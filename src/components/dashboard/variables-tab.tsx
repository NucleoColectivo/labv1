"use client";

import React from 'react';
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { PRESETS } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const glassStyles = {
  panel: "relative bg-white/60 backdrop-blur-xl border border-white/80 shadow-xl rounded-xl overflow-hidden",
};

type VariablesTabProps = {
  variables: typeof PRESETS.general;
  setVariables: React.Dispatch<React.SetStateAction<typeof PRESETS.general>>;
};

export function VariablesTab({ variables, setVariables }: VariablesTabProps) {
  const { toast } = useToast();

  return (
    <TabsContent value="variables" className={cn(glassStyles.panel, "p-6 sm:p-8 animate-in fade-in duration-300")}>
      <div className="mb-6 flex justify-between items-center border-b border-white/60 pb-5">
        <div><h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Settings size={18} className="text-primary"/> Base de Datos Contextual</h2><p className="text-slate-500 text-xs mt-1">Configura el motor para la Ruleta Global.</p></div>
        <div className="flex gap-2 bg-white/40 p-1.5 rounded-lg border border-white shadow-inner">
          {Object.keys(PRESETS).map(key => <Button key={key} onClick={() => { setVariables(PRESETS[key as keyof typeof PRESETS]); toast({ title: `Preset ${key} cargado` }) }} size="sm" variant="outline" className="text-xs capitalize bg-white shadow-sm border-slate-100">{key}</Button>)}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Object.keys(variables).map((key) => (
          <div key={key} className="bg-white/50 p-4 rounded-xl border border-white shadow-inner">
            <h3 className="font-bold text-slate-700 capitalize mb-3 text-sm">{key}</h3>
            <Textarea className="h-24 text-xs" value={Array.isArray(variables[key as keyof typeof variables]) ? variables[key as keyof typeof variables].join(", ") : ""} onChange={(e) => { const newArray = e.target.value.split(",").map(i => i.trim()).filter(Boolean); setVariables({ ...variables, [key]: newArray }); }} />
            <div className="mt-3 text-[10px] font-bold text-slate-400 flex justify-between items-center"><span>{variables[key as keyof typeof variables].length} ítems</span><span>Separar por coma (,)</span></div>
          </div>
        ))}
      </div>
    </TabsContent>
  );
}
