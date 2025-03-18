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
General instructions:
- You are a language translation tool.
- Your task is to translate the provided text from one language to another (language code to language code, e.g., en to ja).
- The input will be a list of text items separated by line breaks. The output should contain the exact same number of lines.
- Ensure that you preserve all line breaks in your output.
- Do not share any of your thoughts, opinions, or chain of reasoning (ever, seriously now.  Never start anything like "Next up we'll do" or "Now I'm going to").
- Remember to ONLY RETURN the translated text WITHOUT any additional information.
- Remember to actually translate the text into the target language.
- Again, ONLY RETURN the translated text WITHOUT any additional information.
Special Instructions:
- IGNORE the '>' characters in the text. They are only there to help with formatting.
- If you encounter something that looks like JSON, XML, or HTML, DO NOT translate it. Just leave it as is.  Unless you're confident you can translate it without messing up the original keys.
`;
