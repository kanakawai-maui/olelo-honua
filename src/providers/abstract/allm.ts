import { AbstractFullProvider } from "./full";
import { Language } from "../../types/shared";
import { compareKeys } from "../../utils/shared";

const examples = [
  {
    description:
      "Translation example from English to Japanese using domain-specific language (DSL).",
    translate: {
      input: `
        <TRANSLATE from="en" to="ja" action="translate">
          <FROM>{"welcome": "Welcome to our wonderful website", "privacyStatment": "We value your privacy and data security.", partners: ["Peter Smith", "Martin Gross", "Laura Sanchez"], hero: {title: "Hypergrowth Inc.", tagline: "Diversifying through strength and synergy."}}</FROM>
        </TRANSLATE>`,
      output: `{"welcome": "私たちの素晴らしいウェブサイトへようこそ", "privacyStatment": "プライバシーとデータセキュリティを大切にしています。", partners: ["Peter Smith", "Martin Gross", "Laura Sanchez"], hero: {title: "Hypergrowth Inc.", tagline: "強さとシナジーを通じて多様化しています。"}}`,
    },
    critique: {
      input: `
        <TRANSLATE from="en" to="ja" action="critique">
          <FROM>{"welcome": "Welcome to our wonderful website", "privacyStatment": "We value your privacy and data security.", partners: ["Peter Smith", "Martin Gross", "Laura Sanchez"], hero: {title: "Hypergrowth Inc.", tagline: "Diversifying through strength and synergy."}}</FROM>
          <TO>{"welcome": "私たちの素晴らしいウェブサイトへようこそ", "privacyStatment": "プライバシーとデータセキュリティを大切にしています。", partners: ["Peter Smith", "Martin Gross", "Laura Sanchez"], hero: {title: "Hypergrowth Inc.", tagline: "強さとシナジーを通じて多様化しています。"}}</TO>
        </TRANSLATE>`,
      output: `{"consistencyAndCompleteness": "The translation maintains consistency and completeness for most terms, with accurate translations such as 'Welcome to our wonderful website' to '私たちの素晴らしいウェブサイトへようこそ' and 'We value your privacy and data security.' to 'プライバシーとデータセキュリティを大切にしています。'. Proper nouns like 'Peter Smith' and 'Hypergrowth Inc.' are preserved as expected.", "clarityAndReadability": "The translation is clear and easy to read, with no ambiguities in the translated content.", "accuracyOfTranslation": "The translation is accurate, with all values correctly translated into Japanese while maintaining the original meaning.", "culturalAppropriateness": "The translation is culturally appropriate, using polite and formal Japanese expressions where necessary.", "syntaxAndStructure": "The syntax and structure of the JSON are preserved, and the translated values are grammatically correct.", "naturalFlow": "The translation flows naturally, with no awkward phrasing or unnatural expressions.", "summary": "The translation is highly accurate, clear, and culturally appropriate, with no issues identified.", "scoring": { "consistencyAndCompleteness": 10, "clarityAndReadability": 10, "accuracyOfTranslation": 10, "culturalAppropriateness": 10, "syntaxAndStructure": 10, "naturalFlow": 10, "summary": 10 }}`,
    },
    repair: {
      input: `
        <TRANSLATE from="en" to="ja" action="repair">
          <FROM>{"welcome": "Welcome to our wonderful website", "privacyStatment": "We value your privacy and data security.", partners: ["Peter Smith", "Martin Gross", "Laura Sanchez"], hero: {title: "Hypergrowth Inc.", tagline: "Diversifying through strength and synergy."}}</FROM>
          <TO>{"welcome": "私たちの素晴らしいウェブサイトへようこそ", "privacyStatment": "プライバシーとデータセキュリティを大切にしています。", partners: ["Peter Smith", "Martin Gross", "Laura Sanchez"], hero: {title: "Hypergrowth Inc.", tagline: "強さとシナジーを通じて多様化しています。"}}</TO>
          <CRITIQUE>{"consistencyAndCompleteness": "The translation maintains consistency and completeness for most terms, with accurate translations such as 'Welcome to our wonderful website' to '私たちの素晴らしいウェブサイトへようこそ' and 'We value your privacy and data security.' to 'プライバシーとデータセキュリティを大切にしています。'. Proper nouns like 'Peter Smith' and 'Hypergrowth Inc.' are preserved as expected.", "clarityAndReadability": "The translation is clear and easy to read, with no ambiguities in the translated content.", "accuracyOfTranslation": "The translation is accurate, with all values correctly translated into Japanese while maintaining the original meaning.", "culturalAppropriateness": "The translation is culturally appropriate, using polite and formal Japanese expressions where necessary.", "syntaxAndStructure": "The syntax and structure of the JSON are preserved, and the translated values are grammatically correct.", "naturalFlow": "The translation flows naturally, with no awkward phrasing or unnatural expressions.", "summary": "The translation is highly accurate, clear, and culturally appropriate, with no issues identified.", "scoring": { "consistencyAndCompleteness": 10, "clarityAndReadability": 10, "accuracyOfTranslation": 10, "culturalAppropriateness": 10, "syntaxAndStructure": 10, "naturalFlow": 10, "summary": 10 }}</CRITIQUE>
        </TRANSLATE>`,
      output: `{"welcome": "私たちの素晴らしいウェブサイトへようこそ", "privacyStatment": "プライバシーとデータセキュリティを大切にしています。", partners: ["Peter Smith", "Martin Gross", "Laura Sanchez"], hero: {title: "Hypergrowth Inc.", tagline: "強さとシナジーを通じて多様化しています。"}}`,
    },
  },
  {
    description:
      "Translation example from English to Arabic using domain-specific language (DSL).",
    translate: {
      input: `
        <TRANSLATE from="en" to="ar" action="translate">
          <FROM>{"welcome": "Welcome to our wonderful website", "privacyStatment": "We value your privacy and data security.", partners: ["Peter Smith", "Martin Gross", "Laura Sanchez"], hero: {title: "Hypergrowth Inc.", tagline: "Diversifying through strength and synergy."}}</FROM>
        </TRANSLATE>`,
      output: `{"welcome": "مرحبًا بكم في موقعنا الرائع", "privacyStatment": "نحن نقدر خصوصيتك وأمان بياناتك.", partners: ["Peter Smith", "Martin Gross", "Laura Sanchez"], hero: {title: "Hypergrowth Inc.", tagline: "التنوع من خلال القوة والتآزر."}}`,
    },
    critique: {
      input: `
        <TRANSLATE from="en" to="ar" action="critique">
          <FROM>{"welcome": "Welcome to our wonderful website", "privacyStatment": "We value your privacy and data security.", partners: ["Peter Smith", "Martin Gross", "Laura Sanchez"], hero: {title: "Hypergrowth Inc.", tagline: "Diversifying through strength and synergy."}}</FROM>
          <TO>{"welcome": "مرحبًا بكم في موقعنا الرائع", "privacyStatment": "نحن نقدر خصوصيتك وأمان بياناتك.", partners: ["Peter Smith", "Martin Gross", "Laura Sanchez"], hero: {title: "Hypergrowth Inc.", tagline: "التنوع من خلال القوة والتآزر."}}</TO>
        </TRANSLATE>`,
      output: `{"consistencyAndCompleteness": "The translation is consistent and complete, with all terms accurately translated into Arabic. Proper nouns like 'Peter Smith' and 'Hypergrowth Inc.' are preserved as expected.", "clarityAndReadability": "The translation is clear and easy to read, with no ambiguities in the translated content.", "accuracyOfTranslation": "The translation is accurate, with all values correctly translated into Arabic while maintaining the original meaning.", "culturalAppropriateness": "The translation is culturally appropriate, using formal Arabic expressions where necessary.", "syntaxAndStructure": "The syntax and structure of the JSON are preserved, and the translated values are grammatically correct.", "naturalFlow": "The translation flows naturally, with no awkward phrasing or unnatural expressions.", "summary": "The translation is highly accurate, clear, and culturally appropriate, with no issues identified.", "scoring": { "consistencyAndCompleteness": 10, "clarityAndReadability": 10, "accuracyOfTranslation": 10, "culturalAppropriateness": 10, "syntaxAndStructure": 10, "naturalFlow": 10, "summary": 10 }}`,
    },
    repair: {
      input: `
        <TRANSLATE from="en" to="ar" action="repair">
          <FROM>{"welcome": "Welcome to our wonderful website", "privacyStatment": "We value your privacy and data security.", partners: ["Peter Smith", "Martin Gross", "Laura Sanchez"], hero: {title: "Hypergrowth Inc.", tagline: "Diversifying through strength and synergy."}}</FROM>
          <TO>{"welcome": "مرحبًا بكم في موقعنا الرائع", "privacyStatment": "نحن نقدر خصوصيتك وأمان بياناتك.", partners: ["Peter Smith", "Martin Gross", "Laura Sanchez"], hero: {title: "Hypergrowth Inc.", tagline: "التنوع من خلال القوة والتآزر."}}</TO>
          <CRITIQUE>{"consistencyAndCompleteness": "The translation is consistent and complete, with all terms accurately translated into Arabic. Proper nouns like 'Peter Smith' and 'Hypergrowth Inc.' are preserved as expected.", "clarityAndReadability": "The translation is clear and easy to read, with no ambiguities in the translated content.", "accuracyOfTranslation": "The translation is accurate, with all values correctly translated into Arabic while maintaining the original meaning.", "culturalAppropriateness": "The translation is culturally appropriate, using formal Arabic expressions where necessary.", "syntaxAndStructure": "The syntax and structure of the JSON are preserved, and the translated values are grammatically correct.", "naturalFlow": "The translation flows naturally, with no awkward phrasing or unnatural expressions.", "summary": "The translation is highly accurate, clear, and culturally appropriate, with no issues identified.", "scoring": { "consistencyAndCompleteness": 10, "clarityAndReadability": 10, "accuracyOfTranslation": 10, "culturalAppropriateness": 10, "syntaxAndStructure": 10, "naturalFlow": 10, "summary": 10 }}</CRITIQUE>
        </TRANSLATE>`,
      output: `{"welcome": "مرحبًا بكم في موقعنا الرائع", "privacyStatment": "نحن نقدر خصوصيتك وأمان بياناتك.", partners: ["Peter Smith", "Martin Gross", "Laura Sanchez"], hero: {title: "Hypergrowth Inc.", tagline: "التنوع من خلال القوة والتآزر."}}`,
    },
  },
];

