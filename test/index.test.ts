import OleloHonua from "../index";
import { LocaleConfig } from "../src/interfaces/locale";
import { LanguageProvider } from "../src/interfaces/language";
import * as fs from "fs";

const mockProvider: LanguageProvider = {
  translateText: jest.fn((text, from, to) =>
    Promise.resolve(`Translated ${text} from ${from} to ${to}`),
  ),
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
});
