/**
 * @fileoverview Marketing ROI Calculator Page
 * Measures advertising effectiveness by channel
 */

import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
    GlassCard,
    GradientButton,
    SectionHeading,
    Badge,
} from '@/components/landing/shared-components';
import { MarketingROICalculator } from '@/lib/infrastructure/calculators/MarketingROICalculator';

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

function ChannelSelector({ selected, onSelect }: { selected: string; onSelect: (channel: string) => void }) {
    const channels = [
        { id: 'facebook', label: 'Facebook', icon: '📘', color: 'bg-blue-500/20 border-blue-500' },
        { id: 'google', label: 'Google', icon: '🔍', color: 'bg-green-500/20 border-green-500' },
        { id: 'instagram', label: 'Instagram', icon: '📸', color: 'bg-pink-500/20 border-pink-500' },
        { id: 'email', label: 'Email', icon: '✉️', color: 'bg-amber-500/20 border-amber-500' },
        { id: 'referral', label: 'Referidos', icon: '🤝', color: 'bg-violet-500/20 border-violet-500' },
        { id: 'other', label: 'Otro', icon: '📊', color: 'bg-gray-500/20 border-gray-500' },
    ];

    return (
        <View className="mb-4">
            <Text className="text-gray-300 font-medium mb-2">Canal de marketing</Text>
            <View className="flex-row flex-wrap gap-2">
                {channels.map((channel) => (
                    <Pressable
                        key={channel.id}
                        onPress={() => onSelect(channel.id)}
                        className={`px-4 py-2 rounded-xl border ${selected === channel.id
                                ? channel.color
                                : 'bg-slate-800 border-white/10'
                            }`}
                    >
                        <Text className="text-white">{channel.icon} {channel.label}</Text>
                    </Pressable>
                ))}
            </View>
        </View>
    );
}

