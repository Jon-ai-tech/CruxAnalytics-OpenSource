/**
 * @fileoverview Break-Even Calculator Page
 * Interactive calculator with visual results and recommendations
 */

import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
    GlassCard,
    GradientButton,
    SectionHeading,
    Badge,
} from '@/components/landing/shared-components';
import { BreakEvenCalculator } from '@/lib/infrastructure/calculators/BreakEvenCalculator';

// ============================================
// INPUT FIELD COMPONENT
// ============================================
function InputField({
    label,
    value,
    onChange,
    placeholder,
    prefix,
    suffix,
    hint,
}: {
    label: string;
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    prefix?: string;
    suffix?: string;
    hint?: string;
}) {
    return (
        <View className="mb-4">
            <Text className="text-gray-300 font-medium mb-2">{label}</Text>
            <View className="flex-row items-center bg-slate-800 rounded-xl border border-white/10 overflow-hidden">
                {prefix && (
                    <Text className="text-gray-500 pl-4">{prefix}</Text>
                )}
                <TextInput
                    className="flex-1 px-4 py-3 text-white text-lg"
                    value={value}
                    onChangeText={onChange}
                    placeholder={placeholder}
                    placeholderTextColor="#6b7280"
                    keyboardType="numeric"
                />
                {suffix && (
                    <Text className="text-gray-500 pr-4">{suffix}</Text>
                )}
            </View>
            {hint && <Text className="text-gray-500 text-xs mt-1">{hint}</Text>}
        </View>
    );
}