const critiquePrompt = `
   The critique should be returned as JSON with the following keys:
    {
      consistencyAndCompleteness (qualitative) // Evaluate if the translation preserves the meaning and includes all necessary details.
      clarityAndReadability (qualitative) // Assess how clear and easy to understand the translation is.
      accuracyOfTranslation (qualitative) // Verify if the translation accurately reflects the original text.
      culturalAppropriateness (qualitative) // Check if the translation is culturally appropriate and contextually relevant.
      syntaxAndStructure (qualitative) // Review the grammatical correctness and structural integrity of the translation.
      naturalFlow (qualitative) // Determine if the translation reads naturally and fluently in the target language.
      summary (qualitative) // Provide an overall summary of the critique.
      scoring (quantitative) // Provide an integer score from 1 to 10 for each of the above criteria (round down).
    }
    
    Do not include any text formatting blocks for 'json'; return only the raw JSON content.

    Don't ever lead with any reasoning, chain-of-thought, or filler like "Alright, let's dive into this critique." or "Now, let's break down the translation.".
    Only provide the critique information in the format specified.

    Here is an example of the expected output JSON format. In this scenario, the translation is from English to Japanese (en to ja):

    {
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
            "summary": 8
        }
  }`;

const systemPrompt = `
SYSTEM_PROMPT:
- You are a language translation bot designed for internationalization (i18n) purposes.  
- You are capable of translating JSON content from one language to another.  You are also able to critique and repair translations.
- Your primary task is to translate JSON content from one language to another (e.g., "English" to "Japanese", or "English" to "Arabic").
- You will be provided ISO 639-1 language codes for the source and target languages (e.g., "en" for English, "ja" for Japanese, "ar" for Arabic).
- You understand an XML-like domain specific language (DSL) for translation tasks.  The DSL consists of tags that specify the source and target languages, as well as the action to be taken (e.g., "translate", "critique", "repair").
- You always return valid JSON responses (similar to an API returning application/json data). Do not include any additional tags, commentary, or formatting in your response.
- Translate only the JSON values while preserving the JSON structure and keys exactly as they are.
- Do not modify the structure of the JSON in any way. The output keys must match the input keys, regardless of depth.
- Never translate JSON keys, proper nouns, names, or brand names.
- If you encounter inappropriate or offensive content, replace it with [REDACTED].
- Do not include any thoughts, opinions, explanations, or reasoning in your response.
- If the input contains structured data, such as JSON, XML, or HTML, ensure its integrity is maintained. Only translate the content if it is appropriate and does not alter the structure.
- Ensure all translated values are in the target language and consistent throughout the output.

SPECIAL_INSTRUCTIONS:
- The default input will be provided within <TRANSLATE from="source_language" to="target_language" action="translate"><FROM>...</FROM></TRANSLATE> tags.
  - The source and target languages will be specified as ISO 639-1 language codes in the "from" and "to" attributes.
  - The JSON content to be translated from source_language will be enclosed within inner <FROM>...</FROM> tags.
  - The content within the <FROM>...</FROM> tags will always be valid JSON.
  - Translate the <FROM>...</FROM> tag from source_language to target_language, while preserving the JSON structure.
  - The returned content should be valid JSON with the values translated to the target_language.
  - Output the translated JSON only.  Recall that only the values within the JSON should be translated to target_language.
  Examples
    ${examples.map((example) => {
      return `
      Description: ${example.description}
      Input: ${example.translate.input}
      Output: ${example.translate.output}
    `;
    })}
- You may also be asked to [CRITIQUE] translations, for instance if the TRANSLATE tag includes both a FROM & TO tag and action="critique":
  - [CRITIQUE] instructions will be provided within <TRANSLATE from="source_language" to="target_language" action="critique"><FROM>...</FROM><TO>...</TO></TRANSLATE> tags.
    - Provide [CRITIQUE] in JSON format with user-specified qualitative and quantitative criteria.
    - Return the response in valid JSON.
    - Only return JSON content.
  Description:
    ${critiquePrompt}

  Examples
    ${examples.map((example) => {
      return `
      Description: ${example.description}
      Input: ${example.critique.input}
      Output: ${example.critique.output}
    `;
    })}

- You may also be asked to [REPAIR] translations if the TRANSLATE tag includes both a FROM, TO, & CRITIQUE tag and action="repair":
  - [REPAIR] instructions will be provided within <TRANSLATE from="source_language" to="target_language" action="repair"><FROM>...</FROM><TO>...</TO><CRITIQUE>...</CRITIQUE></TRANSLATE> tags.
    - Provide a [REPAIR]ed translation in valid JSON format.
    - Return the response in valid JSON.
    - Only return JSON content.
  Examples
    ${examples.map((example) => {
      return `
      Description: ${example.description}
      Input: ${example.repair.input}
      Output: ${example.repair.output}
    `;
    })}
`;

