import type { FeedbackPayload } from "@/entities/message/types";
import type { ChatRequest, FeedbackResponse, UploadResponse } from "@/shared/api/types";

export async function uploadDocument(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/document/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("upload_failed");
  }

  return (await response.json()) as UploadResponse;
}

export async function streamChat(request: ChatRequest, onChunk: (chunk: string) => void) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!response.ok || !response.body) {
    throw new Error("chat_failed");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      break;
    }
    onChunk(decoder.decode(value));
  }
}

export async function submitFeedback(payload: FeedbackPayload) {
  const response = await fetch("/api/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("feedback_failed");
  }

  return (await response.json()) as FeedbackResponse;
}
