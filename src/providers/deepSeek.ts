import {

BulkLanguageProvider,
CachableProvider,
CritiqueProvider,
LanguageProvider,
RepairProvider,
} from "../interfaces/language";
import {OpenRouterProvider} from "./openRouter";

export class DeepSeekProvider
extends OpenRouterProvider
implements
    LanguageProvider,
    BulkLanguageProvider,
    CachableProvider,
    CritiqueProvider,
    RepairProvider
{
    private static readonly DEFAULT_DEEPSEEK_MODEL_ID = "deepseek/deepseek-r1-distill-llama-70b:free";

    constructor(apiKey: string) {
        super(apiKey, DeepSeekProvider.DEFAULT_DEEPSEEK_MODEL_ID);
      }
}