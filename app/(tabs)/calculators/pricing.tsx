/**
 * @fileoverview Pricing Calculator Page
 * Helps determine optimal pricing with competitor comparison
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
import { PricingCalculator } from '@/lib/infrastructure/calculators/PricingCalculator';
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

function PriceStrategyCard({
    strategy, price, benefits, recommended,
}: {
    strategy: string; price: number; benefits: string; recommended?: boolean;
}) {
    const { t } = useTranslation();
    
    return (
        <GlassCard className={`flex-1 min-w-[150px] ${recommended ? 'border-2 border-[#14B8A6]' : ''}`}>
            {recommended && (
                <Badge variant="success" className="mb-2">✨ {t('calculator.pricing.recommended')}</Badge>
            )}
            <Text className="text-gray-400 text-sm">{strategy}</Text>
            <Text className="text-2xl font-bold text-white">${price != null ? price.toFixed(2) : '0.00'}</Text>
            <Text className="text-gray-500 text-xs mt-2">{benefits}</Text>
        </GlassCard>
    );
}

export default function PricingPage() {
    const { t } = useTranslation();
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

    // Generate recommendations using translations
    const recommendations = useMemo(() => {
        if (!result) return [];
        
        const recs: string[] = [];
        const cost = parseFloat(costPerUnit);
        const margin = parseFloat(desiredMargin);
        
        if (result.competitorComparison) {
            const percentDiff = Math.abs(result.competitorComparison.percentageDiff).toFixed(1);
            if (result.competitorComparison.position === 'above') {
                recs.push(t('calculator.pricing.recommendations.high_vs_competition', { percent: percentDiff }));
            } else {
                recs.push(t('calculator.pricing.recommendations.low_vs_competition', { percent: percentDiff }));
            }
        }
        
        if (margin > 50) {
            recs.push(t('calculator.pricing.recommendations.high_margin'));
        }
        
        recs.push(t('calculator.pricing.recommendations.test_prices'));
        recs.push(t('calculator.pricing.recommendations.monitor_prices'));
        
        return recs;
    }, [result, costPerUnit, desiredMargin, t]);

    return (
        <ScrollView 
            className="flex-1 bg-[#020617]"
            contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 40 }}
        >
            <View className="max-w-5xl mx-auto">
                <SectionHeading
                    title={`🏷️ ${t('calculator.pricing.title')}`}
                    subtitle={t('calculator.pricing.subtitle')}
                />

                <View className="flex-row flex-wrap gap-6">
                    {/* Form */}
                    <View className="flex-1 min-w-[300px]">
                        <GlassCard>
                            <Text className="text-white font-semibold text-lg mb-6">
                                {t('calculator.enter_data')}
                            </Text>

                            <InputField
                                label={t('calculator.pricing.cost_per_unit')}
                                value={costPerUnit}
                                onChange={setCostPerUnit}
                                prefix="$"
                                hint={t('calculator.pricing.cost_per_unit_hint')}
                            />

                            <InputField
                                label={t('calculator.pricing.desired_margin')}
                                value={desiredMargin}
                                onChange={setDesiredMargin}
                                suffix="%"
                                hint={t('calculator.pricing.desired_margin_hint')}
                            />

                            <InputField
                                label={t('calculator.pricing.competitor_price')}
                                value={competitorPrice}
                                onChange={setCompetitorPrice}
                                prefix="$"
                                hint={t('calculator.pricing.competitor_price_hint')}
                            />
                        </GlassCard>
                    </View>

                    {/* Results */}
                    <View className="flex-1 min-w-[300px] gap-4">
                        {result ? (
                            <>
                                {/* Main Price */}
                                <GlassCard gradient className="items-center py-8">
                                    <Text className="text-gray-400">{t('calculator.pricing.recommended_price')}</Text>
                                    <Text className="text-5xl font-bold text-white mt-2">
                                        ${result.recommendedPrice != null ? result.recommendedPrice.toFixed(2) : '0.00'}
                                    </Text>
                                    <View className="flex-row gap-4 mt-4">
                                        <Badge variant="success">
                                            ${result.grossProfitPerUnit != null ? result.grossProfitPerUnit.toFixed(2) : '0.00'} {t('calculator.pricing.profit_per_unit')}
                                        </Badge>
                                        <Badge>
                                            {result.markupPercentage != null ? result.markupPercentage.toFixed(0) : '0'}% {t('calculator.pricing.markup')}
                                        </Badge>
                                    </View>
                                </GlassCard>

                                {/* Price Range */}
                                <GlassCard>
                                    <Text className="text-white font-semibold mb-4">
                                        {t('calculator.pricing.price_range')}
                                    </Text>
                                    <View className="flex-row items-center gap-4">
                                        <View className="items-center">
                                            <Text className="text-gray-400 text-xs">{t('calculator.pricing.minimum')}</Text>
                                            <Text className="text-white text-xl font-bold">${result.recommendedPriceRange.low}</Text>
                                        </View>
                                        <View className="flex-1 h-2 bg-slate-700 rounded-full">
                                            <View className="h-full bg-gradient-to-r from-[#14B8A6] to-[#86EFAC] rounded-full" style={{ width: '60%' }} />
                                        </View>
                                        <View className="items-center">
                                            <Text className="text-gray-400 text-xs">{t('calculator.pricing.maximum')}</Text>
                                            <Text className="text-white text-xl font-bold">${result.recommendedPriceRange.high}</Text>
                                        </View>
                                    </View>
                                </GlassCard>

                                {/* Strategies */}
                                <Text className="text-white font-semibold">{t('calculator.pricing.pricing_strategies')}</Text>
                                <View className="flex-row flex-wrap gap-4">
                                    <PriceStrategyCard
                                        strategy={t('calculator.pricing.premium')}
                                        price={result.priceStrategies.premium}
                                        benefits={t('calculator.pricing.premium_benefits')}
                                    />
                                    <PriceStrategyCard
                                        strategy={t('calculator.pricing.competitive')}
                                        price={result.priceStrategies.competitive}
                                        benefits={t('calculator.pricing.competitive_benefits')}
                                        recommended
                                    />
                                    <PriceStrategyCard
                                        strategy={t('calculator.pricing.penetration')}
                                        price={result.priceStrategies.penetration}
                                        benefits={t('calculator.pricing.penetration_benefits')}
                                    />
                                </View>

                                {/* Competitor Comparison */}
                                {result.competitorComparison && (
                                    <GlassCard className={`border ${result.competitorComparison.position === 'above' ? 'border-[#FB923C]/30' : 'border-[#86EFAC]/30'}`}>
                                        <View className="flex-row items-center gap-3">
                                            <Text className="text-2xl">
                                                {result.competitorComparison.position === 'above' ? '⬆️' : '⬇️'}
                                            </Text>
                                            <View>
                                                <Text className="text-white font-bold">
                                                    {result.competitorComparison.position === 'above'
                                                        ? `${result.competitorComparison.percentageDiff != null ? Math.abs(result.competitorComparison.percentageDiff).toFixed(1) : '0'}% ${t('calculator.pricing.above_competitor')}`
                                                        : `${result.competitorComparison.percentageDiff != null ? Math.abs(result.competitorComparison.percentageDiff).toFixed(1) : '0'}% ${t('calculator.pricing.below_competitor')}`
                                                    }
                                                </Text>
                                                <Text className="text-gray-400 text-sm">
                                                    {t('calculator.pricing.difference')}: ${result.competitorComparison.difference != null ? Math.abs(result.competitorComparison.difference).toFixed(2) : '0.00'}
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
                                <Ionicons name="pricetag" size={48} color="#6b7280" />
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
