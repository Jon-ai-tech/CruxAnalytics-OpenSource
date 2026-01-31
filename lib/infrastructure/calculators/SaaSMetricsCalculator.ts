/**
 * @fileoverview SaaS-specific metrics calculator.
 * Implements LTV/CAC, NRR (Net Revenue Retention), and Rule of 40.
 * 
 * @module infrastructure/calculators/SaaSMetricsCalculator
 */

import { BaseCalculator } from './BaseCalculator';
import type { SaaSInput } from '@/types/project';

/**
 * Calculator for SaaS-specific business metrics.
 * Provides LTV/CAC analysis, Net Revenue Retention, and Rule of 40.
 * 
 * @class SaaSMetricsCalculator
 * @extends BaseCalculator
 */
export class SaaSMetricsCalculator extends BaseCalculator {
  constructor() {
    super('SaaSMetricsCalculator');
  }

  /**
   * Calculates all SaaS metrics.
   * 
   * @param input - SaaS-specific input data
   * @returns Object containing LTV, CAC, ltv_cac_ratio, payback_months, nrr, rule_of_40
   */
  calculate(input: SaaSInput): {
    ltv: number;
    cac: number;
    ltv_cac_ratio: number;
    payback_months: number;
    nrr: number;
    rule_of_40: number;
  } {
    this.validate(input);

    const ltv = this.calculateLTV(input);
    const cac = input.cacCost;
    const ltv_cac_ratio = this.safeDivide(ltv, cac, 0);
    const payback_months = this.calculatePaybackPeriod(input);
    const nrr = this.calculateNRR(input);
    const rule_of_40 = this.calculateRuleOf40(input);

    this.logCalculation('LTV', ltv);
    this.logCalculation('LTV/CAC', ltv_cac_ratio);
    this.logCalculation('Payback Period', payback_months);
    this.logCalculation('NRR', nrr);
    this.logCalculation('Rule of 40', rule_of_40);

    return {
      ltv,
      cac,
      ltv_cac_ratio,
      payback_months,
      nrr,
      rule_of_40,
    };
  }

  /**
   * Validates SaaS input data.
   * 
   * @protected
   * @override
   */
  protected override validate(input: SaaSInput): void {
    super.validate(input);

    this.assertPositive(input.averageRevenuePerUser, 'averageRevenuePerUser');
    this.assertRange(input.churnRate, 0, 100, 'churnRate');
    this.assertPositive(input.cacCost, 'cacCost');
    this.assertRange(input.grossMargin, 0, 100, 'grossMargin');
    this.assertPositive(input.startingMRR, 'startingMRR');
    this.assertPositive(input.expansionMRR, 'expansionMRR');
    this.assertPositive(input.churnedMRR, 'churnedMRR');
    this.assertPositive(input.contractedMRR, 'contractedMRR');
    this.assertRange(input.revenueGrowthRate, -100, 1000, 'revenueGrowthRate');
    this.assertRange(input.profitMargin, -100, 100, 'profitMargin');
  }

  /**
   * Calculates Customer Lifetime Value (LTV).
   * Formula: (ARPU × Gross Margin) / Churn Rate
   * 
   * Benchmarks:
   * - LTV/CAC ratio > 3: Healthy
   * - LTV/CAC ratio < 1: Unsustainable
   * 
   * @private
   */
  private calculateLTV(input: SaaSInput): number {
    const { averageRevenuePerUser, grossMargin, churnRate } = input;

    const grossMarginDecimal = grossMargin / 100;
    const churnRateDecimal = churnRate / 100;

    const ltv = this.safeDivide(
      averageRevenuePerUser * grossMarginDecimal,
      churnRateDecimal,
      0
    );

    return this.round(ltv, 2);
  }

  /**
   * Calculates CAC Payback Period in months.
   * Formula: CAC / (ARPU × Gross Margin)
   * 
   * Benchmarks:
   * - < 12 months: Excellent
   * - 12-18 months: Acceptable
   * - > 18 months: Concerning
   * 
   * @private
   */
  private calculatePaybackPeriod(input: SaaSInput): number {
    const { averageRevenuePerUser, grossMargin, cacCost } = input;

    const grossMarginDecimal = grossMargin / 100;
    const monthlyGrossProfit = averageRevenuePerUser * grossMarginDecimal;

    const payback = this.safeDivide(cacCost, monthlyGrossProfit, 0);

    return this.round(payback, 2);
  }

  /**
   * Calculates Net Revenue Retention (NRR).
   * Formula: (Starting MRR + Expansion - Churn - Contraction) / Starting MRR × 100
   * 
   * Benchmarks:
   * - > 120%: Excellent, strong expansion
   * - 100-120%: Good, stable growth
   * - 90-100%: Acceptable, but needs improvement
   * - < 90%: Concerning, churn problem
   * 
   * @private
   */
  private calculateNRR(input: SaaSInput): number {
    const { startingMRR, expansionMRR, churnedMRR, contractedMRR } = input;

    const endingMRR = startingMRR + expansionMRR - churnedMRR - contractedMRR;
    const nrr = this.safeDivide(endingMRR, startingMRR, 0) * 100;

    return this.round(nrr, 2);
  }

  /**
   * Calculates Rule of 40.
   * Formula: Revenue Growth % + Profit Margin %
   * 
   * Benchmarks:
   * - ≥ 40: Healthy SaaS business
   * - 20-40: Acceptable, room for improvement
   * - < 20: Needs strategic adjustment
   * 
   * @private
   */
  private calculateRuleOf40(input: SaaSInput): number {
    const { revenueGrowthRate, profitMargin } = input;

    const ruleOf40 = revenueGrowthRate + profitMargin;

    return this.round(ruleOf40, 2);
  }

  /**
   * Gets benchmark values for LTV/CAC ratio.
   */
  getLTVCACBenchmarks(): { optimal: number; acceptable: number; industry: number } {
    return {
      optimal: 5.0,
      acceptable: 3.0,
      industry: 3.5,
    };
  }

  /**
   * Gets benchmark values for Payback Period (months).
   */
  getPaybackBenchmarks(): { optimal: number; acceptable: number; industry: number } {
    return {
      optimal: 12,
      acceptable: 18,
      industry: 15,
    };
  }

  /**
   * Gets benchmark values for NRR (%).
   */
  getNRRBenchmarks(): { optimal: number; acceptable: number; industry: number } {
    return {
      optimal: 120,
      acceptable: 100,
      industry: 110,
    };
  }

  /**
   * Gets benchmark values for Rule of 40.
   */
  getRuleOf40Benchmarks(): { optimal: number; acceptable: number; industry: number } {
    return {
      optimal: 50,
      acceptable: 40,
      industry: 40,
    };
  }
}
