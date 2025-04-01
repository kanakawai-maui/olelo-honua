export interface Config {
  primeLanguage: string; // The primary language to use
  provider: {
    platform: 'OpenRouter' | 'OpenAI' | 'GoogleTranslate' | 'Custom'; // Supported platforms
    credentials: {
      apiKey?: string; // Required for OpenRouter and OpenAI
      projectId?: string; // Required for GoogleTranslate
      secretKey?: string; // Required for OpenAI
    },
    modelId?: string; // Model ID for OpenRouter and OpenAI
    customChatCompletionFunction?: (text: string) => Promise<string>; // Custom function for 'Custom' platform
  },
  retries?: {
    mainLoop: number; // Retry limit for the main loop
    critiqueLoop: number; // Retry limit for critique loop
    repairLoop: number; // Retry limit for repair loop
  },
  debug?: boolean; // Enable or disable debug mode
  clearCache?: boolean; // Clear cache on startup
  includeLanguage?: string[]; // Languages to include
  excludeLanguage?: string[]; // Languages to exclude
  maxChunkRequests?: 2 | 4 | 6; // Maximum number of chunk requests
  additionalConfig?: Record<string, any>; // For future extensibility
}
