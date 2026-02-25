// --- PRESETS PARA EL MOTOR DE VARIABLES GLOBALES (Avanzados) ---
export const PRESETS = {
  general: {
    sectores: ["Tecnología", "Negocios", "Comunicación", "Educación", "Social", "Medio Ambiente", "Diseño", "Cultura"],
    productos: ["App Inteligente", "Plataforma SaaS", "Campaña Transmedia", "Sistema IoT", "Laboratorio Ciudadano", "Startup Circular"],
    estilos: ["Minimalista", "Brutalista", "Experimental", "Corporativo", "Orgánico", "Accesible y Universal"],
    publicos: ["Jóvenes creativos", "Adultos mayores", "Pymes", "Estudiantes universitarios", "Comunidades rurales", "Población con discapacidad"],
    valores: ["Innovación", "Sostenibilidad", "Inclusión", "Eficiencia", "Transparencia", "Descentralización"],
    territorios: ["Medellín", "Latinoamérica", "Contexto Rural", "Barrios Periféricos", "Global / Escalable"]
  },
  tech: {
    sectores: ["Ciberseguridad", "Inteligencia Artificial", "Web3", "Fintech", "Healthtech", "GovTech"],
    productos: ["API Pública", "Algoritmo Predictivo", "Contrato Inteligente", "Dashboard Analítico", "Infraestructura Serverless"],
    estilos: ["Cyberpunk", "Dark Mode Minimal", "Futurista", "Tecnológico / Neón", "Monocromático"],
    publicos: ["Desarrolladores", "Early Adopters", "Empresas B2B", "Inversores VC"],
    valores: ["Disrupción", "Escalabilidad", "Privacidad de Datos", "Automatización", "Código Abierto"],
    territorios: ["Ecosistema Startup", "Sillicon Valley Latam", "Nómadas Digitales", "Mercados Emergentes"]
  },
  social: {
    sectores: ["Derechos Humanos", "Salud Mental", "Inclusión Financiera", "Desarrollo Rural", "Acción Climática", "Construcción de Paz"],
    productos: ["Red Comunitaria", "Programa de Mentoría", "Plataforma de Donaciones", "Cooperativa Digital", "Campaña de Concientización"],
    estilos: ["Cálido / Empático", "Ilustración Orgánica", "Alegre y Vibrante", "Documental / Realista"],
    publicos: ["Grupos vulnerables", "Voluntarios", "ONGs", "Activistas", "Madres cabeza de familia", "Líderes sociales"],
    valores: ["Empatía", "Equidad", "Impacto Medible", "Solidaridad", "Justicia Social"],
    territorios: ["Zonas de conflicto", "Periferias Urbanas", "Territorios Indígenas", "Asentamientos Informales"]
  }
};

// --- BASE DE DATOS ESTRUCTURADA PARA EL GENERADOR MANUAL ---
export const opcionesPorSector = {
  tecnologia: {
    label: "Tecnología",
    productos: ["app híbrida de alfabetización digital", "plataforma de automatización", "sistema IoT comunitario", "dashboard de visualización de datos"],
    publicos: ["jóvenes creativos", "pymes locales", "adultos mayores", "personas con discapacidad visual"],
    problemas: ["brecha tecnológica", "procesos ineficientes", "desconexión de datos", "baja accesibilidad digital"],
    tonos: ["minimalista", "futurista", "tecnológico", "accesible y claro"],
    formatos: ["Prototipo Interactivo", "Arquitectura de Software", "App Móvil", "SaaS"],
    valores: ["innovación", "escalabilidad", "accesibilidad universal", "seguridad"],
    territorios: ["Medellín", "Latinoamérica", "Entorno Global", "Zonas Rurales Conectadas"]
  },
  social: {
    label: "Impacto Social",
    productos: ["laboratorio ciudadano", "red colaborativa local", "plataforma de mapeo territorial", "programa de intervención híbrido"],
    publicos: ["comunidades vulnerables", "líderes comunitarios", "voluntarios", "ONGs territoriales"],
    problemas: ["desigualdad de oportunidades", "aislamiento social", "falta de recursos", "desplazamiento"],
    tonos: ["cálido", "empático", "inclusivo", "documental", "esperanzador"],
    formatos: ["Metodología de Intervención", "Campaña de Concientización", "App Comunitaria", "Reporte de Impacto"],
    valores: ["equidad", "solidaridad", "justicia social", "apoyo mutuo"],
    territorios: ["Barrios Periféricos", "Territorios Rurales", "Zonas de Paz", "Contexto Latinoamericano"]
  },
  comunicacion: {
    label: "Comunicación & Diseño",
    productos: ["campaña transmedia", "experiencia interactiva visual", "documental inmersivo", "sistema de identidad visual"],
    publicos: ["generación Z", "consumidores conscientes", "creadores de contenido", "audiencias globales"],
    problemas: ["desinformación", "saturación visual", "falta de pertenencia identitaria", "invisibilización cultural"],
    tonos: ["vibrante", "provocativo", "vanguardista", "narrativo profundo"],
    formatos: ["Campaña Transmedia", "Experiencia Web/VR", "Manual de Marca", "Pitch Deck Visual"],
    valores: ["autenticidad", "conexión emocional", "estética", "expresión cultural"],
    territorios: ["Entornos Urbanos", "Ecosistemas Digitales", "Diáspora Global", "Escena Cultural Local"]
  }
};

export const prefijos = ["Nova", "Núcleo", "Conecta", "Nodo", "Raíz", "Pulso", "Zenith", "Ecos"];
export const sufijos = ["Lab", "Hub", "360", "Studio", "Tech", "Co", "Space", "Works"];

export const entregablesBase = `\n\n📦 ENTREGABLES ESPERADOS:\n• Resumen Ejecutivo (Problema/Solución)\n• Arquitectura del Proyecto / Mockup Inicial\n• Canvas de Modelo de Negocio o Impacto\n• Estrategia de Implementación Territorial`;
