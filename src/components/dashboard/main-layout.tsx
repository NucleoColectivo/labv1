"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { 
  Users, Timer, FileText, Settings, Play, Pause, RotateCw, 
  Sparkles, 
  AlertCircle, Zap, X, Copy, Eye, Dices, RefreshCcw, Save, Trophy
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { PRESETS, opcionesPorSector, prefijos, sufijos, entregablesBase } from "@/lib/data";
import { generateStrategyWithAI } from "@/app/actions";
import { Logo } from "@/components/logo";
import type { Scores, IAData, Team } from "@/lib/types";

import { DashboardTab } from './dashboard-tab';
import { VariablesTab } from './variables-tab';
import { GeneratorTab } from './generator-tab';

// --- UTILITY FUNCTIONS ---
const cleanTextForPDF = (text: string | null | undefined): string => {
  if (!text) return "";
  return String(text)
    .replace(/•/g, '-') 
    .replace(/[🏆👥💡🎯⚠️✨📦🏭🎨💎🤖🌟🎉🚀🧩]/g, '') 
    .replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '') 
    .replace(/^[ \t]+/gm, '') 
    .trim();
};

const loadSavedData = <T,>(key: string, fallbackValue: T): T => {
  if (typeof window === 'undefined') {
    return fallbackValue;
  }
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallbackValue;
  } catch (error) {
    console.warn(`Error reading localStorage key “${key}”:`, error);
    return fallbackValue;
  }
};

const glassStyles = {
  panel: "relative bg-white/60 backdrop-blur-xl border border-white/80 shadow-xl rounded-xl overflow-hidden",
  tabActive: "bg-white backdrop-blur-xl border border-white shadow-sm text-primary rounded-lg",
  tabInactive: "bg-transparent text-slate-500 hover:bg-white/50 hover:text-slate-700 border border-transparent rounded-lg"
};

type MainLayoutProps = {
  onSessionReset: () => void;
};

