'use server'

import { generateAutomatedTeamChallengeStrategy, type GenerateAutomatedTeamChallengeStrategyInput } from '@/ai/flows/generate-automated-team-challenge-strategy';

/**
 * Generates a strategic outline (mission, vision, differentiator, impact) for a project
 * by calling a Genkit AI flow. Provides a fallback response on error.
 * @param input The input containing project details for the AI model.
 * @returns A promise that resolves to the generated strategic output.
 */
export async function generateStrategyWithAI(
  input: GenerateAutomatedTeamChallengeStrategyInput
): Promise<{ mision: string; vision: string; diferenciador: string; impacto_ods: string; }> {
  try {
    const result = await generateAutomatedTeamChallengeStrategy(input);
    return result;
  } catch (error) {
    console.error("AI Generation Error:", error);
    // Return a fallback as per the user's example in case of an API error
    return {
      mision: `Desarrollar ${input.product} enfocado en ${input.value} para mitigar el problema de ${input.problem}.`,
      vision: `Transformar el ecosistema de ${input.sector} en ${input.territory} mediante innovación continua.`,
      diferenciador: `Enfoque iterativo centrado en los usuarios (${input.audience}).`,
      impacto_ods: `Alineado con los objetivos de desarrollo y progreso social local.`
    };
  }
}
