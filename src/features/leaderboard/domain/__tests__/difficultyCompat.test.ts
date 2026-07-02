import { describe, expect, it } from "vitest";
import {
  isLegacyDifficultyKey,
  normalizeDifficultyKey,
} from "../difficultyCompat";

describe("difficultyCompat", () => {
  it("normalizes legacy very-hard to diabolical", () => {
    expect(normalizeDifficultyKey("very-hard")).toBe("diabolical");
  });

  it("returns canonical values unchanged", () => {
    expect(normalizeDifficultyKey("diabolical")).toBe("diabolical");
    expect(normalizeDifficultyKey("normal")).toBe("normal");
  });

  it("marks only very-hard as legacy", () => {
    expect(isLegacyDifficultyKey("very-hard")).toBe(true);
    expect(isLegacyDifficultyKey("diabolical")).toBe(false);
  });
});
