import { LanguageProvider } from "../interfaces/language";

export class GoogleTranslateProvider implements LanguageProvider {
  private translate: any;

  constructor(projectId: string) {
    const { Translate } = require("@google-cloud/translate").v2;
    this.translate = new Translate({ projectId });
  }

  async translateText(text: string, from: string, to: string): Promise<string> {
    const [translation] = await this.translate.translate(text, { from, to });
    return translation;
  }
}
