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
import { useTranslation } from '@/lib/i18n-context';

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
    const { t } = useTranslation();
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

    // Generate recommendations using translations
    const recommendations = useMemo(() => {
        if (!result) return [];
        
        const recs: string[] = [];
        
        if (result.affordability.isAffordable === false) {
            recs.push(t('calculator.loan.recommendations.unaffordable'));
        } else if (result.affordability.isAffordable === true) {
            recs.push(t('calculator.loan.recommendations.affordable'));
        }
        
        if (result.affordability.cushionAfterPayment !== null && result.affordability.cushionAfterPayment > 0) {
            recs.push(t('calculator.loan.recommendations.remaining_low', { 
                amount: result.affordability.cushionAfterPayment.toLocaleString() 
            }));
        }
        
        recs.push(t('calculator.loan.recommendations.compare_options'));
        recs.push(t('calculator.loan.recommendations.negotiate_terms'));
        
        return recs;
    }, [result, t]);

    return (
        <ScrollView 
            className="flex-1 bg-[#020617]"
            contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 40 }}
        >
            <View className="max-w-5xl mx-auto">
                <SectionHeading
                    title={`💳 ${t('calculator.loan.title')}`}
                    subtitle={t('calculator.loan.subtitle')}
                />

                <View className="flex-row flex-wrap gap-6">
                    {/* Form */}
                    <View className="flex-1 min-w-[300px]">
                        <GlassCard>
                            <Text className="text-white font-semibold text-lg mb-6">
                                {t('calculator.enter_data')}
                            </Text>

                            <InputField
                                label={t('calculator.loan.loan_amount')}
                                value={principal}
                                onChange={setPrincipal}
                                prefix="$"
                            />

                            <InputField
                                label={t('calculator.loan.interest_rate')}
                                value={interestRate}
                                onChange={setInterestRate}
                                suffix="%"
                            />

                            <InputField
                                label={t('calculator.loan.term')}
                                value={termMonths}
                                onChange={setTermMonths}
                                suffix={t('calculator.loan.months')}
                            />

                            <View className="h-px bg-white/10 my-4" />
                            <Text className="text-gray-400 text-sm mb-4">
                                {t('calculator.loan.affordability_analysis')}
                            </Text>

                            <InputField
                                label={t('calculator.loan.monthly_income')}
                                value={monthlyRevenue}
                                onChange={setMonthlyRevenue}
                                prefix="$"
                            />

                            <InputField
                                label={t('calculator.loan.monthly_expenses')}
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
                                    <Text className="text-gray-400">{t('calculator.loan.monthly_payment')}</Text>
                                    <Text className="text-5xl font-bold text-white mt-2">
                                        ${result.monthlyPayment.toLocaleString()}
                                    </Text>
                                </GlassCard>

                                {/* Summary Cards */}
                                <View className="flex-row flex-wrap gap-4">
                                    <GlassCard className="flex-1 min-w-[140px]">
                                        <Text className="text-gray-400 text-sm">{t('calculator.loan.total_to_pay')}</Text>
                                        <Text className="text-2xl font-bold text-white">
                                            ${result.totalPayment.toLocaleString()}
                                        </Text>
                                    </GlassCard>

                                    <GlassCard className="flex-1 min-w-[140px]">
                                        <Text className="text-gray-400 text-sm">{t('calculator.loan.total_interest')}</Text>
                                        <Text className="text-2xl font-bold text-rose-400">
                                            ${result.totalInterest.toLocaleString()}
                                        </Text>
                                    </GlassCard>

                                    <GlassCard className="flex-1 min-w-[140px]">
                                        <Text className="text-gray-400 text-sm">{t('calculator.loan.effective_rate')}</Text>
                                        <Text className="text-2xl font-bold text-amber-400">
                                            {result.effectiveAnnualRate != null ? result.effectiveAnnualRate.toFixed(1) : '0'}%
                                        </Text>
                                    </GlassCard>
                                </View>

                                {/* Affordability */}
                                {result.affordability.isAffordable !== null && (
                                    <GlassCard className={`border-2 ${result.affordability.isAffordable ? 'border-[#86EFAC]/50' : 'border-[#FB923C]/50'}`}>
                                        <View className="flex-row items-center gap-3">
                                            <Text className="text-3xl">
                                                {result.affordability.isAffordable ? '✅' : '⚠️'}
                                            </Text>
                                            <View className="flex-1">
                                                <Text className="text-white font-bold text-lg">
                                                    {result.affordability.isAffordable
                                                        ? t('calculator.loan.affordable')
                                                        : 'Préstamo RIESGOSO'
                                                    }
                                                </Text>
                                                <Text className="text-gray-400 text-sm">
                                                    {t('calculator.loan.debt_service_ratio', { 
                                                        ratio: result.affordability.debtServiceRatio != null ? result.affordability.debtServiceRatio.toFixed(1) : '0' 
                                                    })}
                                                </Text>
                                            </View>
                                        </View>

                                        {result.affordability.cushionAfterPayment !== null && (
                                            <View className="mt-4 pt-4 border-t border-white/10">
                                                <Text className="text-gray-400 text-sm">
                                                    {t('calculator.loan.remaining_after_payment', {
                                                        amount: result.affordability.cushionAfterPayment.toLocaleString()
                                                    })}
                                                </Text>
                                            </View>
                                        )}
                                    </GlassCard>
                                )}

                                {/* Amortization Table */}
                                <AmortizationPreview schedule={result.amortizationSchedule} />

                                {/* Recommendations */}
                                {recommendations.length > 0 && (
                                    <GlassCard>
                                        <Text className="text-white font-semibold mb-4">💡 {t('calculator.recommendations')}</Text>
                                        <View className="gap-2">
                                            {recommendations.map((rec, i) => (
                                                <Text key={i} className="text-gray-300">• {rec}</Text>
                                            ))}
                                        </View>
                                    </GlassCard>
                                )}

                                <GradientButton size="lg">📄 {t('calculator.export_pdf')}</GradientButton>
                            </>
                        ) : (
                            <GlassCard className="items-center py-12">
                                <Ionicons name="card" size={48} color="#6b7280" />
                                <Text className="text-gray-400 mt-4 text-center">
                                    {t('calculator.no_data')}
                                </Text>
                            </GlassCard>
                        )}
                    </View>
                </View>
            </View>
        </ScrollView>
    );
}
