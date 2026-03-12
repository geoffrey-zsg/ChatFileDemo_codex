import { NextResponse } from "next/server";

import { mockCitations } from "@/shared/config/mock-data";
import type { ChatRequest } from "@/shared/api/types";
import { sleep } from "@/shared/lib/utils";

function getAnswer(question: string, history: ChatRequest["history"]) {
  if (question.includes("复位值") || question.toLowerCase().includes("ctrl_reg")) {
    return {
      content:
        "根据文档描述，CTRL_REG 的复位值为 0x00 [1]。其中 Bits[7:4] 为保留位，Bits[3:0] 用于选择主工作模式，所以默认上电后模式字段也是 0。[1]",
      citations: [mockCitations[0]],
    };
  }

  if (question.includes("VDD") || question.includes("耐压")) {
    return {
      content:
        "文档给出的 VDD 正常工作范围是 1.62V 到 3.6V，绝对最大额定值是 4.0V [2]。如果问题是在问“最大耐压”，应以 4.0V 作为绝对上限，但不应长期工作在该值附近。[2]",
      citations: [mockCitations[1]],
    };
  }

  if (question.includes("接口") || question.includes("通信")) {
    return {
      content: "当前文档列出的串行通信接口包括 I2C、SPI 和 UART [3]。接口模式在启动配置和控制寄存器中都可以调整。[3]",
      citations: [mockCitations[2]],
    };
  }

  const recentContext = history
    .slice(-4)
    .map((item) => item.content.toLowerCase())
    .join(" ");

  if (question.includes("位域") || (question.includes("它的") && recentContext.includes("ctrl_reg"))) {
    return {
      content:
        "结合上一轮上下文，这里的“它”可指 CTRL_REG。该寄存器位域定义为 Bits[7:4] 保留只读，Bits[3:0] 为工作模式选择字段，复位后默认值为 0x0 [1]。",
      citations: [mockCitations[0]],
    };
  }

  return {
    content: "抱歉，在当前文档中未找到与您问题相关的内容。建议换一种表述，或确认该信息是否包含在这份 PDF 中。",
    citations: [],
  };
}

export async function POST(request: Request) {
  const body = (await request.json()) as ChatRequest;

  if (!body.docId || !body.question) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const { content } = getAnswer(body.question, body.history);
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      for (const chunk of content.match(/.{1,20}/g) ?? []) {
        controller.enqueue(encoder.encode(chunk));
        await sleep(80);
      }
      controller.close();
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
