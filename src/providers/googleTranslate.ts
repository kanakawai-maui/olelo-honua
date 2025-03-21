import { Language } from "../interfaces/language";
import { BaseProvider } from "./base";

export class GoogleTranslateProvider extends BaseProvider {
  private translate: any;
  private projectId: string;
  public preferBulkTranslate: boolean = false;

  constructor(projectId: string) {
    super();
    const { Translate } = require("@google-cloud/translate").v2;
    this.projectId = projectId;
    this.translate = new Translate({ projectId });
  }

  getCacheCode(): string {
    return this.projectId;
  }

  async translateTextBulk(
    text: string[],
    from: Language,
    to: Language,
  ): Promise<string[]> {
    const [translations] = await this.translate.translate(text, {
      from: from.code,
      to: to.code,
    });
    return translations;
  }

  async translateText(
    text: string,
    from: Language,
    to: Language,
  ): Promise<string> {
    const [translation] = await this.translate.translate(text, {
      from: from.code,
      to: to.code,
    });
    return translation;
  }
}
