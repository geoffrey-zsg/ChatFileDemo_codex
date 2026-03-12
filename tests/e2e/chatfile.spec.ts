import { expect, test } from "@playwright/test";

test("upload, ask a question and view preview", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("client-ready")).toHaveText("ready");
  await expect(page.getByRole("button", { name: "选择文件" })).toBeVisible();
  await page.getByRole("button", { name: "帮助" }).click();
  await expect(page.getByRole("heading", { name: "快捷键与使用说明" })).toBeVisible();
  await page.getByRole("button", { name: "关闭" }).click();

  await page.locator('input[type="file"]').setInputFiles({
    name: "demo.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("%PDF-1.4 demo"),
  });

  await expect(page.getByText("文档就绪")).toBeVisible({ timeout: 15000 });
  await page.getByRole("button", { name: "CTRL_REG 的复位值是多少？" }).click();
  await expect(page.getByText("CTRL_REG 的复位值为 0x00")).toBeVisible({ timeout: 10000 });
  await page.getByRole("textbox", { name: "输入问题" }).fill("它的位域定义呢？");
  await page.getByRole("button", { name: "发送消息" }).click();
  await expect(page.getByText("该寄存器位域定义为 Bits[7:4] 保留只读")).toBeVisible({ timeout: 10000 });
  await page.getByRole("textbox", { name: "输入问题" }).fill("这个芯片支持 CAN FD 吗？");
  await page.getByRole("button", { name: "发送消息" }).click();
  await expect(page.getByText("在当前文档中未找到与您问题相关的内容")).toBeVisible({ timeout: 10000 });
  await page.getByRole("button", { name: /\[1\].*P37 · Ch5 Register Map \/ CTRL_REG/ }).nth(1).click();
  await expect(page.getByRole("heading", { name: "5.1 CTRL_REG" })).toBeVisible();
  await page.getByLabel("放大预览").click();
  await expect(page.getByText("125%")).toBeVisible();
  await page.getByLabel("输入页码跳转").fill("52");
  await page.getByLabel("输入页码跳转").press("Enter");
  await expect(page.getByRole("heading", { name: "7. Absolute Maximum Ratings" })).toBeVisible();
  await page.getByRole("button", { name: "👎" }).nth(1).click();
  await page.getByRole("button", { name: "引用错误" }).click();
  await page.getByPlaceholder("补充说明（可选，最多 200 字）").fill("引用已核对，这里只是验证反馈流。");
  await page.getByRole("button", { name: "提交反馈" }).click();
  await expect(page.getByText("感谢反馈，我们会持续优化。")).toBeVisible();

  await page.screenshot({ path: "docs/chatfile-e2e.png", fullPage: true });
});
