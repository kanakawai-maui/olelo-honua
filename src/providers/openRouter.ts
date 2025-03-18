import {
  BulkLanguageProvider,
  CachableProvider,
  LanguageProvider,
} from "../interfaces/language";
import axios from "axios";
import { backify, bulkify, sharedSystemPrompt } from "../utils/shared";

export class OpenRouterProvider
  implements LanguageProvider, BulkLanguageProvider, CachableProvider
{
  private apiKey: string;
  private modelId: string;

  constructor(apiKey: string, modelId: string) {
    this.apiKey = apiKey;
    this.modelId = modelId;
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
