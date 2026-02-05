/**
 * @fileoverview Pricing Calculator Page
 * Helps determine optimal pricing with competitor comparison
 */

import React, { useState, useMemo } from 'react';
import { View, Text, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
    GlassCard,
    GradientButton,
    SectionHeading,
    Badge,
} from '@/components/landing/shared-components';
import { PricingCalculator } from '@/lib/infrastructure/calculators/PricingCalculator';

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

function PriceStrategyCard({
    strategy, price, benefits, recommended,
}: {
    strategy: string; price: number; benefits: string; recommended?: boolean;
}) {
    return (
        <GlassCard className={`flex-1 min-w-[150px] ${recommended ? 'border-2 border-indigo-500' : ''}`}>
            {recommended && (
                <Badge variant="success" className="mb-2">✨ Recomendado</Badge>
            )}
            <Text className="text-gray-400 text-sm">{strategy}</Text>
            <Text className="text-2xl font-bold text-white">${price.toFixed(2)}</Text>
            <Text className="text-gray-500 text-xs mt-2">{benefits}</Text>
        </GlassCard>
    );
}

export default function PricingPage() {
    const [costPerUnit, setCostPerUnit] = useState('15');
    const [desiredMargin, setDesiredMargin] = useState('40');
    const [competitorPrice, setCompetitorPrice] = useState('30');

    const calculator = useMemo(() => new PricingCalculator(), []);

    const result = useMemo(() => {
        try {
            const cost = parseFloat(costPerUnit) || 0;
            const margin = parseFloat(desiredMargin) || 0;
            const competitor = competitorPrice ? parseFloat(competitorPrice) : undefined;

            if (cost <= 0 || margin < 0 || margin >= 100) return null;

            return calculator.calculate({
                costPerUnit: cost,
                desiredMargin: margin,
                competitorPrice: competitor,
            });
        } catch {
            return null;
        }
    }, [costPerUnit, desiredMargin, competitorPrice, calculator]);

    const recommendations = result ? calculator.generateRecommendations(result, {
        costPerUnit: parseFloat(costPerUnit),
        desiredMargin: parseFloat(desiredMargin),
        competitorPrice: competitorPrice ? parseFloat(competitorPrice) : undefined,
    }) : [];

    return (
        <View className="max-w-5xl mx-auto">
            <SectionHeading
                title="🏷️ Calculadora de Precios"
                subtitle="Encuentra el precio óptimo para maximizar tus ganancias"
            />

            <View className="flex-row flex-wrap gap-6">
                {/* Form */}
                <View className="flex-1 min-w-[300px]">
                    <GlassCard>
                        <Text className="text-white font-semibold text-lg mb-6">Ingresa tus datos</Text>

                        <InputField
                            label="Costo por unidad"
                            value={costPerUnit}
                            onChange={setCostPerUnit}
                            prefix="$"
                            hint="Cuánto te cuesta producir/adquirir"
                        />

                        <InputField
                            label="Margen deseado"
                            value={desiredMargin}
                            onChange={setDesiredMargin}
                            suffix="%"
                            hint="Porcentaje de ganancia objetivo"
                        />

                        <InputField
                            label="Precio de competencia (opcional)"
                            value={competitorPrice}
                            onChange={setCompetitorPrice}
                            prefix="$"
                            hint="Para comparar tu posición"
                        />
                    </GlassCard>
                </View>

                {/* Results */}
                <View className="flex-1 min-w-[300px] gap-4">
                    {result ? (
                        <>
                            {/* Main Price */}
                            <GlassCard gradient className="items-center py-8">
                                <Text className="text-gray-400">Precio Recomendado</Text>
                                <Text className="text-5xl font-bold text-white mt-2">
                                    ${result.recommendedPrice.toFixed(2)}
                                </Text>
                                <View className="flex-row gap-4 mt-4">
                                    <Badge variant="success">
                                        ${result.grossProfitPerUnit.toFixed(2)} ganancia/unidad
                                    </Badge>
                                    <Badge>
                                        {result.markupPercentage.toFixed(0)}% markup
                                    </Badge>
                                </View>
                            </GlassCard>

                            {/* Price Range */}
                            <GlassCard>
                                <Text className="text-white font-semibold mb-4">Rango de Precios Sugerido</Text>
                                <View className="flex-row items-center gap-4">
                                    <View className="items-center">
                                        <Text className="text-gray-400 text-xs">Mínimo</Text>
                                        <Text className="text-white text-xl font-bold">${result.recommendedPriceRange.low}</Text>
                                    </View>
                                    <View className="flex-1 h-2 bg-slate-700 rounded-full">
                                        <View className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" style={{ width: '60%' }} />
                                    </View>
                                    <View className="items-center">
                                        <Text className="text-gray-400 text-xs">Máximo</Text>
                                        <Text className="text-white text-xl font-bold">${result.recommendedPriceRange.high}</Text>
                                    </View>
                                </View>
                            </GlassCard>

                            {/* Strategies */}
                            <Text className="text-white font-semibold">Estrategias de Precio</Text>
                            <View className="flex-row flex-wrap gap-4">
                                <PriceStrategyCard
                                    strategy="Premium"
                                    price={result.priceStrategies.premium}
                                    benefits="Mayor margen, menor volumen"
                                />
                                <PriceStrategyCard
                                    strategy="Competitivo"
                                    price={result.priceStrategies.competitive}
                                    benefits="Igual que la competencia"
                                    recommended
                                />
                                <PriceStrategyCard
                                    strategy="Penetración"
                                    price={result.priceStrategies.penetration}
                                    benefits="Mayor volumen, menor margen"
                                />
                            </View>

                            {/* Competitor Comparison */}
                            {result.competitorComparison && (
                                <GlassCard className={`border ${result.competitorComparison.position === 'above' ? 'border-amber-500/30' : 'border-emerald-500/30'}`}>
                                    <View className="flex-row items-center gap-3">
                                        <Text className="text-2xl">
                                            {result.competitorComparison.position === 'above' ? '⬆️' : '⬇️'}
                                        </Text>
                                        <View>
                                            <Text className="text-white font-bold">
                                                {result.competitorComparison.position === 'above'
                                                    ? `${Math.abs(result.competitorComparison.percentageDiff).toFixed(1)}% POR ENCIMA de competencia`
                                                    : `${Math.abs(result.competitorComparison.percentageDiff).toFixed(1)}% POR DEBAJO de competencia`
                                                }
                                            </Text>
                                            <Text className="text-gray-400 text-sm">
                                                Diferencia: ${Math.abs(result.competitorComparison.difference).toFixed(2)}
                                            </Text>
                                        </View>
                                    </View>
                                </GlassCard>
                            )}

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
                            <Ionicons name="pricetag" size={48} color="#6b7280" />
                            <Text className="text-gray-400 mt-4 text-center">
                                Ingresa tus datos para ver{'\n'}el análisis de precios
                            </Text>
                        </GlassCard>
                    )}
                </View>
            </View>
        </View>
    );
}
