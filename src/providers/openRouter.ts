import {
  BulkLanguageProvider,
  CachableProvider,
  CritiqueProvider,
  Language,
  LanguageProvider,
} from "../interfaces/language";
import axios from "axios";
import { backify, bulkify, sharedSystemPrompt } from "../utils/shared";
import * as path from "path";
import * as fs from "fs";

export class OpenRouterProvider
  implements
    LanguageProvider,
    BulkLanguageProvider,
    CachableProvider,
    CritiqueProvider
{
  private apiKey: string;
  private modelId: string;

  constructor(apiKey: string, modelId: string) {
    this.apiKey = apiKey;
    this.modelId = modelId;
  }

  async critiqueTranslation(
    originalText: string,
    newText: string,
    from: Language,
    to: Language,
  ): Promise<string> {
    const prompt = `You are tasked with critiquing a translation from ${from.englishName} to ${to.englishName}.
    I will provide both the original text and the translated text. These texts may be single-line, multi-line, or even in JSON format.
    Your critique should be returned in Markdown format (.md) with the following structure:

    # Translation Critique
    1. **Consistency and Completeness**: Evaluate if the translation preserves the meaning and includes all necessary details.
    2. **Clarity and Readability**: Assess how clear and easy to understand the translation is.
    3. **Accuracy of Translation**: Verify if the translation accurately reflects the original text.
    4. **Cultural Appropriateness**: Check if the translation is culturally appropriate and contextually relevant.
    5. **Syntax and Structure**: Review the grammatical correctness and structural integrity of the translation.
    6. **Natural Flow**: Determine if the translation reads naturally and fluently in the target language.

    **Summary**: Provide an overall summary of the critique.

    Do not include any text formatting blocks for 'md' or 'markdown'; return only the raw Markdown content.

    Original text:
        ${originalText}
    Translated text:
        ${newText}
    `;
    const critique = await this.getChatCompletion(`${prompt}`);
    if (!fs.existsSync(process.cwd() + "/critiques")) {
      fs.mkdirSync(process.cwd() + "/critiques");
    }
    const critiqueFilePath = path.join(
      path.resolve(process.cwd() + "/critiques"),
      `critique.${from.code}.${to.code}.md`,
    );
    fs.writeFileSync(critiqueFilePath, critique);
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

  private async getChatCompletion(content: string): Promise<string> {
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
    return response.data.choices[0].message.content.trim();
  }
}