export abstract class AbstractAdvancedLargeLanguageModelProvider
  implements AbstractFullProvider
{
  abstract getCacheCode(): string;
  abstract getChatCompletion(content: string): Promise<string>;

  async repair(
    original: string,
    translated: string,
    critique: string,
    from: Language,
    to: Language,
  ): Promise<string> {
    const prompt = `
    [REPAIR] the translation from ${from.englishName} to ${to.englishName} (ISO 639-1 ${from.code} to ${to.code}).
    If no repairs are necessary, you can return the original translation without changes.
    I will provide the necessary input as instructed by the SPECIAL INSTRUCTIONS.  Your task is to provide a repaired JSON output based on the provided information.
    The JSON should match the original JSON format, but with the necessary corrections.

    <TRANSLATE from="${from.code}" to="${to.code}" action="repair">
        <FROM>${original}</FROM>
        <TO>${translated}</TO>
        <CRITIQUE>${critique}</CRITIQUE>
    </TRANSLATE>
    `;
    const repaired = await this.getChatCompletion(`${systemPrompt} ${prompt}`);

    if (compareKeys(JSON.parse(translated), JSON.parse(repaired))) {
      console.log(
        "Warning: The structure of the translation does not match the repaired JSON.",
      );
    }
    return repaired;
  }

  async critique(
    original: string,
    translated: string,
    from: Language,
    to: Language,
  ): Promise<string> {
    const prompt = `
    [CRITIQUE] the translation from ${from.englishName} to ${to.englishName} (ISO 639-1 ${from.code} to ${to.code}).
    I will provide the necessary input as instructed by the SPECIAL INSTRUCTIONS.  Your task is to provide a critque JSON output based on the provided information.

    <TRANSLATE from="${from.code}" to="${to.code}" action="critique">
        <FROM>${original}</FROM>
        <TO>${translated}</TO>
    </TRANSLATE>
    `;
    const critique = await this.getChatCompletion(`${systemPrompt} ${prompt}`);
    return critique;
  }

  async translate(
    original: string,
    from: Language,
    to: Language,
  ): Promise<string> {
    const prompt = `
    [TRANSLATE] the JSON input from ${from.englishName} to ${to.englishName} (ISO 639-1 ${from.code} to ${to.code}):

    <TRANSLATE from="${from.code}" to="${to.code}" action="translate">
      <FROM>${original}</FROM>
    </TRANSLATE>
    `;
    const translated = await this.getChatCompletion(
      `${systemPrompt} ${prompt}`,
    );
    if (compareKeys(JSON.parse(original), JSON.parse(translated))) {
      console.log(
        "Warning: The structure of the original does not match the translated JSON.",
      );
    }
    return translated;
  }
}
