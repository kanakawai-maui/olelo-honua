export type Language = {
  code: string;
  nativeName: string;
  flag?: string;
  englishName: string;
};

export interface LanguageProvider {
  translateText(text: string, from: Language, to: Language): Promise<string>;
}

export interface BulkLanguageProvider {
  translateTextBulk(
    text: string[],
    from: Language,
    to: Language,
  ): Promise<string[]>;
}

export interface CachableProvider {
  getCacheCode(): string;
}

export interface CritiqueProvider {
  critiqueTranslation(
    originalText: string,
    newText: string,
    from: Language,
    to: Language,
  ): Promise<string>;
}
