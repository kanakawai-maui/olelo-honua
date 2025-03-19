import {
  LanguageProvider,
  BulkLanguageProvider,
  Language,
} from "../interfaces/language";
import { translate } from "@vitalets/google-translate-api";
import { HttpProxyAgent } from "http-proxy-agent";
import { backify, bulkify } from "../utils/shared";

// This is not a good practice to use Google Translate API for free.
// This is just for demonstration purposes.
// You should use the official Google Translate API for production.
export class ToyProvider implements LanguageProvider, BulkLanguageProvider {
  private proxyAgent: HttpProxyAgent<string> | undefined;

  constructor(proxy?: string) {
    if (proxy) {
      this.proxyAgent = new HttpProxyAgent(proxy);
    }
  }

  async translateTextBulk(
    text: string[],
    from: Language,
    to: Language,
  ): Promise<string[]> {
    let translation = { text: "NA" };
    try {
      let options: any = { to: to.code };
      if (this.proxyAgent) {
        options = { to: to.code, fetchOptions: { agent: this.proxyAgent } };
      }
      translation = await translate(bulkify(text), options);
    } catch (e) {
      if ((e as any).name === "TooManyRequestsError") {
        throw new Error("Too many requests. Please try again later.");
      }
    } finally {
      return backify(translation.text);
    }
  }

  async translateText(
    text: string,
    from: Language,
    to: Language,
  ): Promise<string> {
    let translation = { text: "NA" };
    try {
      let options: any = { to: to.code };
      if (this.proxyAgent) {
        options = { to: to.code, fetchOptions: { agent: this.proxyAgent } };
      }
      translation = await translate(text, options);
    } catch (e) {
      if ((e as any).name === "TooManyRequestsError") {
        throw new Error("Too many requests. Please try again later.");
      }
    } finally {
      return translation.text;
    }
  }
}
