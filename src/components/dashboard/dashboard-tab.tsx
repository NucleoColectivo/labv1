"use client";

import React from 'react';
import {
  Users, Sparkles, CheckCircle2, Dices, LayoutDashboard,
  FileSpreadsheet, Plus, Eye, RotateCw, Edit3, Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TabsContent } from "@/components/ui/tabs";
import type { Team, Scores } from "@/lib/types";

const glassStyles = {
  panel: "relative bg-white/60 backdrop-blur-xl border border-white/80 shadow-xl rounded-xl overflow-hidden",
};

type Stats = {
    active: number;
    graded: number;
    total: number;
};

type DashboardTabProps = {
  stats: Stats;
  triggerRoulette: (mode: 'global') => void;
  isSpinningLock: boolean;
  exportarCSV: () => void;
  addTeam: () => void;
  sortedTeams: Team[];
  teams: Team[];
  setTeams: React.Dispatch<React.SetStateAction<Team[]>>;
  setViewingTeam: (team: Team | null) => void;
  triggerTeamRoulette: (teamId: number) => void;
  setScoringTeam: (team: Team | null) => void;
  deleteTeam: (id: number) => void;
  getTotalScore: (scores: Scores) => number;
};

export function DashboardTab({
  stats,
  triggerRoulette,
  isSpinningLock,
  exportarCSV,
  addTeam,
  sortedTeams,
  teams,
  setTeams,
  setViewingTeam,
  triggerTeamRoulette,
  setScoringTeam,
  deleteTeam,
  getTotalScore
}: DashboardTabProps) {
  return (
    <TabsContent value="dashboard" className="space-y-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: "Equipos", value: stats.total, icon: Users },
          { title: "Activos", value: stats.active, icon: Sparkles },
          { title: "Evaluados", value: stats.graded, icon: CheckCircle2 },
        ].map(stat => (
          <Card key={stat.title} className={cn(glassStyles.panel, "p-4 flex items-center gap-3 hover:-translate-y-1 transition-transform")}>
            <div className="bg-white/60 border border-white shadow-sm p-2.5 rounded-md text-primary"><stat.icon size={18} /></div>
            <div><p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{stat.title}</p><p className="text-xl font-bold text-slate-800">{stat.value}</p></div>
          </Card>
        ))}
        <Button onClick={() => triggerRoulette('global')} disabled={isSpinningLock} className="bg-gradient-to-br from-primary to-purple-700 rounded-xl shadow-md h-full text-left border border-white/20 group">
          <div className="p-4 flex items-center gap-3 w-full">
            <div className="bg-white/20 p-2.5 rounded-md text-white shadow-inner group-hover:rotate-180 transition-transform duration-700"><Dices size={18} /></div>
            <div><p className="text-[10px] text-indigo-200 font-bold uppercase tracking-wider">Acción Global</p><p className="text-base font-bold text-white leading-tight">Girar Ruleta</p></div>
          </div>
        </Button>
      </div>
      <Card className={cn(glassStyles.panel, "flex flex-col")}>
        <div className="p-4 border-b border-white/40 flex justify-between items-center bg-white/40 flex-wrap gap-4">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2"><LayoutDashboard size={16} className="text-primary" /> Clasificación</h2>
          <div className="flex gap-2">
            <Button onClick={exportarCSV} variant="outline" size="sm" className="text-xs"><FileSpreadsheet size={14} /> CSV</Button>
            <Button onClick={addTeam} size="sm" className="text-xs"><Plus size={14} /> Equipo</Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow><TableHead>Posición / Equipo</TableHead><TableHead>Reto</TableHead><TableHead>Estado</TableHead><TableHead className="text-center">Pts</TableHead><TableHead className="text-right">Acciones</TableHead></TableRow></TableHeader>
            <TableBody>
              {sortedTeams.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="p-10 text-center text-slate-400"><Users size={32} className="mx-auto mb-2 opacity-30" /><p>Añade un equipo para empezar.</p></TableCell></TableRow>
              ) : (
                sortedTeams.map((team, index) => (
                  <TableRow key={team.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className={`flex items-center justify-center w-6 h-6 rounded-md font-bold text-xs shadow-sm border border-white/60 ${index === 0 ? 'bg-accent text-accent-foreground' : 'bg-white/80 text-slate-600'}`}>{index + 1}</span>
                        <Input value={team.name} onChange={(e) => setTeams(teams.map(t => t.id === team.id ? { ...t, name: e.target.value } : t))} className="font-bold text-slate-700 bg-transparent border-none focus:bg-white focus:ring-2 focus:ring-primary rounded-md px-2 py-1 w-32" />
                      </div>
                    </TableCell>
                    <TableCell><div className="font-semibold text-slate-700 text-xs">{team.sector}</div><div className="text-[11px] text-slate-500 truncate max-w-[150px]">{team.product}</div></TableCell>
                    <TableCell><span className={cn("inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold", {
                      "bg-muted text-muted-foreground": team.status === "Esperando Reto",
                      "bg-primary/10 text-primary animate-pulse": team.status === "Generando IA...",
                      "bg-chart-2/10 text-chart-2": team.status === "Calificado",
                      "bg-chart-4/10 text-chart-4": team.status === "Reto Asignado",
                    })}>{team.status}</span></TableCell>
                    <TableCell className="text-center font-bold text-lg text-primary">{getTotalScore(team.scores)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button onClick={() => setViewingTeam(team)} disabled={team.status === "Esperando Reto"} variant="ghost" size="icon" className="h-8 w-8"><Eye size={14} /></Button>
                        <Button onClick={() => triggerTeamRoulette(team.id)} disabled={isSpinningLock} variant="ghost" size="icon" className="h-8 w-8"><RotateCw size={14} /></Button>
                        <Button onClick={() => setScoringTeam(team)} variant="ghost" size="icon" className="h-8 w-8"><Edit3 size={14} /></Button>
                        <Button onClick={() => deleteTeam(team.id)} variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"><Trash2 size={14} /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </TabsContent>
  );
}
