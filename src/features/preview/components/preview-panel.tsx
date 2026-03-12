"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpenText, ChevronLeft, ChevronRight, PanelRightClose, PanelRightOpen, Search, ZoomIn, ZoomOut } from "lucide-react";

import type { Citation, PreviewSection } from "@/entities/document/types";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { cn } from "@/shared/lib/utils";

interface PreviewPanelProps {
  documentName?: string;
  sections: PreviewSection[];
  citations: Citation[];
  activeCitationId: string | null;
  collapsed: boolean;
  onToggle: () => void;
  onCitationClick: (citationId: string) => void;
}

export function PreviewPanel({
  documentName,
  sections,
  citations,
  activeCitationId,
  collapsed,
  onToggle,
  onCitationClick,
}: PreviewPanelProps) {
  const [zoom, setZoom] = useState(100);
  const [pageInput, setPageInput] = useState("1");
  const activePage = useMemo(() => {
    const activeCitation = citations.find((item) => item.id === activeCitationId);
    return activeCitation?.page ?? sections[0]?.page ?? 1;
  }, [activeCitationId, citations, sections]);

  useEffect(() => {
    setPageInput(String(activePage));
  }, [activePage]);

  const visibleSection = useMemo(
    () => sections.find((section) => section.page === activePage) ?? sections[0],
    [activePage, sections],
  );

  if (collapsed) {
    return (
      <div className="flex h-full items-center justify-center rounded-[var(--radius-xl)] border border-[var(--line)] bg-white/70">
        <Button variant="ghost" className="size-11 rounded-full p-0" onClick={onToggle} aria-label="展开预览">
          <PanelRightOpen className="size-4" />
        </Button>
      </div>
    );
  }

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">Document preview</p>
          <p className="mt-1 text-lg font-semibold">{documentName ?? "上传文档后在此预览"}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="size-10 rounded-full p-0"
            aria-label="上一页"
            onClick={() => {
              const previousSection = [...sections].reverse().find((section) => section.page < activePage);
              if (!previousSection) {
                return;
              }
              const citation = citations.find((item) => item.page === previousSection.page);
              if (citation) {
                onCitationClick(citation.id);
              }
            }}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Badge>{activePage} / 128</Badge>
          <Button
            variant="ghost"
            className="size-10 rounded-full p-0"
            aria-label="下一页"
            onClick={() => {
              const nextSection = sections.find((section) => section.page > activePage);
              if (!nextSection) {
                return;
              }
              const citation = citations.find((item) => item.page === nextSection.page);
              if (citation) {
                onCitationClick(citation.id);
              }
            }}
          >
            <ChevronRight className="size-4" />
          </Button>
          <Button variant="ghost" className="size-10 rounded-full p-0" aria-label="缩小预览" onClick={() => setZoom((value) => Math.max(50, value - 25))}>
            <ZoomOut className="size-4" />
          </Button>
          <Badge>{zoom}%</Badge>
          <Button variant="ghost" className="size-10 rounded-full p-0" aria-label="放大预览" onClick={() => setZoom((value) => Math.min(300, value + 25))}>
            <ZoomIn className="size-4" />
          </Button>
          <Button variant="ghost" className="size-10 rounded-full p-0" onClick={onToggle} aria-label="折叠预览">
            <PanelRightClose className="size-4" />
          </Button>
        </div>
      </div>

      <div className="grid flex-1 gap-4 overflow-hidden p-4 xl:grid-cols-[14rem_minmax(0,1fr)]">
        <aside className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--panel)] p-4">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
            <BookOpenText className="size-4" />
            文档目录
          </div>
          <div className="mb-4 flex items-center gap-2 rounded-full border border-[var(--line)] bg-white px-3 py-2">
            <Search className="size-4 text-[var(--muted)]" />
            <input
              value={pageInput}
              onChange={(event) => setPageInput(event.target.value.replace(/[^\d]/g, ""))}
              onKeyDown={(event) => {
                if (event.key !== "Enter") {
                  return;
                }
                const targetPage = Number(pageInput);
                const matchedSection = sections.find((section) => section.page === targetPage);
                if (!matchedSection) {
                  return;
                }
                const citation = citations.find((item) => item.page === matchedSection.page);
                if (citation) {
                  onCitationClick(citation.id);
                }
              }}
              className="min-w-0 flex-1 border-0 bg-transparent text-sm outline-none"
              placeholder="输入页码跳转"
              aria-label="输入页码跳转"
            />
          </div>
          <div className="space-y-2 text-sm">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                className={cn(
                  "block w-full rounded-[var(--radius-md)] px-3 py-2 text-left transition hover:bg-white",
                  visibleSection?.id === section.id && "bg-white shadow-sm",
                )}
                onClick={() => {
                  const citation = citations.find((item) => item.page === section.page);
                  if (citation) {
                    onCitationClick(citation.id);
                  }
                }}
              >
                <span className="font-medium">{section.title}</span>
                <span className="mt-1 block text-xs text-[var(--muted)]">P{section.page}</span>
              </button>
            ))}
          </div>
        </aside>

        <div className="overflow-y-auto pr-2">
          <div className="space-y-6">
            {sections.map((section) => {
              const linkedCitation = citations.find((item) => item.page === section.page);
              const isActive = linkedCitation?.id === activeCitationId;
              const isVisible = section.id === visibleSection?.id;

              return (
                <section
                  key={section.id}
                  className={cn(
                    "rounded-[var(--radius-xl)] border border-[var(--line)] bg-white px-8 py-7 transition",
                    isActive && "highlight-pulse border-[var(--brand)] shadow-[0_0_0_4px_rgba(91,138,224,0.12)]",
                    !isVisible && "opacity-55",
                  )}
                  style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Page {section.page}</p>
                      <h3 className="font-[var(--font-display)] text-3xl">{section.title}</h3>
                    </div>
                    {linkedCitation ? (
                      <Button variant="ghost" className="rounded-full px-3" onClick={() => onCitationClick(linkedCitation.id)}>
                        {linkedCitation.label}
                      </Button>
                    ) : null}
                  </div>
                  <div className="space-y-4 text-sm leading-7 text-[color-mix(in_oklab,var(--foreground)_90%,var(--muted))]">
                    {section.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
