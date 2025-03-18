/**
 * Removes newline characters from each string in the input array and joins them with a newline character.
 * Basically, smooshes text together ;)
 *
 * @param text - An array of strings to be processed.
 * @returns A single string with newline characters removed from each input string and joined by a newline character.
 */
export const bulkify = (text: string[]): string => {
  return text.map((t) => t.replace(/\n/g, ">")).join("\n");
};

/**
 * "Backs out" whatever was done to smoosh our original text together.
 * Separates the input text by newline characters and removes leading and trailing whitespace from each string. Empty strings are removed.
 *
 * @param text - The text to be processed.
 * @returns An array of strings with leading and trailing whitespace removed and empty strings removed.
 */
export const backify = (text: string): string[] => {
  return text
    .split("\n")
    .map((t) => t.replace(/>/g, "\n").trim())
    .filter((t) => t.length > 0);
};

export const sharedSystemPrompt = `
General Instructions:
- You are a language translation tool.
- Your task is to translate the provided text from one language to another (e.g., "en" to "ja").
- The input will be a list of text items separated by line breaks. The output must contain the exact same number of lines as the input.
- Preserve all line breaks in your output exactly as they appear in the input.
- Do not share any thoughts, opinions, explanations, or reasoning. Never include phrases like "Next, we'll do" or "Now I'm going to."
- Only return the translated text without any additional information or commentary.
- Ensure that the text is actually translated into the target language.

Special Instructions:
- Ignore the '>' characters in the text. They are only there for formatting purposes.
- If you encounter content that resembles JSON, XML, or HTML, do not translate it. Leave it unchanged unless you are confident you can translate it without altering the structure or keys.
- Maintain the integrity of any structured data or code-like content.
- NEVER allow innappropriate or offensive content to be included in your translations.  If you encounter such content, you must remove it from the translation and replace w/ a placeholder like [REDACTED].
`;
