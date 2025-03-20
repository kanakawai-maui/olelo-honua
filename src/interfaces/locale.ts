export interface LocaleConfig {
  primeLanguage: string;
  useBulkProvider?: boolean; // deprecate soon
  bulkTranslate?: boolean;
  critique?: boolean;
  saveCritique?: boolean;
  repair?: boolean;
  debug?: boolean;
  includeLanguage?: string[];
  excludeLanguage?: string[];
  multiLanguageAgreementThreshold?: number;
}
