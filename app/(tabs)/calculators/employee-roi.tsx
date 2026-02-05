/**
 * @fileoverview Employee ROI Calculator Page
 * Evaluates if hiring decisions make financial sense
 */

import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
    GlassCard,
    GradientButton,
    SectionHeading,
    Badge,
} from '@/components/landing/shared-components';
import { EmployeeROICalculator } from '@/lib/infrastructure/calculators/EmployeeROICalculator';
import { useTranslation } from '@/lib/i18n-context';
import { LanguageSelector } from '@/components/language-selector';

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

function RoleSelector({ selected, onSelect }: { selected: string; onSelect: (role: string) => void }) {
    const roles = [
        { id: 'sales', label: 'Ventas', icon: '💼' },
        { id: 'operations', label: 'Operaciones', icon: '⚙️' },
        { id: 'technical', label: 'Técnico', icon: '💻' },
        { id: 'administrative', label: 'Admin', icon: '📋' },
    ];

    return (
        <View className="mb-4">
            <Text className="text-gray-300 font-medium mb-2">Tipo de rol</Text>
            <View className="flex-row flex-wrap gap-2">
                {roles.map((role) => (
                    <Pressable
                        key={role.id}
                        onPress={() => onSelect(role.id)}
                        className={`px-4 py-2 rounded-xl border ${selected === role.id
                                ? 'bg-[#14B8A6]/20 border-[#14B8A6]'
                                : 'bg-slate-800 border-white/10'
                            }`}
                    >
                        <Text className="text-white">{role.icon} {role.label}</Text>
                    </Pressable>
                ))}
            </View>
        </View>
    );
}

function ROIGauge({ roi }: { roi: number }) {
    const getColor = () => {
        if (roi >= 100) return { bg: 'bg-[#86EFAC]', text: 'text-emerald-400' };
        if (roi >= 50) return { bg: 'bg-[#FB923C]', text: 'text-amber-400' };
        if (roi >= 0) return { bg: 'bg-orange-500', text: 'text-orange-400' };
        return { bg: 'bg-[#FB923C]', text: 'text-rose-400' };
    };

    const colors = getColor();
    const fillPercent = Math.min(Math.max((roi + 100) / 2, 0), 100);

    return (
        <View className="items-center">
            <View className="w-48 h-48 rounded-full border-8 border-white/10 items-center justify-center relative">
                <View
                    className={`absolute inset-0 rounded-full ${colors.bg} opacity-20`}
                    style={{
                        clipPath: `polygon(0 ${100 - fillPercent}%, 100% ${100 - fillPercent}%, 100% 100%, 0 100%)`
                    }}
                />
                <View className="items-center">
                    <Text className={`text-5xl font-bold ${colors.text}`}>{roi != null ? roi.toFixed(0) : '0'}%</Text>
                    <Text className="text-gray-400 text-sm">ROI</Text>
                </View>
            </View>
        </View>
    );
}

