import { useEffect, useState } from "react";
import { DndContext, DragOverlay, PointerSensor, TouchSensor, KeyboardSensor, useDraggable, useDroppable, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { THEORIES, type TheoryId } from "@/data/theories";
import { dropCard, getCard, initialState, performanceMessage, startGame, stats, STORAGE_KEY, type GameState } from "@/lib/game";

const COLOR: Record<TheoryId, { bg: string; border: string; text: string; soft: string }> = {
  conductismo: { bg: "bg-t1", border: "border-t1", text: "text-t1", soft: "bg-t1/10" },
  cognitivismo: { bg: "bg-t2", border: "border-t2", text: "text-t2", soft: "bg-t2/10" },
  procesamiento: { bg: "bg-t3", border: "border-t3", text: "text-t3", soft: "bg-t3/10" },
  constructivismo: { bg: "bg-t4", border: "border-t4", text: "text-t4", soft: "bg-t4/10" },
  humanismo: { bg: "bg-t5", border: "border-t5", text: "text-t5", soft: "bg-t5/10" },
};

type Feedback = { kind: "ok" | "error"; text: string; cardId: string } | null;

export function Game() {
  const [state, setState] = useState<GameState>(initialState);
  const [loaded, setLoaded] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [flash, setFlash] = useState<{ zone: TheoryId; ok: boolean; n: number } | null>(null);

  useEffect(() => {
    try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) setState(JSON.parse(raw)); } catch { /* ignore */ }
    setLoaded(true);
  }, []);
  useEffect(() => { if (loaded) localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }, [state, loaded]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 6 } }),
    useSensor(KeyboardSensor),
  );

  const handleDrop = (cardId: string, zone: TheoryId) => {
    if (state.placed[cardId] === zone) return;
    const r = dropCard(state, cardId, zone);
    setState(r.state);
    setSelected(null);
    setFlash({ zone, ok: r.correct, n: Date.now() });
    setFeedback(r.correct ? { kind: "ok", text: `¡Correcto! ${getCard(cardId).concept}.`, cardId } : { kind: "error", text: r.feedback!, cardId });
  };

  const onDragEnd = (e: DragEndEvent) => {
    setActiveId(null);
    if (e.over) handleDrop(String(e.active.id), e.over.id as TheoryId);
  };

  const restart = () => { setFeedback(null); setSelected(null); setState(startGame()); };

  if (state.phase === "welcome") return <Welcome onStart={restart} />;
  if (state.phase === "results") return <Results state={state} onRestart={restart} />;

  const s = stats(state);
  const pool = state.order.filter((id) => !(id in state.placed));

  return (
    <DndContext sensors={sensors} onDragStart={(e) => { setActiveId(String(e.active.id)); setSelected(null); }} onDragEnd={onDragEnd} onDragCancel={() => setActiveId(null)}>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <header className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-primary sm:text-3xl">¿Cuánto sabes sobre las teorías del aprendizaje?</h1>
            <p className="text-sm text-muted-foreground">Arrastra cada tarjeta a su teoría (o tócala y luego toca la categoría).</p>
          </div>
          <div className="flex items-center gap-3">
            <Stat label="Puntos" value={state.score} />
            <Stat label="Correctas" value={`${s.correct}/${s.total}`} />
            <button onClick={() => { localStorage.removeItem(STORAGE_KEY); setState(initialState()); }} className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-muted-foreground hover:bg-muted">Salir</button>
          </div>
        </header>

        <div className="mb-5 h-3 w-full overflow-hidden rounded-full bg-secondary" role="progressbar" aria-valuenow={s.correct} aria-valuemax={s.total}>
          <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${(s.correct / s.total) * 100}%` }} />
        </div>

        <div aria-live="polite" className="mb-5 min-h-14">
          {feedback && (
            <div key={feedback.text} className={`flex items-start gap-3 rounded-2xl border-2 p-4 text-sm shadow-soft ${feedback.kind === "ok" ? "animate-pop border-success bg-success/10" : "animate-shake border-destructive bg-destructive/10"}`}>
              <span className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full font-bold text-primary-foreground ${feedback.kind === "ok" ? "bg-success" : "bg-destructive"}`}>{feedback.kind === "ok" ? "✓" : "!"}</span>
              <p className="flex-1 leading-relaxed">{feedback.kind === "error" && <strong>Inténtalo de nuevo. </strong>}{feedback.text}</p>
              <button onClick={() => setFeedback(null)} aria-label="Cerrar" className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <section>
            <h2 className="mb-3 text-lg font-bold">Tarjetas <span className="text-sm font-normal text-muted-foreground">({pool.length} por clasificar)</span></h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 lg:max-h-[70vh] lg:overflow-y-auto lg:pr-2">
              {pool.map((id) => (
                <DraggableCard key={id} id={id} selected={selected === id} hidden={activeId === id} onSelect={() => setSelected(selected === id ? null : id)} />
              ))}
            </div>
          </section>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {THEORIES.map((t) => (
              <Zone key={t.id} id={t.id} name={t.name} short={t.short} selectable={!!selected} onTap={() => selected && handleDrop(selected, t.id)} flash={flash?.zone === t.id ? flash : null}>
                {state.order.filter((id) => state.placed[id] === t.id).map((id) => (
                  <DraggableCard key={id} id={id} placed={t.id} selected={selected === id} hidden={activeId === id} onSelect={() => setSelected(selected === id ? null : id)} />
                ))}
              </Zone>
            ))}
          </section>
        </div>
      </div>
      <DragOverlay>{activeId ? <CardFace id={activeId} lifted /> : null}</DragOverlay>
    </DndContext>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-border bg-paper px-4 py-2 text-center shadow-soft">
      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="font-display text-xl font-extrabold text-primary">{value}</div>
    </div>
  );
}

