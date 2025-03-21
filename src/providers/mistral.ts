import { OpenRouterProvider } from "./openRouter";

export class MistralProvider extends OpenRouterProvider {
  private static readonly DEFAULT_MODEL_ID =
    "mistralai/mistral-7b-instruct:free";

  constructor(apiKey: string, modelId = MistralProvider.DEFAULT_MODEL_ID) {
    super(apiKey, modelId);
  }
}