function FunnelVisual({ impressions, clicks, conversions }: { impressions?: number; clicks?: number; conversions: number }) {
    const maxWidth = 100;
    const clicksWidth = impressions && clicks ? (clicks / impressions) * maxWidth : maxWidth;
    const conversionsWidth = clicks ? (conversions / clicks) * clicksWidth : maxWidth * 0.5;

    return (
        <GlassCard>
            <Text className="text-white font-semibold mb-4">📊 Funnel de Conversión</Text>

            <View className="gap-3">
                {impressions && (
                    <View>
                        <View className="flex-row justify-between mb-1">
                            <Text className="text-gray-400 text-sm">Impresiones</Text>
                            <Text className="text-white">{impressions.toLocaleString()}</Text>
                        </View>
                        <View className="h-6 bg-slate-700 rounded-full overflow-hidden">
                            <View className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }} />
                        </View>
                    </View>
                )}

                {clicks && (
                    <View>
                        <View className="flex-row justify-between mb-1">
                            <Text className="text-gray-400 text-sm">Clicks</Text>
                            <Text className="text-white">{clicks.toLocaleString()}</Text>
                        </View>
                        <View className="h-6 bg-slate-700 rounded-full overflow-hidden">
                            <View
                                className="h-full bg-indigo-500 rounded-full"
                                style={{ width: `${clicksWidth}%` }}
                            />
                        </View>
                    </View>
                )}

                <View>
                    <View className="flex-row justify-between mb-1">
                        <Text className="text-gray-400 text-sm">Conversiones</Text>
                        <Text className="text-emerald-400 font-bold">{conversions.toLocaleString()}</Text>
                    </View>
                    <View className="h-6 bg-slate-700 rounded-full overflow-hidden">
                        <View
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${Math.max(conversionsWidth, 5)}%` }}
                        />
                    </View>
                </View>
            </View>
        </GlassCard>
    );
}

export default function MarketingPage() {
    const [totalSpend, setTotalSpend] = useState('5000');
    const [conversions, setConversions] = useState('100');
    const [revenuePerConversion, setRevenuePerConversion] = useState('150');
    const [channel, setChannel] = useState('facebook');
    const [impressions, setImpressions] = useState('50000');
    const [clicks, setClicks] = useState('2000');

    const calculator = useMemo(() => new MarketingROICalculator(), []);

    const result = useMemo(() => {
        try {
            const spend = parseFloat(totalSpend) || 0;
            const conv = parseInt(conversions) || 0;
            const revenue = parseFloat(revenuePerConversion) || 0;
            const impr = impressions ? parseInt(impressions) : undefined;
            const clk = clicks ? parseInt(clicks) : undefined;

            if (spend <= 0 || conv <= 0 || revenue <= 0) return null;

            return calculator.calculate({
                totalSpend: spend,
                conversions: conv,
                revenuePerConversion: revenue,
                channel,
                impressions: impr,
                clicks: clk,
            });
        } catch {
            return null;
        }
    }, [totalSpend, conversions, revenuePerConversion, channel, impressions, clicks, calculator]);

    const recommendations = result ? calculator.generateRecommendations(result, {
        totalSpend: parseFloat(totalSpend),
        conversions: parseInt(conversions),
        revenuePerConversion: parseFloat(revenuePerConversion),
        channel,
    }) : [];

    return (
        <View className="max-w-5xl mx-auto">
            <SectionHeading
                title="📢 ROI de Marketing"
                subtitle="¿Tu publicidad está funcionando? Mide el retorno por canal"
            />

            <View className="flex-row flex-wrap gap-6">
                {/* Form */}
                <View className="flex-1 min-w-[300px]">
                    <GlassCard>
                        <Text className="text-white font-semibold text-lg mb-6">Datos de la Campaña</Text>

                        <ChannelSelector selected={channel} onSelect={setChannel} />

                        <InputField
                            label="Inversión total"
                            value={totalSpend}
                            onChange={setTotalSpend}
                            prefix="$"
                        />

                        <InputField
                            label="Conversiones (ventas)"
                            value={conversions}
                            onChange={setConversions}
                        />

                        <InputField
                            label="Ingreso por conversión"
                            value={revenuePerConversion}
                            onChange={setRevenuePerConversion}
                            prefix="$"
                            hint="Ticket promedio"
                        />

                        <View className="h-px bg-white/10 my-4" />
                        <Text className="text-gray-400 text-sm mb-4">Métricas opcionales (para análisis detallado)</Text>

                        <InputField
                            label="Impresiones"
                            value={impressions}
                            onChange={setImpressions}
                        />

                        <InputField
                            label="Clicks"
                            value={clicks}
                            onChange={setClicks}
                        />
                    </GlassCard>
                </View>

                {/* Results */}
                <View className="flex-1 min-w-[300px] gap-4">
                    {result ? (
                        <>
                            {/* Main Metrics */}
                            <View className="flex-row flex-wrap gap-4">
                                <GlassCard gradient className="flex-1 min-w-[140px] items-center py-6">
                                    <Text className="text-gray-400 text-sm">ROI</Text>
                                    <Text className={`text-4xl font-bold ${result.roiPercentage >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {result.roiPercentage.toFixed(0)}%
                                    </Text>
                                </GlassCard>

                                <GlassCard className="flex-1 min-w-[140px] items-center py-6">
                                    <Text className="text-gray-400 text-sm">ROAS</Text>
                                    <Text className="text-3xl font-bold text-indigo-400">
                                        {result.roas.toFixed(1)}x
                                    </Text>
                                    <Text className="text-gray-500 text-xs">Return on Ad Spend</Text>
                                </GlassCard>
                            </View>

                            {/* Profit/Loss */}
                            <GlassCard className={`border-2 ${result.isProfitable ? 'border-emerald-500/50' : 'border-rose-500/50'}`}>
                                <View className="flex-row items-center gap-3">
                                    <Text className="text-4xl">{result.isProfitable ? '💰' : '📉'}</Text>
                                    <View>
                                        <Text className="text-white font-bold text-lg">
                                            {result.isProfitable ? 'CAMPAÑA RENTABLE' : 'CAMPAÑA EN PÉRDIDA'}
                                        </Text>
                                        <Text className={result.isProfitable ? 'text-emerald-400' : 'text-rose-400'}>
                                            {result.isProfitable
                                                ? `Ganancia neta: $${result.netProfit.toLocaleString()}`
                                                : `Pérdida: $${Math.abs(result.netProfit).toLocaleString()}`
                                            }
                                        </Text>
                                    </View>
                                </View>
                            </GlassCard>

                            {/* Detailed Metrics */}
                            <View className="flex-row flex-wrap gap-4">
                                <GlassCard className="flex-1 min-w-[100px]">
                                    <Text className="text-gray-400 text-xs">CAC</Text>
                                    <Text className="text-xl font-bold text-white">${result.costPerAcquisition}</Text>
                                    <Badge variant={result.benchmarkComparison.cacVsBenchmark === 'better' ? 'success' : result.benchmarkComparison.cacVsBenchmark === 'worse' ? 'danger' : 'warning'}>
                                        {result.benchmarkComparison.cacVsBenchmark === 'better' ? '↓ Bajo' : result.benchmarkComparison.cacVsBenchmark === 'worse' ? '↑ Alto' : '~ Normal'}
                                    </Badge>
                                </GlassCard>

                                {result.clickThroughRate && (
                                    <GlassCard className="flex-1 min-w-[100px]">
                                        <Text className="text-gray-400 text-xs">CTR</Text>
                                        <Text className="text-xl font-bold text-white">{result.clickThroughRate}%</Text>
                                    </GlassCard>
                                )}

                                {result.conversionRate && (
                                    <GlassCard className="flex-1 min-w-[100px]">
                                        <Text className="text-gray-400 text-xs">Conv. Rate</Text>
                                        <Text className="text-xl font-bold text-white">{result.conversionRate}%</Text>
                                    </GlassCard>
                                )}

                                {result.costPerClick && (
                                    <GlassCard className="flex-1 min-w-[100px]">
                                        <Text className="text-gray-400 text-xs">CPC</Text>
                                        <Text className="text-xl font-bold text-white">${result.costPerClick}</Text>
                                    </GlassCard>
                                )}
                            </View>

                            {/* Funnel */}
                            {(impressions || clicks) && (
                                <FunnelVisual
                                    impressions={impressions ? parseInt(impressions) : undefined}
                                    clicks={clicks ? parseInt(clicks) : undefined}
                                    conversions={parseInt(conversions)}
                                />
                            )}

                            {/* LTV/CAC */}
                            {result.lifetimeValueToCAC && (
                                <GlassCard>
                                    <Text className="text-white font-semibold mb-2">📈 LTV/CAC Ratio</Text>
                                    <View className="flex-row items-center gap-4">
                                        <Text className={`text-3xl font-bold ${result.lifetimeValueToCAC >= 3 ? 'text-emerald-400' : result.lifetimeValueToCAC >= 1 ? 'text-amber-400' : 'text-rose-400'}`}>
                                            {result.lifetimeValueToCAC.toFixed(1)}x
                                        </Text>
                                        <Text className="text-gray-400 text-sm flex-1">
                                            {result.lifetimeValueToCAC >= 3
                                                ? 'Excelente! Puedes escalar con confianza'
                                                : result.lifetimeValueToCAC >= 1
                                                    ? 'Aceptable, pero hay espacio para mejorar'
                                                    : 'Bajo. El CAC es muy alto vs el valor del cliente'
                                            }
                                        </Text>
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
                            <Ionicons name="megaphone" size={48} color="#6b7280" />
                            <Text className="text-gray-400 mt-4 text-center">
                                Ingresa los datos de tu campaña{'\n'}para ver el análisis de ROI
                            </Text>
                        </GlassCard>
                    )}
                </View>
            </View>
        </View>
    );
}