function CardFace({ id, lifted, placed, selected }: { id: string; lifted?: boolean; placed?: TheoryId; selected?: boolean }) {
  const card = getCard(id);
  return (
    <div className={`rounded-xl border-2 bg-paper p-3 text-sm leading-snug ${placed ? `${COLOR[placed].border} text-xs` : "border-border"} ${selected ? "ring-4 ring-accent" : ""} ${lifted ? "rotate-2 cursor-grabbing shadow-2xl" : "shadow-soft"}`}>
      {placed && <span className={`mr-1 font-bold ${COLOR[placed].text}`}>✓</span>}
      {card.text}
    </div>
  );
}

function DraggableCard({ id, placed, selected, hidden, onSelect }: { id: string; placed?: TheoryId; selected: boolean; hidden: boolean; onSelect: () => void }) {
  const { attributes, listeners, setNodeRef } = useDraggable({ id });
  return (
    <div ref={setNodeRef} {...listeners} {...attributes} onClick={onSelect} className={`cursor-grab touch-manipulation select-none transition-opacity ${hidden ? "opacity-30" : ""}`}>
      <CardFace id={id} placed={placed} selected={selected} />
    </div>
  );
}

function Zone({ id, name, short, children, selectable, onTap, flash }: { id: TheoryId; name: string; short: string; children: React.ReactNode; selectable: boolean; onTap: () => void; flash: { ok: boolean; n: number } | null }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const c = COLOR[id];
  return (
    <div ref={setNodeRef} onClick={onTap} key={flash?.n}
      className={`flex min-h-44 flex-col rounded-2xl border-2 ${c.border} ${c.soft} p-3 transition-transform ${isOver ? "scale-[1.02] ring-4 ring-accent" : ""} ${selectable ? "cursor-pointer ring-2 ring-accent/60" : ""} ${flash ? (flash.ok ? "animate-pop" : "animate-shake") : ""}`}>
      <div className={`mb-3 rounded-xl ${c.bg} px-3 py-2 text-primary-foreground`}>
        <h3 className="text-lg font-extrabold leading-tight">{name}</h3>
        <p className="text-xs opacity-90">{short}</p>
      </div>
      <div className="flex flex-1 flex-col gap-2">{children}</div>
    </div>
  );
}

function Welcome({ onStart }: { onStart: () => void }) {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-5 py-10 text-center">
      <div className="mb-6 flex gap-2">{THEORIES.map((t) => <span key={t.id} className={`size-4 rounded-full ${COLOR[t.id].bg}`} />)}</div>
      <p className="mb-2 text-sm font-bold uppercase tracking-widest text-muted-foreground">Psicología Educativa</p>
      <h1 className="text-4xl font-extrabold leading-tight text-primary sm:text-6xl">¿Cuánto sabes sobre las teorías del aprendizaje?</h1>
      <div className="mt-8 w-full rounded-3xl border border-border bg-paper p-6 text-left shadow-soft sm:p-8">
        <h2 className="mb-3 text-xl font-bold">Instrucciones</h2>
        <ol className="list-decimal space-y-2 pl-5 text-foreground/90">
          <li>Verás 25 tarjetas con descripciones y 5 categorías: {THEORIES.map((t) => t.name).join(", ")}.</li>
          <li>Arrastra cada tarjeta a la teoría correcta. En el móvil también puedes tocar la tarjeta y luego la categoría.</li>
          <li>Acierto al primer intento: <strong>10 puntos</strong>. Tras un error: <strong>5 puntos</strong>.</li>
          <li>Si te equivocas, leerás una explicación y podrás intentarlo otra vez.</li>
        </ol>
        <p className="mt-4 text-sm text-muted-foreground">Pista: el Cognitivismo y el Procesamiento de la información están relacionados, ¡pero no son lo mismo!</p>
      </div>
      <button onClick={onStart} className="mt-8 rounded-full bg-primary px-10 py-4 text-lg font-extrabold text-primary-foreground shadow-soft transition hover:scale-105">Comenzar juego</button>
    </main>
  );
}

function Results({ state, onRestart }: { state: GameState; onRestart: () => void }) {
  const s = stats(state);
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-5 py-10 text-center">
      <h1 className="text-4xl font-extrabold text-primary sm:text-5xl">¡Juego terminado!</h1>
      <div className="mt-8 w-full rounded-3xl border border-border bg-paper p-8 shadow-soft">
        <div className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Puntuación total</div>
        <div className="font-display text-6xl font-extrabold text-primary">{state.score}<span className="text-2xl text-muted-foreground"> / {s.max}</span></div>
        <div className="mt-6 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Aciertos al primer intento</div>
        <div className="font-display text-4xl font-extrabold text-success">{s.percent}%</div>
        <p className="text-sm text-muted-foreground">{s.firstTry} de {s.total} tarjetas</p>
        <p className="mt-6 text-lg font-semibold">{performanceMessage(s.percent)}</p>
      </div>
      <button onClick={onRestart} className="mt-8 rounded-full bg-primary px-10 py-4 text-lg font-extrabold text-primary-foreground shadow-soft transition hover:scale-105">Jugar de nuevo</button>
    </main>
  );
}
