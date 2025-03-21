import {
  FileFormat,
  Language,
} from "../interfaces/language";
import axios from "axios";
import { backify, bulkify, sharedSystemPrompt } from "../utils/shared";
import * as path from "path";
import * as fs from "fs";
import {BaseProvider} from "./base";
import { jsonrepair } from 'jsonrepair';

export class OpenRouterProvider
  extends BaseProvider
{
  private apiKey: string;
  private modelId: string;

  constructor(apiKey: string, modelId: string) {
    super();
    this.apiKey = apiKey;
    this.modelId = modelId;
  }

  async repairTranslation(original: string, critique: string, from: Language, to: Language): Promise<string> {
    const prompt = `Now that you've critiqued the translation, if necessary, please fix the translation from ${from.englishName} to ${to.englishName}.
    If a redo is not necessary, you can simply return the original translation.
    I will provide the original outputted JSON and your JSON-based critique. Your task is to provide a new JSON output based on the critique.
    The JSON should match the original JSON format as closely as possible, but with the necessary corrections.
    ONLY RESPOND WITH VALID JSON.  DO NOT RETURN ANYTHING ELSE.  THE JSON WILL BE PARSED AND VALIDATED.
    Do not include any text formatting blocks for 'json'; return only the raw JSON content string.
    DO NOT INCLUDE ANY INVALID CONTROL CHARACTERS IN THE JSON.  REMOVE ALL CONTROL CHARACTERS.
    Original JSON:
        ${original}
    Critique JSON:
        ${critique}`;
    const translatedJSONString = await this.getChatCompletion(
      `${prompt}`, true
    );
    return translatedJSONString;
  }

  async critiqueTranslation(
    originalText: string,
    newText: string,
    format: FileFormat,
    save: boolean,
    from: Language,
    to: Language,
  ): Promise<string> {
    const prompt = `You are tasked with critiquing a translation from ${from.englishName} to ${to.englishName}.
    I will provide both the original text and the translated text. These texts may be single-line text, multi-line text, or even JSON format.
    Your critique should be returned in ${format.name} file format (.${format.ext}) with the following structure:

    1. consistencyAndCompleteness (qualitative): Evaluate if the translation preserves the meaning and includes all necessary details.
    2. clarityAndReadability (qualitative): Assess how clear and easy to understand the translation is.
    3. accuracyOfTranslation (qualitative): Verify if the translation accurately reflects the original text.
    4. culturalAppropriateness (qualitative): Check if the translation is culturally appropriate and contextually relevant.
    5. syntaxAndStructure (qualitative): Review the grammatical correctness and structural integrity of the translation.
    6. naturalFlow (qualitative): Determine if the translation reads naturally and fluently in the target language.
    7. summary (qualitative): Provide an overall summary of the critique.
    8. scoringOnEach (quantitative): Provide an integer score from 1 to 10 for each of the above criteria (round down).
    
    Do not include any text formatting blocks for '${format.name}'; return only the raw ${format.ext} content.

    IMPORTANT:  Don't ever lead with any reasoning, chain-of-thought, or filler like "Alright, let's dive into this critique." or "Now, let's break down the translation.".
    Only provide the critique information in the format specified.

    Here is an example of the expected format, in this scenario, the translation is ${format.exampleTitle}:
        ${format.exampleDetail}

    Original text:
        ${originalText}
    Translated text:
        ${newText}
    `;
    const critique = await this.getChatCompletion(`${prompt}`, (format.ext === ".json"));
    if(save) {
        if (!fs.existsSync(process.cwd() + "/critiques")) {
            fs.mkdirSync(process.cwd() + "/critiques");
        }
        const critiqueFilePath = path.join(
        path.resolve(process.cwd() + "/critiques"),
        `critique.${from.code}.${to.code}${format.ext}`,
        );
        fs.writeFileSync(critiqueFilePath, critique);
    }
    return critique;
  }

  getCacheCode(): string {
    return this.modelId;
  }

  async translateTextBulk(
    text: string[],
    from: Language,
    to: Language,
  ): Promise<string[]> {
    const prompt = `Translate the following text from ${from.englishName} to ${to.englishName} (ISO 639-1 language code ${from.code} to ${to.code}): ${bulkify(text)}`;
    const translatedText = await this.getChatCompletion(
      `${sharedSystemPrompt} ${prompt}`,
    );
    const backified = backify(translatedText);
    if (backified.length !== text.length) {
      console.log(
        "Warning:  The number of translations does not match the number of texts.",
      );
    }
    return backified;
  }

  async translateText(
    text: string,
    from: Language,
    to: Language,
  ): Promise<string> {
    const prompt = `Translate the following text from ${from.englishName} to ${to.englishName} (ISO 639-1 language code ${from.code} to ${to.code}): ${text}`;
    const translatedText = await this.getChatCompletion(
      `${sharedSystemPrompt} ${prompt}`,
    );
    return translatedText;
  }

  private async getChatCompletion(content: string, strictJSON: boolean = false): Promise<string> {
    try {
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: this.modelId,
                messages: [
                    {
                        role: "user",
                        content: content,
                    },
                ],
            },
            {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    "Content-Type": "application/json",
                },
            },
        );
        let raw = response.data.choices[0].message.content.trim();
        if(strictJSON) {
            raw = raw.replace(/^```json|```$/g, "").trim(); // remove all code blocks
            raw = raw.replace(/[\u0000-\u001F\u007F-\u009F]/g, "").trim(); // remove all control characters
            raw = raw.replace(/[\u200B-\u200D\uFEFF]/g, "").trim(); // remove zero-width spaces
            try {
                const _ = JSON.parse(raw);
                return raw;
            }
            catch {
                console.error("Invalid JSON returned. Retrying...");
                raw = jsonrepair(raw); // attempt rapid repair
                return await this.getChatCompletion(`This JSON is not valid - return the expected valid JSON result ONLY.  Remove all contol characters:  ${raw}`, strictJSON);
            }
        }
        return raw; // Ensure a return statement for non-strictJSON case
    } catch (error: any) {
        if (error.code === "ECONNRESET") {
            console.warn("Connection reset. Retrying...");
            return await this.getChatCompletion(content);
        }
        console.error("An error occurred:", error.message);
        return ""; // Return an empty string or a default value in case of an error
    }
  }
}
