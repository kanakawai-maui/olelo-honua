import { OpenRouterProvider } from "./openRouter";

export class GemmaProvider extends OpenRouterProvider {
  private static readonly DEFAULT_MODEL_ID = "google/gemma-3-1b-it:free";

  constructor(apiKey: string, modelId = GemmaProvider.DEFAULT_MODEL_ID) {
    super(apiKey, modelId);
  }
}
