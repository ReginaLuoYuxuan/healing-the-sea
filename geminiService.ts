// services/geminiService.ts

// 现在不再真正调用 Gemini，只返回固定的一句话。
// 这样就不会出现一大段 AI 味道很重的文字。

export const getOceanFact = async (_topic: string): Promise<string> => {
  return "Life returns when someone cares.";
};
