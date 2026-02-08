import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import { downloadWebFile } from './platform-utils';
import type { ProjectData } from '@/types/project';
import {
  calculateMultiVariableSensitivity,
  generateTornadoChartData,
  formatSensitivityValue,
  getVariableNameES,
  type SensitivityVariable,
  type TornadoChartData,
} from './sensitivity-calculator';
import { formatCurrency, formatPercentage } from './utils';

interface SensitivityPDFOptions {
  project: ProjectData;
  metric: 'npv' | 'roi';
  language: 'es' | 'en';
}

interface SensitivityRecommendation {
  variable: SensitivityVariable;
  variableName: string;
  impact: 'high' | 'medium' | 'low';
  risk: 'high' | 'medium' | 'low';
  recommendation: string;
}

/**
 * Generate sensitivity analysis recommendations
 */
function generateRecommendations(
  project: ProjectData,
  tornadoData: TornadoChartData[],
  language: 'es' | 'en'
): SensitivityRecommendation[] {
  const recommendations: SensitivityRecommendation[] = [];

  // Sort by impact (already sorted in tornadoData)
  const maxRange = tornadoData[0]?.range || 1;

  for (const item of tornadoData) {
    const impactRatio = item.range / maxRange;
    const impact = impactRatio > 0.7 ? 'high' : impactRatio > 0.4 ? 'medium' : 'low';

    // Determine risk based on negative impact
    const negativeImpactRatio = Math.abs(item.negativeImpact) / Math.abs(project.results?.npv || 1);
    const risk = negativeImpactRatio > 0.5 ? 'high' : negativeImpactRatio > 0.25 ? 'medium' : 'low';

    let recommendation = '';

    if (language === 'es') {
      if (item.variable === 'yearlyRevenue') {
        if (impact === 'high') {
          recommendation = 'Validar proyecciones de ingresos con datos de mercado. Considerar escenarios conservadores. Implementar estrategias de diversificación de ingresos.';
        } else {
          recommendation = 'Monitorear ingresos periódicamente. Mantener proyecciones realistas basadas en tendencias históricas.';
        }
      } else if (item.variable === 'operatingCosts') {
        if (impact === 'high') {
          recommendation = 'Establecer controles de costos operativos estrictos. Negociar contratos a largo plazo con proveedores. Implementar sistema de monitoreo de gastos.';
        } else {
          recommendation = 'Revisar costos operativos trimestralmente. Buscar oportunidades de optimización sin comprometer calidad.';
        }
      } else if (item.variable === 'initialInvestment') {
        if (impact === 'high') {
          recommendation = 'Solicitar cotizaciones detalladas. Incluir contingencia del 15-20%. Evaluar opciones de financiamiento para reducir impacto inicial.';
        } else {
          recommendation = 'Mantener presupuesto de inversión con margen de contingencia del 10%. Documentar todos los costos iniciales.';
        }
      } else if (item.variable === 'maintenanceCosts') {
        if (impact === 'high') {
          recommendation = 'Establecer contratos de mantenimiento preventivo. Crear fondo de reserva para mantenimiento. Evaluar opciones de garantías extendidas.';
        } else {
          recommendation = 'Programar mantenimiento preventivo regular. Monitorear costos de mantenimiento vs. proyecciones.';
        }
      }
    } else {
      // English recommendations
      if (item.variable === 'yearlyRevenue') {
        if (impact === 'high') {
          recommendation = 'Validate revenue projections with market data. Consider conservative scenarios. Implement revenue diversification strategies.';
        } else {
          recommendation = 'Monitor revenue periodically. Maintain realistic projections based on historical trends.';
        }
      } else if (item.variable === 'operatingCosts') {
        if (impact === 'high') {
          recommendation = 'Establish strict operating cost controls. Negotiate long-term contracts with suppliers. Implement expense monitoring system.';
        } else {
          recommendation = 'Review operating costs quarterly. Seek optimization opportunities without compromising quality.';
        }
      } else if (item.variable === 'initialInvestment') {
        if (impact === 'high') {
          recommendation = 'Request detailed quotes. Include 15-20% contingency. Evaluate financing options to reduce initial impact.';
        } else {
          recommendation = 'Maintain investment budget with 10% contingency margin. Document all initial costs.';
        }
      } else if (item.variable === 'maintenanceCosts') {
        if (impact === 'high') {
          recommendation = 'Establish preventive maintenance contracts. Create maintenance reserve fund. Evaluate extended warranty options.';
        } else {
          recommendation = 'Schedule regular preventive maintenance. Monitor maintenance costs vs. projections.';
        }
      }
    }

    recommendations.push({
      variable: item.variable,
      variableName: language === 'es' ? getVariableNameES(item.variable) : item.variableName,
      impact,
      risk,
      recommendation,
    });
  }

  return recommendations;
}

