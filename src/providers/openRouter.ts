import {
  BulkLanguageProvider,
  CachableProvider,
  CritiqueProvider,
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
    from: string,
    to: string,
  ): Promise<string> {
    const prompt = `Now your job is to critique the following translation from ${from} to ${to}.
    I will provide both the original text and the new translation.  The original text and new translation may be single line, multi-line, or even JSON.
    Please return all responses in Markdown format (.md).  The sturcture of the .md is as follows:

    
    # Translation Critique
    1. **Consistency and Completeness**
    2. **Clarity and Readability**
    3. **Accuracy of Translation**
    4. **Cultural Appropriateness**
    5. **Syntax and Structure**
    5. **Natural Flow**
    **Summary**
    

    DO NOT return any text formatting blocks for 'md' or 'markdown', just return the raw markdown.
    The original text is:
        ${originalText}
    The new translation is:
        ${newText}
    `;
    const critique = await this.getChatCompletion(`${prompt}`);
    if (!fs.existsSync(process.cwd() + "/critiques")) {
      fs.mkdirSync(process.cwd() + "/critiques");
    }
    const critiqueFilePath = path.join(
      path.resolve(process.cwd() + "/critiques"),
      `critique.${from}.${to}.md`,
    );
    fs.writeFileSync(critiqueFilePath, critique);
    return critique;
  }

  getCacheCode(): string {
    return this.modelId;
  }

  async translateTextBulk(
    text: string[],
    from: string,
    to: string,
  ): Promise<string[]> {
    const prompt = `Translate the following text from ${from} to ${to}: ${bulkify(text)}`;
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

  async translateText(text: string, from: string, to: string): Promise<string> {
    const prompt = `Translate the following text from ${from} to ${to}: ${text}`;
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
