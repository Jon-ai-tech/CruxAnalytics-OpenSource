/**
 * @fileoverview Cohort-specific metrics calculator.
 * Implements Contribution Margin by Cohort for identifying profitable customer segments.
 * 
 * @module infrastructure/calculators/CohortMetricsCalculator
 * 
 * @example
 * ```typescript
 * const calculator = new CohortMetricsCalculator();
 * const result = calculator.calculate({
 *   cohortName: 'Enterprise Q1 2026',
 *   cohortRevenue: 500000,
 *   directCosts: 200000,
 *   customerCount: 50,
 *   acquisitionCost: 5000,
 *   servicingCostPerCustomer: 200
 * });
 * ```
 */

import { BaseCalculator } from './BaseCalculator';
import type { CohortInput } from '@/types/project';

/**
 * Calculator for cohort-specific profitability metrics.
 * Helps identify which customer segments are profitable vs loss-making.
 * 
 * @class CohortMetricsCalculator
 * @extends BaseCalculator
 */
export class CohortMetricsCalculator extends BaseCalculator {
    constructor() {
        super('CohortMetricsCalculator');
    }

    /**
     * Calculates all cohort profitability metrics.
     * 
     * @param input - Cohort-specific input data
     * @returns Object containing contribution margin, margin per customer, and profitability index
     */
    calculate(input: CohortInput): {
        contributionMargin: number;
        marginPerCustomer: number;
        profitabilityIndex: number;
        isLosingMoney: boolean;
        cohortName: string;
    } {
        this.validate(input);

        const contributionMargin = this.calculateContributionMargin(input);
        const marginPerCustomer = this.calculateMarginPerCustomer(input);
        const profitabilityIndex = this.calculateProfitabilityIndex(input);
        const isLosingMoney = contributionMargin < 0;

        this.logCalculation('Contribution Margin', contributionMargin, {
            cohort: input.cohortName,
        });
        this.logCalculation('Margin per Customer', marginPerCustomer);
        this.logCalculation('Profitability Index', profitabilityIndex);

        return {
            contributionMargin,
            marginPerCustomer,
            profitabilityIndex,
            isLosingMoney,
            cohortName: input.cohortName,
        };
    }

    /**
     * Validates cohort input data.
     * 
     * @protected
     * @override
     */
    protected override validate(input: CohortInput): void {
        super.validate(input);

        if (!input.cohortName || input.cohortName.trim() === '') {
            throw new Error(`${this.calculatorName}: cohortName is required`);
        }
        this.assertPositive(input.cohortRevenue, 'cohortRevenue');
        this.assertPositive(input.directCosts, 'directCosts');
        this.assertPositive(input.customerCount, 'customerCount');
        this.assertPositive(input.acquisitionCost, 'acquisitionCost');
        this.assertPositive(input.servicingCostPerCustomer, 'servicingCostPerCustomer');
    }

    /**
     * Calculates Contribution Margin as a percentage.
     * Formula: (Revenue - Direct Costs) / Revenue × 100
     * 
     * Interpretation:
     * - > 40%: High-value cohort, consider expansion
     * - 20-40%: Acceptable, monitor for improvements
     * - 0-20%: Below average, review pricing strategy
     * - < 0%: Loss-making, consider discontinuing
     * 
     * @private
     * @param input - Cohort input data
     * @returns Contribution margin percentage
     */
    private calculateContributionMargin(input: CohortInput): number {
        const { cohortRevenue, directCosts } = input;

        const margin = this.safeDivide(
            (cohortRevenue - directCosts),
            cohortRevenue,
            0
        ) * 100;

        return this.round(margin, 2);
    }

    /**
     * Calculates the contribution margin per individual customer.
     * Formula: (Revenue - Direct Costs) / Customer Count
     * 
     * @private
     * @param input - Cohort input data
     * @returns Margin per customer in currency
     */
    private calculateMarginPerCustomer(input: CohortInput): number {
        const { cohortRevenue, directCosts, customerCount } = input;

        const totalMargin = cohortRevenue - directCosts;
        const marginPerCustomer = this.safeDivide(totalMargin, customerCount, 0);

        return this.round(marginPerCustomer, 2);
    }

    /**
     * Calculates Cohort Profitability Index.
     * Compares contribution margin to break-even and acquisition costs.
     * Formula: (Margin per Customer - Acquisition Cost) / Servicing Cost
     * 
     * Interpretation:
     * - > 2.0: Excellent, strong profitability
     * - 1.0-2.0: Good, sustainable
     * - 0-1.0: Marginal, needs improvement
     * - < 0: Unprofitable cohort
     * 
     * @private
     * @param input - Cohort input data
     * @returns Profitability index ratio
     */
    private calculateProfitabilityIndex(input: CohortInput): number {
        const marginPerCustomer = this.calculateMarginPerCustomer(input);
        const { acquisitionCost, servicingCostPerCustomer } = input;

        // How many months of servicing cost does the margin cover after recovering CAC
        const netMargin = marginPerCustomer - acquisitionCost;
        const index = this.safeDivide(netMargin, servicingCostPerCustomer, 0);

        return this.round(index, 2);
    }

    /**
     * Gets benchmark values for Contribution Margin (%).
     * 
     * @returns Benchmark object
     */
    getContributionMarginBenchmarks(): { optimal: number; acceptable: number; critical: number } {
        return {
            optimal: 40,
            acceptable: 20,
            critical: 0,
        };
    }

    /**
     * Gets benchmark values for Profitability Index.
     * 
     * @returns Benchmark object
     */
    getProfitabilityIndexBenchmarks(): { optimal: number; acceptable: number; critical: number } {
        return {
            optimal: 2.0,
            acceptable: 1.0,
            critical: 0,
        };
    }

    /**
     * Generates recommendations based on cohort metrics.
     * 
     * @param contributionMargin - The calculated contribution margin
     * @param profitabilityIndex - The calculated profitability index
     * @returns Array of recommendation strings
     */
    generateRecommendations(
        contributionMargin: number,
        profitabilityIndex: number
    ): string[] {
        const recommendations: string[] = [];

        if (contributionMargin < 0) {
            recommendations.push(
                'CRITICAL: This cohort is losing money. Consider discontinuing service or restructuring pricing immediately.'
            );
            recommendations.push(
                'Analyze which cost components are driving losses and explore cost reduction opportunities.'
            );
        } else if (contributionMargin < 20) {
            recommendations.push(
                'Contribution margin is below industry average (20%). Review pricing strategy for this segment.'
            );
            recommendations.push(
                'Consider upselling higher-margin products/services to this cohort.'
            );
        } else if (contributionMargin >= 40) {
            recommendations.push(
                'High-value cohort identified. Consider investing in expansion and customer acquisition for this segment.'
            );
            recommendations.push(
                'Analyze what makes this cohort profitable and replicate success factors in other segments.'
            );
        }

        if (profitabilityIndex < 0) {
            recommendations.push(
                'Acquisition costs exceed lifetime contribution. Reduce CAC or increase customer value.'
            );
        } else if (profitabilityIndex < 1) {
            recommendations.push(
                'Marginal profitability. Focus on retention to extend customer lifetime value.'
            );
        }

        return recommendations;
    }
}