/**
 * Generate HTML for sensitivity analysis PDF
 */
function generateSensitivityHTML(
  project: ProjectData,
  metric: 'npv' | 'roi',
  language: 'es' | 'en'
): string {
  const variations = [-30, -20, -10, 0, 10, 20, 30];
  const results = calculateMultiVariableSensitivity(project, variations);
  const tornadoData = generateTornadoChartData(project);
  const recommendations = generateRecommendations(project, tornadoData, language);

  const variables: SensitivityVariable[] = [
    'initialInvestment',
    'yearlyRevenue',
    'operatingCosts',
    'maintenanceCosts',
  ];

  const getVariableLabel = (variable: SensitivityVariable): string => {
    return language === 'es' ? getVariableNameES(variable) : variable.replace(/([A-Z])/g, ' $1').trim();
  };

  const getValue = (variable: SensitivityVariable, variation: number): number => {
    const result = results[variable].find((r) => r.variation === variation);
    return result ? (metric === 'npv' ? result.npv : result.roi) : 0;
  };

  const baseValue = getValue('initialInvestment', 0);

  const getCellColor = (value: number): string => {
    const change = ((value - baseValue) / Math.abs(baseValue)) * 100;
    if (change > 10) return '#d4edda'; // Light green
    if (change < -10) return '#f8d7da'; // Light red
    return '#fff3cd'; // Light yellow
  };

  const getCellTextColor = (value: number): string => {
    const change = ((value - baseValue) / Math.abs(baseValue)) * 100;
    if (change > 10) return '#155724'; // Dark green
    if (change < -10) return '#721c24'; // Dark red
    return '#856404'; // Dark yellow
  };

  const t = (key: string): string => {
    const translations: Record<string, Record<string, string>> = {
      es: {
        title: 'Análisis de Sensibilidad',
        subtitle: `Proyecto: ${project.name}`,
        date: `Fecha: ${new Date().toLocaleDateString('es-ES')}`,
        description: 'Este análisis muestra cómo las variaciones en variables clave afectan las métricas financieras del proyecto.',
        matrix_title: `Matriz de Sensibilidad - ${metric === 'npv' ? 'NPV' : 'ROI'}`,
        tornado_title: 'Gráfico de Impacto (Tornado Chart)',
        recommendations_title: 'Recomendaciones de Gestión de Riesgos',
        variable: 'Variable',
        impact: 'Impacto',
        risk: 'Riesgo',
        recommendation: 'Recomendación',
        high: 'Alto',
        medium: 'Medio',
        low: 'Bajo',
        legend: 'Leyenda',
        positive: 'Positivo (>10%)',
        neutral: 'Neutral (±10%)',
        negative: 'Negativo (<-10%)',
        base_case: 'Caso Base',
        footer: 'Generado por Business Case Analyzer Pro',
      },
      en: {
        title: 'Sensitivity Analysis',
        subtitle: `Project: ${project.name}`,
        date: `Date: ${new Date().toLocaleDateString('en-US')}`,
        description: 'This analysis shows how variations in key variables affect the project\'s financial metrics.',
        matrix_title: `Sensitivity Matrix - ${metric === 'npv' ? 'NPV' : 'ROI'}`,
        tornado_title: 'Impact Chart (Tornado Chart)',
        recommendations_title: 'Risk Management Recommendations',
        variable: 'Variable',
        impact: 'Impact',
        risk: 'Risk',
        recommendation: 'Recommendation',
        high: 'High',
        medium: 'Medium',
        low: 'Low',
        legend: 'Legend',
        positive: 'Positive (>10%)',
        neutral: 'Neutral (±10%)',
        negative: 'Negative (<-10%)',
        base_case: 'Base Case',
        footer: 'Generated by Business Case Analyzer Pro',
      },
    };
    return translations[language][key] || key;
  };

  // Generate matrix table HTML
  let matrixHTML = `
    <table class="matrix-table">
      <thead>
        <tr>
          <th>${t('variable')}</th>
          ${variations.map(v => `<th class="${v === 0 ? 'base-case' : ''}">${v > 0 ? '+' : ''}${v}%</th>`).join('')}
        </tr>
      </thead>
      <tbody>
  `;

  for (const variable of variables) {
    matrixHTML += '<tr>';
    matrixHTML += `<td class="variable-name">${getVariableLabel(variable)}</td>`;

    for (const variation of variations) {
      const value = getValue(variable, variation);
      const bgColor = getCellColor(value);
      const textColor = getCellTextColor(value);
      const isBase = variation === 0;

      matrixHTML += `
        <td class="${isBase ? 'base-case' : ''}" style="background-color: ${bgColor}; color: ${textColor};">
          ${formatSensitivityValue(value, metric === 'npv' ? 'currency' : 'percentage')}
        </td>
      `;
    }

    matrixHTML += '</tr>';
  }

  matrixHTML += `
      </tbody>
    </table>
  `;

  // Generate tornado chart HTML (simplified bar chart)
  let tornadoHTML = '<div class="tornado-chart">';

  for (const item of tornadoData) {
    const maxAbs = Math.max(...tornadoData.map(d => Math.max(Math.abs(d.negativeImpact), Math.abs(d.positiveImpact))));
    const negativeWidth = (Math.abs(item.negativeImpact) / maxAbs) * 100;
    const positiveWidth = (Math.abs(item.positiveImpact) / maxAbs) * 100;

    tornadoHTML += `
      <div class="tornado-row">
        <div class="tornado-label">${getVariableLabel(item.variable)}</div>
        <div class="tornado-bars">
          <div class="tornado-negative" style="width: ${negativeWidth}%;">
            <span>${formatCurrency(item.negativeImpact)}</span>
          </div>
          <div class="tornado-center"></div>
          <div class="tornado-positive" style="width: ${positiveWidth}%;">
            <span>${formatCurrency(item.positiveImpact)}</span>
          </div>
        </div>
      </div>
    `;
  }

  tornadoHTML += '</div>';

  // Generate recommendations HTML
  let recommendationsHTML = '<div class="recommendations">';

  for (const rec of recommendations) {
    const impactBadge = `<span class="badge badge-${rec.impact}">${t(rec.impact)}</span>`;
    const riskBadge = `<span class="badge badge-${rec.risk}">${t(rec.risk)}</span>`;

    recommendationsHTML += `
      <div class="recommendation-card">
        <h4>${rec.variableName}</h4>
        <div class="badges">
          <div><strong>${t('impact')}:</strong> ${impactBadge}</div>
          <div><strong>${t('risk')}:</strong> ${riskBadge}</div>
        </div>
        <p>${rec.recommendation}</p>
      </div>
    `;
  }

  recommendationsHTML += '</div>';

  // Complete HTML document
  return `
<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${t('title')} - ${project.name}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      padding: 40px;
      background: #fff;
    }
    
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 3px solid #0a7ea4;
    }
    
    h1 {
      font-size: 32px;
      color: #0a7ea4;
      margin-bottom: 10px;
    }
    
    h2 {
      font-size: 24px;
      color: #333;
      margin: 30px 0 15px;
    }
    
    h3 {
      font-size: 18px;
      color: #555;
      margin: 20px 0 10px;
    }
    
    .subtitle {
      font-size: 18px;
      color: #666;
      margin-bottom: 5px;
    }
    
    .date {
      font-size: 14px;
      color: #999;
    }
    
    .description {
      background: #f5f5f5;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 30px;
      font-size: 14px;
    }
    
    .matrix-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 12px;
    }
    
    .matrix-table th,
    .matrix-table td {
      border: 1px solid #ddd;
      padding: 10px;
      text-align: center;
    }
    
    .matrix-table th {
      background: #0a7ea4;
      color: white;
      font-weight: 600;
    }
    
    .matrix-table th.base-case {
      background: #0a7ea4;
    }
    
    .matrix-table td.base-case {
      border: 2px solid #0a7ea4;
      font-weight: 700;
    }
    
    .matrix-table .variable-name {
      text-align: left;
      font-weight: 600;
      background: #f9f9f9;
    }
    
    .legend {
      display: flex;
      justify-content: center;
      gap: 30px;
      margin: 20px 0;
      font-size: 12px;
    }
    
    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .legend-box {
      width: 20px;
      height: 20px;
      border-radius: 4px;
      border: 1px solid #ddd;
    }
    
    .tornado-chart {
      margin: 20px 0;
    }
    
    .tornado-row {
      margin-bottom: 20px;
    }
    
    .tornado-label {
      font-weight: 600;
      margin-bottom: 5px;
      font-size: 14px;
    }
    
    .tornado-bars {
      display: flex;
      align-items: center;
      height: 40px;
    }
    
    .tornado-negative,
    .tornado-positive {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      color: white;
      font-weight: 600;
    }
    
    .tornado-negative {
      background: #ef4444;
      opacity: 0.7;
      justify-content: flex-end;
      padding-right: 10px;
    }
    
    .tornado-positive {
      background: #22c55e;
      justify-content: flex-start;
      padding-left: 10px;
    }
    
    .tornado-center {
      width: 2px;
      height: 100%;
      background: #333;
    }
    
    .recommendations {
      margin: 20px 0;
    }
    
    .recommendation-card {
      background: #f9f9f9;
      border-left: 4px solid #0a7ea4;
      padding: 15px;
      margin-bottom: 15px;
      border-radius: 4px;
    }
    
    .recommendation-card h4 {
      color: #0a7ea4;
      margin-bottom: 10px;
      font-size: 16px;
    }
    
    .badges {
      display: flex;
      gap: 20px;
      margin-bottom: 10px;
      font-size: 13px;
    }
    
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }
    
    .badge-high {
      background: #fee2e2;
      color: #991b1b;
    }
    
    .badge-medium {
      background: #fef3c7;
      color: #92400e;
    }
    
    .badge-low {
      background: #d1fae5;
      color: #065f46;
    }
    
    .recommendation-card p {
      font-size: 13px;
      line-height: 1.6;
      color: #555;
    }
    
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      font-size: 12px;
      color: #999;
    }
    
    @media print {
      body {
        padding: 20px;
      }
      
      .recommendation-card {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>${t('title')}</h1>
    <div class="subtitle">${t('subtitle')}</div>
    <div class="date">${t('date')}</div>
  </div>
  
  <div class="description">
    ${t('description')}
  </div>
  
  <h2>${t('matrix_title')}</h2>
  ${matrixHTML}
  
  <div class="legend">
    <div class="legend-item">
      <div class="legend-box" style="background: #d4edda;"></div>
      <span>${t('positive')}</span>
    </div>
    <div class="legend-item">
      <div class="legend-box" style="background: #fff3cd;"></div>
      <span>${t('neutral')}</span>
    </div>
    <div class="legend-item">
      <div class="legend-box" style="background: #f8d7da;"></div>
      <span>${t('negative')}</span>
    </div>
  </div>
  
  <h2>${t('tornado_title')}</h2>
  ${tornadoHTML}
  
  <h2>${t('recommendations_title')}</h2>
  ${recommendationsHTML}
  
  <div class="footer">
    ${t('footer')}
  </div>
</body>
</html>
  `;
}

