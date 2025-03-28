import { OleloHonua } from "../src/index";
import { Config } from "../src/interfaces/config";
import { OpenRouterProvider } from "../src/providers/openRouter";

jest.mock("fs", () => ({
    existsSync: jest.fn(() => false),
    readFileSync: jest.fn(() => JSON.stringify([])),
}));

jest.mock("path", () => ({
    resolve: jest.fn(() => "/mocked/path"),
    join: jest.fn((...args: string[]) => args.join("/")),
}));

jest.mock("../src/system/shared", () => ({
    FileManager: class {
        public save = jest.fn();
    },
    LocaleFileManager: class {
        public saveContent = jest.fn();
    },
    CacheManager: class {
        public setCacheKey = jest.fn();
        public peek = jest.fn();
        public get = jest.fn();
    }
}));

jest.mock("../src/providers/openRouter", () => ({
    OpenRouterProvider: class {
        public translate = jest.fn(() => Promise.resolve("Mock translation"));
    }
}));

const mockConfig: Config = {
    includeLanguage: ["en", "haw"],
    excludeLanguage: [],
    primeLanguage: "en",
    provider: {
        platform: "OpenRouter",
        credentials: {
            apiKey: "mockApiKey",
            projectId: undefined,
            secretKey: undefined,
        },
        modelId: "mockModelId",
        customChatCompletionFunction: undefined,
    },
};

describe("OleloHonua", () => {
    let oleloHonua: OleloHonua;

    beforeEach(() => {
        oleloHonua = new OleloHonua(mockConfig);
    });

    test("should validate config correctly", () => {
        expect(() => oleloHonua["validateConfig"](mockConfig)).not.toThrow();
    });

    test("should throw error if prime language is not specified", () => {
        const invalidConfig = { ...mockConfig, primeLanguage: "" };
        expect(() => oleloHonua["validateConfig"](invalidConfig)).toThrow(
            "Prime language must be specified."
        );
    });

    test("should throw error if both includeLanguage and excludeLanguage are specified", () => {
        const invalidConfig = { ...mockConfig, excludeLanguage: ["fr"] };
        expect(() => oleloHonua["validateConfig"](invalidConfig)).toThrow(
            "Only one of includeLanguage or excludeLanguage must be specified, not both."
        );
    });

    test("should throw error if neither includeLanguage nor excludeLanguage are specified", () => {
        const invalidConfig = {
            ...mockConfig,
            includeLanguage: [],
            excludeLanguage: [],
        };
        expect(() => oleloHonua["validateConfig"](invalidConfig)).toThrow(
            "One of includeLanguage or excludeLanguage must be specified."
        );
    });

    test("should throw error if invalid language is specified in includeLanguage", () => {
        const invalidConfig = {
            ...mockConfig,
            includeLanguage: ["invalidLang"],
        };
        expect(() => oleloHonua["validateConfig"](invalidConfig)).toThrow(
            "Invalid language specified in includeLanguage: invalidLang"
        );
    });

    test("should throw error if invalid language is specified in excludeLanguage", () => {
        const invalidConfig = {
            ...mockConfig,
            includeLanguage: [],
            excludeLanguage: ["invalidLang"],
        };
        expect(() => oleloHonua["validateConfig"](invalidConfig)).toThrow(
            "Invalid language specified in excludeLanguage: invalidLang"
        );
    });
});
