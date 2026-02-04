/**
 * @fileoverview Web Worker for heavy financial calculations
 * Offloads computation-intensive tasks to prevent UI blocking
 * 
 * Note: This worker is only used for projects with duration >= 24 months
 */

import type { FinancialCalculationInput, FinancialCalculationResult } from '@/types/project';

// Worker message types
interface CalculationMessage {
  type: 'CALCULATE_PROJECTIONS';
  payload: {
    inputs: FinancialCalculationInput;
    months: number;
  };
}

interface ResultMessage {
  type: 'CALCULATION_COMPLETE';
  payload: FinancialCalculationResult;
}

interface ErrorMessage {
  type: 'CALCULATION_ERROR';
  error: string;
}

/**
 * Calculate NPV (Net Present Value)
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
      const previousCumulative = cumulative - cashFlows[month];
      const fraction = -previousCumulative / cashFlows[month];
      return month + fraction;
    }
  }
  
  return cashFlows.length;
}

/**
 * Calculate IRR (Internal Rate of Return) using Newton-Raphson method
 */
function calculateIRR(
  initialInvestment: number,
  cashFlows: number[],
  maxIterations: number = 100,
  tolerance: number = 0.0001
): number {
  let rate = 0.10 / 12; // Initial guess: 10% annual rate
  
  for (let iteration = 0; iteration < maxIterations; iteration++) {
    let npv = -initialInvestment;
    let derivative = 0;
    
    for (let month = 0; month < cashFlows.length; month++) {
      const period = month + 1;
      const discountFactor = Math.pow(1 + rate, period);
      
      npv += cashFlows[month] / discountFactor;
      derivative -= (period * cashFlows[month]) / Math.pow(1 + rate, period + 1);
    }
    
    if (Math.abs(npv) < tolerance) {
      return ((Math.pow(1 + rate, 12) - 1) * 100);
    }
    
    if (Math.abs(derivative) < 1e-10) {
      break;
    }
    
    rate = rate - npv / derivative;
    
    if (rate < -0.99 || rate > 10) {
      rate = 0.10 / 12;
      break;
    }
  }
  
  return ((Math.pow(1 + rate, 12) - 1) * 100);
}

/**
 * Main calculation function
 */
function calculateFinancialMetrics(
  input: FinancialCalculationInput
): FinancialCalculationResult {
  const {
    initialInvestment,
    yearlyRevenue,
    revenueGrowth,
    operatingCosts,
    maintenanceCosts,
    discountRate,
    projectDuration,
    multiplier = 1.0,
  } = input;

  const months = projectDuration;
  const monthlyRevenue = (yearlyRevenue / 12) * multiplier;
  const monthlyOperatingCosts = operatingCosts / 12;
  const monthlyMaintenanceCosts = (maintenanceCosts || 0) / 12;
  const monthlyGrowthRate = revenueGrowth / 100 / 12;

  const cashFlows: number[] = [];
  const monthlyBreakdown: Array<{
    month: number;
    revenue: number;
    costs: number;
    cashFlow: number;
  }> = [];

  for (let month = 0; month < months; month++) {
    const revenue = monthlyRevenue * Math.pow(1 + monthlyGrowthRate, month);
    const costs = monthlyOperatingCosts + monthlyMaintenanceCosts;
    const cashFlow = revenue - costs;

    cashFlows.push(cashFlow);
    monthlyBreakdown.push({ month: month + 1, revenue, costs, cashFlow });
  }

  const npv = calculateNPV(initialInvestment, cashFlows, discountRate / 100);
  const roi = (npv / initialInvestment) * 100;
  const paybackPeriod = calculatePaybackPeriod(initialInvestment, cashFlows);
  const irr = calculateIRR(initialInvestment, cashFlows);

  return {
    roi,
    npv,
    paybackPeriod,
    irr,
    totalRevenue: cashFlows.reduce((sum, cf) => sum + cf, 0) + initialInvestment,
    totalCosts: operatingCosts + (maintenanceCosts || 0),
    cashFlows,
    monthlyBreakdown,
  };
}

/**
 * Worker message handler
 */
self.addEventListener('message', (event: MessageEvent<CalculationMessage>) => {
  const { type, payload } = event.data;
  
  if (type === 'CALCULATE_PROJECTIONS') {
    try {
      const { inputs, months } = payload;
      const result = calculateFinancialMetrics(inputs);
      
      const response: ResultMessage = {
        type: 'CALCULATION_COMPLETE',
        payload: result,
      };
      
      self.postMessage(response);
    } catch (error) {
      const errorResponse: ErrorMessage = {
        type: 'CALCULATION_ERROR',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      
      self.postMessage(errorResponse);
    }
  }
});

// Export for TypeScript (won't execute in worker context)
export {};