export function MainLayout({ onSessionReset }: MainLayoutProps) {
  const [variables, setVariables] = useState(() => loadSavedData("dash_variables", PRESETS.general));
  const [teams, setTeams] = useState<Team[]>(() => loadSavedData("dash_teams", []));
  const [round, setRound] = useState(() => loadSavedData("dash_round", 1));
  const [timer, setTimer] = useState(() => loadSavedData("dash_timer", 1800));
  const [isRunning, setIsRunning] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => { localStorage.setItem("dash_variables", JSON.stringify(variables)); }, [variables]);
  useEffect(() => { localStorage.setItem("dash_teams", JSON.stringify(teams)); }, [teams]);
  useEffect(() => { localStorage.setItem("dash_round", JSON.stringify(round)); }, [round]);
  useEffect(() => { localStorage.setItem("dash_timer", JSON.stringify(timer)); }, [timer]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    } else if (timer === 0 && isRunning) {
      setIsRunning(false);
      toast({ title: "¡Tiempo Finalizado!", description: "El reto ha concluido.", variant: "destructive" });
    }
    return () => clearInterval(interval);
  }, [isRunning, timer, toast]);

  const [activeTab, setActiveTab] = useState("dashboard");
  const [scoringTeam, setScoringTeam] = useState<Team | null>(null); 
  const [viewingTeam, setViewingTeam] = useState<Team | null>(null);
  const [isSpinningLock, setIsSpinningLock] = useState(false);

  const [roulette, setRoulette] = useState({
    show: false, phase: 'idle', mode: 'manual', teamId: null as number | null,
    spinWords: { sector: '', producto: '', estilo: '' }, result: null as any
  });

  const [manualSector, setManualSector] = useState("tecnologia");
  const [manualEquipo, setManualEquipo] = useState("");
  const [manualPublico, setManualPublico] = useState(opcionesPorSector.tecnologia.publicos[0]);
  const [manualProblema, setManualProblema] = useState(opcionesPorSector.tecnologia.problemas[0]);
  const [manualTono, setManualTono] = useState(opcionesPorSector.tecnologia.tonos[0]);
  const [manualValor, setManualValor] = useState(opcionesPorSector.tecnologia.valores[0]);
  const [manualTerritorio, setManualTerritorio] = useState(opcionesPorSector.tecnologia.territorios[0]);

  const handleSectorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sector = e.target.value;
    setManualSector(sector);
    setManualPublico(opcionesPorSector[sector as keyof typeof opcionesPorSector].publicos[0]);
    setManualProblema(opcionesPorSector[sector as keyof typeof opcionesPorSector].problemas[0]);
    setManualTono(opcionesPorSector[sector as keyof typeof opcionesPorSector].tonos[0]);
    setManualValor(opcionesPorSector[sector as keyof typeof opcionesPorSector].valores[0]);
    setManualTerritorio(opcionesPorSector[sector as keyof typeof opcionesPorSector].territorios[0]);
  };

  const resetearSesion = () => {
    if(window.confirm("¿Estás seguro de borrar todos los equipos y datos de la clase actual?")) {
      setTeams([]); setTimer(1800); setIsRunning(false); setRound(1);
      onSessionReset();
      toast({ title: "Sesión Reiniciada", description: "Se han borrado todos los datos." });
    }
  };

  const triggerRoulette = useCallback(async (mode: 'manual' | 'team' | 'global', targetId: number | null = null) => {
    if (isSpinningLock) return; 
    setIsSpinningLock(true);

    setRoulette({ show: true, phase: 'spinning', mode, teamId: targetId, spinWords: { sector: 'Procesando...', producto: 'Conectando...', estilo: 'Analizando...' }, result: null });
    
    const safeArr = (arr: any[] | undefined) => (Array.isArray(arr) && arr.length > 0) ? arr : ["Indefinido"];
    const r = (arr: any[] | undefined) => safeArr(arr)[Math.floor(Math.random() * safeArr(arr).length)];
    
    const spinInterval = setInterval(() => {
      setRoulette(prev => ({...prev, spinWords: { sector: r(variables?.sectores), producto: r(variables?.productos), estilo: r(variables?.estilos) } }));
    }, 100); 

    await new Promise(resolve => setTimeout(resolve, 3000));

    try {
      if (mode === 'manual') {
        const productosDelSector = opcionesPorSector[manualSector as keyof typeof opcionesPorSector].productos;
        const producto = r(productosDelSector); 
        const nombreMarca = r(prefijos) + r(sufijos);

        const iaResponse = await generateStrategyWithAI({
          sector: opcionesPorSector[manualSector as keyof typeof opcionesPorSector].label,
          product: producto,
          value: manualValor,
          audience: manualPublico,
          problem: manualProblema,
          territory: manualTerritorio
        });
        
        clearInterval(spinInterval);

        const challengeText = `Desarrolla ${producto} dirigido a ${manualPublico}.\n\n⚠️ PROBLEMA A RESOLVER:\n${manualProblema}.\n\n✨ IDENTIDAD DE MARCA:\nLa marca debe enfocarse en "${manualValor}" con un estilo ${manualTono}.`;
        const challengeUI = `🏆 RETO CREATIVO\n======================\n\n👥 Equipo: ${manualEquipo || "Sin nombre"}\n💡 Nombre sugerido: ${nombreMarca}\n\n🎯 DESAFÍO:\n${challengeText}${entregablesBase}`;
        const challengePDF = `RETO CREATIVO\n\nEquipo: ${manualEquipo || "Sin nombre"}\nNombre sugerido: ${nombreMarca}\n\nDESAFÍO:\n${challengeText}`;

        setRoulette(prev => ({ ...prev, phase: 'result', result: { title: 'Reto Individual Generado', challengeUI, challengePDF, iaData: iaResponse, filename: `Reto_${manualEquipo || 'Creativo'}` } }));
      } 
      else if (mode === 'team' && targetId) {
        setTeams(prevTeams => prevTeams.map(t => t.id === targetId ? { ...t, status: "Generando IA..." } : t));
        const currentTeam = teams.find(t => t.id === targetId);
        if(!currentTeam) throw new Error("Team not found");

        const vSector = r(variables?.sectores); const vProd = r(variables?.productos); const vStyle = r(variables?.estilos); const vPublico = r(variables?.publicos); const vValor = r(variables?.valores); const vTerritorio = r(variables?.territorios); const nombreMarca = r(prefijos) + r(sufijos);

        const iaResponse = await generateStrategyWithAI({ sector: vSector, product: vProd, value: vValor, audience: vPublico, problem: "Falta de innovación en el sector", territory: vTerritorio });
        clearInterval(spinInterval);
        
        const challengeText = `Desarrolla ${vProd.toLowerCase()} dirigido a ${vPublico.toLowerCase()}.\n\n✨ IDENTIDAD DE MARCA:\nLa marca debe enfocarse en "${vValor}" con un estilo ${vStyle}.`;
        const challengeUI = `🏆 RETO CREATIVO GLOBAL\n======================\n\n👥 Equipo: ${currentTeam.name}\n💡 Nombre sugerido: ${nombreMarca}\n🏭 Sector: ${vSector}\n📍 Territorio: ${vTerritorio}\n\n🎯 DESAFÍO:\n${challengeText}${entregablesBase}`;
        const challengePDF = `RETO CREATIVO GLOBAL\n\nEquipo: ${currentTeam.name}\nNombre sugerido: ${nombreMarca}\nSector: ${vSector}\nTerritorio: ${vTerritorio}\n\nDESAFÍO:\n${challengeText}`;

        setTeams(prevTeams => prevTeams.map(t => t.id === targetId ? { ...t, sector: vSector, product: vProd, style: vStyle, status: "Reto Asignado", challengeUI, challengePDF, iaData: iaResponse } : t ));
        setRoulette(prev => ({ ...prev, phase: 'result', result: { title: `Reto Asignado: ${currentTeam.name}`, challengeUI, challengePDF, iaData: iaResponse, filename: `Reto_${currentTeam.name}` } }));
        toast({ title: `Reto generado para ${currentTeam.name}`});
      }
      else if (mode === 'global') {
        const teamsToUpdate = teams.filter(t => t.status === "Esperando Reto");
        if(teamsToUpdate.length === 0) {
          clearInterval(spinInterval);
          setIsSpinningLock(false);
          setRoulette(prev => ({...prev, show: false, phase: 'idle'}));
          return toast({ title: "No hay equipos esperando reto", description: "Añade nuevos equipos o cambia el estado de los existentes."});
        }
        
        setTeams(prev => prev.map(t => teamsToUpdate.find(tu => tu.id === t.id) ? {...t, status: "Generando IA..."} : t));

        const promises = teamsToUpdate.map(async (team) => {
          const vSector = r(variables?.sectores); const vProd = r(variables?.productos); const vStyle = r(variables?.estilos); const vPublico = r(variables?.publicos); const vValor = r(variables?.valores); const vTerritorio = r(variables?.territorios); const nombreMarca = r(prefijos) + r(sufijos);
          
          const iaResponse = await generateStrategyWithAI({ sector: vSector, product: vProd, value: vValor, audience: vPublico, problem: "Falta de innovación en el sector", territory: vTerritorio });
          
          const challengeText = `Desarrolla ${vProd.toLowerCase()} dirigido a ${vPublico.toLowerCase()}.\n\n✨ IDENTIDAD DE MARCA:\nLa marca debe enfocarse en "${vValor}" con un estilo ${vStyle}.`;
          const challengeUI = `🏆 RETO CREATIVO GLOBAL\n======================\n\n👥 Equipo: ${team.name}\n💡 Nombre sugerido: ${nombreMarca}\n🏭 Sector: ${vSector}\n📍 Territorio: ${vTerritorio}\n\n🎯 DESAFÍO:\n${challengeText}${entregablesBase}`;
          const challengePDF = `RETO CREATIVO GLOBAL\n\nEquipo: ${team.name}\nNombre sugerido: ${nombreMarca}\nSector: ${vSector}\nTerritorio: ${vTerritorio}\n\nDESAFÍO:\n${challengeText}`;

          return { id: team.id, teamName: team.name, data: { sector: vSector, product: vProd, style: vStyle, status: "Reto Asignado", challengeUI, challengePDF, iaData: iaResponse } };
        });

        const results = await Promise.all(promises);
        clearInterval(spinInterval);

        setTeams(prevTeams => prevTeams.map(t => { 
          const updatedData = results.find(res => res.id === t.id); 
          return updatedData ? { ...t, ...updatedData.data } : t; 
        }));
        setRound(prev => prev + 1);

        setRoulette(prev => ({ ...prev, phase: 'result', result: { title: '¡Generación Exitosa!', isGlobal: true, globalResults: results } }));
        toast({ title: `Retos generados para ${results.length} equipos` });
      }
    } catch (e) {
      console.error(e);
      clearInterval(spinInterval); 
      setRoulette(prev => ({...prev, show: false, phase: 'idle'}));
      toast({ title: "Error de Generación", description: "Hubo un problema al contactar la IA. Inténtalo de nuevo.", variant: "destructive" });
      setTeams(prev => prev.map(t => t.status === "Generando IA..." ? {...t, status: "Esperando Reto"} : t));
    } finally {
      setIsSpinningLock(false);
    }
  }, [isSpinningLock, variables, manualSector, manualEquipo, manualPublico, manualProblema, manualTono, manualValor, manualTerritorio, teams, toast]);

  const addTeam = () => {
    if (teams.length >= 6) {
      toast({ title: "Límite de equipos alcanzado", description: "Solo se pueden crear hasta 6 equipos.", variant: "destructive" });
      return;
    }
    const newId = teams.length > 0 ? Math.max(...teams.map(t => t.id)) + 1 : 1;
    setTeams([...teams, {
      id: newId, name: `Equipo ${newId}`, sector: "-", product: "-", style: "-",
      status: "Esperando Reto", scores: { innovacion: 0, coherencia: 0, visual: 0, viabilidad: 0, etica: 0 },
      feedback: "", iaData: null, challengeUI: "", challengePDF: ""
    }]);
    toast({ title: "Equipo añadido" });
  };

  const deleteTeam = (id: number) => { if(window.confirm("¿Seguro que deseas eliminar este equipo?")) setTeams(teams.filter(t => t.id !== id)); };

  const copiarTexto = async (texto?: string) => {
    if (!texto || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(texto);
      toast({ title: "Copiado al portapapeles" });
    } catch (err) {
      console.error('Error al copiar', err);
      toast({ title: "Error al copiar", variant: "destructive" });
    }
  };

  const exportarPDF = async (title: string, challengePDF?: string, iaData?: IAData | null, scores?: Scores | null, feedback?: string) => {
    if (!challengePDF) return toast({ title: "No hay datos para exportar", variant: "destructive" });
    try {
      const { jsPDF } = await import('jspdf');
      
      let fullText = `${title}\n====================================\n\n`;
      if (scores) {
        fullText += `PUNTAJE OBTENIDO: ${getTotalScore(scores)} / 25\n\n`;
      }
      
      fullText += `RETO ASIGNADO:\n${challengePDF}\n\n`;

      if (iaData) {
        fullText += `ANÁLISIS ESTRATÉGICO (IA):\n`;
        fullText += `Misión: ${iaData.mision}\n`;
        fullText += `Visión: ${iaData.vision}\n`;
        fullText += `Diferenciador: ${iaData.diferenciador}\n`;
        fullText += `Impacto & ODS: ${iaData.impacto_ods}\n\n`;
      }

      if (scores) {
        fullText += `RÚBRICA DE EVALUACIÓN:\n`;
        Object.entries(scores).forEach(([key, val]) => { fullText += `- ${key.charAt(0).toUpperCase() + key.slice(1)}: ${val}/5\n`; });
        fullText += `\n`;
      }

      if (feedback) {
        fullText += `FEEDBACK DEL DOCENTE:\n${feedback}\n`;
      }

      const sanitizedText = cleanTextForPDF(fullText);
      const doc = new jsPDF();
      const lines = doc.splitTextToSize(sanitizedText, 180);
      let y = 20;
      doc.setFontSize(11);
      
      for (let i = 0; i < lines.length; i++) {
        if (y > 280) { doc.addPage(); y = 20; }
        doc.text(lines[i], 15, y);
        y += 6; 
      }
      doc.save(`Resumen_Ejecutivo_Reto.pdf`); 
      toast({ title: "PDF descargado correctamente" });
    } catch (error) { 
      console.error("Error PDF:", error); 
      toast({ title: "Error al generar el PDF", variant: "destructive" }); 
    }
  };

  const exportarCSV = () => {
    if(!teams || teams.length === 0) return toast({ title: "No hay datos para exportar", variant: "destructive" });
    const headers = ["Rank", "Equipo", "Sector", "Producto", "Estado", "P. Innovacion", "P. Coherencia", "P. Visual", "P. Viabilidad", "P. Etica", "PUNTAJE TOTAL", "Feedback"];
    const sorted = [...teams].sort((a, b) => getTotalScore(b.scores) - getTotalScore(a.scores));
    const rows = sorted.map((t, i) => [ i + 1, `"${t.name}"`, `"${t.sector}"`, `"${t.product}"`, `"${t.status}"`, t.scores.innovacion, t.scores.coherencia, t.scores.visual, t.scores.viabilidad, t.scores.etica, getTotalScore(t.scores), `"${(t.feedback || '').replace(/"/g, '""')}"` ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent); const link = document.createElement("a");
    link.setAttribute("href", encodedUri); link.setAttribute("download", `Ranking_Ronda${round}.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link); 
    toast({ title: "Ranking exportado a CSV" });
  };

  const getTotalScore = (scores: Scores) => Object.values(scores).reduce((a, b) => a + Number(b), 0);
  const updateTeamScore = (id: number, newScores: Scores, feedback: string) => { setTeams(teams.map(t => t.id === id ? { ...t, scores: newScores, feedback, status: "Calificado" } : t)); setScoringTeam(null); toast({ title: "Evaluación guardada" }); };

  const stats = useMemo(() => {
    const active = teams.filter(t => t.status !== "Esperando Reto").length;
    const graded = teams.filter(t => t.status === "Calificado").length;
    return { active, graded, total: teams.length };
  }, [teams]);

  const sortedTeams = useMemo(() => [...teams].sort((a, b) => getTotalScore(b.scores) - getTotalScore(a.scores)), [teams]);
  const formatTime = (seconds: number) => { const m = Math.floor(seconds / 60); const s = seconds % 60; return `${m}:${s < 10 ? '0' : ''}${s}`; };
  const timerProgress = useMemo(() => (1800 - timer) / 1800 * 100, [timer]);

  const triggerGlobalRoulette = () => triggerRoulette('global');
  const triggerTeamRoulette = (teamId: number) => triggerRoulette('team', teamId);
  const triggerManualRoulette = () => triggerRoulette('manual');


  return (
    <div className="min-h-screen relative font-sans text-slate-800 selection:bg-primary/20 overflow-x-hidden">
      <div className="fixed inset-0 z-[-1] bg-background">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-primary/10 rounded-full mix-blend-multiply blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-accent/20 rounded-full mix-blend-multiply blur-3xl animate-[pulse_10s_ease-in-out_infinite]" />
      </div>
      
      {roulette.show && (
        <Dialog open={roulette.show} onOpenChange={(isOpen) => !isOpen && setRoulette(p => ({...p, show: false}))}>
          <DialogContent className="max-w-2xl w-full p-0 border-0 bg-transparent shadow-none">
            <DialogHeader>
              <DialogTitle className="sr-only">Sintetizando variables</DialogTitle>
            </DialogHeader>
            {roulette.phase === 'spinning' && (
              <div className="text-center space-y-6 max-w-sm w-full mx-auto">
                <div className="flex justify-center mb-4"><div className="bg-white/50 backdrop-blur-xl text-primary p-6 rounded-xl animate-spin shadow-lg border border-white"><Dices size={56} strokeWidth={1.5} /></div></div>
                <h2 className="text-lg font-bold text-primary uppercase tracking-widest animate-pulse">Sintetizando variables...</h2>
                <div className="bg-white/60 p-6 rounded-xl border border-white shadow-xl backdrop-blur-xl space-y-4">
                  <div className="text-sm font-semibold text-primary uppercase">{roulette.spinWords.sector}</div>
                  <div className="text-2xl font-bold text-slate-800">{roulette.spinWords.producto}</div>
                  <div className="text-sm font-semibold text-purple-600">{roulette.spinWords.estilo}</div>
                </div>
              </div>
            )}
            {roulette.phase === 'result' && roulette.result && (
              <Card className="bg-white/80 backdrop-blur-xl border border-white shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
                <DialogHeader className="p-4 border-b">
                  <DialogTitle className="flex items-center gap-2 text-lg"><Sparkles className="text-primary"/> {roulette.result.title}</DialogTitle>
                </DialogHeader>
                <div className="p-6 overflow-y-auto scrollbar-hide">
                  {roulette.result.isGlobal ? (
                    <div className="space-y-4">
                      {roulette.result.globalResults.map((gr: any, idx: number) => (
                        <Card key={idx}><CardHeader><CardTitle className="flex items-center gap-2"><Users size={18} /> {gr.teamName}</CardTitle></CardHeader><CardContent className="whitespace-pre-wrap font-medium text-sm text-muted-foreground">{gr.data.challengeUI}</CardContent></Card>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white/60 p-5 rounded-lg whitespace-pre-wrap border border-slate-100 shadow-inner text-slate-700 font-medium text-sm leading-relaxed">
                      {roulette.result.challengeUI}
                      {roulette.result.iaData && (
                        <div className="mt-5 pt-5 border-t border-dashed">
                           <p className="font-bold text-primary flex items-center gap-2 mb-2"><Sparkles size={14}/> Análisis Estratégico IA</p>
                           <p className="mb-2"><strong>Misión:</strong> {roulette.result.iaData.mision}</p>
                           <p className="mb-2"><strong>Visión:</strong> {roulette.result.iaData.vision}</p>
                           <p className="mb-2 text-primary"><strong>💡 Diferenciador:</strong> {roulette.result.iaData.diferenciador}</p>
                           <p className="text-emerald-700"><strong>🌍 KPI de Impacto / ODS:</strong> {roulette.result.iaData.impacto_ods}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <DialogFooter className="p-4 border-t gap-2 sm:justify-between w-full">
                  {!roulette.result.isGlobal && (
                    <Button variant="outline" onClick={() => triggerRoulette(roulette.mode, roulette.teamId)}><Dices size={16} /> Relanzar</Button>
                  )}
                   <div className="flex gap-2">
                    {!roulette.result.isGlobal && (<>
                      <Button variant="outline" onClick={() => copiarTexto(roulette.result.challengeUI)}><Copy size={16} /> Copiar</Button>
                      <Button variant="outline" onClick={() => exportarPDF("RESUMEN EJECUTIVO", roulette.result.challengePDF, roulette.result.iaData, null, "")}><FileText size={16} /> PDF</Button>
                    </>)}
                    <Button onClick={() => setRoulette(p => ({...p, show: false}))}>Cerrar</Button>
                  </div>
                </DialogFooter>
              </Card>
            )}
          </DialogContent>
        </Dialog>
      )}

      {viewingTeam && (
        <Dialog open={!!viewingTeam} onOpenChange={(isOpen) => !isOpen && setViewingTeam(null)}>
          <DialogContent className="max-w-xl w-full p-0">
            <DialogHeader className="p-4 border-b"><DialogTitle className="flex items-center gap-2"><Eye size={16} className="text-primary" /> Equipo: {viewingTeam.name}</DialogTitle></DialogHeader>
            <div className="p-5 overflow-y-auto max-h-[70vh]"><Card><CardContent className="p-4 whitespace-pre-wrap font-medium text-sm text-muted-foreground">{viewingTeam.challengeUI}</CardContent></Card></div>
            <DialogFooter className="p-4 border-t"><Button onClick={() => exportarPDF(`REPORTE: ${viewingTeam.name}`, viewingTeam.challengePDF, viewingTeam.iaData, viewingTeam.scores, viewingTeam.feedback)}><FileText size={14} /> Descargar Reporte PDF</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {scoringTeam && (
        <Dialog open={!!scoringTeam} onOpenChange={(isOpen) => !isOpen && setScoringTeam(null)}>
          <DialogContent className="max-w-lg w-full p-0">
            <DialogHeader className="bg-primary text-primary-foreground p-4 flex flex-row justify-between items-center rounded-t-lg">
              <div>
                <DialogTitle>Rúbrica: {scoringTeam.name}</DialogTitle>
                <p className="text-sm text-primary-foreground/80">{scoringTeam.product}</p>
              </div>
              <div className="bg-black/20 px-3 py-1 rounded-md shadow-inner font-bold text-lg">{getTotalScore(scoringTeam.scores)}<span className="text-xs opacity-70">/25</span></div>
            </DialogHeader>
            <div className="p-5 overflow-y-auto max-h-[70vh] bg-slate-50">
              {scoringTeam.status === "Esperando Reto" ? (
                 <div className="text-center p-6 bg-white rounded-lg border text-muted-foreground shadow-sm"><AlertCircle className="mx-auto mb-2 text-amber-500" />Equipo sin reto asignado.</div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-bold text-xs uppercase tracking-wider border-b pb-1.5">Criterios (0-5)</h4>
                    {Object.keys(scoringTeam.scores).map(criterion => (
                      <div key={criterion} className="flex items-center justify-between gap-3 bg-white p-2.5 rounded-md border shadow-sm">
                        <label className="capitalize text-sm font-semibold text-slate-600 w-1/3 truncate">{criterion === 'etica' ? 'Impacto' : criterion}</label>
                        <Input type="range" min="0" max="5" step="1" value={scoringTeam.scores[criterion as keyof Scores]} onChange={(e) => setScoringTeam({...scoringTeam, scores: {...scoringTeam.scores, [criterion]: Number(e.target.value)}})} className="w-2/5 accent-primary cursor-pointer h-1.5" />
                        <span className="w-8 h-8 flex items-center justify-center font-bold text-primary bg-primary/10 rounded-md text-sm">{scoringTeam.scores[criterion as keyof Scores]}</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5">Feedback</label>
                    <Textarea placeholder="Áreas de mejora y fortalezas..." value={scoringTeam.feedback} onChange={(e) => setScoringTeam({...scoringTeam, feedback: e.target.value})} />
                  </div>
                </div>
              )}
            </div>
            <DialogFooter className="p-4 border-t flex justify-end gap-2 bg-white">
              <Button variant="ghost" onClick={() => setScoringTeam(null)}>Cancelar</Button>
              {scoringTeam.status !== "Esperando Reto" && (<Button onClick={() => updateTeamScore(scoringTeam.id, scoringTeam.scores, scoringTeam.feedback)}><Save size={14} /> Guardar</Button>)}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <header className="sticky top-3 z-20 mx-4 sm:mx-6 mb-6">
        <div className={cn(glassStyles.panel, "p-3 max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4")}>
          <div className="flex items-center gap-3"><Logo className="h-8 sm:h-10 w-auto" /><div className="hidden sm:block w-px h-6 bg-slate-300 mx-1"></div><h1 className="text-base font-bold text-slate-800">Motor Creativo</h1></div>
          <div className="flex items-center gap-4 bg-white/60 px-4 py-1.5 rounded-md border border-slate-200 shadow-inner">
            <div className="flex flex-col items-center"><span className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Ronda</span><span className="font-bold text-base text-primary leading-none">{round}</span></div>
            <div className="w-px h-6 bg-slate-300"></div>
            <div className="flex items-center gap-3">
              <Timer size={16} className={cn("transition-colors", { "text-red-500 animate-pulse": timer < 300, "text-slate-500": timer >= 300})} />
              <span className={cn("font-mono text-xl font-bold tracking-tight", { "text-red-500": timer < 300, "text-slate-700": timer >= 300 })}>{formatTime(timer)}</span>
              <div className="relative w-full sm:w-24 h-1 bg-slate-200 rounded-full overflow-hidden ml-2"><div className="absolute top-0 left-0 h-full bg-primary transition-all duration-1000 ease-linear" style={{ width: `${timerProgress}%` }}></div></div>
              <div className="flex gap-1 pl-2 border-l border-slate-300">
                <Button onClick={() => setIsRunning(!isRunning)} variant="ghost" size="icon" className="h-7 w-7">{isRunning ? <Pause size={14} /> : <Play size={14} />}</Button>
                <Button onClick={() => { setTimer(1800); setIsRunning(false); }} variant="ghost" size="icon" className="h-7 w-7"><RotateCw size={14} /></Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="bg-white/50 backdrop-blur-md p-1.5 border border-slate-200 rounded-lg shadow-sm flex flex-wrap justify-between items-center gap-3">
              <TabsList className="bg-transparent p-0 gap-1 w-full sm:w-auto overflow-x-auto scrollbar-hide">
                <TabsTrigger value="dashboard" className={cn("px-4 py-1.5 font-semibold text-sm transition-all flex items-center gap-2 whitespace-nowrap", activeTab === 'dashboard' ? glassStyles.tabActive : glassStyles.tabInactive)}><Trophy size={14}/> Panel de Equipos</TabsTrigger>
                <TabsTrigger value="variables" className={cn("px-4 py-1.5 font-semibold text-sm transition-all flex items-center gap-2 whitespace-nowrap", activeTab === 'variables' ? glassStyles.tabActive : glassStyles.tabInactive)}><Settings size={14}/> Motor de Variables</TabsTrigger>
                <TabsTrigger value="generador" className={cn("px-4 py-1.5 font-semibold text-sm transition-all flex items-center gap-2 whitespace-nowrap", activeTab === 'generador' ? glassStyles.tabActive : glassStyles.tabInactive)}><Zap size={14}/> Modo Individual</TabsTrigger>
              </TabsList>
              <Button onClick={resetearSesion} variant="destructive" size="sm" className="flex items-center gap-1.5 text-xs font-semibold ml-auto"><RefreshCcw size={12}/> Reiniciar Sesión</Button>
            </div>
          <main className="flex-1 w-full mt-6">
            <DashboardTab
              stats={stats}
              triggerRoulette={triggerGlobalRoulette}
              isSpinningLock={isSpinningLock}
              exportarCSV={exportarCSV}
              addTeam={addTeam}
              sortedTeams={sortedTeams}
              teams={teams}
              setTeams={setTeams}
              setViewingTeam={setViewingTeam}
              triggerTeamRoulette={triggerTeamRoulette}
              setScoringTeam={setScoringTeam}
              deleteTeam={deleteTeam}
              getTotalScore={getTotalScore}
            />
            <VariablesTab 
              variables={variables}
              setVariables={setVariables}
            />
            <GeneratorTab
                manualSector={manualSector}
                handleSectorChange={handleSectorChange}
                manualEquipo={manualEquipo}
                setManualEquipo={setManualEquipo}
                manualPublico={manualPublico}
                setManualPublico={setManualPublico}
                manualProblema={manualProblema}
                setManualProblema={setManualProblema}
                manualTono={manualTono}
                setManualTono={setManualTono}
                manualValor={manualValor}
                setManualValor={setManualValor}
                manualTerritorio={manualTerritorio}
                setManualTerritorio={setManualTerritorio}
                triggerRoulette={triggerManualRoulette}
                isSpinningLock={isSpinningLock}
            />
          </main>
        </Tabs>
      </div>
    </div>
  );
}
