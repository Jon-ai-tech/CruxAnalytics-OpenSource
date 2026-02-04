/**
 * @fileoverview Worker client for financial calculations
 * Provides a Promise-based interface to the financial worker
 * with automatic fallback to synchronous calculations
 */

import type { FinancialCalculationInput, FinancialCalculationResult } from '@/types/project';
import { Platform } from 'react-native';

/**
 * Check if Web Workers are supported
 */
export function areWorkersSupported(): boolean {
  // Workers are only supported on web
  if (Platform.OS !== 'web') {
    return false;
  }
  
  // Check if Worker constructor exists
  return typeof Worker !== 'undefined';
}

/**
 * Calculate financial projections using a Web Worker
 * Only use for projects with duration >= 24 months
 * 
 * @param inputs - Financial calculation inputs
 * @param months - Project duration in months
 * @returns Promise that resolves to calculation results
 */
export function calculateProjectionsInWorker(
  inputs: FinancialCalculationInput,
  months: number
): Promise<FinancialCalculationResult> {
  return new Promise((resolve, reject) => {
    if (!areWorkersSupported()) {
      reject(new Error('Web Workers not supported on this platform'));
      return;
    }

    try {
      // Create worker
      const worker = new Worker(
        new URL('./financial-worker.ts', import.meta.url),
        { type: 'module' }
      );
      
      // Set timeout for worker (30 seconds max)
      const timeout = setTimeout(() => {
        worker.terminate();
        reject(new Error('Worker calculation timeout'));
      }, 30000);
      
      // Handle worker messages
      worker.addEventListener('message', (event) => {
        clearTimeout(timeout);
        
        if (event.data.type === 'CALCULATION_COMPLETE') {
          resolve(event.data.payload);
          worker.terminate();
        } else if (event.data.type === 'CALCULATION_ERROR') {
          reject(new Error(event.data.error));
          worker.terminate();
        }
      });
      
      // Handle worker errors
      worker.addEventListener('error', (error) => {
        clearTimeout(timeout);
        reject(new Error(`Worker error: ${error.message}`));
        worker.terminate();
      });
      
      // Send calculation request
      worker.postMessage({
        type: 'CALCULATE_PROJECTIONS',
        payload: { inputs, months },
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Determine if worker should be used based on project duration
 * Workers are only beneficial for long-running calculations
 * 
 * @param months - Project duration in months
 * @returns True if worker should be used
 */
export function shouldUseWorker(months: number): boolean {
  // Only use workers for projects >= 24 months
  // AND when workers are supported
  return months >= 24 && areWorkersSupported();
}

/**
 * Calculate with automatic worker/sync fallback
 * 
 * @param inputs - Financial calculation inputs
 * @param syncCalculator - Synchronous calculation fallback function
 * @returns Promise that resolves to calculation results
 */
export async function calculateWithWorker(
  inputs: FinancialCalculationInput,
  syncCalculator: (input: FinancialCalculationInput) => FinancialCalculationResult
): Promise<FinancialCalculationResult> {
  const months = inputs.projectDuration;
  
  // Use worker for long projects on web
  if (shouldUseWorker(months)) {
    try {
      console.log('[Worker] Using Web Worker for calculations (>= 24 months)');
      return await calculateProjectionsInWorker(inputs, months);
    } catch (error) {
      console.warn('[Worker] Worker failed, falling back to sync:', error);
      // Fall back to sync calculation
      return syncCalculator(inputs);
    }
  }
  
  // Use synchronous calculation for short projects or non-web platforms
  console.log('[Worker] Using synchronous calculations');
  return syncCalculator(inputs);
}
