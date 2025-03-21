export type Language = {
  code: string;
  nativeName: string;
  flag?: string;
  englishName: string;
};

export const OUTPUT_FILETYPE_JSON = {
  name: "JSON",
  ext: ".json",
  exampleTitle: "from English to Japanese",
  exampleDetail: `{
      "consistencyAndCompleteness": "The translation is largely consistent and complete, but there are minor discrepancies in the translated text. For example, the term 'Help' is translated as 'たすけて' which is correct, but in the train_station_description, there is a minor typographical error with the word 'Savaş' which does not make sense in the context of Japanese. The rest of the terms are translated accurately and comprehensively.",
      "clarityAndReadability": "The translated text is clear and readable. The translations of common phrases like 'Good morning' as 'おはようございます' and 'How are you?' as 'おげんきですか？' are appropriate and easily understandable. However, there is room for improvement in the train_station_description where the error in 'Savaş' might confuse readers.",
      "accuracyOfTranslation": "Most of the translations are accurate, but there are a few areas that could be improved. For instance, 'Help' is translated as 'たすけて' which is correct in informal contexts but might not be suitable in all formal situations. Additionally, the train_station_description contains an error with the word 'Savaş', which does not belong in the translation.",
      "culturalAppropriateness": "The translations are culturally appropriate. Phrases like 'ありがとう' for 'Thank you' and 'すみません' for 'Excuse me' are commonly used in Japanese culture and convey the intended meaning effectively. The train_station_description maintains cultural relevance except for the minor error mentioned earlier.",
      "syntaxAndStructure": "The syntax and structure of the translated text are mostly correct. However, in the train_station_description, the error in 'Savaş' disrupts the flow and grammatical correctness of the sentence. Other than this, the rest of the translations follow proper Japanese syntax and structure.",
      "naturalFlow": "The translated text generally flows naturally in Japanese. Phrases like 'おはようございます' and 'おやすみなさい' are natural and commonly used. The only exception is the train_station_description, where the error in 'Saviours' disrupts the natural flow of the sentence.",
      "summary": "Overall, the translation is quite good and accurately conveys the meaning of the original text. However, there are a few minor issues such as the typographical error in 'Saviours' and the informal translation of 'Help'. With these minor adjustments, the translation would be nearly flawless.",
      "scoring": {
          "consistencyAndCompleteness": 9,
          "clarityAndReadability": 9,
          "accuracyOfTranslation": 8,
          "culturalAppropriateness": 9,
          "syntaxAndStructure": 8,
          "naturalFlow": 8,
          "summary": "8"
      }
  }`,
};

export const OUTPUT_FILETYPE_MD = {
  name: "Markdown",
  ext: ".md",
  exampleTitle: "from English to Japanese",
  exampleDetail: `
  ### Consistency and Completeness
  The translation is largely consistent and complete, but there are minor discrepancies in the translated text. For example, the term **'Help'** is translated as **'たすけて'** which is correct, but in the train_station_description, there is a minor typographical error with the word **'Savaş'** which does not make sense in the context of Japanese. The rest of the terms are translated accurately and comprehensively.

  ### Clarity and Readability
  The translated text is clear and readable. The translations of common phrases like **'Good morning'** as **'おはようございます'** and **'How are you?'** as **'おげんきですか？'** are appropriate and easily understandable. However, there is room for improvement in the train_station_description where the error in **'Savaş'** might confuse readers.

  ### Accuracy of Translation
  Most of the translations are accurate, but there are a few areas that could be improved. For instance, **'Help'** is translated as **'たすけて'** which is correct in informal contexts but might not be suitable in all formal situations. Additionally, the train_station_description contains an error with the word **'Savaş'**, which does not belong in the translation.

  ### Cultural Appropriateness
  The translations are culturally appropriate. Phrases like **'ありがとう'** for **'Thank you'** and **'すみません'** for **'Excuse me'** are commonly used in Japanese culture and convey the intended meaning effectively. The train_station_description maintains cultural relevance except for the minor error mentioned earlier.

  ### Syntax and Structure
  The syntax and structure of the translated text are mostly correct. However, in the train_station_description, the error in **'Savaş'** disrupts the flow and grammatical correctness of the sentence. Other than this, the rest of the translations follow proper Japanese syntax and structure.

  ### Natural Flow
  The translated text generally flows naturally in Japanese. Phrases like **'おはようございます'** and **'おやすみなさい'** are natural and commonly used. The only exception is the train_station_description, where the error in **'Saviours'** disrupts the natural flow of the sentence.

  ### Summary
  Overall, the translation is quite good and accurately conveys the meaning of the original text. However, there are a few minor issues such as the typographical error in **'Saviours'** and the informal translation of **'Help'**. With these minor adjustments, the translation would be nearly flawless.

  ### Scoring
  - **Consistency and Completeness**: 9  
  - **Clarity and Readability**: 9  
  - **Accuracy of Translation**: 8  
  - **Cultural Appropriateness**: 9  
  - **Syntax and Structure**: 8  
  - **Natural Flow**: 8  
  - **Summary**: 8
  `,
};

export type FileFormat = {
  name: string;
  ext: string;
  exampleTitle: string;
  exampleDetail: string;
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
    format: FileFormat,
    save: boolean,
    from: Language,
    to: Language,
  ): Promise<string>;
}

export interface RepairProvider {
  repairTranslation(
    original: string,
    critique: string,
    from: Language,
    to: Language,
  ): Promise<string>;
}
