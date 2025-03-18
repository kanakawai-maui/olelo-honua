export interface LanguageProvider {
  translateText(text: string, from: string, to: string): Promise<string>;
}

export interface BulkLanguageProvider {
  translateTextBulk(
    text: string[],
    from: string,
    to: string,
  ): Promise<string[]>;
}

export interface CachableProvider {
  getCacheCode(): string;
}

export interface CritiqueProvider {
  critiqueTranslation(
    originalText: string,
    newText: string,
    from: string,
    to: string,
  ): Promise<string>;
}
