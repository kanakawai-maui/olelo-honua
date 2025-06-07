export type Language = {
  code: string;
  nativeName: string;
  flag?: string;
  englishName: string;
};

export type Models = Record<string, Record<string, string>>;

export type FileFormat = {
  name: string;
  ext: string;
  exampleTitle: string;
  exampleDetail: string;
};