export default function EmployeeROIPage() {
    const { t } = useTranslation();
    const [annualSalary, setAnnualSalary] = useState('60000');
    const [annualBenefits, setAnnualBenefits] = useState('12000');
    const [onboardingCosts, setOnboardingCosts] = useState('5000');
    const [revenueGenerated, setRevenueGenerated] = useState('150000');
    const [hoursPerWeek, setHoursPerWeek] = useState('40');
    const [roleType, setRoleType] = useState('operations');

    const calculator = useMemo(() => new EmployeeROICalculator(), []);

    const result = useMemo(() => {
        try {
            const salary = parseFloat(annualSalary) || 0;
            const benefits = parseFloat(annualBenefits) || 0;
            const onboarding = parseFloat(onboardingCosts) || 0;
            const revenue = parseFloat(revenueGenerated) || 0;
            const hours = parseFloat(hoursPerWeek) || 0;

            if (salary <= 0 || benefits <= 0 || onboarding <= 0 || revenue <= 0 || hours <= 0) return null;

            return calculator.calculate({
                annualSalary: salary,
                annualBenefits: benefits,
                onboardingCosts: onboarding,
                revenueGenerated: revenue,
                hoursPerWeek: hours,
                roleType,
            });
        } catch {
            return null;
        }
    }, [annualSalary, annualBenefits, onboardingCosts, revenueGenerated, hoursPerWeek, roleType, calculator]);

    // Generate recommendations using translations
    const recommendations = useMemo(() => {
        if (!result) return [];
        
        const recs: string[] = [];
        
        if (result.roiPercentage >= 50) {
            recs.push(t('calculator.employee_roi.recommendations.positive_hire'));
        } else if (result.roiPercentage < 0) {
            recs.push(t('calculator.employee_roi.recommendations.negative_roi'));
        } else {
            recs.push(t('calculator.employee_roi.recommendations.adjust_expectations'));
        }
        
        if (result.paybackMonths && result.paybackMonths <= 6) {
            recs.push(t('calculator.employee_roi.recommendations.fast_payback', { 
                months: result.paybackMonths.toString() 
            }));
        }
        
        recs.push(t('calculator.employee_roi.recommendations.optimize_role'));
        
        return recs;
    }, [result, t]);

    return (
        <ScrollView 
            className="flex-1 bg-[#020617]"
            contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 40 }}
        >
            <View className="max-w-5xl mx-auto">
                {/* Header with Language Selector */}
                <View className="flex-row items-start justify-between mb-6">
                    <View className="flex-1">
                        <SectionHeading
                            title={`👥 ${t('calculator.employee_roi.title')}`}
                            subtitle={t('calculator.employee_roi.subtitle')}
                        />
                    </View>
                    <LanguageSelector />
                </View>

                <View className="flex-row flex-wrap gap-6">
                    {/* Form */}
                    <View className="flex-1 min-w-[300px]">
                        <GlassCard>
                            <Text className="text-white font-semibold text-lg mb-6">
                                {t('calculator.enter_data')}
                            </Text>

                            <RoleSelector selected={roleType} onSelect={setRoleType} />

                            <InputField
                                label={t('calculator.employee_roi.annual_salary')}
                                value={annualSalary}
                                onChange={setAnnualSalary}
                                prefix="$"
                            />

                            <InputField
                                label={t('calculator.employee_roi.additional_costs')}
                                value={annualBenefits}
                                onChange={setAnnualBenefits}
                                prefix="$"
                            />

                            <InputField
                                label="Costos de onboarding"
                                value={onboardingCosts}
                                onChange={setOnboardingCosts}
                                prefix="$"
                                hint="Training, equipo, reclutamiento"
                            />

                            <InputField
                                label={t('calculator.employee_roi.expected_revenue')}
                                value={revenueGenerated}
                                onChange={setRevenueGenerated}
                                prefix="$"
                            />

                            <InputField
                                label="Horas por semana"
                                value={hoursPerWeek}
                                onChange={setHoursPerWeek}
                                suffix="hrs"
                            />
                        </GlassCard>
                    </View>

                    {/* Results */}
                    <View className="flex-1 min-w-[300px] gap-4">
                        {result ? (
                            <>
                                {/* Main Result */}
                                <GlassCard gradient className="items-center py-8">
                                    <ROIGauge roi={result.roiPercentage} />
                                    <View className="flex-row gap-4 mt-6">
                                        <Badge variant={result.isWorthHiring ? 'success' : 'danger'}>
                                            {result.isWorthHiring ? `✅ ${t('calculator.employee_roi.positive_hire')}` : `⚠️ ${t('calculator.employee_roi.negative_hire')}`}
                                        </Badge>
                                    </View>
                                </GlassCard>

                                {/* Metrics */}
                                <View className="flex-row flex-wrap gap-4">
                                    <GlassCard className="flex-1 min-w-[140px]">
                                        <Text className="text-gray-400 text-sm">{t('calculator.employee_roi.total_cost')}</Text>
                                        <Text className="text-2xl font-bold text-white">
                                            ${result.totalCost.toLocaleString()}
                                        </Text>
                                        <Text className="text-gray-500 text-xs">Primer año</Text>
                                    </GlassCard>

                                    <GlassCard className="flex-1 min-w-[140px]">
                                        <Text className="text-gray-400 text-sm">{t('calculator.employee_roi.net_benefit')}</Text>
                                        <Text className={`text-2xl font-bold ${result.netContribution >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            ${result.netContribution.toLocaleString()}
                                        </Text>
                                        <Text className="text-gray-500 text-xs">Revenue - Costo</Text>
                                    </GlassCard>

                                    <GlassCard className="flex-1 min-w-[140px]">
                                        <Text className="text-gray-400 text-sm">Por cada $1 invertido</Text>
                                        <Text className="text-2xl font-bold text-indigo-400">
                                            ${result.revenuePerDollarSpent != null ? result.revenuePerDollarSpent.toFixed(2) : '0.00'}
                                        </Text>
                                        <Text className="text-gray-500 text-xs">Retorno</Text>
                                    </GlassCard>
                                </View>

                                {/* Productivity */}
                                <GlassCard>
                                    <Text className="text-white font-semibold mb-4">📊 Productividad</Text>
                                    <View className="flex-row justify-between">
                                        <View className="items-center flex-1">
                                            <Text className="text-gray-400 text-xs">Costo/hora</Text>
                                            <Text className="text-white text-xl font-bold">${result.costPerHour}</Text>
                                        </View>
                                        <View className="items-center flex-1">
                                            <Text className="text-gray-400 text-xs">Revenue/hora</Text>
                                            <Text className="text-emerald-400 text-xl font-bold">${result.revenuePerHour}</Text>
                                        </View>
                                        <View className="items-center flex-1">
                                            <Text className="text-gray-400 text-xs">Ratio</Text>
                                            <Text className="text-indigo-400 text-xl font-bold">{result.productivityRatio}x</Text>
                                        </View>
                                    </View>

                                    <View className="mt-4 pt-4 border-t border-white/10">
                                        <View className="flex-row items-center gap-2">
                                            <Badge variant={result.benchmarkComparison.productivityLevel === 'high' ? 'success' : result.benchmarkComparison.productivityLevel === 'low' ? 'danger' : 'warning'}>
                                                Productividad: {result.benchmarkComparison.productivityLevel.toUpperCase()}
                                            </Badge>
                                            <Text className="text-gray-500 text-xs">vs promedio de industria</Text>
                                        </View>
                                    </View>
                                </GlassCard>

                                {/* Payback */}
                                {result.paybackMonths && (
                                    <GlassCard>
                                        <View className="flex-row items-center gap-3">
                                            <Text className="text-3xl">⏱️</Text>
                                            <View>
                                                <Text className="text-white font-bold">{t('calculator.employee_roi.payback')}</Text>
                                                <Text className="text-indigo-400">
                                                    {result.paybackMonths} {t('calculator.employee_roi.months')} para recuperar costos de onboarding
                                                </Text>
                                            </View>
                                        </View>
                                    </GlassCard>
                                )}

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
                                <Ionicons name="people" size={48} color="#6b7280" />
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
