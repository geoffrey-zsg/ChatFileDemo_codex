import { mockCitations, mockDocument } from "@/shared/config/mock-data";

describe("mock data", () => {
  it("provides three suggested questions", () => {
    expect(mockDocument.suggestedQuestions).toHaveLength(3);
  });

  it("keeps citation colors stable", () => {
    expect(mockCitations.map((item) => item.highlightColor)).toEqual(["amber", "sky", "emerald"]);
  });
});
