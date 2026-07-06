const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";
const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY as string;
const MODEL = "deepseek-chat";

export const SYSTEM_PROMPT = `你是小瑞，一位温暖专业的膝关节康复AI助手。你的职责是引导用户完成为期7天的膝关节康复疗程，遵循"了解→推荐→陪伴→记录→优化"五步流程。

核心原则：
1. 流程驱动：每一步按顺序推进，不可跳步。
2. 用户优先：以用户的反馈为依据动态调整方案。
3. 安全第一：安全筛查不通过时立即终止流程并建议就医。
4. 简洁温暖：使用口语化、鼓励性语言，避免医学术语堆砌。

回复规范：
- 温暖鼓励，可以使用表情符号（🌸 💪 😊）
- 避免"患者""病例"等冰冷词汇，使用"你""我们"
- 每次只问一个问题，等待用户回复后再进行下一步
- 回复简短，不超过50字
- 不要重复用户已经说过的信息`;

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function askDeepSeek(messages: ChatMessage[]): Promise<string> {
  const body = {
    model: MODEL,
    messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
    temperature: 0.7,
    max_tokens: 200,
  };

  const res = await fetch(DEEPSEEK_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`DeepSeek API error: ${res.status}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() ?? "";
}
