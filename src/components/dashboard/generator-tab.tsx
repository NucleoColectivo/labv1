"use client";

import React from 'react';
import { Dices } from "lucide-react";
import { cn } from "@/lib/utils";
import { opcionesPorSector } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";

const glassStyles = {
  panel: "relative bg-white/60 backdrop-blur-xl border border-white/80 shadow-xl rounded-xl overflow-hidden",
  input: "w-full bg-white/60 backdrop-blur-md border border-white/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.04),0_1px_1px_rgba(255,255,255,1)] focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent text-slate-800 outline-none rounded-lg px-3.5 py-2.5 transition-all placeholder:text-slate-400 text-sm font-semibold",
};

type GeneratorTabProps = {
    manualSector: string;
    handleSectorChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    manualEquipo: string;
    setManualEquipo: (value: string) => void;
    manualPublico: string;
    setManualPublico: (value: string) => void;
    manualProblema: string;
    setManualProblema: (value: string) => void;
    manualTono: string;
    setManualTono: (value: string) => void;
    manualValor: string;
    setManualValor: (value: string) => void;
    manualTerritorio: string;
    setManualTerritorio: (value: string) => void;
    triggerRoulette: () => void;
    isSpinningLock: boolean;
};


export function GeneratorTab({
    manualSector,
    handleSectorChange,
    manualEquipo,
    setManualEquipo,
    manualPublico,
    setManualPublico,
    manualProblema,
    setManualProblema,
    manualTono,
    setManualTono,
    manualValor,
    setManualValor,
    manualTerritorio,
    setManualTerritorio,
    triggerRoulette,
    isSpinningLock,
}: GeneratorTabProps) {
    return (
        <TabsContent value="generador" className="animate-in fade-in duration-400 flex justify-center">
            <Card className={cn(glassStyles.panel, "p-8 sm:p-12 w-full max-w-4xl")}>
                <CardHeader><CardTitle className="text-2xl font-bold text-primary tracking-tight mb-2">Configuración Manual</CardTitle></CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {[
                        { label: "Sector", value: manualSector, onChange: handleSectorChange, options: Object.entries(opcionesPorSector).map(([key, data]) => ({ value: key, label: data.label })) },
                        { label: "Equipo", value: manualEquipo, onChange: (e: any) => setManualEquipo(e.target.value), type: "input" },
                        { label: "Público", value: manualPublico, onChange: (e: any) => setManualPublico(e.target.value), options: opcionesPorSector[manualSector as keyof typeof opcionesPorSector]?.publicos.map(o => ({ value: o, label: o })) },
                        { label: "Problema", value: manualProblema, onChange: (e: any) => setManualProblema(e.target.value), options: opcionesPorSector[manualSector as keyof typeof opcionesPorSector]?.problemas.map(o => ({ value: o, label: o })) },
                        { label: "Tono Visual", value: manualTono, onChange: (e: any) => setManualTono(e.target.value), options: opcionesPorSector[manualSector as keyof typeof opcionesPorSector]?.tonos.map(o => ({ value: o, label: o })) },
                        { label: "Valor Principal", value: manualValor, onChange: (e: any) => setManualValor(e.target.value), options: opcionesPorSector[manualSector as keyof typeof opcionesPorSector]?.valores.map(o => ({ value: o, label: o })) },
                        { label: "Territorio", value: manualTerritorio, onChange: (e: any) => setManualTerritorio(e.target.value), options: opcionesPorSector[manualSector as keyof typeof opcionesPorSector]?.territorios.map(o => ({ value: o, label: o })) },
                    ].map(item => (
                        <div key={item.label} className="flex flex-col gap-2">
                            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-widest ml-1">{item.label}</label>
                            {item.type === 'input' ? <Input value={item.value} onChange={item.onChange} className={glassStyles.input} /> :
                                <select value={item.value} onChange={item.onChange} className={cn(glassStyles.input, "capitalize cursor-pointer")}>
                                    {item.options?.map(o => (<option key={o.value} value={o.value}>{o.label}</option>))}
                                </select>}
                        </div>
                    ))}
                    <div className="md:col-span-2 mt-4 pt-6 border-t flex justify-center">
                        <Button onClick={triggerRoulette} disabled={isSpinningLock} size="lg" className="w-full md:w-auto px-8 py-3 text-base"><Dices size={18} /> Sintetizar Reto con IA</Button>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    );
}
