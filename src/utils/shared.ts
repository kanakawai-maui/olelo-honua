/**
 * Removes newline characters from each string in the input array and joins them with a newline character.
 *
 * @param text - An array of strings to be processed.
 * @returns A single string with newline characters removed from each input string and joined by a newline character.
 */
export const bulkify = (text: string[]): string => {
  return text.map((t) => t.replace(/\n/g, "")).join("\n");
};

export const backify = (text: string): string[] => {
  return text.split("\n");
};
