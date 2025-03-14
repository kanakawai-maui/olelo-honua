export interface LocaleConfig {
  primeLanguage: string;
  useBulkProvider?: boolean;
  includeLanguage?: string[];
  excludeLanguage?: string[];
  multiLanguageAgreementThreshold?: number;
}
