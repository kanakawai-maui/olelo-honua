import { Models } from "../types/shared";

export const OpenRouterModels: Models = {
  DEEPSEEK: {
    DEEPSEEK_V3_0324_FREE: "deepseek/deepseek-chat-v3-0324:free",
    DEEPSEEK_R1_FREE: "deepseek/deepseek-r1:free",
    DEEPSEEK_V3_FREE: "deepseek/deepseek-chat:free",
  },
  GOOGLE: {
    GEMINI_PRO_2_5_EXP_FREE: "google/gemini-2.5-pro-exp-03-25:free",
    GEMMA_3_1B_FREE: "google/gemma-3-1b-it:free",
    GEMMA_3_4B_FREE: "google/gemma-3-4b-it:free",
    GEMMA_3_12B_FREE: "google/gemma-3-12b-it:free",
    GEMMA_3_27B_FREE: "google/gemma-3-27b-it:free",
    GEMINI_2_0_FLASH_LITE_PREVIEW_FREE:
      "google/gemini-2.0-flash-lite-preview-02-05:free",
    GEMINI_PRO_2_0_EXP_FREE: "google/gemini-2.0-pro-exp-02-05:free",
    GEMINI_2_0_FLASH_THINKING_EXP_01_21_FREE:
      "google/gemini-2.0-flash-thinking-exp:free",
    GEMINI_2_0_FLASH_THINKING_EXP_FREE:
      "google/gemini-2.0-flash-thinking-exp-1219:free",
    GEMINI_FLASH_2_0_EXP_FREE: "google/gemini-2.0-flash-exp:free",
    LEARNLM_1_5_PRO_EXP_FREE: "google/learnlm-1.5-pro-experimental:free",
    GEMMA_2_9B_FREE: "google/gemma-2-9b-it:free",
  },
  LLAMA2: {
    ROGUE_ROSE_103B_V0_2_FREE: "sophosympatheia/rogue-rose-103b-v0.2:free",
    MYTHOMAX_13B_FREE: "gryphe/mythomax-l2-13b:free",
  },
  LLAMA3: {
    DEEPSEEK_R1_DISTILL_LLAMA_70B_FREE:
      "deepseek/deepseek-r1-distill-llama-70b:free",
    META_LLAMA_3_3_70B_INSTRUCT_FREE: "meta-llama/llama-3.3-70b-instruct:free",
    NVIDIA_LLAMA_3_1_NEMOTRON_70B_INSTRUCT_FREE:
      "nvidia/llama-3.1-nemotron-70b-instruct:free",
    META_LLAMA_3_2_3B_INSTRUCT_FREE: "meta-llama/llama-3.2-3b-instruct:free",
    META_LLAMA_3_2_1B_INSTRUCT_FREE: "meta-llama/llama-3.2-1b-instruct:free",
    META_LLAMA_3_1_8B_INSTRUCT_FREE: "meta-llama/llama-3.1-8b-instruct:free",
    META_LLAMA_3_8B_INSTRUCT_FREE: "meta-llama/llama-3-8b-instruct:free",
  },
  QWEN: {
    QWQ_32B_FREE: "qwen/qwq-32b:free",
    DEEPSEEK_R1_DISTILL_QWEN_32B_FREE:
      "deepseek/deepseek-r1-distill-qwen-32b:free",
    DEEPSEEK_R1_DISTILL_QWEN_14B_FREE:
      "deepseek/deepseek-r1-distill-qwen-14b:free",
    QWQ_32B_PREVIEW_FREE: "qwen/qwq-32b-preview:free",
    QWEN_2_5_CODER_32B_INSTRUCT_FREE: "qwen/qwen-2.5-coder-32b-instruct:free",
    QWEN_2_5_72B_INSTRUCT_FREE: "qwen/qwen-2.5-72b-instruct:free",
    QWEN_2_7B_INSTRUCT_FREE: "qwen/qwen-2-7b-instruct:free",
  },
  MISTRAL: {
    MISTRAL_7B_INSTRUCT_FREE: "mistralai/mistral-7b-instruct:free",
  },
};

export const OpenAIModels: Models = {
  OPENAI: {
    DAVINCI: "openai/davinci",
    CURIE: "openai/curie",
    BABBAGE: "openai/babbage",
    ADA: "openai/ada",
    GPT3_5: "openai/gpt-3.5-turbo",
    GPT4: "openai/gpt-4o",
  },
};
