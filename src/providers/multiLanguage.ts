import { Language, LanguageProvider } from "../interfaces/language";

export class MultiLanguageProvider implements LanguageProvider {
  private providers: LanguageProvider[];
  private agreementThreshold: number;

  constructor(
    providers: LanguageProvider[],
    agreementThreshold: number = 0.95,
  ) {
    this.providers = providers;
    this.agreementThreshold = agreementThreshold;
  }

  async translateText(
    text: string,
    from: Language,
    to: Language,
  ): Promise<string> {
    const translations = await Promise.all(
      this.providers.map((provider) => provider.translateText(text, from, to)),
    );

    // Cross-check translations and return the most consistent one
    const translationCounts: { [key: string]: number } = {};

    translations.forEach((translation) => {
      if (translationCounts[translation]) {
        translationCounts[translation]++;
      } else {
        translationCounts[translation] = 1;
      }
    });

    // Find the translation with the highest count
    let mostConsistentTranslation = translations[0];
    let maxCount = 1;

    for (const [translation, count] of Object.entries(translationCounts)) {
      if (count > maxCount) {
        mostConsistentTranslation = translation;
        maxCount = count;
      }
    }

    // Ensure translations agree by at least the configured threshold
    const totalTranslations = translations.length;
    const agreementCount = translationCounts[mostConsistentTranslation] || 0;

    if (agreementCount / totalTranslations < this.agreementThreshold) {
      throw new Error(
        "Translations do not agree by at least the configured threshold",
      );
    }

    return mostConsistentTranslation;
  }
}
