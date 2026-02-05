/**
 * @fileoverview Loan Calculator Page
 * Evaluates loan options with amortization schedule and affordability analysis
 */

import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
    GlassCard,
    GradientButton,
    SectionHeading,
    Badge,
} from '@/components/landing/shared-components';
import { LoanCalculator } from '@/lib/infrastructure/calculators/LoanCalculator';

function InputField({
    label, value, onChange, prefix, suffix, hint,
}: {
    label: string; value: string; onChange: (val: string) => void;
    prefix?: string; suffix?: string; hint?: string;
}) {
    return (
        <View className="mb-4">
            <Text className="text-gray-300 font-medium mb-2">{label}</Text>
            <View className="flex-row items-center bg-slate-800 rounded-xl border border-white/10 overflow-hidden">
                {prefix && <Text className="text-gray-500 pl-4">{prefix}</Text>}
                <TextInput
                    className="flex-1 px-4 py-3 text-white text-lg"
                    value={value}
                    onChangeText={onChange}
                    placeholderTextColor="#6b7280"
                    keyboardType="numeric"
                />
                {suffix && <Text className="text-gray-500 pr-4">{suffix}</Text>}
            </View>
            {hint && <Text className="text-gray-500 text-xs mt-1">{hint}</Text>}
        </View>
    );
}

function AmortizationPreview({ schedule }: { schedule: Array<{ month: number; payment: number; principal: number; interest: number; balance: number }> }) {
    // Show first 6 and last 3 months
    const preview = [...schedule.slice(0, 6), ...schedule.slice(-3)];

    return (
        <GlassCard>
            <Text className="text-white font-semibold mb-4">📋 Tabla de Amortización (Vista previa)</Text>

            <View className="bg-slate-800 rounded-lg overflow-hidden">
                {/* Header */}
                <View className="flex-row bg-slate-700 py-2 px-3">
                    <Text className="text-gray-400 text-xs flex-1 text-center">Mes</Text>
                    <Text className="text-gray-400 text-xs flex-1 text-center">Pago</Text>
                    <Text className="text-gray-400 text-xs flex-1 text-center">Capital</Text>
                    <Text className="text-gray-400 text-xs flex-1 text-center">Interés</Text>
                    <Text className="text-gray-400 text-xs flex-1 text-center">Saldo</Text>
                </View>

                {/* Rows */}
                {preview.map((row, idx) => (
                    <View key={idx} className={`flex-row py-2 px-3 ${idx % 2 === 0 ? 'bg-slate-800' : 'bg-slate-800/50'}`}>
                        <Text className="text-white text-xs flex-1 text-center">{row.month}</Text>
                        <Text className="text-white text-xs flex-1 text-center">${row.payment.toLocaleString()}</Text>
                        <Text className="text-emerald-400 text-xs flex-1 text-center">${row.principal.toLocaleString()}</Text>
                        <Text className="text-rose-400 text-xs flex-1 text-center">${row.interest.toLocaleString()}</Text>
                        <Text className="text-gray-400 text-xs flex-1 text-center">${row.balance.toLocaleString()}</Text>
                    </View>
                ))}

                {schedule.length > 9 && (
                    <View className="py-2 px-3 bg-slate-700/50">
                        <Text className="text-gray-500 text-xs text-center">
                            ... {schedule.length - 9} meses más en el PDF
                        </Text>
                    </View>
                )}
            </View>
        </GlassCard>
    );
}

