import { jsonrepair } from "jsonrepair";

export const compareKeys = (a: object, b: object): boolean => {
  var aKeys = Object.keys(a).sort();
  var bKeys = Object.keys(b).sort();
  return JSON.stringify(aKeys) === JSON.stringify(bKeys);
};

export const anyToStr = (input: string | object): string => {
  try {
    let strJson = "";
    if (typeof input === "object") {
      strJson = JSON.stringify(input);
    } else if (typeof input === "string") {
      strJson = input;
    }
    const parsed = JSON.parse(strJson);
    if (parsed && typeof parsed === "object") {
      return JSON.stringify(parsed);
    }
  } catch {
    try {
      let strJson = "";
      if (typeof input === "object") {
        strJson = JSON.stringify(input);
      }
      return jsonrepair(strJson);
    } catch {
      return "{}";
    }
  }
  return "{}";
};
