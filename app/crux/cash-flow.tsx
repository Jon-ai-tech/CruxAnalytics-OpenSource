/**
 * @fileoverview Cash Flow Forecast Calculator Page
 * 12-month projection with visual timeline and alert system
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
import { CashFlowForecastCalculator } from '@/lib/infrastructure/calculators/CashFlowForecastCalculator';

function InputField({
    label,
    value,
    onChange,
    prefix,
    hint,
}: {
    label: string;
    value: string;
    onChange: (val: string) => void;
    prefix?: string;
    hint?: string;
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
            </View>
            {hint && <Text className="text-gray-500 text-xs mt-1">{hint}</Text>}
        </View>
    );
}

function CashFlowTimeline({ forecasts }: { forecasts: Array<{ month: number; netCash: number; balance: number }> }) {
    const maxBalance = Math.max(...forecasts.map(f => Math.abs(f.balance)));

    return (
        <GlassCard>
            <Text className="text-white font-semibold mb-4">📊 Proyección 12 Meses</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-2 pb-4">
                    {forecasts.map((forecast, index) => {
                        const height = Math.abs(forecast.balance) / maxBalance * 100;
                        const isPositive = forecast.balance >= 0;

                        return (
                            <View key={index} className="items-center w-16">
                                {/* Bar */}
                                <View className="h-32 w-8 justify-end bg-slate-800 rounded-lg overflow-hidden">
                                    <View
                                        className={`w-full rounded-t-lg ${isPositive ? 'bg-emerald-500' : 'bg-rose-500'}`}
                                        style={{ height: `${Math.max(height, 10)}%` }}
                                    />
                                </View>
                                {/* Month label */}
                                <Text className="text-gray-400 text-xs mt-2">Mes {forecast.month}</Text>
                                {/* Value */}
                                <Text className={`text-xs font-medium ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    ${(forecast.balance / 1000).toFixed(0)}k
                                </Text>
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
        </GlassCard>
    );
}

function AlertsPanel({ alerts }: { alerts: string[] }) {
    if (alerts.length === 0) {
        return (
            <GlassCard className="border border-emerald-500/30">
                <View className="flex-row items-center gap-3">
                    <Text className="text-2xl">✅</Text>
                    <View>
                        <Text className="text-emerald-400 font-bold">Sin alertas críticas</Text>
                        <Text className="text-gray-400 text-sm">Tu flujo de caja se ve saludable</Text>
                    </View>
                </View>
            </GlassCard>
        );
    }

    return (
        <GlassCard className="border border-rose-500/30">
            <Text className="text-white font-semibold mb-4">⚠️ Alertas</Text>
            <View className="gap-2">
                {alerts.map((alert, index) => (
                    <View key={index} className="flex-row items-start gap-2">
                        <Text className="text-rose-400">•</Text>
                        <Text className="text-gray-300 flex-1">{alert}</Text>
                    </View>
                ))}
            </View>
        </GlassCard>
    );
}

export default function CashFlowPage() {
    const [startingCash, setStartingCash] = useState('50000');
    const [monthlyRevenue, setMonthlyRevenue] = useState('30000');
    const [monthlyExpenses, setMonthlyExpenses] = useState('25000');
    const [expectedGrowth, setExpectedGrowth] = useState('5');

    const calculator = useMemo(() => new CashFlowForecastCalculator(), []);

    const result = useMemo(() => {
        try {
            const starting = parseFloat(startingCash) || 0;
            const revenue = parseFloat(monthlyRevenue) || 0;
            const expenses = parseFloat(monthlyExpenses) || 0;
            const growth = parseFloat(expectedGrowth) || 0;

            if (starting <= 0 || revenue <= 0 || expenses <= 0) return null;

            return calculator.calculate({
                startingCash: starting,
                monthlyRevenue: revenue,
                monthlyExpenses: expenses,
                expectedGrowthRate: growth,
            });
        } catch {
            return null;
        }
    }, [startingCash, monthlyRevenue, monthlyExpenses, expectedGrowth, calculator]);

    const recommendations = result ? calculator.generateRecommendations(result) : [];

    return (
        <View className="max-w-5xl mx-auto">
            <SectionHeading
                title="💰 Flujo de Caja"
                subtitle="Proyecta tus ingresos y gastos para los próximos 12 meses"
            />

            <View className="flex-row flex-wrap gap-6">
                {/* Input Form */}
                <View className="flex-1 min-w-[300px]">
                    <GlassCard>
                        <Text className="text-white font-semibold text-lg mb-6">Ingresa tus datos</Text>

                        <InputField
                            label="Efectivo inicial"
                            value={startingCash}
                            onChange={setStartingCash}
                            prefix="$"
                            hint="Dinero disponible ahora"
                        />

                        <InputField
                            label="Ingresos mensuales"
                            value={monthlyRevenue}
                            onChange={setMonthlyRevenue}
                            prefix="$"
                            hint="Promedio de ventas"
                        />

                        <InputField
                            label="Gastos mensuales"
                            value={monthlyExpenses}
                            onChange={setMonthlyExpenses}
                            prefix="$"
                            hint="Todos los gastos fijos y variables"
                        />

                        <InputField
                            label="Crecimiento esperado"
                            value={expectedGrowth}
                            onChange={setExpectedGrowth}
                            prefix="%"
                            hint="Porcentaje de crecimiento mensual"
                        />
                    </GlassCard>
                </View>

                {/* Results */}
                <View className="flex-1 min-w-[300px] gap-4">
                    {result ? (
                        <>
                            {/* Summary Cards */}
                            <View className="flex-row flex-wrap gap-4">
                                <GlassCard className="flex-1 min-w-[140px]">
                                    <Text className="text-gray-400 text-sm">Balance Final</Text>
                                    <Text className={`text-2xl font-bold ${result.endingCash >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        ${result.endingCash.toLocaleString()}
                                    </Text>
                                </GlassCard>

                                <GlassCard className="flex-1 min-w-[140px]">
                                    <Text className="text-gray-400 text-sm">Runway</Text>
                                    <Text className="text-2xl font-bold text-white">
                                        {result.monthsUntilDeficit ?? '∞'} meses
                                    </Text>
                                </GlassCard>

                                <GlassCard className="flex-1 min-w-[140px]">
                                    <Text className="text-gray-400 text-sm">Reserva Mínima</Text>
                                    <Text className="text-2xl font-bold text-amber-400">
                                        ${result.minimumCashReserve.toLocaleString()}
                                    </Text>
                                </GlassCard>
                            </View>

                            {/* Health Status */}
                            <GlassCard className={`border-2 ${result.isHealthy ? 'border-emerald-500/50' : 'border-rose-500/50'}`}>
                                <View className="flex-row items-center gap-3">
                                    <Text className="text-3xl">{result.isHealthy ? '🟢' : '🔴'}</Text>
                                    <View>
                                        <Text className="text-white font-bold text-lg">
                                            {result.isHealthy ? 'Flujo de Caja Saludable' : 'Flujo de Caja en Riesgo'}
                                        </Text>
                                        <Text className={result.isHealthy ? 'text-emerald-400' : 'text-rose-400'}>
                                            {result.isHealthy
                                                ? 'Tienes suficiente liquidez para los próximos 12 meses'
                                                : `Podrías quedarte sin efectivo en ${result.monthsUntilDeficit} meses`
                                            }
                                        </Text>
                                    </View>
                                </View>
                            </GlassCard>

                            {/* Timeline Chart */}
                            <CashFlowTimeline forecasts={result.monthlyForecasts} />

                            {/* Alerts */}
                            <AlertsPanel alerts={result.alerts} />

                            {/* Recommendations */}
                            <GlassCard>
                                <Text className="text-white font-semibold mb-4">💡 Recomendaciones</Text>
                                <View className="gap-2">
                                    {recommendations.map((rec, i) => (
                                        <View key={i} className="flex-row gap-2">
                                            <Text className="text-indigo-400">{i + 1}.</Text>
                                            <Text className="text-gray-300 flex-1">{rec}</Text>
                                        </View>
                                    ))}
                                </View>
                            </GlassCard>

                            <GradientButton size="lg">📄 Exportar a PDF</GradientButton>
                        </>
                    ) : (
                        <GlassCard className="items-center py-12">
                            <Ionicons name="wallet" size={48} color="#6b7280" />
                            <Text className="text-gray-400 mt-4 text-center">
                                Ingresa tus datos para ver{'\n'}la proyección de flujo de caja
                            </Text>
                        </GlassCard>
                    )}
                </View>
            </View>
        </View>
    );
}
