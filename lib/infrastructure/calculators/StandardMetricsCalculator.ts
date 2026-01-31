/**
 * @fileoverview Standard financial metrics calculator.
 * Implements ROI, NPV, IRR, and Payback Period calculations.
 * Uses existing calculation logic from financial-calculator.ts.
 * 
 * @module infrastructure/calculators/StandardMetricsCalculator
 */

import { BaseCalculator } from './BaseCalculator';
import { Metric } from '@/lib/domain/entities/Metric';
import type { FinancialCalculationInput } from '@/types/project';

/**
 * Calculator for standard financial metrics.
 * Provides ROI, NPV, IRR, and Payback Period calculations.
 * 
 * @class StandardMetricsCalculator
 * @extends BaseCalculator
 * 
 * @example
 * ```typescript
 * const calculator = new StandardMetricsCalculator();
 * const metrics = calculator.calculate({
 *   initialInvestment: 100000,
 *   discountRate: 10,
 *   projectDuration: 36,
 *   yearlyRevenue: 150000,
 *   revenueGrowth: 5,
 *   operatingCosts: 30000,
 *   maintenanceCosts: 10000
 * });
 * ```
 */
export class StandardMetricsCalculator extends BaseCalculator {
  constructor() {
    super('StandardMetricsCalculator');
  }

  /**
   * Calculates all standard financial metrics.
   * 
   * @param input - Financial calculation input data
   * @returns Object containing calculated values (without XAI context)
   * 
   * @throws {Error} If validation fails
   */
  calculate(input: FinancialCalculationInput): {
    roi: number;
    npv: number;
    irr: number;
    paybackPeriod: number;
    monthlyCashFlow: number[];
    cumulativeCashFlow: number[];
  } {
    this.validate(input);
    
    const {
      initialInvestment,
      discountRate,
      projectDuration,
      yearlyRevenue,
      revenueGrowth,
      operatingCosts,
      maintenanceCosts,
      multiplier = 1.0,
    } = input;

    // Calculate monthly cash flows
    const monthlyCashFlow: number[] = [];
    const cumulativeCashFlow: number[] = [];
    
    let cumulative = -initialInvestment;
    
    for (let month = 0; month < projectDuration; month++) {
      const year = Math.floor(month / 12);
      const growthFactor = Math.pow(1 + revenueGrowth / 100, year);
      
      const monthlyRevenue = (yearlyRevenue * growthFactor * multiplier) / 12;
      const monthlyCosts = (operatingCosts + maintenanceCosts) / 12;
      
      const netCashFlow = monthlyRevenue - monthlyCosts;
      monthlyCashFlow.push(netCashFlow);
      
      cumulative += netCashFlow;
      cumulativeCashFlow.push(cumulative);
    }

    // Calculate metrics
    const roi = this.calculateROI(initialInvestment, monthlyCashFlow);
    const npv = this.calculateNPV(initialInvestment, monthlyCashFlow, discountRate / 100);
    const paybackPeriod = this.calculatePaybackPeriod(initialInvestment, monthlyCashFlow);
    const irr = this.calculateIRR(initialInvestment, monthlyCashFlow);

    // Log calculations
    this.logCalculation('ROI', roi);
    this.logCalculation('NPV', npv);
    this.logCalculation('IRR', irr);
    this.logCalculation('PaybackPeriod', paybackPeriod);

    return {
      roi,
      npv,
      irr,
      paybackPeriod,
      monthlyCashFlow,
      cumulativeCashFlow,
    };
  }

  /**
   * Validates financial calculation input.
   * 
   * @protected
   * @override
   */
  protected override validate(input: FinancialCalculationInput): void {
    super.validate(input);
    
    this.assertPositive(input.initialInvestment, 'initialInvestment');
    this.assertRange(input.discountRate, 0, 100, 'discountRate');
    this.assertRange(input.projectDuration, 1, 600, 'projectDuration');
    this.assertPositive(input.yearlyRevenue, 'yearlyRevenue');
    this.assertRange(input.revenueGrowth, -100, 1000, 'revenueGrowth');
    this.assertPositive(input.operatingCosts, 'operatingCosts');
    this.assertPositive(input.maintenanceCosts, 'maintenanceCosts');
  }

  /**
   * Calculates Return on Investment (ROI).
   * Formula: ((Total Revenue - Initial Investment) / Initial Investment) × 100
   * 
   * @private
   * @param initialInvestment - Initial investment amount
   * @param cashFlows - Monthly cash flows
   * @returns ROI as percentage
   */
  private calculateROI(initialInvestment: number, cashFlows: number[]): number {
    const totalRevenue = cashFlows.reduce((sum, cf) => sum + cf, 0);
    const roi = ((totalRevenue - initialInvestment) / initialInvestment) * 100;
    return this.round(roi, 2);
  }

  /**
   * Calculates Net Present Value (NPV).
   * Discounts future cash flows to present value.
   * 
   * @private
   * @param initialInvestment - Initial investment amount
   * @param cashFlows - Monthly cash flows
   * @param discountRate - Annual discount rate (as decimal, e.g., 0.10 for 10%)
   * @returns NPV amount
   */
  private calculateNPV(
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
    
    return this.round(npv, 2);
  }

  /**
   * Calculates Payback Period.
   * Time required to recover initial investment.
   * 
   * @private
   * @param initialInvestment - Initial investment amount
   * @param cashFlows - Monthly cash flows
   * @returns Payback period in months
   */
  private calculatePaybackPeriod(
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
        return this.round(month + fraction, 2);
      }
    }
    
    // If payback is not achieved within project duration
    return cashFlows.length;
  }

  /**
   * Calculates Internal Rate of Return (IRR).
   * Uses Newton-Raphson method for convergence.
   * 
   * @private
   * @param initialInvestment - Initial investment amount
   * @param cashFlows - Monthly cash flows
   * @param maxIterations - Maximum iterations for convergence (default: 100)
   * @param tolerance - Convergence tolerance (default: 0.0001)
   * @returns IRR as annual percentage
   */
  private calculateIRR(
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
        return this.round((Math.pow(1 + rate, 12) - 1) * 100, 2);
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
    
    // If convergence failed, return the current estimate
    // Convert monthly rate to annual percentage
    return this.round((Math.pow(1 + rate, 12) - 1) * 100, 2);
  }
}
