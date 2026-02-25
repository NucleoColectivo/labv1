'use server';
/**
 * @fileOverview A Genkit flow for generating a strategic framework (mission, vision, differentiator, impact) for a project.
 *
 * - generateIndividualProjectStrategy - A function that handles the generation of a strategic framework.
 * - GenerateIndividualProjectStrategyInput - The input type for the generateIndividualProjectStrategy function.
 * - GenerateIndividualProjectStrategyOutput - The return type for the generateIndividualProjectStrategy function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateIndividualProjectStrategyInputSchema = z.object({
  sector: z.string().describe('The sector of the project.'),
  product: z.string().describe('The product or solution of the project.'),
  public: z.string().describe('The target audience of the project.'),
  problem: z.string().describe('The central problem the project aims to solve.'),
  value: z.string().describe('The differential value of the project.'),
  territory: z.string().describe('The territorial context of the project.'),
});
export type GenerateIndividualProjectStrategyInput = z.infer<typeof GenerateIndividualProjectStrategyInputSchema>;

const GenerateIndividualProjectStrategyOutputSchema = z.object({
  mision: z.string().describe('A short, actionable, and high-impact mission statement.'),
  vision: z.string().describe('An inspiring and measurable future-projected vision statement.'),
  diferenciador: z.string().describe('A unique quality, transmedia, technological, or inclusive approach that sets the project apart.'),
  impacto_ods: z.string().describe('A key success metric (KPI) and its alignment with an SDG (Sustainable Development Goal).'),
});
export type GenerateIndividualProjectStrategyOutput = z.infer<typeof GenerateIndividualProjectStrategyOutputSchema>;

export async function generateIndividualProjectStrategy(input: GenerateIndividualProjectStrategyInput): Promise<GenerateIndividualProjectStrategyOutput> {
  return generateIndividualProjectStrategyFlow(input);
}

const generateIndividualProjectStrategyPrompt = ai.definePrompt({
  name: 'generateIndividualProjectStrategyPrompt',
  input: { schema: GenerateIndividualProjectStrategyInputSchema },
  output: { schema: GenerateIndividualProjectStrategyOutputSchema },
  system: `Actúa como consultor senior en innovación social y transmedia para el laboratorio "Núcleo Colectivo". Tu tarea es construir una narrativa estratégica y diferenciada para un nuevo proyecto. No uses texto de relleno genérico. Ve directo al grano, sé visionario, medible y anclado al contexto territorial dado.`,
  prompt: `Desarrolla la estrategia para el siguiente proyecto:
- Sector: {{{sector}}}
- Producto/Solución: {{{product}}}
- Público Objetivo: {{{public}}}
- Problema central a resolver: {{{problem}}}
- Valor diferencial: {{{value}}}
- Contexto Territorial: {{{territory}}}`,
});

const generateIndividualProjectStrategyFlow = ai.defineFlow(
  {
    name: 'generateIndividualProjectStrategyFlow',
    inputSchema: GenerateIndividualProjectStrategyInputSchema,
    outputSchema: GenerateIndividualProjectStrategyOutputSchema,
  },
  async (input) => {
    const { output } = await generateIndividualProjectStrategyPrompt(input);
    return output!;
  }
);
