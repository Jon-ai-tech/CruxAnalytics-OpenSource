import { saveProject } from '@/lib/project-storage';
import { calculateFinancialMetrics } from '@/lib/financial-calculator';
import type { ProjectData } from '@/types/project';

const DEMO_PREFIX = 'demo-';

function makeDemoId(slug: string): string {
  return `${DEMO_PREFIX}${slug}-${Date.now()}`;
}

function buildDemoProject(overrides: Partial<ProjectData> & {
  id: string;
  name: string;
  description: string;
  initialInvestment: number;
  yearlyRevenue: number;
  operatingCosts: number;
  maintenanceCosts: number;
  projectDuration: number;
  discountRate: number;
  revenueGrowth: number;
}): ProjectData {
  const results = calculateFinancialMetrics({
    initialInvestment: overrides.initialInvestment,
    yearlyRevenue: overrides.yearlyRevenue,
    operatingCosts: overrides.operatingCosts,
    maintenanceCosts: overrides.maintenanceCosts,
    projectDuration: overrides.projectDuration,
    discountRate: overrides.discountRate,
    revenueGrowth: overrides.revenueGrowth,
    multiplier: 1,
  });

  return {
    id: overrides.id,
    name: overrides.name,
    description: overrides.description,
    initialInvestment: overrides.initialInvestment,
    yearlyRevenue: overrides.yearlyRevenue,
    operatingCosts: overrides.operatingCosts,
    maintenanceCosts: overrides.maintenanceCosts,
    projectDuration: overrides.projectDuration,
    discountRate: overrides.discountRate,
    revenueGrowth: overrides.revenueGrowth,
    bestCaseMultiplier: 1.3,
    worstCaseMultiplier: 0.7,
    businessModel: overrides.businessModel ?? 'standard',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    results: {
      roi: results.roi,
      npv: results.npv,
      irr: results.irr,
      paybackPeriod: results.paybackPeriod,
      monthlyCashFlow: results.monthlyCashFlow,
      cumulativeCashFlow: results.cumulativeCashFlow,
      roiBest: results.roi * 1.3,
      npvBest: results.npv * 1.3,
      paybackBest: results.paybackPeriod * 0.8,
      irrBest: results.irr * 1.2,
      roiWorst: results.roi * 0.7,
      npvWorst: results.npv * 0.7,
      paybackWorst: results.paybackPeriod * 1.3,
      irrWorst: results.irr * 0.8,
    },
  };
}

const DEMO_PROJECTS_ES: Partial<ProjectData>[] = [
  {
    name: '📱 App SaaS – Analítica de Ventas',
    description:
      'Plataforma SaaS B2B que ayuda a medianas empresas a visualizar sus datos de ventas en tiempo real. Modelo de suscripción mensual con plan básico ($49/mes) y profesional ($149/mes).',
    initialInvestment: 55000,
    yearlyRevenue: 130000,
    operatingCosts: 48000,
    maintenanceCosts: 12000,
    projectDuration: 24,
    discountRate: 15,
    revenueGrowth: 8,
    businessModel: 'saas',
  },
  {
    name: '🛒 Tienda Online – Moda Sustentable',
    description:
      'E-commerce de ropa ecológica con enfoque en Latinoamérica. Inventario inicial de 200 productos, dropshipping para colecciones estacionales, y tienda física planeada en Año 2.',
    initialInvestment: 28000,
    yearlyRevenue: 192000,
    operatingCosts: 96000,
    maintenanceCosts: 18000,
    projectDuration: 18,
    discountRate: 12,
    revenueGrowth: 10,
    businessModel: 'ecommerce',
  },
  {
    name: '🏭 Producción – Panadería Industrial',
    description:
      'Planta de panadería artesanal para distribución a supermercados y restaurantes. Capacidad de 2.000 kg/día. Incluye equipos, certificaciones sanitarias y contrato ancla con cadena local.',
    initialInvestment: 180000,
    yearlyRevenue: 360000,
    operatingCosts: 192000,
    maintenanceCosts: 24000,
    projectDuration: 36,
    discountRate: 10,
    revenueGrowth: 5,
    businessModel: 'manufacturing',
  },
];

const DEMO_PROJECTS_EN: Partial<ProjectData>[] = [
  {
    name: '📱 SaaS App – Sales Analytics',
    description:
      'B2B SaaS platform that helps mid-size companies visualize their sales data in real time. Subscription model with basic ($49/mo) and professional ($149/mo) tiers.',
    initialInvestment: 55000,
    yearlyRevenue: 130000,
    operatingCosts: 48000,
    maintenanceCosts: 12000,
    projectDuration: 24,
    discountRate: 15,
    revenueGrowth: 8,
    businessModel: 'saas',
  },
  {
    name: '🛒 Online Store – Sustainable Fashion',
    description:
      'Eco-friendly clothing e-commerce focused on Latin America. Initial inventory of 200 products, dropshipping for seasonal collections, and a physical store planned for Year 2.',
    initialInvestment: 28000,
    yearlyRevenue: 192000,
    operatingCosts: 96000,
    maintenanceCosts: 18000,
    projectDuration: 18,
    discountRate: 12,
    revenueGrowth: 10,
    businessModel: 'ecommerce',
  },
  {
    name: '🏭 Manufacturing – Artisan Bakery',
    description:
      'Industrial artisan bakery supplying supermarkets and restaurants. Capacity of 2,000 kg/day. Includes equipment, health certifications, and an anchor contract with a local chain.',
    initialInvestment: 180000,
    yearlyRevenue: 360000,
    operatingCosts: 192000,
    maintenanceCosts: 24000,
    projectDuration: 36,
    discountRate: 10,
    revenueGrowth: 5,
    businessModel: 'manufacturing',
  },
];

/**
 * Creates and saves 3 realistic demo projects to local storage.
 * Returns the number of projects created.
 */
export async function loadDemoProjects(language: 'es' | 'en' = 'es'): Promise<number> {
  const templates = language === 'es' ? DEMO_PROJECTS_ES : DEMO_PROJECTS_EN;
  const slugs = ['saas', 'ecommerce', 'bakery'];

  for (let i = 0; i < templates.length; i++) {
    const tpl = templates[i];
    const id = makeDemoId(slugs[i]);
    const project = buildDemoProject({
      id,
      name: tpl.name!,
      description: tpl.description!,
      initialInvestment: tpl.initialInvestment!,
      yearlyRevenue: tpl.yearlyRevenue!,
      operatingCosts: tpl.operatingCosts!,
      maintenanceCosts: tpl.maintenanceCosts!,
      projectDuration: tpl.projectDuration!,
      discountRate: tpl.discountRate!,
      revenueGrowth: tpl.revenueGrowth!,
      businessModel: tpl.businessModel as any,
    });
    await saveProject(project);
  }

  return templates.length;
}
