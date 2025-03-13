export interface LanguageProvider {
  translateText(text: string, from: string, to: string): Promise<string>;
}

export interface BulkLanguageProvider {
  translateTextBulk(text: string[], from: string, to: string): Promise<string[]>;
}