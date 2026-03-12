import type { FeedbackPayload } from "@/entities/message/types";
import type { UploadResult } from "@/entities/document/types";

export interface UploadResponse extends UploadResult {}

export interface ChatRequest {
  docId: string;
  question: string;
  history: { role: "user" | "assistant"; content: string }[];
}

export interface FeedbackResponse {
  ok: true;
  payload: FeedbackPayload;
}
