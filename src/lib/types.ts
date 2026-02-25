export type Scores = { innovacion: number; coherencia: number; visual: number; viabilidad: number; etica: number; };
export type IAData = { mision: string; vision: string; diferenciador: string; impacto_ods: string; };
export type Team = {
  id: number;
  name: string;
  sector: string;
  product: string;
  style: string;
  status: "Esperando Reto" | "Generando IA..." | "Reto Asignado" | "Calificado";
  scores: Scores;
  feedback: string;
  iaData: IAData | null;
  challengeUI: string;
  challengePDF: string;
};
