export interface LanguageProvider {
    translateText(text: string, from: string, to: string): Promise<string>;
}