export default function LoanPage() {
    const [principal, setPrincipal] = useState('100000');
    const [interestRate, setInterestRate] = useState('8.5');
    const [termMonths, setTermMonths] = useState('60');
    const [monthlyRevenue, setMonthlyRevenue] = useState('50000');
    const [monthlyExpenses, setMonthlyExpenses] = useState('40000');

    const calculator = useMemo(() => new LoanCalculator(), []);

    const result = useMemo(() => {
        try {
            const princ = parseFloat(principal) || 0;
            const rate = parseFloat(interestRate) || 0;
            const term = parseInt(termMonths) || 0;
            const revenue = monthlyRevenue ? parseFloat(monthlyRevenue) : undefined;
            const expenses = monthlyExpenses ? parseFloat(monthlyExpenses) : undefined;

            if (princ <= 0 || rate < 0 || term <= 0) return null;

            return calculator.calculate({
                principal: princ,
                annualInterestRate: rate,
                termMonths: term,
                monthlyRevenue: revenue,
                monthlyExpenses: expenses,
            });
        } catch {
            return null;
        }
    }, [principal, interestRate, termMonths, monthlyRevenue, monthlyExpenses, calculator]);

    const recommendations = result ? calculator.generateRecommendations(result, {
        principal: parseFloat(principal),
        annualInterestRate: parseFloat(interestRate),
        termMonths: parseInt(termMonths),
    }) : [];

    return (
        <View className="max-w-5xl mx-auto">
            <SectionHeading
                title="💳 Evaluador de Préstamos"
                subtitle="Analiza si el financiamiento es conveniente para tu negocio"
            />

            <View className="flex-row flex-wrap gap-6">
                {/* Form */}
                <View className="flex-1 min-w-[300px]">
                    <GlassCard>
                        <Text className="text-white font-semibold text-lg mb-6">Datos del Préstamo</Text>

                        <InputField
                            label="Monto del préstamo"
                            value={principal}
                            onChange={setPrincipal}
                            prefix="$"
                        />

                        <InputField
                            label="Tasa de interés anual"
                            value={interestRate}
                            onChange={setInterestRate}
                            suffix="%"
                        />

                        <InputField
                            label="Plazo"
                            value={termMonths}
                            onChange={setTermMonths}
                            suffix="meses"
                        />

                        <View className="h-px bg-white/10 my-4" />
                        <Text className="text-gray-400 text-sm mb-4">Para análisis de affordability (opcional)</Text>

                        <InputField
                            label="Ingresos mensuales"
                            value={monthlyRevenue}
                            onChange={setMonthlyRevenue}
                            prefix="$"
                        />

                        <InputField
                            label="Gastos mensuales"
                            value={monthlyExpenses}
                            onChange={setMonthlyExpenses}
                            prefix="$"
                        />
                    </GlassCard>
                </View>

                {/* Results */}
                <View className="flex-1 min-w-[300px] gap-4">
                    {result ? (
                        <>
                            {/* Monthly Payment */}
                            <GlassCard gradient className="items-center py-8">
                                <Text className="text-gray-400">Pago Mensual</Text>
                                <Text className="text-5xl font-bold text-white mt-2">
                                    ${result.monthlyPayment.toLocaleString()}
                                </Text>
                            </GlassCard>

                            {/* Summary Cards */}
                            <View className="flex-row flex-wrap gap-4">
                                <GlassCard className="flex-1 min-w-[140px]">
                                    <Text className="text-gray-400 text-sm">Total a Pagar</Text>
                                    <Text className="text-2xl font-bold text-white">
                                        ${result.totalPayment.toLocaleString()}
                                    </Text>
                                </GlassCard>

                                <GlassCard className="flex-1 min-w-[140px]">
                                    <Text className="text-gray-400 text-sm">Total Intereses</Text>
                                    <Text className="text-2xl font-bold text-rose-400">
                                        ${result.totalInterest.toLocaleString()}
                                    </Text>
                                </GlassCard>

                                <GlassCard className="flex-1 min-w-[140px]">
                                    <Text className="text-gray-400 text-sm">Tasa Efectiva</Text>
                                    <Text className="text-2xl font-bold text-amber-400">
                                        {result.effectiveAnnualRate.toFixed(1)}%
                                    </Text>
                                </GlassCard>
                            </View>

                            {/* Affordability */}
                            {result.affordability.isAffordable !== null && (
                                <GlassCard className={`border-2 ${result.affordability.isAffordable ? 'border-emerald-500/50' : 'border-rose-500/50'}`}>
                                    <View className="flex-row items-center gap-3">
                                        <Text className="text-3xl">
                                            {result.affordability.isAffordable ? '✅' : '⚠️'}
                                        </Text>
                                        <View className="flex-1">
                                            <Text className="text-white font-bold text-lg">
                                                {result.affordability.isAffordable
                                                    ? 'Préstamo AFFORDABLE'
                                                    : 'Préstamo RIESGOSO'
                                                }
                                            </Text>
                                            <Text className="text-gray-400 text-sm">
                                                Ratio de servicio de deuda: {result.affordability.debtServiceRatio?.toFixed(1)}%
                                                {result.affordability.isAffordable ? ' (< 40% es saludable)' : ' (> 40% es riesgoso)'}
                                            </Text>
                                        </View>
                                    </View>

                                    {result.affordability.cushionAfterPayment !== null && (
                                        <View className="mt-4 pt-4 border-t border-white/10">
                                            <Text className="text-gray-400 text-sm">
                                                Después del pago te quedan: {' '}
                                                <Text className={result.affordability.cushionAfterPayment >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                                                    ${result.affordability.cushionAfterPayment.toLocaleString()}/mes
                                                </Text>
                                            </Text>
                                        </View>
                                    )}
                                </GlassCard>
                            )}

                            {/* Amortization Table */}
                            <AmortizationPreview schedule={result.amortizationSchedule} />

                            {/* Recommendations */}
                            <GlassCard>
                                <Text className="text-white font-semibold mb-4">💡 Recomendaciones</Text>
                                <View className="gap-2">
                                    {recommendations.map((rec, i) => (
                                        <Text key={i} className="text-gray-300">• {rec}</Text>
                                    ))}
                                </View>
                            </GlassCard>

                            <GradientButton size="lg">📄 Exportar a PDF</GradientButton>
                        </>
                    ) : (
                        <GlassCard className="items-center py-12">
                            <Ionicons name="card" size={48} color="#6b7280" />
                            <Text className="text-gray-400 mt-4 text-center">
                                Ingresa los datos del préstamo{'\n'}para ver el análisis
                            </Text>
                        </GlassCard>
                    )}
                </View>
            </View>
        </View>
    );
}
