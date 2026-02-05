/**
 * @fileoverview Dashboard - Main overview page for CruxAnalytics
 * Shows health score, key metrics, and quick access to calculators
 */

import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import {
    GlassCard,
    GradientButton,
    SectionHeading,
    Badge,
} from '@/components/landing/shared-components';

// ============================================
// HEALTH SCORE GAUGE
// ============================================
function HealthScoreGauge({ score }: { score: number | null }) {
    const getScoreColor = (s: number) => {
        if (s >= 80) return { color: '#10b981', label: 'Excelente' };
        if (s >= 60) return { color: '#f59e0b', label: 'Bueno' };
        if (s >= 40) return { color: '#f97316', label: 'Regular' };
        return { color: '#ef4444', label: 'Crítico' };
    };

    const scoreInfo = score !== null ? getScoreColor(score) : null;

    return (
        <GlassCard gradient className="items-center py-8">
            <Text className="text-gray-400 text-sm mb-4">HEALTH SCORE</Text>

            {score !== null ? (
                <>
                    <View className="w-36 h-36 rounded-full border-8 border-white/10 items-center justify-center mb-4"
                        style={{ borderColor: `${scoreInfo?.color}30` }}
                    >
                        <LinearGradient
                            colors={[`${scoreInfo?.color}40`, `${scoreInfo?.color}10`]}
                            className="absolute inset-0 rounded-full"
                        />
                        <Text className="text-5xl font-bold text-white">{score}</Text>
                    </View>
                    <Badge variant={score >= 60 ? 'success' : score >= 40 ? 'warning' : 'danger'}>
                        {scoreInfo?.label}
                    </Badge>
                </>
            ) : (
                <>
                    <View className="w-36 h-36 rounded-full border-8 border-white/10 items-center justify-center mb-4">
                        <Ionicons name="help" size={48} color="#6b7280" />
                    </View>
                    <Text className="text-gray-500 text-center">
                        Completa al menos 3 análisis{'\n'}para ver tu score
                    </Text>
                </>
            )}
        </GlassCard>
    );
}

// ============================================
// QUICK ACTION CARD
// ============================================
function QuickActionCard({
    icon,
    title,
    description,
    status,
    href,
}: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    description: string;
    status: 'complete' | 'pending' | 'locked';
    href: string;
}) {
    const router = useRouter();

    const statusConfig = {
        complete: { badge: '✓ Completo', color: 'success' as const },
        pending: { badge: 'Pendiente', color: 'warning' as const },
        locked: { badge: '🔒 Bloqueado', color: 'default' as const },
    };

    return (
        <Pressable onPress={() => router.push(href as any)}>
            <GlassCard className="flex-row items-center gap-4 hover:bg-white/10 transition-colors">
                <View className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 items-center justify-center">
                    <Ionicons name={icon} size={24} color="white" />
                </View>
                <View className="flex-1">
                    <Text className="text-white font-semibold">{title}</Text>
                    <Text className="text-gray-500 text-sm">{description}</Text>
                </View>
                <Badge variant={statusConfig[status].color}>
                    {statusConfig[status].badge}
                </Badge>
                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
            </GlassCard>
        </Pressable>
    );
}

// ============================================
// METRIC SUMMARY CARD
// ============================================
function MetricSummaryCard({
    icon,
    label,
    value,
    trend,
    trendLabel,
}: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value: string;
    trend: 'up' | 'down' | 'neutral';
    trendLabel: string;
}) {
    const trendConfig = {
        up: { icon: 'trending-up' as const, color: '#10b981' },
        down: { icon: 'trending-down' as const, color: '#ef4444' },
        neutral: { icon: 'remove' as const, color: '#6b7280' },
    };

    return (
        <GlassCard className="flex-1 min-w-[200px]">
            <View className="flex-row items-center gap-2 mb-3">
                <Ionicons name={icon} size={18} color="#6366f1" />
                <Text className="text-gray-400 text-sm">{label}</Text>
            </View>
            <Text className="text-white text-2xl font-bold">{value}</Text>
            <View className="flex-row items-center gap-1 mt-2">
                <Ionicons
                    name={trendConfig[trend].icon}
                    size={16}
                    color={trendConfig[trend].color}
                />
                <Text style={{ color: trendConfig[trend].color }} className="text-sm">
                    {trendLabel}
                </Text>
            </View>
        </GlassCard>
    );
}

