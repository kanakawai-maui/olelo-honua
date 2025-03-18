export interface LocaleConfig {
  primeLanguage: string;
  useBulkProvider?: boolean; // deprecate soon
  bulkTranslate?: boolean;
  critique?: boolean;
  includeLanguage?: string[];
  excludeLanguage?: string[];
  multiLanguageAgreementThreshold?: number;
}
