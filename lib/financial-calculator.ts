import type { FinancialCalculationInput, FinancialCalculationResult } from '@/types/project';
import { StandardMetricsCalculator } from '@/lib/infrastructure/calculators/StandardMetricsCalculator';

/**
 * Calculate financial metrics for a business case
 * 
 * @deprecated Use CalculationService.calculateStandard() or CalculateFinancialMetrics use case instead.
 * This function is kept for backward compatibility. 
 * The new modular architecture provides better separation of concerns, XAI context, 
 * and supports additional metric categories (Vanguard, SaaS, Risk).
 * 
 * Migration example:
 * ```typescript
 * // Old way (still works):
 * const results = calculateFinancialMetrics(input);
 * 
 * // New way (recommended):
 * import { CalculationService } from '@/lib/application/services/CalculationService';
 * const service = new CalculationService();
 * const results = await service.calculateStandard(input);
 * 
 * // Or use the full use case with XAI enrichment:
 * import { CalculateFinancialMetrics } from '@/lib/application/use-cases/CalculateFinancialMetrics';
 * const useCase = new CalculateFinancialMetrics();
 * const enrichedResults = await useCase.execute(projectData);
 * ```
 * 
 * @see CalculationService
 * @see CalculateFinancialMetrics
 */
export function calculateFinancialMetrics(
  input: FinancialCalculationInput
): FinancialCalculationResult {
  // Use new modular calculator for actual calculation
  const calculator = new StandardMetricsCalculator();
  return calculator.calculate(input);
}

// Note: The internal calculation functions below are kept for reference but are no longer used.
// They have been moved to StandardMetricsCalculator for better modularity.

/**
 * Calculate Net Present Value (NPV)
 * @deprecated Internal function - use StandardMetricsCalculator instead
 */
function calculateNPV(
  initialInvestment: number,
  cashFlows: number[],
  discountRate: number
): number {
  let npv = -initialInvestment;
  
  for (let month = 0; month < cashFlows.length; month++) {
    const periodRate = discountRate / 12;
    const discountFactor = Math.pow(1 + periodRate, month + 1);
    npv += cashFlows[month] / discountFactor;
  }
  
  return npv;
}

/**
 * Calculate Payback Period (in months)
 */
function calculatePaybackPeriod(
  initialInvestment: number,
  cashFlows: number[]
): number {
  let cumulative = -initialInvestment;
  
  for (let month = 0; month < cashFlows.length; month++) {
    cumulative += cashFlows[month];
    
    if (cumulative >= 0) {
      // Linear interpolation for more accurate payback period
      const previousCumulative = cumulative - cashFlows[month];
      const fraction = -previousCumulative / cashFlows[month];
      return month + fraction;
    }
  }
  
  // If payback is not achieved within project duration
  return cashFlows.length;
}

/**
 * Calculate Internal Rate of Return (IRR) using Newton-Raphson method
 */
function calculateIRR(
  initialInvestment: number,
  cashFlows: number[],
  maxIterations: number = 100,
  tolerance: number = 0.0001
): number {
  // Initial guess for IRR (10% annual rate)
  let rate = 0.10 / 12; // Monthly rate
  
  for (let iteration = 0; iteration < maxIterations; iteration++) {
    let npv = -initialInvestment;
    let derivative = 0;
    
    // Calculate NPV and its derivative at current rate
    for (let month = 0; month < cashFlows.length; month++) {
      const period = month + 1;
      const discountFactor = Math.pow(1 + rate, period);
      
      npv += cashFlows[month] / discountFactor;
      derivative -= (period * cashFlows[month]) / Math.pow(1 + rate, period + 1);
    }
    
    // Check for convergence
    if (Math.abs(npv) < tolerance) {
      // Convert monthly rate to annual percentage
      return ((Math.pow(1 + rate, 12) - 1) * 100);
    }
    
    // Newton-Raphson iteration
    if (Math.abs(derivative) < 1e-10) {
      // Avoid division by zero
      break;
    }
    
    rate = rate - npv / derivative;
    
    // Ensure rate stays within reasonable bounds
    if (rate < -0.99 || rate > 10) {
      rate = 0.10 / 12; // Reset to initial guess
      break;
    }
  }
  
  // If convergence failed, return a default value
  // Convert monthly rate to annual percentage
  return ((Math.pow(1 + rate, 12) - 1) * 100);
}

/**
 * Calculate metrics for all three scenarios (expected, best, worst)
 * 
 * @deprecated Use CalculationService with scenario multipliers instead.
 * Kept for backward compatibility.
 */
export function calculateAllScenarios(input: FinancialCalculationInput) {
  const expected = calculateFinancialMetrics({ ...input, multiplier: 1.0 });
  const best = calculateFinancialMetrics({ 
    ...input, 
    multiplier: input.multiplier || 1.3 
  });
  const worst = calculateFinancialMetrics({ 
    ...input, 
    multiplier: input.multiplier || 0.7 
  });

  return {
    expected,
    best,
    worst,
  };
}

/**
 * Calculate scenario with adjustments (for comparison feature)
 * 
 * @deprecated Use CalculationService with adjusted inputs instead.
 * Kept for backward compatibility.
 */
export function calculateScenarioWithAdjustments(
  baseInput: FinancialCalculationInput,
  salesAdjustment: number, // percentage: -50 to +50
  costsAdjustment: number, // percentage: -50 to +50
  discountAdjustment: number // absolute: -5 to +5
): FinancialCalculationResult {
  const adjustedInput: FinancialCalculationInput = {
    ...baseInput,
    yearlyRevenue: baseInput.yearlyRevenue * (1 + salesAdjustment / 100),
    operatingCosts: baseInput.operatingCosts * (1 + costsAdjustment / 100),
    maintenanceCosts: baseInput.maintenanceCosts * (1 + costsAdjustment / 100),
    discountRate: baseInput.discountRate + discountAdjustment,
  };

  return calculateFinancialMetrics(adjustedInput);
}

/**
 * Format currency for display
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format percentage for display
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format months for display
 */
export function formatMonths(months: number): string {
  if (months < 12) {
    return `${months.toFixed(1)} months`;
  }
  const years = months / 12;
  return `${years.toFixed(1)} years`;
}
