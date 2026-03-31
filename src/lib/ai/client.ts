import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

export function getAIClient(): Anthropic {
  if (!client) {
    client = new Anthropic({
      baseURL: process.env.ANTHROPIC_BASE_URL,
      apiKey: process.env.ANTHROPIC_AUTH_TOKEN,
    });
  }
  return client;
}

export function getModel(): string {
  return process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-20250514";
}
