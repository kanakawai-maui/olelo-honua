
export interface FullEngine {
  mainLoop(root: string | object, retries: number) : Promise<void>;

  critiqueLoop(
    original: string | object,
    translated: string | object,
    retries: number
  ) : Promise<string>;

  repairLoop(
    original: string | object,
    translated: string | object,
    critique: string | object,
    retries: number
  ) : Promise<string>;
}

export interface PartialEngine {
  mainLoop(root: string | object, retries: number) : Promise<void>;
}