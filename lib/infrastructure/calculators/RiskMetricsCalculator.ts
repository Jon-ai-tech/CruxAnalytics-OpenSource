/**
 * @fileoverview Risk metrics calculator.
 * Implements runway calculation and probabilistic churn impact analysis.
 * 
 * @module infrastructure/calculators/RiskMetricsCalculator
 */

import { BaseCalculator } from './BaseCalculator';
import type { RiskInput } from '@/types/project';

/**
 * Calculator for risk analysis metrics.
 * Provides runway/zero cash date and churn impact calculations.
 * 
 * @class RiskMetricsCalculator
 * @extends BaseCalculator
 */
export class RiskMetricsCalculator extends BaseCalculator {
  constructor() {
    super('RiskMetricsCalculator');
  }

  /**
   * Calculates all risk metrics.
   * 
   * @param input - Risk-specific input data
   * @returns Object containing runway_months, zero_cash_date, churn_impact_6mo
   */
  calculate(input: RiskInput): {
    runway_months: number;
    zero_cash_date: string;
    churn_impact_6mo: number;
  } {
    this.validate(input);

    const runway_months = this.calculateRunway(input);
    const zero_cash_date = this.calculateZeroCashDate(input);
    const churn_impact_6mo = this.calculateChurnImpact(input);

    this.logCalculation('Runway (months)', runway_months);
    this.logCalculation('Churn Impact (6mo)', churn_impact_6mo);

    return {
      runway_months,
      zero_cash_date,
      churn_impact_6mo,
    };
  }

  /**
   * Validates risk input data.
   * 
   * @protected
   * @override
   */
  protected override validate(input: RiskInput): void {
    super.validate(input);

    this.assertPositive(input.currentCash, 'currentCash');
    this.assertPositive(input.monthlyBurnRate, 'monthlyBurnRate');
    if (input.plannedFundraising !== undefined) {
      this.assertPositive(input.plannedFundraising, 'plannedFundraising');
    }
    this.assertRange(input.monthlyChurnRate, 0, 100, 'monthlyChurnRate');
    this.assertPositive(input.currentMRR, 'currentMRR');
    this.assertPositive(input.averageContractValue, 'averageContractValue');
  }

  /**
   * Calculates runway (months until zero cash).
   * Formula: (Current Cash + Planned Funding) / Monthly Burn Rate
   * 
   * Alert levels:
   * - < 6 months: Critical, immediate action required
   * - 6-12 months: Warning, start fundraising process
   * - > 12 months: Healthy, plan for future
   * 
   * @private
   */
  private calculateRunway(input: RiskInput): number {
    const { currentCash, monthlyBurnRate, plannedFundraising = 0 } = input;

    const totalCash = currentCash + plannedFundraising;
    const runway = this.safeDivide(totalCash, monthlyBurnRate, 0);

    return this.round(runway, 2);
  }

  /**
   * Calculates the date when cash reaches zero.
   * Based on current burn rate and available funds.
   * 
   * @private
   */
  private calculateZeroCashDate(input: RiskInput): string {
    const runway_months = this.calculateRunway(input);
    
    const today = new Date();
    const zeroCashDate = new Date(today);
    zeroCashDate.setMonth(zeroCashDate.getMonth() + Math.floor(runway_months));

    return zeroCashDate.toISOString().split('T')[0]; // Return YYYY-MM-DD
  }

  /**
   * Calculates probabilistic churn impact over 6 months.
   * Formula: 1 - (1 - Monthly Churn Rate)^6
   * 
   * This estimates the percentage of revenue at risk over a 6-month period
   * due to customer churn, using compound probability.
   * 
   * Interpretation:
   * - < 10%: Low risk
   * - 10-20%: Moderate risk, monitor closely
   * - > 20%: High risk, retention priority
   * 
   * @private
   */
  private calculateChurnImpact(input: RiskInput): number {
    const { monthlyChurnRate } = input;

    const monthlyChurnDecimal = monthlyChurnRate / 100;
    
    // Compound probability over 6 months
    const retentionRate = 1 - monthlyChurnDecimal;
    const sixMonthRetention = Math.pow(retentionRate, 6);
    const sixMonthChurn = (1 - sixMonthRetention) * 100;

    return this.round(sixMonthChurn, 2);
  }

  /**
   * Gets benchmark values for runway (months).
   */
  getRunwayBenchmarks(): { optimal: number; acceptable: number; critical: number } {
    return {
      optimal: 18,
      acceptable: 12,
      critical: 6,
    };
  }

  /**
   * Gets benchmark values for churn impact (%).
   */
  getChurnImpactBenchmarks(): { optimal: number; acceptable: number; critical: number } {
    return {
      optimal: 10,
      acceptable: 20,
      critical: 30,
    };
  }
}
