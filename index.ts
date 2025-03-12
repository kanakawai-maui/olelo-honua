import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

import { LocaleConfig } from './interfaces/locale';
import {LanguageProvider} from './interfaces/language';

const exampleConfig: LocaleConfig = {
    includeLanguage: ["en", "zh-tw"],
    excludeLanguage: ["zh-cn"],
    primeLanguage: "en"
};

export default class OleloHonua {
    private config: LocaleConfig;
    private provider: LanguageProvider;
    private __dirname: string;

    constructor(config: LocaleConfig, provider: LanguageProvider, __dirname: string = path.dirname(fileURLToPath(import.meta.url))) {
        this.config = config;
        this.provider = provider;
        this.__dirname = __dirname;
    }

    async createLocaleFiles() {
        this.validateConfig(this.config);

        const languages = this.config.includeLanguage.length > 0 ? this.config.includeLanguage : this.getAllLanguages().filter(lang => !this.config.excludeLanguage.includes(lang));
        const primeLanguage = this.config.primeLanguage;
        const primeContent = await this.getPrimeLanguageContent(primeLanguage);

        for (const lang of languages) {
            if (lang !== primeLanguage) {
                const translatedContent = await this.provider.translateText(primeContent, primeLanguage, lang);
                this.saveToFile(lang, translatedContent);
            } else {
                this.saveToFile(lang, primeContent);
            }
        }
    }

    private validateConfig(config: LocaleConfig) {
        if (!config.primeLanguage) {
            throw new Error("Prime language must be specified.");
        }

        if (config.includeLanguage.length > 0 && config.excludeLanguage.length > 0) {
            throw new Error("Only one of includeLanguage or excludeLanguage must be specified, not both.");
        }

        if (config.includeLanguage.length === 0 && config.excludeLanguage.length === 0) {
            throw new Error("One of includeLanguage or excludeLanguage must be specified.");
        }

        // Ensure that languages specified in includeLanguage or excludeLanguage are valid
        const allLanguages = this.getAllLanguages();
        for (const lang of config.includeLanguage) {
            if (!allLanguages.includes(lang)) {
                throw new Error(`Invalid language specified in includeLanguage: ${lang}`);
            }
        }
    }

    private getAllLanguages(): string[] {
        // This function should return all available languages from ISO 639-1
        const defaultLanguagesFilePath = path.join(this.__dirname, 'default_languages.json');
        const customerLanguagesFilePath = path.join(this.__dirname, 'customer_languages.json');

        let languagesData = fs.readFileSync(defaultLanguagesFilePath, 'utf-8');

        if (fs.existsSync(customerLanguagesFilePath)) {
            const customerLanguagesData = fs.readFileSync(customerLanguagesFilePath, 'utf-8');
            languagesData = customerLanguagesData;
        }

        return JSON.parse(languagesData);
    }

    private async getPrimeLanguageContent(primeLanguage: string): Promise<string> {
        // This function should return the content for the prime language
        const filePath = path.join(this.__dirname, `locales/${primeLanguage}.json`);
        return fs.readFileSync(filePath, 'utf-8');
    }

    private saveToFile(language: string, content: string) {
        const filePath = path.join(this.__dirname, `locales/${language}.json`);
        fs.writeFileSync(filePath, JSON.stringify({ content }, null, 2));
    }
}


