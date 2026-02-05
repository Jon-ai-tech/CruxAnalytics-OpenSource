/**
 * @fileoverview Break-even analysis calculator for small businesses.
 * Calculates the point where total revenue equals total costs.
 * 
 * @module infrastructure/calculators/BreakEvenCalculator
 * 
 * @example
 * ```typescript
 * const calculator = new BreakEvenCalculator();
 * const result = calculator.calculate({
 *   fixedCosts: 50000,
 *   pricePerUnit: 25,
 *   variableCostPerUnit: 10,
 *   currentSalesUnits: 5000
 * });
 * // Result: breakEvenUnits = 3334, marginOfSafety = 33.3%
 * ```
 */

import { BaseCalculator } from './BaseCalculator';
import type { BreakEvenInput } from '@/types/project';

/**
 * Calculator for break-even analysis.
 * Essential metric for small business owners to understand minimum sales needed.
 * 
 * @class BreakEvenCalculator
 * @extends BaseCalculator
 */
export class BreakEvenCalculator extends BaseCalculator {
    constructor() {
        super('BreakEvenCalculator');
    }

    /**
     * Calculates break-even point and related metrics.
     * 
     * @param input - Break-even input data
     * @returns Break-even analysis results
     */
    calculate(input: BreakEvenInput): {
        breakEvenUnits: number;
        breakEvenRevenue: number;
        contributionMarginPerUnit: number;
        contributionMarginRatio: number;
        marginOfSafety: number | null;
        marginOfSafetyUnits: number | null;
        unitsPerMonth: number;
        revenuePerMonth: number;
        isAboveBreakEven: boolean;
    } {
        this.validate(input);

        const contributionMarginPerUnit = input.pricePerUnit - input.variableCostPerUnit;
        const contributionMarginRatio = this.safeDivide(
            contributionMarginPerUnit,
            input.pricePerUnit,
            0
        );

        const breakEvenUnits = this.calculateBreakEvenUnits(input);
        const breakEvenRevenue = breakEvenUnits * input.pricePerUnit;

        // Margin of safety calculations
        let marginOfSafety: number | null = null;
        let marginOfSafetyUnits: number | null = null;
        let isAboveBreakEven = false;

        if (input.currentSalesUnits !== undefined) {
            marginOfSafetyUnits = input.currentSalesUnits - breakEvenUnits;
            marginOfSafety = this.safeDivide(
                marginOfSafetyUnits,
                input.currentSalesUnits,
                0
            ) * 100;
            isAboveBreakEven = input.currentSalesUnits >= breakEvenUnits;
        }

        // Calculate per-month figures
        const periodMonths = input.periodMonths || 12;
        const unitsPerMonth = this.round(breakEvenUnits / periodMonths, 0);
        const revenuePerMonth = this.round(breakEvenRevenue / periodMonths, 2);

        this.logCalculation('Break-even Units', breakEvenUnits);
        this.logCalculation('Break-even Revenue', breakEvenRevenue);
        this.logCalculation('Contribution Margin Ratio', contributionMarginRatio);

        return {
            breakEvenUnits: this.round(breakEvenUnits, 0),
            breakEvenRevenue: this.round(breakEvenRevenue, 2),
            contributionMarginPerUnit: this.round(contributionMarginPerUnit, 2),
            contributionMarginRatio: this.round(contributionMarginRatio * 100, 2),
            marginOfSafety: marginOfSafety !== null ? this.round(marginOfSafety, 2) : null,
            marginOfSafetyUnits: marginOfSafetyUnits !== null ? this.round(marginOfSafetyUnits, 0) : null,
            unitsPerMonth,
            revenuePerMonth,
            isAboveBreakEven,
        };
    }

    /**
     * Validates break-even input data.
     * 
     * @protected
     * @override
     */
    protected override validate(input: BreakEvenInput): void {
        super.validate(input);

        this.assertPositive(input.fixedCosts, 'fixedCosts');
        this.assertPositive(input.pricePerUnit, 'pricePerUnit');
        this.assertPositive(input.variableCostPerUnit, 'variableCostPerUnit');

        if (input.pricePerUnit <= input.variableCostPerUnit) {
            throw new Error(
                `${this.calculatorName}: pricePerUnit must be greater than variableCostPerUnit`
            );
        }

        if (input.currentSalesUnits !== undefined) {
            this.assertPositive(input.currentSalesUnits, 'currentSalesUnits');
        }
    }

    /**
     * Calculates break-even point in units.
     * Formula: Fixed Costs / (Price - Variable Cost)
     * 
     * @private
     */
    private calculateBreakEvenUnits(input: BreakEvenInput): number {
        const contributionMargin = input.pricePerUnit - input.variableCostPerUnit;
        return this.safeDivide(input.fixedCosts, contributionMargin, 0);
    }

    /**
     * Generates recommendations based on break-even analysis.
     * 
     * @param result - Calculation results
     * @returns Array of recommendation strings
     */
    generateRecommendations(result: ReturnType<typeof this.calculate>): string[] {
        const recommendations: string[] = [];

        if (result.marginOfSafety !== null) {
            if (result.marginOfSafety < 0) {
                recommendations.push(
                    `CRITICAL: You are ${Math.abs(result.marginOfSafetyUnits!)} units BELOW break-even.`
                );
                recommendations.push('Immediate actions needed: Reduce costs or increase prices.');
            } else if (result.marginOfSafety < 10) {
                recommendations.push(
                    'Low margin of safety. Small sales decrease could cause losses.'
                );
                recommendations.push('Consider building a cash reserve for slow periods.');
            } else if (result.marginOfSafety < 25) {
                recommendations.push(
                    'Acceptable margin of safety. Monitor sales trends closely.'
                );
            } else {
                recommendations.push(
                    'Healthy margin of safety. Business is resilient to sales fluctuations.'
                );
            }
        }

        if (result.contributionMarginRatio < 30) {
            recommendations.push(
                'Low contribution margin. Consider reducing variable costs or increasing prices.'
            );
        } else if (result.contributionMarginRatio > 60) {
            recommendations.push(
                'Strong contribution margin. Focus on increasing sales volume.'
            );
        }

        recommendations.push(
            `Target: Sell at least ${result.unitsPerMonth} units/month to break even.`
        );

        return recommendations;
    }

    /**
     * Gets benchmark values for margin of safety.
     */
    getMarginOfSafetyBenchmarks(): { healthy: number; acceptable: number; critical: number } {
        return {
            healthy: 25,
            acceptable: 10,
            critical: 0,
        };
    }
}
