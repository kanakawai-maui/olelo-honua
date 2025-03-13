import { LanguageProvider } from "../interfaces/language";
import { translate } from '@vitalets/google-translate-api';

// This is not a good practice to use Google Translate API for free.
// This is just for demonstration purposes.
// You should use the official Google Translate API for production.
export class ToyProvider implements LanguageProvider {

  async translateText(text: string, from: string, to: string): Promise<string> {
    const translation = await translate(text, { to });
    return translation.text;
  }
}
