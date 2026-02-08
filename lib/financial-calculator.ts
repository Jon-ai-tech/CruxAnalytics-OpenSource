/**
 * @deprecated This file contains legacy financial calculation functions.
 * Use the new modular architecture instead:
 * 
 * - CalculationService: @/lib/application/services/CalculationService
 * - CalculateFinancialMetrics use case: @/lib/application/use-cases/CalculateFinancialMetrics
 * 
 * This file is kept for backward compatibility and will be removed in a future version.
 */

import { StandardMetricsCalculator } from '@/lib/infrastructure/calculators/StandardMetricsCalculator';
import type { FinancialCalculationInput, FinancialCalculationResult } from '@/types/project';

const calculator = new StandardMetricsCalculator();

/**
 * @deprecated Use CalculationService.calculateStandard() instead
 */
export function calculateFinancialMetrics(params: FinancialCalculationInput): FinancialCalculationResult {
  return calculator.calculate(params);
}

/**
 * @deprecated Use CalculationService.calculateStandard() instead
 */
export function calculateFinancialMetricsAsync(params: FinancialCalculationInput): Promise<FinancialCalculationResult> {
  return Promise.resolve(calculator.calculate(params));
}

// Re-export types for compatibility
export type { FinancialCalculationInput, FinancialCalculationResult };

// Export formatters from utils for centralized management
export { formatCurrency, formatPercentage, formatMonths } from './utils';
