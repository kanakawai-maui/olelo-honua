import { OpenRouterProvider } from "./openRouter";

export class QwenProvider extends OpenRouterProvider {
  private static readonly DEFAULT_MODEL_ID =
    "qwen/qwq-32b:free";

  constructor(apiKey: string) {
    super(apiKey, QwenProvider.DEFAULT_MODEL_ID);
  }
}
