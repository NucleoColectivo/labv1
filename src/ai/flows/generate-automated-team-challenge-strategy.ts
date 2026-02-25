'use server';
/**
 * @fileOverview This file implements a Genkit flow to generate a comprehensive strategic outline
 * including mission, vision, unique differentiator, and an impact statement (aligned with ODS)
 * for a project based on specified variables. It serves to provide a solid strategic foundation
 * for team challenges.
 *
 * - generateAutomatedTeamChallengeStrategy - The main function to trigger the AI generation.
 * - GenerateAutomatedTeamChallengeStrategyInput - The input type for the generation.
 * - GenerateAutomatedTeamChallengeStrategyOutput - The output type of the generated strategy.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * Input schema for generating an automated team challenge strategy.
 */
const GenerateAutomatedTeamChallengeStrategyInputSchema = z.object({
  sector: z.string().describe('El sector del proyecto, e.g., Tecnología, Social, Comunicación.'),
  product: z.string().describe('El producto o solución del proyecto, e.g., App Inteligente, Plataforma SaaS.'),
  audience: z.string().describe('El público objetivo del proyecto, e.g., Jóvenes creativos, Comunidades rurales.'),
  problem: z.string().describe('El problema central que el proyecto busca resolver.'),
  value: z.string().describe('El valor diferencial o principal del proyecto, e.g., Innovación, Sostenibilidad.'),
  territory: z.string().describe('El contexto territorial donde se implementará el proyecto, e.g., Medellín, Latinoamérica.'),
});
export type GenerateAutomatedTeamChallengeStrategyInput = z.infer<typeof GenerateAutomatedTeamChallengeStrategyInputSchema>;

/**
 * Output schema for the generated automated team challenge strategy.
 */
const GenerateAutomatedTeamChallengeStrategyOutputSchema = z.object({
  mision: z.string().describe('Misión corta, accionable y de alto impacto del proyecto.'),
  vision: z.string().describe('Visión proyectada a futuro, inspiradora y medible del proyecto.'),
  diferenciador: z.string().describe('Cualidad única, enfoque transmedia, tecnológico o de inclusión que separa al proyecto del resto.'),
  impacto_ods: z.string().describe('Métrica clave de éxito (KPI) y su alineación con un ODS (Objetivo de Desarrollo Sostenible).'),
});
export type GenerateAutomatedTeamChallengeStrategyOutput = z.infer<typeof GenerateAutomatedTeamChallengeStrategyOutputSchema>;

const systemPrompt = `Actúa como consultor senior en innovación social y transmedia para el laboratorio "Núcleo Colectivo". Tu tarea es construir una narrativa estratégica y diferenciada para un nuevo proyecto. No uses texto de relleno genérico. Ve directo al grano, sé visionario, medible y anclado al contexto territorial dado.`;

const generateAutomatedTeamChallengeStrategyPrompt = ai.definePrompt({
  name: 'generateAutomatedTeamChallengeStrategyPrompt',
  input: { schema: GenerateAutomatedTeamChallengeStrategyInputSchema },
  output: { schema: GenerateAutomatedTeamChallengeStrategyOutputSchema },
  system: systemPrompt,
  prompt: `Desarrolla la estrategia para el siguiente proyecto:
  - Sector: {{{sector}}}
  - Producto/Solución: {{{product}}}
  - Público Objetivo: {{{audience}}}
  - Problema central a resolver: {{{problem}}}
  - Valor diferencial: {{{value}}}
  - Contexto Territorial: {{{territory}}}`,
});

const generateAutomatedTeamChallengeStrategyFlow = ai.defineFlow(
  {
    name: 'generateAutomatedTeamChallengeStrategyFlow',
    inputSchema: GenerateAutomatedTeamChallengeStrategyInputSchema,
    outputSchema: GenerateAutomatedTeamChallengeStrategyOutputSchema,
  },
  async (input) => {
    const { output } = await generateAutomatedTeamChallengeStrategyPrompt(input);
    return output!;
  }
);

/**
 * Generates a strategic outline (mission, vision, differentiator, impact) for a project
 * based on provided input variables using an AI model.
 * @param input The input containing project details such as sector, product, audience, etc.
 * @returns A promise that resolves to the generated strategic output.
 */
export async function generateAutomatedTeamChallengeStrategy(
  input: GenerateAutomatedTeamChallengeStrategyInput
): Promise<GenerateAutomatedTeamChallengeStrategyOutput> {
  return generateAutomatedTeamChallengeStrategyFlow(input);
}
