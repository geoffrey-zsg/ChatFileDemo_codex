"use client";

import { Paperclip, Send, Square } from "lucide-react";
import { useId } from "react";

import { Button } from "@/shared/ui/button";

interface ChatInputProps {
  value: string;
  disabled: boolean;
  isStreaming: boolean;
  inputRef?: React.RefObject<HTMLTextAreaElement | null>;
  onChange: (value: string) => void;
  onSend: () => void;
  onPickFile: () => void;
  onStop: () => void;
}

export function ChatInput({ value, disabled, isStreaming, inputRef, onChange, onSend, onPickFile, onStop }: ChatInputProps) {
  const inputId = useId();
  const overLimit = value.length > 2000;

  return (
    <div className="rounded-[calc(var(--radius-xl)+0.25rem)] border border-[var(--line)] bg-white/90 p-2 shadow-[var(--shadow-soft)] backdrop-blur">
      <label htmlFor={inputId} className="sr-only">
        输入问题
      </label>
      <div className="flex items-end gap-2">
        <Button variant="ghost" className="size-11 rounded-full p-0" aria-label="上传或更换文档" onClick={onPickFile}>
          <Paperclip className="size-4" />
        </Button>
        <textarea
          ref={inputRef}
          id={inputId}
          rows={1}
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              onSend();
            }
          }}
          placeholder={disabled ? "文档解析中，AI 助手稍后就绪" : "输入问题，开始与文档对话..."}
          className="max-h-32 min-h-11 flex-1 resize-none border-0 bg-transparent px-2 py-2 text-sm leading-6 outline-none placeholder:text-[var(--muted)] disabled:cursor-not-allowed"
        />
        <Button
          className="size-11 rounded-full p-0"
          variant={isStreaming ? "danger" : "primary"}
          aria-label={isStreaming ? "停止生成" : "发送消息"}
          disabled={!isStreaming && (disabled || !value.trim() || overLimit)}
          onClick={isStreaming ? onStop : onSend}
        >
          {isStreaming ? <Square className="size-4" /> : <Send className="size-4" />}
        </Button>
      </div>
      <div className="flex items-center justify-between px-3 pb-1 pt-2 text-xs text-[var(--muted)]">
        <span>Enter 发送，Shift + Enter 换行</span>
        <span className={overLimit ? "text-[var(--danger)]" : ""}>{value.length}/2000</span>
      </div>
    </div>
  );
}