// ============================================
// MAIN DASHBOARD
// ============================================
export default function CruxDashboard() {
    // In a real app, this would come from state/storage
    const [analysisStatus] = useState({
        breakEven: 'pending' as const,
        cashFlow: 'pending' as const,
        pricing: 'pending' as const,
        loan: 'pending' as const,
        employeeRoi: 'pending' as const,
        marketing: 'pending' as const,
    });

    const completedCount = Object.values(analysisStatus).filter(s => s === 'complete').length;
    const healthScore = completedCount >= 3 ? 72 : null; // Mock score

    return (
        <View className="max-w-6xl mx-auto">
            {/* Header */}
            <View className="mb-8">
                <Text className="text-3xl font-bold text-white">
                    Bienvenido a <Text className="text-indigo-400">CruxAnalytics</Text>
                </Text>
                <Text className="text-gray-400 mt-2">
                    Analiza tu negocio y toma mejores decisiones financieras
                </Text>
            </View>

            {/* Main Grid */}
            <View className="flex-row flex-wrap gap-6">
                {/* Left: Health Score */}
                <View className="w-full md:w-80">
                    <HealthScoreGauge score={healthScore} />

                    {/* Progress */}
                    <GlassCard className="mt-6">
                        <Text className="text-white font-semibold mb-3">Tu progreso</Text>
                        <View className="flex-row items-center gap-3">
                            <View className="flex-1 h-2 rounded-full bg-white/10">
                                <View
                                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                                    style={{ width: `${(completedCount / 6) * 100}%` }}
                                />
                            </View>
                            <Text className="text-gray-400 text-sm">{completedCount}/6</Text>
                        </View>
                    </GlassCard>
                </View>

                {/* Right: Analysis Tools */}
                <View className="flex-1 min-w-[320px] gap-4">
                    <Text className="text-white font-semibold text-lg mb-2">
                        Herramientas de Análisis
                    </Text>

                    <QuickActionCard
                        icon="trending-up"
                        title="Punto de Equilibrio"
                        description="¿Cuánto debes vender para no perder?"
                        status={analysisStatus.breakEven}
                        href="/crux/break-even"
                    />

                    <QuickActionCard
                        icon="wallet"
                        title="Flujo de Caja"
                        description="Proyección de ingresos y gastos"
                        status={analysisStatus.cashFlow}
                        href="/crux/cash-flow"
                    />

                    <QuickActionCard
                        icon="pricetag"
                        title="Calculadora de Precios"
                        description="¿A qué precio deberías vender?"
                        status={analysisStatus.pricing}
                        href="/crux/pricing"
                    />

                    <QuickActionCard
                        icon="card"
                        title="Evaluador de Préstamos"
                        description="¿Es bueno ese financiamiento?"
                        status={analysisStatus.loan}
                        href="/crux/loan"
                    />

                    <QuickActionCard
                        icon="people"
                        title="ROI de Empleados"
                        description="¿Vale la pena contratar?"
                        status={analysisStatus.employeeRoi}
                        href="/crux/employee-roi"
                    />

                    <QuickActionCard
                        icon="megaphone"
                        title="ROI de Marketing"
                        description="¿Tu publicidad funciona?"
                        status={analysisStatus.marketing}
                        href="/crux/marketing"
                    />
                </View>
            </View>

            {/* Tips Section */}
            <View className="mt-12">
                <SectionHeading
                    title="💡 Tips rápidos"
                    subtitle="Consejos para mejorar tu negocio"
                />

                <View className="flex-row flex-wrap gap-4">
                    <GlassCard className="flex-1 min-w-[280px]">
                        <Text className="text-indigo-400 font-bold mb-2">Punto de Equilibrio</Text>
                        <Text className="text-gray-300">
                            Si no conoces tu break-even, estás navegando a ciegas.
                            Es la métrica más importante para cualquier negocio.
                        </Text>
                    </GlassCard>

                    <GlassCard className="flex-1 min-w-[280px]">
                        <Text className="text-emerald-400 font-bold mb-2">Flujo de Caja</Text>
                        <Text className="text-gray-300">
                            El 82% de los negocios que quiebran lo hacen por problemas de flujo de caja,
                            no por falta de ventas.
                        </Text>
                    </GlassCard>

                    <GlassCard className="flex-1 min-w-[280px]">
                        <Text className="text-amber-400 font-bold mb-2">Margen de Seguridad</Text>
                        <Text className="text-gray-300">
                            Un margen de seguridad del 25% significa que puedes perder 25% de ventas
                            antes de empezar a perder dinero.
                        </Text>
                    </GlassCard>
                </View>
            </View>
        </View>
    );
}
