"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { AlertCircle, FileText, HelpCircle, LoaderCircle, Sparkles } from "lucide-react";

import { ChatInput } from "@/features/chat/components/chat-input";
import { ChatMessage } from "@/features/chat/components/chat-message";
import { PreviewPanel } from "@/features/preview/components/preview-panel";
import { UploadPanel } from "@/features/upload/components/upload-panel";
import { submitFeedback, uploadDocument, streamChat } from "@/shared/api/client";
import { mockCitations } from "@/shared/config/mock-data";
import { formatTime } from "@/shared/lib/utils";
import { useChatFileStore } from "@/shared/stores/chatfile-store";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";

const processingPlan = [
  { stage: "uploading" as const, progress: 28, delay: 400 },
  { stage: "parsing" as const, progress: 56, delay: 700 },
  { stage: "chunking" as const, progress: 82, delay: 650 },
  { stage: "indexing" as const, progress: 100, delay: 650 },
];

export default function HomePage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const chatInputRef = useRef<HTMLTextAreaElement | null>(null);
  const abortRef = useRef(false);
  const latestMessagesRef = useRef<typeof messages>([]);
  const latestStreamingRef = useRef(false);
  const [clientReady, setClientReady] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [showFullHistory, setShowFullHistory] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [messageDraft, setMessageDraft] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [statusText, setStatusText] = useState("等待上传文档");
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [pending, startTransition] = useTransition();

  const {
    document,
    previewSections,
    citations,
    messages,
    stage,
    stageProgress,
    collapsedPreview,
    activeCitationId,
    setDocumentPayload,
    setStage,
    appendMessage,
    updateMessage,
    resetConversation,
    togglePreview,
    setActiveCitation,
    resetDocument,
  } = useChatFileStore();

  const isReady = stage === "ready";
  const isStreaming = messages.some((item) => item.status === "streaming");

  const currentCitations = citations.length ? citations : mockCitations;
  const visibleMessages = showFullHistory ? messages : messages.slice(-20);
  const hiddenMessageCount = Math.max(0, messages.length - visibleMessages.length);

  useEffect(() => {
    setClientReady(true);
  }, []);

  useEffect(() => {
    latestMessagesRef.current = messages;
    latestStreamingRef.current = isStreaming;
  }, [isStreaming, messages]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        chatInputRef.current?.focus();
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "u") {
        event.preventDefault();
        fileInputRef.current?.click();
      }

      if ((event.ctrlKey || event.metaKey) && event.key === "/") {
        event.preventDefault();
        setShowHelp((value) => !value);
      }

      if (event.key === "Escape") {
        if (latestStreamingRef.current) {
          abortRef.current = true;
          const streamingMessage = [...latestMessagesRef.current].reverse().find((message) => message.status === "streaming");

          if (streamingMessage) {
            updateMessage(streamingMessage.id, (message) => ({
              ...message,
              status: "interrupted",
              content: `${message.content}\n\n⚠️ 回答已中断`,
            }));
            setStatusText("回答已中断");
          }
        }
        setShowHelp(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [updateMessage]);

  useEffect(() => {
    if (!feedbackMessage) {
      return;
    }

    const timer = window.setTimeout(() => setFeedbackMessage(null), 2200);
    return () => window.clearTimeout(timer);
  }, [feedbackMessage]);

  const welcomeVisible = useMemo(() => isReady && messages.length === 0, [isReady, messages.length]);

  function validateFile(file: File) {
    if (!(file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"))) {
      return "仅支持 PDF 格式文件。";
    }

    if (file.size > 100 * 1024 * 1024) {
      return "文件大小超过 100MB 限制。";
    }

    return null;
  }

  async function handleFile(file: File) {
    const validationError = validateFile(file);
    if (validationError) {
      setErrorMessage(validationError);
      setStatusText("上传失败");
      return;
    }

    setErrorMessage(undefined);
    setShowFullHistory(false);
    resetConversation();
    abortRef.current = false;
    setStatusText("上传文件中");

    try {
      setStage("uploading", 8);
      const payloadPromise = uploadDocument(file);

      for (const item of processingPlan) {
        setStage(item.stage, item.progress);
        setStatusText(item.stage);
        await new Promise((resolve) => window.setTimeout(resolve, item.delay));
      }

      const payload = await payloadPromise;
      setDocumentPayload(payload);
      setStatusText("文档已就绪");
    } catch (error) {
      setStage("failed");
      setErrorMessage(
        error instanceof Error && error.message === "upload_failed"
          ? "上传失败，请确认文件为 PDF 且大小不超过 100MB。"
          : "文档解析失败，请重新上传。",
      );
    }
  }

  function handlePickFile() {
    fileInputRef.current?.click();
  }

  function handleReplaceDocument() {
    resetDocument();
    setMessageDraft("");
    setFeedbackMessage(null);
    setShowFullHistory(false);
    setStatusText("等待上传文档");
    setErrorMessage(undefined);
    fileInputRef.current?.click();
  }

  async function handleFeedback(
    messageId: string,
    positive: boolean,
    detail?: { tags: string[]; note?: string },
  ) {
    updateMessage(messageId, (message) => ({
      ...message,
      feedbackState: positive ? "positive" : "negative",
    }));

    if (positive) {
      setFeedbackMessage("感谢点赞，已记录正向反馈。");
      return;
    }

    await submitFeedback({
      messageId,
      tags: detail?.tags ?? [],
      note: detail?.note,
    });
    setFeedbackMessage("感谢反馈，我们会持续优化。");
  }

  async function handleSend(overrideQuestion?: string) {
    const resolvedQuestion = overrideQuestion ?? messageDraft;

    if (!isReady || !document || !resolvedQuestion.trim() || isStreaming) {
      return;
    }

    const question = resolvedQuestion.trim();
    const userMessageId = crypto.randomUUID();
    const assistantMessageId = crypto.randomUUID();

    appendMessage({
      id: userMessageId,
      role: "user",
      content: question,
      timestamp: formatTime(),
    });

    appendMessage({
      id: assistantMessageId,
      role: "assistant",
      content: "",
      timestamp: formatTime(),
      citations: [],
      status: "streaming",
    });

    setMessageDraft("");
    setStatusText("正在检索相关内容...");
    abortRef.current = false;

    const history = messages.slice(-10).map((message) => ({
      role: message.role,
      content: message.content,
    }));

    try {
      await streamChat({ docId: document.id, question, history }, (chunk) => {
        if (abortRef.current) {
          return;
        }
        startTransition(() => {
          updateMessage(assistantMessageId, (message) => ({
            ...message,
            content: `${message.content}${chunk}`,
          }));
        });
      });

      const recentContext = history
        .slice(-4)
        .map((item) => item.content.toLowerCase())
        .join(" ");

      const citationsForMessage =
        question.includes("复位值") ||
        question.toLowerCase().includes("ctrl_reg") ||
        question.includes("位域") ||
        (question.includes("它的") && recentContext.includes("ctrl_reg"))
          ? [currentCitations[0]]
          : question.includes("VDD") || question.includes("耐压")
            ? [currentCitations[1]]
            : question.includes("接口") || question.includes("通信")
              ? [currentCitations[2]]
              : [];

      updateMessage(assistantMessageId, (message) => ({
        ...message,
        citations: citationsForMessage,
        status: abortRef.current ? "interrupted" : "complete",
        canCopy: citationsForMessage.length > 0,
      }));
      setStatusText("回答已完成");
    } catch {
      updateMessage(assistantMessageId, (message) => ({
        ...message,
        content: "服务暂时不可用，请稍后再试。",
        status: "error",
      }));
      setStatusText("服务异常");
    }
  }

  function handleStop() {
    abortRef.current = true;
    const streamingMessage = [...messages].reverse().find((message) => message.status === "streaming");

    if (streamingMessage) {
      updateMessage(streamingMessage.id, (message) => ({
        ...message,
        status: "interrupted",
        content: `${message.content}\n\n⚠️ 回答已中断`,
      }));
      setStatusText("回答已中断");
    }
  }

  return (
    <main className="page-shell grain">
      <span data-testid="client-ready" className="sr-only">
        {clientReady ? "ready" : "pending"}
      </span>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            void handleFile(file);
          }
          event.target.value = "";
        }}
      />

      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col px-4 py-4 md:px-6">
        <header className="mb-4 rounded-[var(--radius-xl)] border border-[var(--line)] bg-white/80 px-5 py-4 shadow-[var(--shadow-soft)] backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="rounded-[1.25rem] bg-[var(--foreground)] px-4 py-3 text-white">
                <span className="font-[var(--font-display)] text-2xl">ChatFile</span>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">PDF grounded Q&A demo</p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                  {document ? (
                    <>
                      <span className="font-semibold">{document.name}</span>
                      <span className="text-[var(--muted)]">
                        {document.pageCount} 页 · {document.sizeLabel}
                      </span>
                    </>
                  ) : (
                    <span className="text-[var(--muted)]">暂未加载文档</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge>{statusText}</Badge>
              <Button variant="ghost" className="rounded-full px-4" onClick={() => setShowHelp(true)}>
                <HelpCircle className="mr-2 size-4" />
                帮助
              </Button>
            </div>
          </div>
        </header>

        {!document ? (
          <div className="grid flex-1 place-items-center pb-24 pt-6">
            <UploadPanel
              stage={stage}
              progress={stageProgress}
              currentFileName={undefined}
              errorMessage={errorMessage}
              onSelectFile={handlePickFile}
              isDragActive={isDragActive}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragActive(true);
              }}
              onDragLeave={(event) => {
                event.preventDefault();
                setIsDragActive(false);
              }}
              onDrop={(event) => {
                event.preventDefault();
                setIsDragActive(false);
                const file = event.dataTransfer.files?.[0];
                if (file) {
                  void handleFile(file);
                }
              }}
            />
          </div>
        ) : (
          <div className="grid flex-1 gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(22rem,1.1fr)]">
            <section className="flex min-h-[72vh] flex-col gap-4">
              <Card className="flex-1 overflow-hidden px-4 py-4 md:px-5">
                <div className="mb-4 flex items-center justify-between border-b border-[var(--line)] pb-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">Assistant</p>
                    <h1 className="font-[var(--font-display)] text-4xl tracking-[-0.03em]">上传即问，回答带引用</h1>
                  </div>
                  <Button variant="secondary" onClick={handleReplaceDocument}>
                    更换文档
                  </Button>
                </div>

                <div className="space-y-4 overflow-y-auto pb-2 pr-1">
                  {welcomeVisible ? (
                    <Card className="bg-[color-mix(in_oklab,var(--panel)_78%,white)] p-6">
                      <div className="flex items-start gap-4">
                        <div className="rounded-[var(--radius-lg)] bg-white p-3 text-[var(--brand)]">
                          <Sparkles className="size-5" />
                        </div>
                        <div className="space-y-4">
                          <div>
                            <p className="text-xs uppercase tracking-[0.22em] text-[var(--muted)]">文档摘要</p>
                            <p className="mt-2 max-w-2xl text-sm leading-7">{document.summary}</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {document.suggestedQuestions.map((question) => (
                              <Button
                                key={question}
                                variant="secondary"
                                onClick={() => {
                                  setMessageDraft(question);
                                  void handleSend(question);
                                }}
                              >
                                {question}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ) : null}

                  {hiddenMessageCount > 0 ? (
                    <div className="flex items-center justify-center">
                      <Button variant="ghost" onClick={() => setShowFullHistory(true)}>
                        查看更多历史（共 {Math.ceil(hiddenMessageCount / 2)} 轮）
                      </Button>
                    </div>
                  ) : null}

                  {visibleMessages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      message={message}
                      onCitationClick={(citationId) => {
                        setActiveCitation(citationId);
                        if (collapsedPreview) {
                          togglePreview();
                        }
                      }}
                      onFeedback={handleFeedback}
                      onCopy={() => setFeedbackMessage("已复制到剪贴板。")}
                    />
                  ))}

                  {pending ? (
                    <div className="flex items-center gap-2 px-2 text-xs text-[var(--muted)]">
                      <LoaderCircle className="size-4 animate-spin" />
                      正在刷新回答内容
                    </div>
                  ) : null}
                </div>
              </Card>

              <div className="space-y-3">
                {stage !== "ready" ? (
                  <Card className="flex items-center gap-3 px-4 py-3 text-sm text-[var(--muted)]">
                    <AlertCircle className="size-4 text-[var(--warn)]" />
                    文档解析中，AI 助手稍后就绪
                  </Card>
                ) : (
                  <Card className="flex flex-wrap items-center gap-3 px-4 py-3 text-sm">
                    <Badge className="bg-emerald-50 text-emerald-700">文档就绪</Badge>
                    <span>{document.pageCount} 页</span>
                    <span>{document.chunkCount} 个切片</span>
                    <span className="text-[var(--muted)]">耗时 1 分 42 秒</span>
                  </Card>
                )}
                <ChatInput
                  value={messageDraft}
                  disabled={!isReady}
                  isStreaming={isStreaming}
                  inputRef={chatInputRef}
                  onChange={setMessageDraft}
                  onSend={() => void handleSend()}
                  onPickFile={handleReplaceDocument}
                  onStop={handleStop}
                />
              </div>
            </section>

            <section className="min-h-[72vh]">
              <PreviewPanel
                documentName={document.name}
                sections={previewSections}
                citations={currentCitations}
                activeCitationId={activeCitationId}
                collapsed={collapsedPreview}
                onToggle={togglePreview}
                onCitationClick={setActiveCitation}
              />
            </section>
          </div>
        )}

        <footer className="mt-4 flex flex-wrap items-center gap-3 px-2 text-xs text-[var(--muted)]">
          <div className="inline-flex items-center gap-2">
            <FileText className="size-4" />
            当前演示使用 mock BFF 和演示 PDF 结构
          </div>
          <span>支持单文档问答、引用跳转、推荐问题、预览折叠</span>
        </footer>
      </div>

      {feedbackMessage ? (
        <div className="fixed right-4 top-4 rounded-full bg-[var(--foreground)] px-4 py-2 text-sm text-white shadow-[var(--shadow-soft)]">
          {feedbackMessage}
        </div>
      ) : null}

      {showHelp ? (
        <div className="fixed inset-0 z-20 grid place-items-center bg-[rgba(31,39,55,0.28)] px-4">
          <Card className="w-full max-w-2xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">Quick help</p>
                <h2 className="mt-2 font-[var(--font-display)] text-4xl">快捷键与使用说明</h2>
              </div>
              <Button variant="ghost" onClick={() => setShowHelp(false)}>
                关闭
              </Button>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <Card className="p-4">
                <p className="font-semibold">快捷键</p>
                <div className="mt-3 space-y-2 text-sm text-[var(--muted)]">
                  <p><span className="font-semibold text-[var(--foreground)]">Ctrl + K</span> 聚焦输入框</p>
                  <p><span className="font-semibold text-[var(--foreground)]">Ctrl + U</span> 打开上传文件</p>
                  <p><span className="font-semibold text-[var(--foreground)]">Ctrl + /</span> 打开帮助面板</p>
                  <p><span className="font-semibold text-[var(--foreground)]">Esc</span> 停止生成或关闭帮助层</p>
                </div>
              </Card>
              <Card className="p-4">
                <p className="font-semibold">当前演示范围</p>
                <div className="mt-3 space-y-2 text-sm text-[var(--muted)]">
                  <p>支持单文档上传、模拟解析、推荐问题、多轮对话和引用跳转。</p>
                  <p>当前 PDF 解析、切片和向量检索使用 mock 数据演示前端链路。</p>
                  <p>无结果时会明确提示“当前文档中未找到相关内容”。</p>
                </div>
              </Card>
            </div>
          </Card>
        </div>
      ) : null}
    </main>
  );
}
