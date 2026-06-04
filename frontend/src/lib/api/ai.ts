import { apiClient } from "./client";

export async function askChatbot(question: string): Promise<string> {
  const data = await apiClient<{ result: string }>("/api/ai/chat", {
    method: "POST",
    body: JSON.stringify({ question }),
  });
  return data.result;
}
