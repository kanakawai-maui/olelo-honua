import { LanguageProvider } from "../interfaces/language";
import axios from "axios";

export class OpenAIChatGPTProvider implements LanguageProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async translateText(text: string, from: string, to: string): Promise<string> {
    const response = await axios.post(
      "https://api.openai.com/v1/engines/davinci-codex/completions",
      {
        prompt: `Translate the following text from ${from} to ${to}: ${text}`,
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
