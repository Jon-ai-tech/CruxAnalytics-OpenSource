export interface IndustryBenchmark {
  /** Typical gross margin (%) */
  grossMarginPct: number;
  /** Typical net margin (%) */
  netMarginPct: number;
  /** Average payback in months */
  avgPaybackMonths: number;
  /** Typical annual revenue growth (%) */
  revenueGrowthPct: number;
  /** Source label shown to users */
  source: string;
  /** Extra industry-specific note */
  note?: string;
}

export interface ProjectTemplate {
  id: string;
  icon: string;
  nameKey: string; // Translation key
  descriptionKey: string; // Translation key
  category: 'tech' | 'retail' | 'manufacturing' | 'blank';
  data: {
    initialInvestment: number;
    yearlyRevenue: number;
    monthlyCosts: number;
    projectDuration: number;
    discountRate: number;
  };
  /** Typical industry benchmarks for reference */
  benchmarks?: IndustryBenchmark;
}

/**
 * Predefined project templates for different industries
 * Values are based on typical industry benchmarks
 */
export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  // Blank Template
  {
    id: 'blank',
    icon: '📝',
    nameKey: 'templates.blank_name',
    descriptionKey: 'templates.blank_description',
    category: 'blank',
    data: {
      initialInvestment: 0,
      yearlyRevenue: 0,
      monthlyCosts: 0,
      projectDuration: 12,
      discountRate: 10,
    },
  },

  // SaaS Startup Template
  {
    id: 'saas_startup',
    icon: '💻',
    nameKey: 'templates.saas_name',
    descriptionKey: 'templates.saas_description',
    category: 'tech',
    data: {
      initialInvestment: 50000,
      yearlyRevenue: 120000,
      monthlyCosts: 5000,
      projectDuration: 24,
      discountRate: 15,
    },
    benchmarks: {
      grossMarginPct: 72,
      netMarginPct: 18,
      avgPaybackMonths: 20,
      revenueGrowthPct: 30,
      source: 'SaaStr / Bessemer 2024',
      note: 'CAC payback ~12 mo; churn <5%/yr is healthy',
    },
  },

  // E-commerce Store Template
  {
    id: 'ecommerce',
    icon: '🛒',
    nameKey: 'templates.ecommerce_name',
    descriptionKey: 'templates.ecommerce_description',
    category: 'retail',
    data: {
      initialInvestment: 30000,
      yearlyRevenue: 180000,
      monthlyCosts: 8000,
      projectDuration: 18,
      discountRate: 12,
    },
    benchmarks: {
      grossMarginPct: 42,
      netMarginPct: 8,
      avgPaybackMonths: 14,
      revenueGrowthPct: 20,
      source: 'Shopify / NRF 2024',
      note: 'COGS ~58%; avg cart $85; conversion 2–3%',
    },
  },

  // Manufacturing/Production Template
  {
    id: 'manufacturing',
    icon: '🏭',
    nameKey: 'templates.manufacturing_name',
    descriptionKey: 'templates.manufacturing_description',
    category: 'manufacturing',
    data: {
      initialInvestment: 200000,
      yearlyRevenue: 400000,
      monthlyCosts: 20000,
      projectDuration: 36,
      discountRate: 10,
    },
    benchmarks: {
      grossMarginPct: 38,
      netMarginPct: 9,
      avgPaybackMonths: 30,
      revenueGrowthPct: 7,
      source: 'Deloitte Manufacturing Report 2024',
      note: 'EBITDA margin ~14%; OEE target 85%',
    },
  },

  // Mobile App Template
  {
    id: 'mobile_app',
    icon: '📱',
    nameKey: 'templates.mobile_app_name',
    descriptionKey: 'templates.mobile_app_description',
    category: 'tech',
    data: {
      initialInvestment: 40000,
      yearlyRevenue: 90000,
      monthlyCosts: 3500,
      projectDuration: 18,
      discountRate: 18,
    },
    benchmarks: {
      grossMarginPct: 65,
      netMarginPct: 12,
      avgPaybackMonths: 16,
      revenueGrowthPct: 40,
      source: 'AppAnnie / Sensor Tower 2024',
      note: 'D30 retention ~25%; ARPU $3–8/mo for freemium',
    },
  },

  // Restaurant/Food Service Template
  {
    id: 'restaurant',
    icon: '🍽️',
    nameKey: 'templates.restaurant_name',
    descriptionKey: 'templates.restaurant_description',
    category: 'retail',
    data: {
      initialInvestment: 100000,
      yearlyRevenue: 300000,
      monthlyCosts: 18000,
      projectDuration: 24,
      discountRate: 14,
    },
    benchmarks: {
      grossMarginPct: 65,
      netMarginPct: 6,
      avgPaybackMonths: 24,
      revenueGrowthPct: 8,
      source: 'NRA Restaurant Industry Report 2024',
      note: 'Prime cost (COGS+labor) should stay under 60%',
    },
  },

  // Consulting/Services Template
  {
    id: 'consulting',
    icon: '💼',
    nameKey: 'templates.consulting_name',
    descriptionKey: 'templates.consulting_description',
    category: 'tech',
    data: {
      initialInvestment: 15000,
      yearlyRevenue: 150000,
      monthlyCosts: 6000,
      projectDuration: 12,
      discountRate: 8,
    },
    benchmarks: {
      grossMarginPct: 55,
      netMarginPct: 22,
      avgPaybackMonths: 8,
      revenueGrowthPct: 15,
      source: 'IBIS World Consulting 2024',
      note: 'Utilization rate target 70–75%; avg bill rate $150–250/hr',
    },
  },
];

/**
 * Get all available project templates
 */
export function getProjectTemplates(): ProjectTemplate[] {
  return PROJECT_TEMPLATES;
}

/**
 * Get a specific template by ID
 */
export function getTemplateById(id: string): ProjectTemplate | undefined {
  return PROJECT_TEMPLATES.find((template) => template.id === id);
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(
  category: ProjectTemplate['category']
): ProjectTemplate[] {
  return PROJECT_TEMPLATES.filter((template) => template.category === category);
}
