"use client";

import { create } from "zustand";

import type { DocumentMeta, PreviewSection, ProcessingStage, Citation } from "@/entities/document/types";
import type { ChatMessage } from "@/entities/message/types";

interface ChatFileStore {
  document: DocumentMeta | null;
  previewSections: PreviewSection[];
  citations: Citation[];
  stage: ProcessingStage;
  stageProgress: number;
  messages: ChatMessage[];
  collapsedPreview: boolean;
  activeCitationId: string | null;
  setDocumentPayload: (payload: { document: DocumentMeta; previewSections: PreviewSection[]; citations: Citation[] }) => void;
  setStage: (stage: ProcessingStage, stageProgress?: number) => void;
  setMessages: (messages: ChatMessage[]) => void;
  appendMessage: (message: ChatMessage) => void;
  updateMessage: (id: string, updater: (message: ChatMessage) => ChatMessage) => void;
  resetConversation: () => void;
  togglePreview: () => void;
  setActiveCitation: (citationId: string | null) => void;
  resetDocument: () => void;
}

const initialState = {
  document: null,
  previewSections: [],
  citations: [],
  stage: "idle" as ProcessingStage,
  stageProgress: 0,
  messages: [] as ChatMessage[],
  collapsedPreview: false,
  activeCitationId: null as string | null,
};

export const useChatFileStore = create<ChatFileStore>((set) => ({
  ...initialState,
  setDocumentPayload: ({ document, previewSections, citations }) =>
    set({
      document,
      previewSections,
      citations,
      stage: "ready",
      stageProgress: 100,
    }),
  setStage: (stage, stageProgress = 0) => set({ stage, stageProgress }),
  setMessages: (messages) => set({ messages }),
  appendMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  updateMessage: (id, updater) =>
    set((state) => ({
      messages: state.messages.map((message) => (message.id === id ? updater(message) : message)),
    })),
  resetConversation: () => set({ messages: [] }),
  togglePreview: () => set((state) => ({ collapsedPreview: !state.collapsedPreview })),
  setActiveCitation: (activeCitationId) => set({ activeCitationId }),
  resetDocument: () => set({ ...initialState }),
}));
