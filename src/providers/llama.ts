import { OpenRouterProvider } from "./openRouter";

export class LlamaProvider extends OpenRouterProvider {
  private static readonly DEFAULT_MODEL_ID =
    "meta-llama/llama-3.3-70b-instruct:free";

    constructor(apiKey: string, modelId = LlamaProvider.DEFAULT_MODEL_ID) {
        super(apiKey, modelId);
    }
}
