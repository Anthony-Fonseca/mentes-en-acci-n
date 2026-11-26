import { createFileRoute } from "@tanstack/react-router";
import { Game } from "@/components/game/Game";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "¿Cuánto sabes sobre las teorías del aprendizaje?" },
      { name: "description", content: "Juego para clasificar conductismo, cognitivismo, procesamiento de la información, constructivismo y humanismo." },
      { property: "og:title", content: "¿Cuánto sabes sobre las teorías del aprendizaje?" },
      { property: "og:description", content: "Juego educativo de Psicología Educativa: arrastra cada tarjeta a su teoría." },
    ],
  }),
  component: Game,
});
