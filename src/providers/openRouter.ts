import axios from "axios";
import { AbstractAdvancedLargeLanguageModelProvider } from "./abstract/allm";
import { jsonrepair } from "jsonrepair";


export class OpenRouterProvider extends AbstractAdvancedLargeLanguageModelProvider {
  private apiKey: string;
  private modelId: string;

  constructor(apiKey: string, modelId: string) {
    super();
    this.apiKey = apiKey;
    this.modelId = modelId;
  }

  getCacheCode(): string {
    return this.modelId;
  }

  async getChatCompletion(content: string): Promise<string> {
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
      raw = raw.replace(/^```json|```$/g, "").trim(); // remove all code blocks
      raw = raw.replace(/[\u0000-\u001F\u007F-\u009F]/g, "").trim(); // remove all control characters
      raw = raw.replace(/[\u200B-\u200D\uFEFF]/g, "").trim(); // remove zero-width spaces
      try {
        const _ = JSON.parse(raw);
        return raw;
      } catch {
        console.error("Invalid JSON returned. Retrying...");
        raw = jsonrepair(raw); // attempt rapid repair
        return await this.getChatCompletion(
          `This JSON is not valid - return the expected valid JSON result ONLY.  Remove all contol characters:  ${raw}`,
        );
      }
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
