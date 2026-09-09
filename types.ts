
export interface Experience {
  company: string;
  role: string;
  location: string;
  duration: string;
  points: string[];
}

export interface Education {
  school: string;
  degree: string;
  location: string;
  duration: string;
  details: string[];
}

export interface ProblemItem {
  title: string;
  description: string;
}

export interface EmpathyMap {
  thinksAndFeels: string[];
  saysAndDoes: string[];
  sees: string[];
}

export interface Persona {
  name: string;
  role: string;
  age?: string;
  education?: string;
  quote?: string;
  goals?: string[];
  empathyMap?: EmpathyMap;
  awareness: {
    familiarity: string;
    understanding: string;
  };
  behavior: {
    sought: string;
    sources: string;
  };
  painPoints: {
    challenges: string[];
    accessibility: string[];
    overload: string[];
    trust: string[];
    engagement: string[];
  };
  designPreferences: {
    appealing: string;
    preference: string;
  };
  expectations: {
    expectations: string;
    desiredInfo: string;
  };
  contentPreferences: {
    preferred: string;
    consumption: string;
  };
}

export interface CompetitorAnalysisItem {
  persona: string;
  keyNeeds: string;
  competitors: string[];
  strengths: string[];
  weaknesses: string[];
}

export interface JourneyStage {
  stage: string;
  actions: string[];
  thoughtsAndFeelings: string[];
  painPoints: string[];
  opportunities: string[];
}

export interface UserJourney {
  personaName: string;
  role: string;
  stages: JourneyStage[];
}

export interface BrandConcept {
  title: string;
  description: string;
  badge?: string;
  image?: string;
}

export interface ColorSwatch {
  name: string;
  hex: string;
  type: string;
  image?: string;
  rgb?: string;
  cmyk?: string;
}

export interface BrandStyleguide {
  clearSpace: string;
  minSizeDigital: string;
  minSizePrint: string;
  clearSpaceDiagram?: string;
  primaryTypeface: {
    name: string;
    weight: string;
    sample: string;
    image?: string;
  };
  secondaryTypeface?: {
    name: string;
    weight: string;
    sample: string;
    image?: string;
    additionalImages?: string[];
  };
  colorPalette?: ColorSwatch[];
  primaryColors?: ColorSwatch[];
  secondaryColors?: ColorSwatch[];
}

export interface BrandLockup {
  title: string;
  subtitle: string;
  description: string;
  tag: string;
  image?: string;
  variant: 'standalone' | 'stacked' | 'horizontal' | 'dark' | 'reverse-blue' | 'reverse-black';
}

export interface BrandMockup {
  title: string;
  category: string;
  description: string;
  image: string;
  badge?: string;
  videoUrl?: string;
}

export interface BrandGalleryItem {
  title: string;
  category: string;
  description?: string;
  image: string;
  aspect?: string;
}

export interface SecurityPersona {
  name: string;
  image: string;
  demographics: { label: string; value: string }[];
  sections: {
    title: string;
    items: string[];
    svg?: {
      viewBox: string;
      path: string;
    };
  }[];
}

export interface CaseStudy {
  overview: string;
  challenge: string;
  solution: string;
  year: string;
  role: string;
  technologies: string[];
  problemOverview?: ProblemItem[];
  problemStatement?: string;
  detailedSolution?: ProblemItem[];
  userPersonas?: Persona[];
  competitorAnalysis?: CompetitorAnalysisItem[];
  userJourneys?: UserJourney[];
  
  // Brand Identity / Logo Redesign fields
  isBrandIdentity?: boolean;
  historyAndContext?: string;
  initialExplorations?: string;
  auditCurrentIdentity?: {
    whatWorks: string[];
    whatDoesntWork: string[];
  };
  differentiationOpportunities?: { title: string; description: string }[];
  avoidances?: string[];
  audienceAnalysis?: { segment: string; demographics: string; needs: string[]; touchpoints: string }[];
  referencesList?: { citationNumber: number; text: string; url?: string }[];
  brandAttributes?: { title: string; rationale: string; visualExpression: string }[];
  conceptDirections?: BrandConcept[];
  refinementRationale?: string;
  refinementDiagram?: string;
  refinementImage?: string;
  styleguide?: BrandStyleguide;
  lockups?: BrandLockup[];
  mockups?: BrandMockup[];
  gallery?: BrandGalleryItem[];
  // Enterprise Security UX fields
  isSecurityUX?: boolean;
  securityPersonas?: SecurityPersona[];
  systemObjectives?: {
    system: string;
    description: string;
    objectives: { title: string; content: string }[];
  }[];
  mindmapsAndFlows?: {
    system: string;
    mindmap: string;
    flowchart: string;
    description?: string;
  }[];
  prototypeSuites?: {
    system: string;
    badge: string;
    description: string;
    screens: { label: string; src: string; category?: string; description?: string }[];
  }[];
  uxImpactMetrics?: { label: string; value: string; detail: string }[];

  // Industrial & Mechatronic Design fields
  isHardwareEngineering?: boolean;
  needStatement?: string;
  hardwareSpecs?: { label: string; value: string }[];
  existingSolutions?: { name: string; description: string; image?: string; link?: string }[];
  morphologicalChart?: { subfunction: string; means: string[] }[];
  pughMatrix?: { criteria: string; weight: number; concept1: string; concept2: string; concept3: string; concept4: string; notes?: string }[];
  subsystems?: { title: string; category: string; description: string; parts: { name: string; image?: string; spec?: string }[]; circuitImage?: string; flowChartImage?: string }[];
  motorTorqueCalculations?: { title: string; steps: string[]; formula?: string; notes?: string }[];
  powerBudget?: { component: string; rating: string; qty: number; totalRating: string }[];
  billOfMaterials?: { sNo: number; partName: string; material: string; spec: string; qty: string | number; process: string }[];
  cadAttachmentUrl?: string;
  teamMembers?: { name: string; role: string; usn?: string; email?: string }[];
  figmaUrl?: string;
  figmaEmbedUrl?: string;
  figmaPages?: FigmaPageTab[];
  videoUrl?: string;
  isOlympicIdentity?: boolean;
}

export interface FigmaPageTab {
  name: string;
  nodeId?: string;
  embedUrl: string;
  directUrl: string;
}

export interface Project {
  title: string;
  category: string;
  description: string[];
  image?: string;
  logo?: string;
  link?: string;
  caseStudy?: CaseStudy;
}

export interface SkillCategory {
  category: string;
  skills: string;
  skillsArray?: string[]; // Optional helper if we split string
}

export interface ResumeData {
  personal: {
    name: string;
    role: string;
    location: string;
    phone?: string;
    email: string;
    linkedin: string;
    summary: string;
    insights: string;
  };
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: SkillCategory[];
  certifications: string[];
}