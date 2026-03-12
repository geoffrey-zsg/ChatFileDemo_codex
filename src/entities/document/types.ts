export type ProcessingStage = "idle" | "uploading" | "parsing" | "chunking" | "indexing" | "ready" | "failed";

export interface DocumentMeta {
  id: string;
  name: string;
  pageCount: number;
  sizeLabel: string;
  chunkCount: number;
  summary: string;
  suggestedQuestions: string[];
}

export interface Citation {
  id: string;
  label: string;
  page: number;
  section: string;
  excerpt: string;
  highlightColor: "amber" | "sky" | "emerald";
}

export interface PreviewSection {
  id: string;
  title: string;
  page: number;
  body: string[];
}

export interface UploadResult {
  document: DocumentMeta;
  previewSections: PreviewSection[];
  citations: Citation[];
}
