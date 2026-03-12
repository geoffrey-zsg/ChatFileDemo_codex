import type { Citation } from "@/entities/document/types";

export interface FeedbackPayload {
  messageId: string;
  tags: string[];
  note?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  citations?: Citation[];
  status?: "streaming" | "complete" | "interrupted" | "error";
  canCopy?: boolean;
  feedbackState?: "positive" | "negative";
}
