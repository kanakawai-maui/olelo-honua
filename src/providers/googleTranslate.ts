import {
  LanguageProvider,
  BulkLanguageProvider,
  CachableProvider,
} from "../interfaces/language";

export class GoogleTranslateProvider
  implements LanguageProvider, BulkLanguageProvider, CachableProvider
{
  private translate: any;
  private projectId: string;

  constructor(projectId: string) {
    const { Translate } = require("@google-cloud/translate").v2;
    this.projectId = projectId;
    this.translate = new Translate({ projectId });
  }

  getCacheCode(): string {
    return this.projectId;
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
