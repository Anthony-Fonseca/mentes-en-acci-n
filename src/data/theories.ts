// Contenido editable del juego. Cada tarjeta tiene UNA categoría correcta.
export type TheoryId = "conductismo" | "cognitivismo" | "procesamiento" | "constructivismo" | "humanismo";

export interface Theory {
  id: TheoryId;
  name: string;
  short: string;
  /** Qué define a esta teoría; se usa para explicar por qué una tarjeta NO pertenece aquí. */
  focus: string;
}

export interface Card {
  id: string;
  text: string;
  theory: TheoryId;
  /** Concepto teórico que hace correcta la categoría. */
  concept: string;
}

export const THEORIES: Theory[] = [
  { id: "conductismo", name: "Conductismo", short: "Estímulo, respuesta y refuerzo",
    focus: "El conductismo estudia solo la conducta observable y cómo cambia por asociaciones y consecuencias (refuerzo, castigo), sin analizar procesos mentales." },
  { id: "cognitivismo", name: "Cognitivismo", short: "Comprensión y estructuras mentales",
    focus: "El cognitivismo explica el aprendizaje como cambio en las estructuras mentales: comprensión, significado, esquemas previos, insight y aprendizaje por descubrimiento o significativo." },
  { id: "procesamiento", name: "Procesamiento de la información", short: "La mente como sistema de memoria",
    focus: "El procesamiento de la información modela la mente como un sistema con etapas: registro sensorial, memoria de trabajo de capacidad limitada, codificación, almacenamiento y recuperación en memoria a largo plazo." },
  { id: "constructivismo", name: "Constructivismo", short: "Construcción activa y social",
    focus: "El constructivismo sostiene que el alumno construye activamente el conocimiento interactuando con su entorno y con otros (Piaget, Vygotsky: ZDP, andamiaje, aprendizaje situado)." },
  { id: "humanismo", name: "Humanismo", short: "Persona, autorrealización y afecto",
    focus: "El humanismo se centra en la persona completa: necesidades, emociones, autoestima, libertad y autorrealización (Maslow, Rogers), con el docente como facilitador." },
];

export const CARDS: Card[] = [
  // Conductismo
  { id: "c1", theory: "conductismo", text: "Un perro saliva al oír una campana que antes se presentó junto con la comida.", concept: "condicionamiento clásico (Pavlov)" },
  { id: "c2", theory: "conductismo", text: "Se entregan puntos canjeables a los alumnos cada vez que entregan la tarea a tiempo.", concept: "refuerzo positivo / economía de fichas (Skinner)" },
  { id: "c3", theory: "conductismo", text: "El aprendizaje se define como un cambio observable y medible en la conducta.", concept: "conducta observable como objeto de estudio" },
  { id: "c4", theory: "conductismo", text: "Una habilidad compleja se enseña reforzando aproximaciones sucesivas a la conducta final.", concept: "moldeamiento (shaping)" },
  { id: "c5", theory: "conductismo", text: "La mente es una 'caja negra': solo importan los estímulos del ambiente y las respuestas.", concept: "modelo estímulo–respuesta (Watson)" },
  // Cognitivismo
  { id: "g1", theory: "cognitivismo", text: "Aprender es relacionar la nueva información de forma no arbitraria con lo que el alumno ya sabe.", concept: "aprendizaje significativo (Ausubel)" },
  { id: "g2", theory: "cognitivismo", text: "Antes de un tema nuevo, el docente presenta un organizador previo que sirve de puente conceptual.", concept: "organizadores previos (Ausubel)" },
  { id: "g3", theory: "cognitivismo", text: "Un chimpancé, tras observar la situación, encaja dos palos de golpe para alcanzar un plátano.", concept: "insight o comprensión súbita (Gestalt, Köhler)" },
  { id: "g4", theory: "cognitivismo", text: "El alumno descubre por sí mismo la regla o principio a partir de ejemplos guiados.", concept: "aprendizaje por descubrimiento (Bruner)" },
  { id: "g5", theory: "cognitivismo", text: "El aprendizaje es un cambio interno en la comprensión y el significado, no solo en la conducta.", concept: "cambio en las estructuras cognitivas" },
  // Procesamiento de la información
  { id: "p1", theory: "procesamiento", text: "La memoria de trabajo solo puede mantener alrededor de 7 ± 2 elementos a la vez.", concept: "capacidad limitada de la memoria a corto plazo (Miller)" },
  { id: "p2", theory: "procesamiento", text: "Agrupar un número de teléfono en bloques (55-12-34-78) facilita recordarlo.", concept: "agrupamiento o chunking" },
  { id: "p3", theory: "procesamiento", text: "La información pasa por el registro sensorial, la memoria a corto plazo y la memoria a largo plazo.", concept: "modelo multialmacén (Atkinson y Shiffrin)" },
  { id: "p4", theory: "procesamiento", text: "Para recuperar un dato de la memoria a largo plazo ayudan las claves presentes al codificarlo.", concept: "codificación y recuperación" },
  { id: "p5", theory: "procesamiento", text: "El docente evita la sobrecarga presentando poca información nueva a la vez.", concept: "carga cognitiva (Sweller)" },
  // Constructivismo
  { id: "k1", theory: "constructivismo", text: "Lo que el alumno puede hacer con ayuda hoy, podrá hacerlo solo mañana.", concept: "zona de desarrollo próximo (Vygotsky)" },
  { id: "k2", theory: "constructivismo", text: "El docente ofrece apoyos temporales que retira gradualmente conforme el alumno gana autonomía.", concept: "andamiaje (Wood, Bruner y Ross, desde Vygotsky)" },
  { id: "k3", theory: "constructivismo", text: "El niño ajusta sus esquemas cuando una experiencia nueva no encaja con lo que creía.", concept: "asimilación, acomodación y equilibrio (Piaget)" },
  { id: "k4", theory: "constructivismo", text: "Los estudiantes construyen el conocimiento resolviendo en equipo un problema real de su comunidad.", concept: "construcción social y aprendizaje situado" },
  { id: "k5", theory: "constructivismo", text: "El conocimiento no se transmite tal cual: cada alumno lo elabora activamente desde su experiencia.", concept: "el aprendiz como constructor activo" },
  // Humanismo
  { id: "h1", theory: "humanismo", text: "Un alumno con hambre o miedo difícilmente podrá concentrarse en aprender.", concept: "jerarquía de necesidades (Maslow)" },
  { id: "h2", theory: "humanismo", text: "El docente actúa como facilitador con empatía, autenticidad y aceptación incondicional.", concept: "aprendizaje centrado en la persona (Rogers)" },
  { id: "h3", theory: "humanismo", text: "La meta última de la educación es que la persona desarrolle plenamente su potencial.", concept: "autorrealización" },
  { id: "h4", theory: "humanismo", text: "El estudiante elige sus metas y evalúa su propio progreso de forma autónoma.", concept: "libertad, autodirección y autoevaluación" },
  { id: "h5", theory: "humanismo", text: "Las emociones, la autoestima y los valores son parte central del proceso educativo.", concept: "educación de la persona integral" },
];
