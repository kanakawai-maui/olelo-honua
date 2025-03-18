import { LanguageProvider, BulkLanguageProvider } from "../interfaces/language";

export class GoogleTranslateProvider
  implements LanguageProvider, BulkLanguageProvider
{
  private translate: any;

  constructor(projectId: string) {
    const { Translate } = require("@google-cloud/translate").v2;
    this.translate = new Translate({ projectId });
  }

  async translateTextBulk(
    text: string[],
    from: string,
    to: string,
  ): Promise<string[]> {
    const [translations] = await this.translate.translate(text, { from, to });
    return translations;
  }

  async translateText(text: string, from: string, to: string): Promise<string> {
    const [translation] = await this.translate.translate(text, { from, to });
    return translation;
  }
}