// ============================================
// RESULT CARD COMPONENT
// ============================================
function ResultCard({
    label,
    value,
    icon,
    color,
    large,
}: {
    label: string;
    value: string;
    icon: string;
    color: 'indigo' | 'emerald' | 'amber' | 'rose';
    large?: boolean;
}) {
    const colorMap = {
        indigo: 'from-[#14B8A6] to-[#86EFAC]',
        emerald: 'from-[#86EFAC] to-[#14B8A6]',
        amber: 'from-[#FB923C] to-orange-500',
        rose: 'from-[#FB923C] to-pink-500',
    };

    return (
        <GlassCard className={`${large ? 'col-span-2' : ''}`}>
            <View className="flex-row items-center gap-3 mb-2">
                <View className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorMap[color]} items-center justify-center`}>
                    <Text className="text-xl">{icon}</Text>
                </View>
                <Text className="text-gray-400 text-sm">{label}</Text>
            </View>
            <Text className={`text-white font-bold ${large ? 'text-3xl' : 'text-2xl'}`}>
                {value}
            </Text>
        </GlassCard>
    );
}

// ============================================
// BREAK-EVEN CHART (Simplified)
// ============================================
function BreakEvenChart({
    breakEvenUnits,
    currentUnits,
    pricePerUnit,
    variableCost,
    fixedCosts,
}: {
    breakEvenUnits: number;
    currentUnits: number | null;
    pricePerUnit: number;
    variableCost: number;
    fixedCosts: number;
}) {
    const maxUnits = Math.max(breakEvenUnits * 1.5, currentUnits || 0);
    const breakEvenPercent = (breakEvenUnits / maxUnits) * 100;
    const currentPercent = currentUnits ? (currentUnits / maxUnits) * 100 : null;

    return (
        <GlassCard>
            <Text className="text-white font-semibold mb-4">Visualización</Text>

            {/* Chart Bar */}
            <View className="h-8 bg-slate-800 rounded-full overflow-hidden relative">
                {/* Loss zone */}
                <View
                    className="absolute left-0 top-0 bottom-0 bg-[#FB923C]/30"
                    style={{ width: `${breakEvenPercent}%` }}
                />
                {/* Profit zone */}
                <View
                    className="absolute right-0 top-0 bottom-0 bg-[#86EFAC]/30"
                    style={{ width: `${100 - breakEvenPercent}%` }}
                />

                {/* Break-even marker */}
                <View
                    className="absolute top-0 bottom-0 w-1 bg-white"
                    style={{ left: `${breakEvenPercent}%` }}
                />

                {/* Current position */}
                {currentPercent !== null && (
                    <View
                        className="absolute top-0 bottom-0 w-3 h-3 rounded-full bg-[#14B8A6] border-2 border-white self-center"
                        style={{ left: `${currentPercent}%`, marginTop: 10 }}
                    />
                )}
            </View>

            {/* Labels */}
            <View className="flex-row justify-between mt-4">
                <View>
                    <Text className="text-rose-400 text-xs">🔴 Pérdida</Text>
                    <Text className="text-gray-500 text-xs">0 - {breakEvenUnits.toLocaleString()} unidades</Text>
                </View>
                <View className="items-center">
                    <Text className="text-white text-xs font-bold">⚡ Break-even</Text>
                    <Text className="text-gray-500 text-xs">{breakEvenUnits.toLocaleString()} unidades</Text>
                </View>
                <View className="items-end">
                    <Text className="text-emerald-400 text-xs">🟢 Ganancia</Text>
                    <Text className="text-gray-500 text-xs">{breakEvenUnits.toLocaleString()}+ unidades</Text>
                </View>
            </View>
        </GlassCard>
    );
}

// ============================================
// RECOMMENDATIONS COMPONENT
// ============================================
function Recommendations({ items }: { items: string[] }) {
    return (
        <GlassCard>
            <Text className="text-white font-semibold mb-4">💡 Recomendaciones</Text>
            <View className="gap-3">
                {items.map((item, index) => (
                    <View key={index} className="flex-row gap-3">
                        <View className="w-6 h-6 rounded-full bg-[#14B8A6]/20 items-center justify-center">
                            <Text className="text-indigo-400 text-xs font-bold">{index + 1}</Text>
                        </View>
                        <Text className="text-gray-300 flex-1">{item}</Text>
                    </View>
                ))}
            </View>
        </GlassCard>
    );
}

// ============================================
// MAIN PAGE
// ============================================
export default function BreakEvenPage() {
    const [fixedCosts, setFixedCosts] = useState('10000');
    const [pricePerUnit, setPricePerUnit] = useState('50');
    const [variableCost, setVariableCost] = useState('25');
    const [currentSales, setCurrentSales] = useState('');

    const calculator = useMemo(() => new BreakEvenCalculator(), []);

    const result = useMemo(() => {
        try {
            const fixed = parseFloat(fixedCosts) || 0;
            const price = parseFloat(pricePerUnit) || 0;
            const variable = parseFloat(variableCost) || 0;
            const current = currentSales ? parseInt(currentSales) : undefined;

            if (fixed <= 0 || price <= 0 || variable <= 0 || price <= variable) {
                return null;
            }

            return calculator.calculate({
                fixedCosts: fixed,
                pricePerUnit: price,
                variableCostPerUnit: variable,
                currentSalesUnits: current,
            });
        } catch {
            return null;
        }
    }, [fixedCosts, pricePerUnit, variableCost, currentSales, calculator]);

    const recommendations = result ? calculator.generateRecommendations(result) : [];

    return (
        <ScrollView 
            className="flex-1 bg-[#020617]"
            contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 40 }}
        >
            <View className="max-w-5xl mx-auto">
            <SectionHeading
                title="📈 Punto de Equilibrio"
                subtitle="Descubre cuántas unidades necesitas vender para no perder dinero"
            />

            <View className="flex-row flex-wrap gap-6">
                {/* Input Form */}
                <View className="flex-1 min-w-[300px]">
                    <GlassCard>
                        <Text className="text-white font-semibold text-lg mb-6">
                            Ingresa tus datos
                        </Text>

                        <InputField
                            label="Costos fijos mensuales"
                            value={fixedCosts}
                            onChange={setFixedCosts}
                            prefix="$"
                            hint="Renta, salarios, servicios, etc."
                        />

                        <InputField
                            label="Precio por unidad"
                            value={pricePerUnit}
                            onChange={setPricePerUnit}
                            prefix="$"
                            hint="Lo que cobra por cada producto/servicio"
                        />

                        <InputField
                            label="Costo variable por unidad"
                            value={variableCost}
                            onChange={setVariableCost}
                            prefix="$"
                            hint="Materiales, comisiones, envío, etc."
                        />

                        <InputField
                            label="Ventas actuales (opcional)"
                            value={currentSales}
                            onChange={setCurrentSales}
                            suffix="unidades"
                            hint="Para calcular tu margen de seguridad"
                        />
                    </GlassCard>
                </View>

                {/* Results */}
                <View className="flex-1 min-w-[300px] gap-4">
                    {result ? (
                        <>
                            {/* Main Results */}
                            <View className="flex-row flex-wrap gap-4">
                                <ResultCard
                                    label="Punto de Equilibrio (Unidades)"
                                    value={result.breakEvenUnits.toLocaleString()}
                                    icon="🎯"
                                    color="indigo"
                                    large
                                />

                                <ResultCard
                                    label="Punto de Equilibrio (Ingresos)"
                                    value={`$${result.breakEvenRevenue.toLocaleString()}`}
                                    icon="💰"
                                    color="emerald"
                                />

                                <ResultCard
                                    label="Contribución por Unidad"
                                    value={result.contributionMarginPerUnit != null ? `$${result.contributionMarginPerUnit.toFixed(2)}` : '$0.00'}
                                    icon="📊"
                                    color="amber"
                                />
                            </View>

                            {/* Margin of Safety */}
                            {result.marginOfSafety !== undefined && (
                                <GlassCard className={`border-2 ${result.isAboveBreakEven ? 'border-[#86EFAC]/50' : 'border-[#FB923C]/50'}`}>
                                    <View className="flex-row items-center gap-3">
                                        <Text className="text-3xl">{result.isAboveBreakEven ? '✅' : '⚠️'}</Text>
                                        <View>
                                            <Text className="text-white font-bold text-lg">
                                                {result.isAboveBreakEven ? 'Por encima del equilibrio' : 'Por debajo del equilibrio'}
                                            </Text>
                                            <Text className={result.isAboveBreakEven ? 'text-emerald-400' : 'text-rose-400'}>
                                                Margen de seguridad: {result.marginOfSafety != null ? result.marginOfSafety.toFixed(1) : '0'}%
                                            </Text>
                                        </View>
                                    </View>
                                </GlassCard>
                            )}

                            {/* Chart */}
                            <BreakEvenChart
                                breakEvenUnits={result.breakEvenUnits}
                                currentUnits={currentSales ? parseInt(currentSales) : null}
                                pricePerUnit={parseFloat(pricePerUnit)}
                                variableCost={parseFloat(variableCost)}
                                fixedCosts={parseFloat(fixedCosts)}
                            />

                            {/* Recommendations */}
                            <Recommendations items={recommendations} />

                            {/* Export */}
                            <GradientButton size="lg">
                                📄 Exportar a PDF
                            </GradientButton>
                        </>
                    ) : (
                        <GlassCard className="items-center py-12">
                            <Ionicons name="calculator" size={48} color="#6b7280" />
                            <Text className="text-gray-400 mt-4 text-center">
                                Ingresa tus datos para ver{'\n'}el análisis de punto de equilibrio
                            </Text>
                        </GlassCard>
                    )}
                </View>
            </View>
        </View>
    </ScrollView>
);
}
