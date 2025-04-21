import path from "path";
import { promises as fs } from "fs";
import { FileManager, LocaleFileManager, CritiqueFileManager, CacheManager, FileType } from "./shared";

jest.mock("fs", () => {
    const originalModule = jest.requireActual("fs");
    return {
        ...originalModule,
        promises: {
            access: jest.fn(),
            mkdir: jest.fn(),
            writeFile: jest.fn(),
        },
    };
});

const mockedFs = fs as jest.Mocked<typeof fs>;

describe("FileManager", () => {
    const testContent = JSON.stringify({ hello: "world" });
    const expectedOutput = JSON.stringify({ hello: "world" }, null, 2);
    const testDir = "testDir";
    const testFile = "testFile";

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should create directory if it does not exist and write file", async () => {
        mockedFs.access.mockRejectedValue(new Error("Directory not found"));
        mockedFs.mkdir.mockResolvedValue(undefined);
        mockedFs.writeFile.mockResolvedValue(undefined);

        const fm = new FileManager();
        await fm.save(testDir, testFile, "json", testContent);

        expect(mockedFs.access).toHaveBeenCalled();
        expect(mockedFs.mkdir).toHaveBeenCalledWith(expect.stringContaining(testDir), { recursive: true });
        expect(mockedFs.writeFile).toHaveBeenCalledWith(expect.any(String), expectedOutput);
    });

    test("should write file if directory exists", async () => {
        mockedFs.access.mockResolvedValue(undefined);
        mockedFs.writeFile.mockResolvedValue(undefined);

        const fm = new FileManager();
        await fm.save(testDir, testFile, "json", testContent);

        expect(mockedFs.access).toHaveBeenCalled();
        expect(mockedFs.mkdir).not.toHaveBeenCalled();
        expect(mockedFs.writeFile).toHaveBeenCalledWith(expect.any(String), expectedOutput);
    });
});

describe("LocaleFileManager", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should call FileManager.save with language code as file name", async () => {
        mockedFs.access.mockResolvedValue(undefined);
        mockedFs.writeFile.mockResolvedValue(undefined);

        const language = { code: "en" } as any;
        const lfm = new LocaleFileManager(language);
        const content = JSON.stringify({ key: "value" });

        await lfm.saveContent(content);
        expect(mockedFs.writeFile).toHaveBeenCalledWith(
            expect.stringContaining(path.join("locales", "en.json")),
            JSON.stringify({ key: "value" }, null, 2)
        );
    });
});

describe("CritiqueFileManager", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should call FileManager.save with namespace when provided", async () => {
        mockedFs.access.mockResolvedValue(undefined);
        mockedFs.writeFile.mockResolvedValue(undefined);

        const from = { code: "en" } as any;
        const to = { code: "haw" } as any;
        const namespace = "testNamespace";
        const cfm = new CritiqueFileManager(from, to, namespace);
        const content = JSON.stringify({ critique: "test" });
        await cfm.saveContent(content);

        expect(mockedFs.writeFile).toHaveBeenCalledWith(
            expect.stringContaining(path.join("critiques", `en.haw.${namespace.toLowerCase()}.json`)),
            JSON.stringify({ critique: "test" }, null, 2)
        );
    });

    test("should call FileManager.save without namespace when not provided", async () => {
        mockedFs.access.mockResolvedValue(undefined);
        mockedFs.writeFile.mockResolvedValue(undefined);

        const from = { code: "en" } as any;
        const to = { code: "haw" } as any;
        const cfm = new CritiqueFileManager(from, to);
        const content = JSON.stringify({ critique: "test" });
        await cfm.saveContent(content);

        expect(mockedFs.writeFile).toHaveBeenCalledWith(
            expect.stringContaining(path.join("critiques", "en.haw.json")),
            JSON.stringify({ critique: "test" }, null, 2)
        );
    });
});

describe("CacheManager", () => {
    let cacheManager: CacheManager;
    const sampleCache = { sample: "data" };

    beforeEach(() => {
        jest.clearAllMocks();
        mockedFs.writeFile.mockResolvedValue(undefined);
        cacheManager = new CacheManager("test_cache", "ns");
    });

    test("should set cache key and store value", () => {
        cacheManager.setCacheKey("myKey");
        cacheManager.set(sampleCache);
        expect(cacheManager.get()).toEqual(sampleCache);
    });

    test("save should write cache file and clear cache key when flag is true", () => {
        cacheManager.setCacheKey("myKey");
        cacheManager.set(sampleCache);
        cacheManager.save(true);
        expect(mockedFs.writeFile).toHaveBeenCalledWith(
            expect.stringContaining("ns.test_cache.json"),
            JSON.stringify({ myKey: sampleCache }, null, 2)
        );
        expect(() => cacheManager.get()).toThrow();
    });

    test("clear should reset cache and write empty object to file", async () => {
        cacheManager.setCacheKey("myKey");
        cacheManager.set(sampleCache);
        await cacheManager.clear();
        expect(() => cacheManager.get()).toThrow();
        expect(mockedFs.writeFile).toHaveBeenCalledWith(
            expect.stringContaining("ns.test_cache.json"),
            JSON.stringify({}, null, 2)
        );
    });

    describe("Extra CacheManager coverage", () => {
        test("set() should throw error when using default cache key", () => {
            const cm = new CacheManager("test_cache", "ns");
            expect(() => cm.set({ foo: "bar" })).toThrow("Cannot quickset with the default cache key.");
        });

        test("get() should throw error when using default cache key", () => {
            const cm = new CacheManager("test_cache", "ns");
            expect(() => cm.get()).toThrow("Cannot quickget with the default cache key.");
        });

        test("save() logs warning when cache is empty", () => {
            const cm = new CacheManager("test_cache", "ns");
            cm.setCacheKey("nonDefaultKey");
            const spyConsole = jest.spyOn(console, "log").mockImplementation(() => {});
            cm.save();
            expect(spyConsole).toHaveBeenCalledWith(
                "An empty cache file was created, this means that the translations were not cached and something went wrong. Please check the logs for more information."
            );
            spyConsole.mockRestore();
        });

        test("save should write cache file and clear cache key when flag is true", async () => {
          cacheManager.setCacheKey("myKey");
          cacheManager.set(sampleCache);
          await cacheManager.save(true);
          expect(mockedFs.writeFile).toHaveBeenCalledWith(
            expect.stringContaining("ns.test_cache.json"),
            JSON.stringify({ myKey: sampleCache }, null, 2)
          );
          expect(() => cacheManager.get()).toThrow();
        });

        test("clear() resets cache and autoCacheKey", async () => {
            const cm = new CacheManager("test_cache", "ns");
            cm.setCacheKey("nonDefaultKey");
            cm.set({ foo: "bar" });
            await cm.clear();
            expect(() => cm.get()).toThrow("Cannot quickget with the default cache key.");
            expect(cm["cache"]).toEqual({});
            expect(mockedFs.writeFile).toHaveBeenCalledWith(
                expect.stringContaining("ns.test_cache.json"),
                JSON.stringify({}, null, 2)
            );
        });
    });
    describe("Extra CacheManager default key coverage", () => {
      test("get() should throw error when autoCacheKey equals default (lines 107-108)", () => {
        const cm = new CacheManager("test_cache", "ns");
        expect(() => cm.get()).toThrow("Cannot quickget with the default cache key.");
      });
    
      test("set() should throw error when autoCacheKey equals default (line 117)", () => {
        const cm = new CacheManager("test_cache", "ns");
        expect(() => cm.set({ foo: "bar" })).toThrow("Cannot quickset with the default cache key.");
      });
    });
});