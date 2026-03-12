import { NextResponse } from "next/server";

import { mockCitations, mockDocument, mockPreviewSections } from "@/shared/config/mock-data";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "missing_file" }, { status: 400 });
  }

  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    return NextResponse.json({ error: "invalid_type" }, { status: 400 });
  }

  if (file.size > 100 * 1024 * 1024) {
    return NextResponse.json({ error: "file_too_large" }, { status: 400 });
  }

  return NextResponse.json({
    document: {
      ...mockDocument,
      name: file.name,
      sizeLabel: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
    },
    previewSections: mockPreviewSections,
    citations: mockCitations,
  });
}