/**
 * Generate sensitivity analysis PDF report
 */
export async function generateSensitivityPDF(
  options: SensitivityPDFOptions
): Promise<string> {
  const { project, metric, language } = options;

  const html = generateSensitivityHTML(project, metric, language);

  const fileName = `sensitivity-analysis-${project.name.replace(/\s+/g, '-')}-${Date.now()}.html`;
  const filePath = `${FileSystem.documentDirectory ?? ''}${fileName}`;

  await FileSystem.writeAsStringAsync(filePath, html);

  return filePath;
}

/**
 * Share sensitivity analysis PDF
 */
export async function shareSensitivityPDF(
  filePath: string,
  project: ProjectData,
  metric: 'npv' | 'roi',
  language: 'es' | 'en'
): Promise<void> {
  if (Platform.OS === 'web') {
    const html = generateSensitivityHTML(project, metric, language);
    const fileName = `sensitivity-analysis-${project.name.replace(/\s+/g, '-')}.html`;
    downloadWebFile(html, fileName);
    return;
  }

  const isAvailable = await Sharing.isAvailableAsync();

  if (isAvailable) {
    await Sharing.shareAsync(filePath, {
      mimeType: 'text/html',
      dialogTitle: 'Share Sensitivity Analysis',
    });
  } else {
    throw new Error('Sharing is not available on this platform');
  }
}
