import { OleloHonua } from "../src/index";
import { LocaleConfig } from "../src/interfaces/locale";
import { BaseProvider } from "../src/providers/base";
import { bulkify, backify } from "../src/utils/shared";

const mockProvider: BaseProvider = {
  preferBulkTranslate: true,
  getCacheCode: jest.fn(() => "mockCacheCode"),
  generateCacheKey: jest.fn((original, critique, from, to) =>
    Buffer.from(`${original}-${critique}-${from}-${to}`).toString("base64"),
  ),
  repairTranslation: jest.fn((original, critique, from, to) =>
    Promise.resolve("Mock repaired translation"),
  ),
  critiqueTranslation: jest.fn(
    (originalText, newText, format, save, from, to) =>
      Promise.resolve("Mock critique result"),
  ),
  translateTextBulk: jest.fn((text, from, to) =>
    Promise.resolve(
      text.map((t) => `Mock translated ${t} from ${from} to ${to}`),
    ),
  ),
  translateText: jest.fn((text, from, to) =>
    Promise.resolve(`Mock translated ${text} from ${from} to ${to}`),
  ),
  saveToFile: jest.fn((content, filePath) => {
    // Mock implementation for saving to file
  }),
};

const mockConfig: LocaleConfig = {
  includeLanguage: ["en", "haw"],
  excludeLanguage: [],
  primeLanguage: "en",
};

describe("OleloHonua", () => {
  let oleloHonua: OleloHonua;

  beforeEach(() => {
    oleloHonua = new OleloHonua(mockConfig, mockProvider);
  });

  test("should validate config correctly", () => {
    expect(() => oleloHonua["validateConfig"](mockConfig)).not.toThrow();
  });

  test("should throw error if prime language is not specified", () => {
    const invalidConfig = { ...mockConfig, primeLanguage: "" };
    expect(() => oleloHonua["validateConfig"](invalidConfig)).toThrow(
      "Prime language must be specified.",
    );
  });

  test("should throw error if both includeLanguage and excludeLanguage are specified", () => {
    const invalidConfig = { ...mockConfig, excludeLanguage: ["fr"] };
    expect(() => oleloHonua["validateConfig"](invalidConfig)).toThrow(
      "Only one of includeLanguage or excludeLanguage must be specified, not both.",
    );
  });

  test("should throw error if neither includeLanguage nor excludeLanguage are specified", () => {
    const invalidConfig = {
      ...mockConfig,
      includeLanguage: [],
      excludeLanguage: [],
    };
    expect(() => oleloHonua["validateConfig"](invalidConfig)).toThrow(
      "One of includeLanguage or excludeLanguage must be specified.",
    );
  });

  test("bulkify should remove newlines and join text with newline", () => {
    const input = ["Hello\nWorld", "This\nis\na\ntest"];
    const expectedOutput = "Hello>World\nThis>is>a>test";
    expect(bulkify(input)).toBe(expectedOutput);
  });

  test("backify should split text by newline", () => {
    const input = "HelloWorld\nThisisatest";
    const expectedOutput = ["HelloWorld", "Thisisatest"];
    expect(backify(input)).toEqual(expectedOutput);
  });
});
