import type { Citation, DocumentMeta, PreviewSection } from "@/entities/document/types";

export const mockDocument: DocumentMeta = {
  id: "doc-chatfile-demo",
  name: "XYZ_Datasheet_v2.0.pdf",
  pageCount: 128,
  sizeLabel: "45.2 MB",
  chunkCount: 356,
  summary:
    "本文档为 XYZ 系列芯片 Datasheet，涵盖引脚定义、寄存器映射、电气特性与时序说明，适合快速定位寄存器复位值、供电范围和接口能力。",
  suggestedQuestions: [
    "CTRL_REG 的复位值是多少？",
    "VDD 的最大耐压范围是多少？",
    "这颗芯片支持哪些通信接口？",
  ],
};

export const mockCitations: Citation[] = [
  {
    id: "citation-ctrl-reg",
    label: "[1]",
    page: 37,
    section: "Ch5 Register Map / CTRL_REG",
    excerpt: "CTRL_REG Reset Value: 0x00. Bits[3:0] select working mode and Bits[7:4] are reserved.",
    highlightColor: "amber",
  },
  {
    id: "citation-vdd",
    label: "[2]",
    page: 52,
    section: "Ch7 Electrical Characteristics / Absolute Maximum Ratings",
    excerpt: "VDD operating range is 1.62V to 3.6V, absolute maximum rating is 4.0V.",
    highlightColor: "sky",
  },
  {
    id: "citation-interface",
    label: "[3]",
    page: 12,
    section: "Ch2 Features / Interfaces",
    excerpt: "The device supports I2C, SPI and UART serial communication interfaces.",
    highlightColor: "emerald",
  },
];

export const mockPreviewSections: PreviewSection[] = [
  {
    id: "section-overview",
    title: "1. Overview",
    page: 3,
    body: [
      "XYZ series controller targets ultra-low-power sensing nodes and integrates digital interfaces for industrial and consumer electronics.",
      "The document focuses on pin configuration, electrical characteristics, timing and detailed register mapping.",
    ],
  },
  {
    id: "section-interface",
    title: "2. Interfaces",
    page: 12,
    body: [
      "Supported communication interfaces include I2C, SPI and UART. Interface selection is configured during boot and can be adjusted through control registers.",
    ],
  },
  {
    id: "section-ctrl",
    title: "5.1 CTRL_REG",
    page: 37,
    body: [
      "CTRL_REG Reset Value: 0x00. Bits[7:4] are reserved and read only. Bits[3:0] define the active working mode for the main controller.",
      "Reserved bits default to zero after power-on reset and must remain unchanged during normal operation.",
    ],
  },
  {
    id: "section-vdd",
    title: "7. Absolute Maximum Ratings",
    page: 52,
    body: [
      "VDD operating range spans from 1.62V to 3.6V. The absolute maximum rating is 4.0V for transient exposure.",
      "Exceeding the absolute maximum may cause irreversible damage and should not be treated as functional operation.",
    ],
  },
];
