import type { ProjectData, FinancialCalculationResult } from '@/types/project';

interface AIInsightRequest {
  project: ProjectData;
  results: FinancialCalculationResult;
  language: 'es' | 'en';
  deviceId?: string; // Device identifier for usage tracking
}

interface AIInsightResponse {
  insights: string;
  timestamp: string;
}

/**
 * Generate AI-powered viability diagnosis using the project's built-in LLM
 */
export async function generateAIInsights(
  request: AIInsightRequest
): Promise<AIInsightResponse> {
  const { project, results, language, deviceId } = request;

  const prompt = buildPrompt(project, results, language);

  try {
    // Use the built-in server LLM endpoint
    const response = await fetch('/api/ai/insights', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        language,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `AI API error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      insights: data.insights,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error generating AI insights:', error);
    throw error;
  }
}

/**
 * Build the prompt for AI analysis
 */
function buildPrompt(
  project: ProjectData,
  results: FinancialCalculationResult,
  language: 'es' | 'en'
): string {
  const isViable = results.roi > 0 && results.npv > 0;
  const irrVsDiscount = results.irr - project.discountRate;

  if (language === 'es') {
    return `
Eres un consultor financiero experto. Analiza este business case y proporciona un diagnóstico profesional de viabilidad.

**Datos del Proyecto:**
- Nombre: ${project.name}
- Inversión Inicial: $${project.initialInvestment.toLocaleString()}
- Duración: ${project.projectDuration} meses
- Tasa de Descuento: ${project.discountRate}%

**Resultados Financieros:**
- ROI: ${results.roi.toFixed(2)}%
- VPN: $${results.npv.toLocaleString()}
- TIR: ${results.irr.toFixed(2)}%
- Período de Recuperación: ${results.paybackPeriod.toFixed(1)} meses

**Análisis Requerido:**
1. Evalúa la viabilidad general del proyecto (${isViable ? 'parece viable' : 'parece riesgoso'})
2. Analiza la TIR vs tasa de descuento (diferencia: ${irrVsDiscount.toFixed(2)}%)
3. Identifica los principales riesgos o fortalezas
4. Proporciona 2-3 recomendaciones accionables específicas

Responde en español, de forma concisa (máximo 200 palabras), profesional y directa. Enfócate en insights prácticos para la toma de decisiones.
    `.trim();
  } else {
    return `
You are an expert financial consultant. Analyze this business case and provide a professional viability diagnosis.

**Project Data:**
- Name: ${project.name}
- Initial Investment: $${project.initialInvestment.toLocaleString()}
- Duration: ${project.projectDuration} months
- Discount Rate: ${project.discountRate}%

**Financial Results:**
- ROI: ${results.roi.toFixed(2)}%
- NPV: $${results.npv.toLocaleString()}
- IRR: ${results.irr.toFixed(2)}%
- Payback Period: ${results.paybackPeriod.toFixed(1)} months

**Required Analysis:**
1. Evaluate the overall project viability (${isViable ? 'appears viable' : 'appears risky'})
2. Analyze IRR vs discount rate (difference: ${irrVsDiscount.toFixed(2)}%)
3. Identify key risks or strengths
4. Provide 2-3 specific actionable recommendations

Respond in English, concisely (max 200 words), professionally and directly. Focus on practical insights for decision-making.
    `.trim();
  }
}

/**
 * Generate a fallback insight when AI is not available
 */
export function generateFallbackInsight(
  project: ProjectData,
  results: FinancialCalculationResult,
  language: 'es' | 'en'
): string {
  const isViable = results.roi > 0 && results.npv > 0;
  const irrVsDiscount = results.irr - project.discountRate;

  if (language === 'es') {
    let insight = '';

    if (isViable) {
      insight += `✅ **Proyecto Viable**: El proyecto muestra métricas positivas con un ROI de ${results.roi.toFixed(1)}% y un VPN de ${results.npv.toLocaleString('es-ES', { style: 'currency', currency: 'USD' })}. `;
    } else {
      insight += `⚠️ **Proyecto Riesgoso**: El proyecto presenta métricas negativas que requieren atención. `;
    }

    if (irrVsDiscount > 0) {
      insight += `La TIR (${results.irr.toFixed(1)}%) supera la tasa de descuento por ${irrVsDiscount.toFixed(1)} puntos porcentuales, indicando rentabilidad superior al costo de capital. `;
    } else {
      insight += `La TIR (${results.irr.toFixed(1)}%) está por debajo de la tasa de descuento, lo que sugiere que el proyecto no genera suficiente retorno. `;
    }

    if (results.paybackPeriod < project.projectDuration / 2) {
      insight += `El período de recuperación de ${results.paybackPeriod.toFixed(1)} meses es favorable. `;
    } else {
      insight += `El período de recuperación de ${results.paybackPeriod.toFixed(1)} meses es considerable. `;
    }

    insight += '\n\n**Recomendaciones**: ';
    if (isViable) {
      insight += 'Proceder con el proyecto monitoreando los supuestos clave. Considerar análisis de sensibilidad para variables críticas.';
    } else {
      insight += 'Revisar los supuestos de ingresos y costos. Explorar alternativas para mejorar la rentabilidad antes de proceder.';
    }

    return insight;
  } else {
    let insight = '';

    if (isViable) {
      insight += `✅ **Viable Project**: The project shows positive metrics with an ROI of ${results.roi.toFixed(1)}% and an NPV of ${results.npv.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}. `;
    } else {
      insight += `⚠️ **Risky Project**: The project presents negative metrics that require attention. `;
    }

    if (irrVsDiscount > 0) {
      insight += `The IRR (${results.irr.toFixed(1)}%) exceeds the discount rate by ${irrVsDiscount.toFixed(1)} percentage points, indicating profitability above the cost of capital. `;
    } else {
      insight += `The IRR (${results.irr.toFixed(1)}%) is below the discount rate, suggesting the project doesn't generate sufficient returns. `;
    }

    if (results.paybackPeriod < project.projectDuration / 2) {
      insight += `The payback period of ${results.paybackPeriod.toFixed(1)} months is favorable. `;
    } else {
      insight += `The payback period of ${results.paybackPeriod.toFixed(1)} months is considerable. `;
    }

    insight += '\n\n**Recommendations**: ';
    if (isViable) {
      insight += 'Proceed with the project while monitoring key assumptions. Consider sensitivity analysis for critical variables.';
    } else {
      insight += 'Review revenue and cost assumptions. Explore alternatives to improve profitability before proceeding.';
    }

    return insight;
  }
}
