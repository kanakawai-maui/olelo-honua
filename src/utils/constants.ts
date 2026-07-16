import { Models } from "../types/shared";

export const OpenRouterModels: Models = {
  DEEPSEEK: {
    DEEPSEEK_V4_FLASH: "deepseek/deepseek-v4-flash",
    DEEPSEEK_V4_PRO: "deepseek/deepseek-v4-pro",
    DEEPSEEK_V3_2: "deepseek/deepseek-v3.2",
    DEEPSEEK_R1_0528: "deepseek/deepseek-r1-0528",
    // Legacy free models (may be deprecated)
    DEEPSEEK_V3_0324_FREE: "deepseek/deepseek-chat-v3-0324:free",
    DEEPSEEK_R1_FREE: "deepseek/deepseek-r1:free",
  },
  GOOGLE: {
    GEMMA_4_31B_FREE: "google/gemma-4-31b-it:free",
    GEMMA_4_26B_A4B_FREE: "google/gemma-4-26b-a4b-it:free",
    GEMINI_3_FLASH_PREVIEW: "google/gemini-3-flash-preview",
    GEMINI_3_5_FLASH: "google/gemini-3.5-flash",
    GEMINI_3_1_FLASH_LITE: "google/gemini-3.1-flash-lite",
    GEMINI_2_5_PRO: "google/gemini-2.5-pro",
    GEMINI_2_5_FLASH: "google/gemini-2.5-flash",
    // Legacy Gemma 3 free models
    GEMMA_3_4B_FREE: "google/gemma-3-4b-it:free",
    GEMMA_3_12B_FREE: "google/gemma-3-12b-it:free",
    GEMMA_3_27B_FREE: "google/gemma-3-27b-it:free",
  },
  NVIDIA: {
    NEMOTRON_3_ULTRA_550B_FREE: "nvidia/nemotron-3-ultra-550b-a55b:free",
    NEMOTRON_3_SUPER_120B_FREE: "nvidia/nemotron-3-super-120b-a12b:free",
    NEMOTRON_3_NANO_30B_FREE: "nvidia/nemotron-3-nano-30b-a3b:free",
    NEMOTRON_3_NANO_OMNI_FREE: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
    NEMOTRON_NANO_9B_V2_FREE: "nvidia/nemotron-nano-9b-v2:free",
  },
  META: {
    LLAMA_4_MAVERICK: "meta-llama/llama-4-maverick-17b-128e-instruct",
    LLAMA_4_SCOUT: "meta-llama/llama-4-scout-17b-16e-instruct",
    LLAMA_3_3_70B_FREE: "meta-llama/llama-3.3-70b-instruct:free",
    LLAMA_3_2_3B_FREE: "meta-llama/llama-3.2-3b-instruct:free",
  },
  QWEN: {
    QWEN_3_CODER_480B_FREE: "qwen/qwen3-coder:free",
    QWEN_3_235B_A22B: "qwen/qwen3-235b-a22b-2507",
    QWEN_3_30B_A3B: "qwen/qwen3-30b-a3b-instruct-2507",
    QWEN_3_6_FLASH: "qwen/qwen3.6-flash",
    QWEN_3_6_35B_A3B: "qwen/qwen3.6-35b-a3b",
    // Legacy free models
    QWQ_32B_FREE: "qwen/qwq-32b:free",
    QWEN_2_5_CODER_32B_INSTRUCT_FREE: "qwen/qwen-2.5-coder-32b-instruct:free",
  },
  MISTRAL: {
    MISTRAL_SMALL_4: "mistralai/mistral-small-2603",
    MISTRAL_MEDIUM_3_5: "mistralai/mistral-medium-3.5",
    DEVSTRAL_2: "mistralai/devstral-2512",
    // Legacy
    MISTRAL_SMALL_3_2_24B: "mistralai/mistral-small-3.2-24b-instruct",
    MISTRAL_7B_INSTRUCT_FREE: "mistralai/mistral-7b-instruct:free",
  },
  COHERE: {
    NORTH_MINI_CODE_FREE: "cohere/north-mini-code:free",
  },
  POOLSIDE: {
    LAGUNA_XS_2_1_FREE: "poolside/laguna-xs-2.1:free",
  },
  OPENAI_OSS: {
    GPT_OSS_20B_FREE: "openai/gpt-oss-20b:free",
    GPT_OSS_120B: "openai/gpt-oss-120b",
  },
};

export const OpenAIModels: Models = {
  OPENAI: {
    GPT_5_6_SOL: "openai/gpt-5.6-sol",
    GPT_5_6_TERRA: "openai/gpt-5.6-terra",
    GPT_5_6_LUNA: "openai/gpt-5.6-luna",
    GPT_5_5: "openai/gpt-5.5",
    GPT_5_4: "openai/gpt-5.4",
    GPT_5_4_MINI: "openai/gpt-5.4-mini",
    GPT_5: "openai/gpt-5",
    GPT_5_MINI: "openai/gpt-5-mini",
    GPT_4O: "openai/gpt-4o",
    GPT_4O_MINI: "openai/gpt-4o-mini",
    // Legacy
    GPT3_5: "openai/gpt-3.5-turbo",
    GPT4: "openai/gpt-4",
  },
};
