/**
 * @fileoverview Abstract base calculator providing common functionality.
 * Follows Template Method pattern for calculator implementations.
 * 
 * @module infrastructure/calculators/BaseCalculator
 */

import { Metric } from '@/lib/domain/entities/Metric';

/**
 * Abstract base class for all calculators.
 * Provides common validation, formatting, and logging capabilities.
 * Implements Template Method pattern.
 * 
 * @abstract
 * @class BaseCalculator
 */
export abstract class BaseCalculator {
  protected calculatorName: string;

  /**
   * Creates a new BaseCalculator instance
   * 
   * @param calculatorName - Name of the calculator for logging
   */
  constructor(calculatorName: string) {
    this.calculatorName = calculatorName;
  }

  /**
   * Validates input data before calculation.
   * Subclasses should override to add specific validation.
   * 
   * @protected
   * @param input - Input data to validate
   * @throws {Error} If validation fails
   */
  protected validate(input: any): void {
    if (!input) {
      throw new Error(`${this.calculatorName}: Input cannot be null or undefined`);
    }
  }

  /**
   * Formats a number as currency.
   * 
   * @protected
   * @param value - Value to format
   * @param currency - Currency code (default: USD)
   * @param locale - Locale for formatting (default: en-US)
   * @returns Formatted currency string
   */
  protected formatCurrency(
    value: number,
    currency: string = 'USD',
    locale: string = 'en-US'
  ): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  /**
   * Formats a number as percentage.
   * 
   * @protected
   * @param value - Value to format
   * @param decimals - Number of decimal places (default: 2)
   * @returns Formatted percentage string
   */
  protected formatPercentage(value: number, decimals: number = 2): string {
    return `${value.toFixed(decimals)}%`;
  }

  /**
   * Formats months as years and months.
   * 
   * @protected
   * @param months - Number of months
   * @returns Formatted string
   */
  protected formatMonths(months: number): string {
    if (months < 12) {
      return `${months.toFixed(1)} months`;
    }
    const years = months / 12;
    return `${years.toFixed(1)} years`;
  }

  /**
   * Logs calculation details for audit trail.
   * 
   * @protected
   * @param metricName - Name of the calculated metric
   * @param value - Calculated value
   * @param details - Additional details
   */
  protected logCalculation(
    metricName: string,
    value: number,
    details?: Record<string, any>
  ): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      calculator: this.calculatorName,
      metric: metricName,
      value,
      ...details,
    };

    // In production, this would write to a proper logging service
    if (process.env.NODE_ENV === 'development') {
      console.log('[Calculation]', logEntry);
    }
  }

  /**
   * Checks if a number is valid and finite.
   * 
   * @protected
   * @param value - Value to check
   * @param fieldName - Name of the field for error message
   * @throws {Error} If value is not finite
   */
  protected assertFinite(value: number, fieldName: string): void {
    if (!Number.isFinite(value)) {
      throw new Error(
        `${this.calculatorName}: ${fieldName} must be a finite number`
      );
    }
  }

  /**
   * Checks if a number is positive.
   * 
   * @protected
   * @param value - Value to check
   * @param fieldName - Name of the field for error message
   * @throws {Error} If value is not positive
   */
  protected assertPositive(value: number, fieldName: string): void {
    this.assertFinite(value, fieldName);
    if (value < 0) {
      throw new Error(`${this.calculatorName}: ${fieldName} must be positive`);
    }
  }

  /**
   * Checks if a number is within a range.
   * 
   * @protected
   * @param value - Value to check
   * @param min - Minimum value (inclusive)
   * @param max - Maximum value (inclusive)
   * @param fieldName - Name of the field for error message
   * @throws {Error} If value is outside range
   */
  protected assertRange(
    value: number,
    min: number,
    max: number,
    fieldName: string
  ): void {
    this.assertFinite(value, fieldName);
    if (value < min || value > max) {
      throw new Error(
        `${this.calculatorName}: ${fieldName} must be between ${min} and ${max}`
      );
    }
  }

  /**
   * Rounds a number to specified decimal places.
   * 
   * @protected
   * @param value - Value to round
   * @param decimals - Number of decimal places (default: 2)
   * @returns Rounded value
   */
  protected round(value: number, decimals: number = 2): number {
    const multiplier = Math.pow(10, decimals);
    return Math.round(value * multiplier) / multiplier;
  }

  /**
   * Safe division that handles divide by zero.
   * 
   * @protected
   * @param numerator - Numerator
   * @param denominator - Denominator
   * @param defaultValue - Value to return if denominator is zero (default: 0)
   * @returns Result of division or default value
   */
  protected safeDivide(
    numerator: number,
    denominator: number,
    defaultValue: number = 0
  ): number {
    if (denominator === 0) {
      return defaultValue;
    }
    return numerator / denominator;
  }
}
