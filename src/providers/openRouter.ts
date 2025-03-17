import { BulkLanguageProvider, LanguageProvider } from "../interfaces/language";
import axios from "axios";
import { backify, bulkify } from "../utils/shared";

export class OpenRouterProvider
  implements LanguageProvider, BulkLanguageProvider
{
  private apiKey: string;
  private modelId: string;

  constructor(apiKey: string, modelId: string) {
    this.apiKey = apiKey;
    this.modelId = modelId;
  }

  async translateTextBulk(
    text: string[],
    from: string,
    to: string,
  ): Promise<string[]> {
    const system = `You are a language translation tool.
    Your task is to translate the provided text from one language to another (language code to language code, e.g., en to ja).
    The input will be a list of text items separated by line breaks. The output should contain the exact same number of lines.
    Ensure that you preserve all line breaks in your output.
    Do not share any of your thoughts, opinions, or chain of reasoning (ever, seriously now.  Never start anything like "Next up we'll do" or "Now I'm going to").
    Remember to ONLY RETURN the translated text WITHOUT any additional information.
    Remember to actually translate the text into the target language.
    Again, ONLY RETURN the translated text WITHOUT any additional information.`;
    const prompt = `Translate the following text from ${from} to ${to}: ${bulkify(text)}`;
    const translatedText = await this.getChatCompletion(`${system} ${prompt}`);
    const backified = backify(translatedText);
    if (backified.length !== text.length) {
      console.log(
        "Warning:  The number of translations does not match the number of texts.",
      );
    }
    return backified;
  }

  async translateText(text: string, from: string, to: string): Promise<string> {
    const system = `You are a language translation tool.
    Your task is to translate the provided text from one language to another (language code to language code, e.g., en to ja).
    The input will be a single line of text.
    Ensure that you preserve all line breaks in your output.
    If a list of text items is provided as input, the output should contain the exact same number of lines.
    Do not share any of your thoughts, opinions, or chain of reasoning (ever, seriously now.  Never start anything like "Next up we'll do" or "Now I'm going to").
    Remember to actually translate the text into the target language.
    Again, ONLY RETURN the translated text WITHOUT any additional information.`;
    const prompt = `Translate the following text from ${from} to ${to}: ${text}`;
    const translatedText = await this.getChatCompletion(`${system} ${prompt}`);
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
