import { OpenRouterProvider } from "./openRouter";

export class DeepSeekProvider extends OpenRouterProvider {
  private static readonly DEFAULT_MODEL_ID =
    "deepseek/deepseek-r1-distill-llama-70b:free";

    constructor(apiKey: string, modelId = DeepSeekProvider.DEFAULT_MODEL_ID) {
        super(apiKey, modelId);
    }
}
