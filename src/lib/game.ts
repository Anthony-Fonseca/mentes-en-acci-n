import { CARDS, THEORIES, type Card, type TheoryId } from "@/data/theories";

export const POINTS_FIRST_TRY = 10;
export const POINTS_RETRY = 5;
export const STORAGE_KEY = "teorias-aprendizaje-progress-v1";

export interface GameState {
  phase: "welcome" | "playing" | "results";
  order: string[]; // card ids, shuffled
  placed: Record<string, TheoryId>; // correctly placed cards
  mistakes: Record<string, number>; // per card
  score: number;
}

export const initialState = (): GameState => ({ phase: "welcome", order: [], placed: {}, mistakes: {}, score: 0 });

export function shuffle<T>(arr: T[], rand: () => number = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

export const startGame = (rand?: () => number): GameState => ({
  ...initialState(),
  phase: "playing",
  order: shuffle(CARDS.map((c) => c.id), rand),
});

export const getCard = (id: string): Card => CARDS.find((c) => c.id === id)!;
export const getTheory = (id: TheoryId) => THEORIES.find((t) => t.id === id)!;

export type DropResult = { state: GameState; correct: boolean; feedback?: string };

export function dropCard(state: GameState, cardId: string, target: TheoryId): DropResult {
  const card = getCard(cardId);
  if (state.placed[cardId] === target) return { state, correct: true };
  if (card.theory === target) {
    const alreadyScored = cardId in state.placed;
    const pts = alreadyScored ? 0 : (state.mistakes[cardId] ?? 0) === 0 ? POINTS_FIRST_TRY : POINTS_RETRY;
    const placed = { ...state.placed, [cardId]: target };
    const done = Object.keys(placed).length === CARDS.length;
    return { state: { ...state, placed, score: state.score + pts, phase: done ? "results" : "playing" }, correct: true };
  }
  const wrong = getTheory(target);
  const right = getTheory(card.theory);
  const feedback = `No es ${wrong.name}. ${wrong.focus} Esta tarjeta describe ${card.concept}, un concepto clave de ${right.name}.`;
  // A correctly placed card moved to a wrong area stays where it was.
  return { state: { ...state, mistakes: { ...state.mistakes, [cardId]: (state.mistakes[cardId] ?? 0) + 1 } }, correct: false, feedback };
}

export function stats(state: GameState) {
  const total = CARDS.length;
  const firstTry = CARDS.filter((c) => c.id in state.placed && !state.mistakes[c.id]).length;
  return { total, correct: Object.keys(state.placed).length, firstTry, percent: Math.round((firstTry / total) * 100), max: total * POINTS_FIRST_TRY };
}

export function performanceMessage(percent: number) {
  if (percent >= 90) return "¡Excelente! Dominas las teorías del aprendizaje.";
  if (percent >= 70) return "¡Muy bien! Tienes una base sólida; repasa los detalles.";
  if (percent >= 50) return "Buen intento. Revisa sobre todo las diferencias entre teorías cercanas.";
  return "Sigue practicando: repasa los conceptos clave de cada teoría y vuelve a intentarlo.";
}
