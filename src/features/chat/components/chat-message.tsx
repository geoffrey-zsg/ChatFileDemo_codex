"use client";

import { useState } from "react";
import { Copy, ThumbsDown, ThumbsUp } from "lucide-react";

import type { ChatMessage as ChatMessageType } from "@/entities/message/types";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { cn } from "@/shared/lib/utils";
import { Textarea } from "@/shared/ui/textarea";

interface ChatMessageProps {
  message: ChatMessageType;
  onCitationClick: (citationId: string) => void;
  onFeedback: (messageId: string, positive: boolean, detail?: { tags: string[]; note?: string }) => Promise<void> | void;
  onCopy?: (content: string) => void;
}

const feedbackOptions = ["回答不准确", "引用错误", "信息不完整", "答非所问"];

export function ChatMessage({ message, onCitationClick, onFeedback, onCopy }: ChatMessageProps) {
  const isAssistant = message.role === "assistant";
  const [panelOpen, setPanelOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const isNoResult = isAssistant && !message.citations?.length && message.content.includes("未找到");

  const isPositive = message.feedbackState === "positive";
  const isNegative = message.feedbackState === "negative";

  return (
    <div className={cn("flex", isAssistant ? "justify-start" : "justify-end")}>
      <Card
        className={cn(
          "max-w-[min(100%,42rem)] rounded-[var(--radius-xl)] px-5 py-4",
          isAssistant ? "bg-[var(--assistant-bubble)]" : "bg-[var(--user-bubble)]",
          isNoResult && "border-[color-mix(in_oklab,var(--warn)_38%,var(--line))] bg-[color-mix(in_oklab,var(--panel)_90%,#fff8ea)]",
        )}
      >
        <div className={cn("space-y-3 text-sm leading-7", message.status === "streaming" && "cursor-dot")}>
          <p className="whitespace-pre-wrap">{message.content}</p>

          {isNoResult ? (
            <div className="rounded-[var(--radius-lg)] bg-white/75 p-4 text-sm">
              <p className="font-semibold">建议</p>
              <ul className="mt-2 space-y-1 pl-5 text-[var(--muted)]">
                <li>尝试换一种表述方式</li>
                <li>确认该信息是否在当前文档中</li>
              </ul>
            </div>
          ) : null}

          {isAssistant && message.citations?.length ? (
            <div className="space-y-2 border-t border-[var(--line)] pt-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">引用来源</p>
              {message.citations.map((citation) => (
                <button
                  key={citation.id}
                  type="button"
                  className="block w-full rounded-[var(--radius-md)] bg-[var(--panel)] px-3 py-2 text-left transition hover:bg-[var(--panel-strong)]"
                  onClick={() => onCitationClick(citation.id)}
                >
                  <span className="mr-2 font-semibold text-[var(--brand)]">{citation.label}</span>
                  <span>
                    P{citation.page} · {citation.section}
                  </span>
                </button>
              ))}
            </div>
          ) : null}

          {isAssistant ? (
            <div className="flex items-center gap-2 border-t border-[var(--line)] pt-3 text-[var(--muted)]">
              <Button
                variant="ghost"
                className={cn("h-9 px-3", isPositive && "bg-emerald-50 text-emerald-700")}
                onClick={() => {
                  setPanelOpen(false);
                  void onFeedback(message.id, true);
                }}
              >
                <ThumbsUp className="mr-2 size-4" />
                👍
              </Button>
              <Button
                variant="ghost"
                className={cn("h-9 px-3", isNegative && "bg-rose-50 text-rose-700")}
                onClick={() => setPanelOpen((open) => !open)}
              >
                <ThumbsDown className="mr-2 size-4" />
                👎
              </Button>
              {message.canCopy ? (
                <Button
                  variant="ghost"
                  className="h-9 px-3"
                  onClick={async () => {
                    await navigator.clipboard.writeText(message.content);
                    onCopy?.(message.content);
                  }}
                >
                  <Copy className="mr-2 size-4" />
                  复制
                </Button>
              ) : null}
            </div>
          ) : null}

          {isAssistant && panelOpen ? (
            <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--panel)] p-4">
              <p className="text-sm font-semibold">请选择问题类型（可多选）</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {feedbackOptions.map((option) => {
                  const selected = selectedTags.includes(option);
                  return (
                    <button
                      key={option}
                      type="button"
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                        selected
                          ? "border-[var(--brand)] bg-[color-mix(in_oklab,var(--brand)_12%,white)] text-[var(--brand)]"
                          : "border-[var(--line)] bg-white text-[var(--muted)]",
                      )}
                      onClick={() =>
                        setSelectedTags((tags) =>
                          selected ? tags.filter((tag) => tag !== option) : [...tags, option],
                        )
                      }
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
              <div className="mt-3">
                <Textarea
                  rows={3}
                  maxLength={200}
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="补充说明（可选，最多 200 字）"
                />
              </div>
              <div className="mt-3 flex items-center justify-end gap-2">
                <Button variant="ghost" onClick={() => setPanelOpen(false)}>
                  取消
                </Button>
                <Button
                  onClick={() => {
                    void onFeedback(message.id, false, {
                      tags: selectedTags,
                      note: note.trim() || undefined,
                    });
                    setPanelOpen(false);
                  }}
                >
                  提交反馈
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
