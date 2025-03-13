import { LanguageProvider } from "../interfaces/language";
import { translate } from '@vitalets/google-translate-api';
import { HttpProxyAgent } from 'http-proxy-agent';

// This is not a good practice to use Google Translate API for free.
// This is just for demonstration purposes.
// You should use the official Google Translate API for production.
export class ToyProvider implements LanguageProvider {
  private proxyAgent: HttpProxyAgent<string>|undefined;

  constructor(proxy?: string) {
    if(proxy) {
      this.proxyAgent = new HttpProxyAgent(proxy);
    }
  }

  async translateText(text: string, from: string, to: string): Promise<string> {
    let translation = { text: 'NA' };
    try {
      translation = await translate(text, { to });
    } catch (e) {
      if ((e as any).name === 'TooManyRequestsError') {
        if(this.proxyAgent){
          translation = await translate(text, { to, fetchOptions: {agent: this.proxyAgent} });
        } else {
          throw new Error('Too many requests. Please try again later.');
        }
      }
    }
    return translation.text;
  }
}
