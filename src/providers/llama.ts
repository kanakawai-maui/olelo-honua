import { OpenRouterProvider } from "./openRouter";

export class LlamaProvider extends OpenRouterProvider {
  private static readonly DEFAULT_MODEL_ID =
    "meta-llama/llama-3.3-70b-instruct:free";

  constructor(apiKey: string) {
    super(apiKey, LlamaProvider.DEFAULT_MODEL_ID);
  }
}
