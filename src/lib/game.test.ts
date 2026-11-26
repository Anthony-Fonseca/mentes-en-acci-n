import { describe, it, expect } from "vitest";
import { startGame, dropCard, stats } from "./game";

describe("game rules", () => {
  it("first-try correct gives 10 points", () => {
    const r = dropCard(startGame(), "p1", "procesamiento");
    expect(r.correct).toBe(true);
    expect(r.state.score).toBe(10);
  });
  it("wrong drop gives feedback, no points, card not locked; retry gives 5", () => {
    const r = dropCard(startGame(), "p1", "cognitivismo");
    expect(r.correct).toBe(false);
    expect(r.state.score).toBe(0);
    expect(r.state.placed["p1"]).toBeUndefined();
    expect(dropCard(r.state, "p1", "procesamiento").state.score).toBe(5);
  });
  it("shuffles 25 cards and ends after all placed", () => {
    let s = startGame();
    expect(s.order).toHaveLength(25);
    const ids = ["c","g","p","k","h"]; const th = ["conductismo","cognitivismo","procesamiento","constructivismo","humanismo"] as const;
    ids.forEach((p, i) => { for (let n = 1; n <= 5; n++) s = dropCard(s, `${p}${n}`, th[i]!).state; });
    expect(s.phase).toBe("results");
    expect(stats(s).percent).toBe(100);
  });
});
