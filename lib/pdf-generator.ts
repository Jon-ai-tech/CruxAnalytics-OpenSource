import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import type { ProjectData } from '@/types/project';
import { formatCurrency, formatPercentage, formatMonths } from './utils';
import { calculateBreakEven } from './break-even-calculator';
import { downloadWebFile } from './platform-utils';

interface PDFGenerationOptions {
  project: ProjectData;
  chartImages?: {
    cashflow?: string;
    roi?: string;
    scenarios?: string;
  };
  language: 'es' | 'en';
}

/**
 * Generate a professional PDF report for a business case
 */
export async function generatePDFReport(options: PDFGenerationOptions): Promise<string> {
  const { project, chartImages, language } = options;

  const html = generateHTMLReport(project, chartImages, language);

  // For React Native, we'll use a simpler approach with HTML
  // In production, you would use react-native-html-to-pdf or similar

  const fileName = `business-case-${project.name.replace(/\s+/g, '-')}-${Date.now()}.html`;
  const filePath = `${FileSystem.documentDirectory}${fileName}`;

  await FileSystem.writeAsStringAsync(filePath, html, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  return filePath;
}

/**
 * Share the generated PDF report
 */
export async function sharePDFReport(filePath: string, project: ProjectData, language: 'es' | 'en'): Promise<void> {
  if (Platform.OS === 'web') {
    const html = generateHTMLReport(project, {}, language);
    const fileName = `business-case-${project.name.replace(/\s+/g, '-')}.html`;
    downloadWebFile(html, fileName);
    return;
  }

  const isAvailable = await Sharing.isAvailableAsync();

  if (isAvailable) {
    await Sharing.shareAsync(filePath, {
      mimeType: 'text/html',
      dialogTitle: 'Share Business Case Report',
    });
  } else {
    throw new Error('Sharing is not available on this platform');
  }
}

/**
 * Generate HTML content for the PDF report
 */
function generateHTMLReport(
  project: ProjectData,
  chartImages: PDFGenerationOptions['chartImages'],
  language: 'es' | 'en'
): string {
  const t = language === 'es' ? getSpanishTranslations() : getEnglishTranslations();

  if (!project.results) {
    throw new Error('Project results are required to generate a report');
  }

  const { results } = project;
  const generatedDate = new Date().toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `
<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t.title} - ${project.name}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      background: #ffffff;
      padding: 40px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .header {
      border-bottom: 4px solid #2563EB;
      padding-bottom: 30px;
      margin-bottom: 40px;
    }
    
    .header h1 {
      font-size: 32px;
      color: #1a1a1a;
      margin-bottom: 8px;
    }
    
    .header .subtitle {
      font-size: 18px;
      color: #687076;
    }
    
    .validated-badge {
      display: inline-block;
      background: #2563EB;
      color: white;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      margin-top: 16px;
    }
    
    .section {
      margin-bottom: 40px;
    }
    
    .section-title {
      font-size: 24px;
      color: #1a1a1a;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid #e5e7eb;
    }
    
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-bottom: 30px;
    }
    
    .metric-card {
      background: #f8f9fa;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 20px;
    }
    
    .metric-label {
      font-size: 14px;
      color: #687076;
      margin-bottom: 8px;
    }
    
    .metric-value {
      font-size: 28px;
      font-weight: bold;
      color: #1a1a1a;
    }
    
    .metric-value.positive {
      color: #059669;
    }
    
    .metric-value.negative {
      color: #ef4444;
    }
    
    .metric-subtitle {
      font-size: 12px;
      color: #687076;
      margin-top: 4px;
    }
    
    .chart-container {
      background: #f8f9fa;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
      text-align: center;
    }
    
    .chart-container img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
    }
    
    .chart-placeholder {
      padding: 60px 20px;
      color: #687076;
      font-style: italic;
    }
    
    .project-info {
      background: #f8f9fa;
      border-left: 4px solid #2563EB;
      padding: 20px;
      margin-bottom: 30px;
      border-radius: 8px;
    }
    
    .project-info-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .project-info-row:last-child {
      border-bottom: none;
    }
    
    .project-info-label {
      font-weight: 600;
      color: #1a1a1a;
    }
    
    .project-info-value {
      color: #687076;
    }
    
    .footer {
      margin-top: 60px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      color: #687076;
      font-size: 12px;
    }
    
    @media print {
      body {
        padding: 20px;
      }
      
      .section {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${t.title}</h1>
    <div class="subtitle">${t.subtitle}</div>
    <div class="subtitle">${project.name}</div>
    <div class="validated-badge">${t.validated_by}</div>
  </div>

  <div class="section">
    <h2 class="section-title">${t.executive_summary}</h2>
    <div class="project-info">
      <div class="project-info-row">
        <span class="project-info-label">${t.project_name}:</span>
        <span class="project-info-value">${project.name}</span>
      </div>
      <div class="project-info-row">
        <span class="project-info-label">${t.initial_investment}:</span>
        <span class="project-info-value">${formatCurrency(project.initialInvestment)}</span>
      </div>
      <div class="project-info-row">
        <span class="project-info-label">${t.project_duration}:</span>
        <span class="project-info-value">${project.projectDuration} ${t.months}</span>
      </div>
      <div class="project-info-row">
        <span class="project-info-label">${t.discount_rate}:</span>
        <span class="project-info-value">${project.discountRate}%</span>
      </div>
    </div>
  </div>

  <div class="section">
    <h2 class="section-title">${t.financial_metrics}</h2>
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-label">${t.roi_full}</div>
        <div class="metric-value ${results.roi > 0 ? 'positive' : 'negative'}">
          ${formatPercentage(results.roi)}
        </div>
        <div class="metric-subtitle">
          ${results.roi > 0 ? t.positive_return : t.negative_return}
        </div>
      </div>
      
      <div class="metric-card">
        <div class="metric-label">${t.npv_full}</div>
        <div class="metric-value ${results.npv > 0 ? 'positive' : 'negative'}">
          ${formatCurrency(results.npv)}
        </div>
        <div class="metric-subtitle">
          ${results.npv > 0 ? t.creates_value : t.destroys_value}
        </div>
      </div>
      
      <div class="metric-card">
        <div class="metric-label">${t.payback_full}</div>
        <div class="metric-value">
          ${formatMonths(results.paybackPeriod)}
        </div>
        <div class="metric-subtitle">${t.recovery_period}</div>
      </div>
      
      <div class="metric-card">
        <div class="metric-label">${t.irr_full}</div>
        <div class="metric-value ${results.irr > project.discountRate ? 'positive' : 'negative'}">
          ${formatPercentage(results.irr)}
        </div>
        <div class="metric-subtitle">${t.annualized_return}</div>
      </div>
    </div>
  </div>

  ${chartImages?.cashflow ? `
  <div class="section">
    <h2 class="section-title">${t.cashflow_analysis}</h2>
    <div class="chart-container">
      <img src="${chartImages.cashflow}" alt="Cash Flow Chart" />
    </div>
  </div>
  ` : ''}

  ${chartImages?.scenarios ? `
  <div class="section">
    <h2 class="section-title">${t.scenario_analysis}</h2>
    <div class="chart-container">
      <img src="${chartImages.scenarios}" alt="Scenario Analysis Chart" />
    </div>
  </div>
  ` : ''}

  <div class="section">
    <h2 class="section-title">${t.breakeven_analysis}</h2>
    ${generateBreakEvenSection(project, t)}
  </div>

  ${results.aiInsights ? `
  <div class="section">
    <h2 class="section-title">${t.recommendations}</h2>
    <div class="project-info">
      <p style="line-height: 1.8; color: #1a1a1a;">${results.aiInsights}</p>
    </div>
  </div>
  ` : ''}

  <div class="footer">
    <p>${t.generated_on}: ${generatedDate}</p>
    <p style="margin-top: 8px;">${t.validated_by}</p>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Generate break-even section HTML
 */
function generateBreakEvenSection(project: ProjectData, t: ReturnType<typeof getSpanishTranslations>): string {
  const breakEvenData = calculateBreakEven(project);

  if (!breakEvenData.breakEvenPoint.achieved) {
    return `
      <div class="project-info">
        <div class="metric-card">
          <div class="metric-label">${t.breakeven_month}</div>
          <div class="metric-value negative">N/A</div>
          <div class="metric-subtitle">${t.breakeven_never}</div>
        </div>
      </div>
      <div class="project-info" style="margin-top: 20px;">
        <p style="line-height: 1.8; color: #1a1a1a;"><strong>${t.breakeven_interpretation}:</strong> ${t.breakeven_never}</p>
      </div>
    `;
  }

  const monthLabel = `${t.months.charAt(0).toUpperCase() + t.months.slice(1)} ${breakEvenData.breakEvenPoint.month}`;
  const thirdOfPeriod = project.projectDuration / 3;

  let interpretation = '';
  if (breakEvenData.breakEvenPoint.month <= thirdOfPeriod) {
    interpretation = t.breakeven_early;
  } else if (breakEvenData.breakEvenPoint.month <= thirdOfPeriod * 2) {
    interpretation = t.breakeven_mid;
  } else {
    interpretation = t.breakeven_late;
  }

  return `
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-label">${t.breakeven_month}</div>
        <div class="metric-value positive">${monthLabel}</div>
        <div class="metric-subtitle">${Math.round((breakEvenData.breakEvenPoint.month / project.projectDuration) * 100)}% ${t.project_duration.toLowerCase()}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">${t.breakeven_amount}</div>
        <div class="metric-value">${formatCurrency(breakEvenData.breakEvenPoint.amount)}</div>
        <div class="metric-subtitle">${t.recovery_period}</div>
      </div>
    </div>
    <div class="project-info">
      <p style="line-height: 1.8; color: #1a1a1a;"><strong>${t.breakeven_interpretation}:</strong> ${interpretation}</p>
    </div>
  `;
}

function getSpanishTranslations() {
  return {
    title: 'Reporte Ejecutivo',
    subtitle: 'Análisis de Business Case',
    validated_by: 'Validado por Business Case Analyzer Pro',
    executive_summary: 'Resumen Ejecutivo',
    financial_metrics: 'Métricas Financieras',
    scenario_analysis: 'Análisis de Escenarios',
    recommendations: 'Recomendaciones',
    cashflow_analysis: 'Análisis de Flujo de Caja',
    breakeven_analysis: 'Análisis de Punto de Equilibrio',
    breakeven_month: 'Mes de Equilibrio',
    breakeven_amount: 'Monto en Equilibrio',
    breakeven_interpretation: 'Interpretación',
    breakeven_early: 'El proyecto alcanza el punto de equilibrio temprano (primeros 33% del periodo), lo que indica una rápida recuperación de la inversión y bajo riesgo financiero.',
    breakeven_mid: 'El proyecto alcanza el punto de equilibrio en la mitad del periodo, lo que es típico para proyectos de riesgo moderado. Se recomienda monitorear el flujo de caja cuidadosamente.',
    breakeven_late: 'El proyecto alcanza el punto de equilibrio tarde (últimos 33% del periodo), lo que indica alto riesgo financiero. Se recomienda asegurar capital de trabajo suficiente y revisar supuestos de ingresos.',
    breakeven_never: 'El proyecto no alcanza el punto de equilibrio en el periodo proyectado. Se recomienda revisar el modelo de negocio, reducir costos o extender el periodo de análisis.',
    generated_on: 'Generado el',
    project_name: 'Proyecto',
    initial_investment: 'Inversión Inicial',
    project_duration: 'Duración',
    discount_rate: 'Tasa de Descuento',
    months: 'meses',
    roi_full: 'Retorno de Inversión (ROI)',
    npv_full: 'Valor Presente Neto (VPN)',
    payback_full: 'Período de Recuperación',
    irr_full: 'Tasa Interna de Retorno (TIR)',
    positive_return: 'Retorno positivo',
    negative_return: 'Retorno negativo',
    creates_value: 'Genera valor',
    destroys_value: 'Destruye valor',
    recovery_period: 'Tiempo de recuperación',
    annualized_return: 'Tasa de retorno anualizada',
  };
}

function getEnglishTranslations() {
  return {
    title: 'Executive Report',
    subtitle: 'Business Case Analysis',
    validated_by: 'Validated by Business Case Analyzer Pro',
    executive_summary: 'Executive Summary',
    financial_metrics: 'Financial Metrics',
    scenario_analysis: 'Scenario Analysis',
    recommendations: 'Recommendations',
    cashflow_analysis: 'Cash Flow Analysis',
    breakeven_analysis: 'Break-Even Analysis',
    breakeven_month: 'Break-Even Month',
    breakeven_amount: 'Break-Even Amount',
    breakeven_interpretation: 'Interpretation',
    breakeven_early: 'The project reaches break-even early (first 33% of the period), indicating rapid investment recovery and low financial risk.',
    breakeven_mid: 'The project reaches break-even mid-period, which is typical for moderate-risk projects. Careful cash flow monitoring is recommended.',
    breakeven_late: 'The project reaches break-even late (last 33% of the period), indicating high financial risk. Ensure sufficient working capital and review revenue assumptions.',
    breakeven_never: 'The project does not reach break-even within the projected period. Consider revising the business model, reducing costs, or extending the analysis period.',
    generated_on: 'Generated on',
    project_name: 'Project',
    initial_investment: 'Initial Investment',
    project_duration: 'Duration',
    discount_rate: 'Discount Rate',
    months: 'months',
    roi_full: 'Return on Investment (ROI)',
    npv_full: 'Net Present Value (NPV)',
    payback_full: 'Payback Period',
    irr_full: 'Internal Rate of Return (IRR)',
    positive_return: 'Positive return',
    negative_return: 'Negative return',
    creates_value: 'Creates value',
    destroys_value: 'Destroys value',
    recovery_period: 'Recovery period',
    annualized_return: 'Annualized return rate',
  };
}
