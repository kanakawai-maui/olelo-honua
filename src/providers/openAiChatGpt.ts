import {
  Language,
} from "../interfaces/language";
import { bulkify, backify, sharedSystemPrompt } from "../utils/shared";
import axios from "axios";
import { BaseProvider } from "./base";

export class OpenAIChatGPTProvider extends BaseProvider {
  private apiKey: string;
  public preferBulkTranslate: boolean = false;

  constructor(apiKey: string) {
    super();
    this.apiKey = apiKey;
  }

  async translateTextBulk(
    text: string[],
    from: Language,
    to: Language,
  ): Promise<string[]> {
    const response = await axios.post(
      "https://api.openai.com/v1/engines/davinci-codex/completions",
      {
        prompt: `${sharedSystemPrompt} Translate the following text from ${from.englishName} to ${to.englishName} (ISO 639-1 language code ${from.code} to ${to.code}): ${bulkify(text)}`,
        max_tokens: 1000,
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      },
    );
    const translatedText = response.data.choices[0].text.trim();
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
    const response = await axios.post(
      "https://api.openai.com/v1/engines/davinci-codex/completions",
      {
        prompt: `${sharedSystemPrompt} Translate the following text from ${from.englishName} to ${to.englishName} (ISO 639-1 language code ${from.code} to ${to.code}): ${text}`,
        max_tokens: 1000,
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      },
    );
    return response.data.choices[0].text.trim();
  }
}
