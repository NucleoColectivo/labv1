'use client';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dices, Sparkles, FileText, LayoutDashboard } from "lucide-react";
import { Logo } from "@/components/logo";

const glassStyles = {
  panel: "relative bg-white/60 backdrop-blur-xl border border-white/80 shadow-xl rounded-xl overflow-hidden",
};

type WelcomeScreenProps = {
  onStart: () => void;
};

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
      <div className="min-h-screen relative font-sans text-slate-800 selection:bg-primary/20 overflow-x-hidden flex items-center justify-center p-4">
        <div className="fixed inset-0 z-[-1] bg-background">
          <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-primary/10 rounded-full mix-blend-multiply blur-3xl animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-accent/20 rounded-full mix-blend-multiply blur-3xl animate-[pulse_10s_ease-in-out_infinite]" />
        </div>
        <div className={cn(glassStyles.panel, "p-8 sm:p-12 max-w-4xl w-full text-center animate-in fade-in zoom-in-95 duration-700")}>
          <div className="mx-auto inline-flex bg-primary text-primary-foreground px-8 sm:px-12 py-4 sm:py-6 rounded-2xl items-center justify-center mb-10 shadow-[0_10px_30px_rgba(143,34,218,0.3)] border border-primary/80">
            <Logo className="h-12 sm:h-16 w-auto drop-shadow-md" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-800 mb-4 tracking-tight drop-shadow-sm">Laboratorio Creativo Modular</h1>
          <p className="text-slate-600 font-medium text-base sm:text-lg mb-10 leading-relaxed max-w-2xl mx-auto">Herramienta para la asignación dinámica de retos, generación de estrategia con IA y evaluación de equipos en tiempo real.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10 text-left">
            {[
              { icon: Dices, iconContainerClass: "bg-primary/10 text-primary", title: "Asignación Dinámica", desc: "Genera variables de territorio, formato y sector para asignar desafíos únicos." },
              { icon: Sparkles, iconContainerClass: "bg-accent/10 text-accent", title: "Contexto con IA", desc: "Crea el marco estratégico (Misión, Visión, KPIs) para cada reto." },
              { icon: FileText, iconContainerClass: "bg-chart-2/10 text-chart-2", title: "Rúbricas y Reportes", desc: "Evalúa y exporta resúmenes ejecutivos en PDF listos para presentar." }
            ].map(item => (
              <div key={item.title} className="bg-white/60 border border-white p-5 rounded-xl shadow-sm hover:-translate-y-1 transition-transform">
                <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center mb-3", item.iconContainerClass)}><item.icon size={20} /></div>
                <h3 className="font-bold text-slate-800 text-sm mb-1.5">{item.title}</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <Button onClick={onStart} size="lg" className="mx-auto text-base sm:text-lg px-10 py-7 shadow-lg shadow-primary/30"><LayoutDashboard size={20} /> Ingresar a la Plataforma</Button>
        </div>
      </div>
  );
}
