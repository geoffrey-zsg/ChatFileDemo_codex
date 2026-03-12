"use client";

import type { DragEventHandler } from "react";
import { useMemo } from "react";
import { FileUp, LoaderCircle, Sparkles } from "lucide-react";

import type { ProcessingStage } from "@/entities/document/types";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

interface UploadPanelProps {
  stage: ProcessingStage;
  progress: number;
  disabled?: boolean;
  onSelectFile: () => void;
  currentFileName?: string;
  errorMessage?: string;
  isDragActive?: boolean;
  onDragOver?: DragEventHandler<HTMLDivElement>;
  onDragLeave?: DragEventHandler<HTMLDivElement>;
  onDrop?: DragEventHandler<HTMLDivElement>;
}

const stageLabels: Record<Extract<ProcessingStage, "uploading" | "parsing" | "chunking" | "indexing">, string> = {
  uploading: "上传中",
  parsing: "文档解析中",
  chunking: "智能切片中",
  indexing: "向量索引构建中",
};

export function UploadPanel({
  stage,
  progress,
  disabled,
  onSelectFile,
  currentFileName,
  errorMessage,
  isDragActive,
  onDragOver,
  onDragLeave,
  onDrop,
}: UploadPanelProps) {
  const isWorking = stage !== "idle" && stage !== "failed" && stage !== "ready";
  const helperText = useMemo(() => {
    if (errorMessage) {
      return errorMessage;
    }

    if (isWorking) {
      return `${stageLabels[stage as keyof typeof stageLabels]}... ${progress}%`;
    }

    if (isDragActive) {
      return "松开鼠标即可开始上传，支持 PDF 格式，单文件不超过 100MB。";
    }

    return "支持 PDF 格式，解析就绪前输入框会自动禁用。";
  }, [errorMessage, isDragActive, isWorking, progress, stage]);

  return (
    <Card className="relative overflow-hidden p-8 md:p-10">
      <div className="absolute inset-x-0 top-0 h-1 bg-[var(--panel)]">
        <div className="h-full bg-[var(--brand)] transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-[var(--panel)] p-3 text-[var(--brand)]">
            {isWorking ? <LoaderCircle className="size-6 animate-spin" /> : <FileUp className="size-6" />}
          </div>
          <div className="space-y-2">
            <p className="font-[var(--font-display)] text-3xl leading-none">上传一份 PDF，立即开始对话</p>
            <p className="max-w-xl text-sm leading-6 text-[var(--muted)]">
              支持单文件 PDF，最多 100MB。当前版本用本地 mock 数据模拟解析、切片和检索，重点验证交互链路和前端体验。
            </p>
          </div>
        </div>

        <div
          className={cn(
            "rounded-[var(--radius-xl)] border border-dashed bg-[color-mix(in_oklab,var(--panel)_72%,white)] p-8 transition",
            isDragActive
              ? "border-[var(--brand)] shadow-[0_0_0_5px_rgba(91,138,224,0.12)]"
              : "border-[color-mix(in_oklab,var(--brand)_36%,var(--line))]",
          )}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
                <Sparkles className="size-3.5" />
                ChatFile intake
              </div>
              <p className="text-lg font-semibold">{currentFileName ?? "拖拽或选择一份 Datasheet / Design Spec"}</p>
              <p className={cn("text-sm", errorMessage ? "text-[var(--danger)]" : "text-[var(--muted)]")}>{helperText}</p>
            </div>
            <Button onClick={onSelectFile} disabled={disabled || isWorking} className="min-w-32">
              选择文件
            </Button>
          </div>

          <div className="mt-6 space-y-3">
            {(["uploading", "parsing", "chunking", "indexing"] as const).map((item, index) => {
              const states = ["uploading", "parsing", "chunking", "indexing"] as const;
              const currentIndex = states.indexOf(stage as (typeof states)[number]);
              const isDone = index < currentIndex;
              const isCurrent = item === stage;

              return (
                <div key={item} className="flex items-center gap-3 text-sm">
                  <span
                    className={cn(
                      "inline-flex size-6 items-center justify-center rounded-full border text-xs font-semibold",
                      isDone && "border-emerald-300 bg-emerald-50 text-emerald-700",
                      isCurrent && "border-[var(--brand)] bg-[color-mix(in_oklab,var(--brand)_10%,white)] text-[var(--brand)]",
                      !isDone && !isCurrent && "border-[var(--line)] bg-white text-[var(--muted)]",
                    )}
                  >
                    {isDone ? "✓" : index + 1}
                  </span>
                  <span>{stageLabels[item]}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
