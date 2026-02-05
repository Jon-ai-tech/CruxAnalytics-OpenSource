/**
 * @fileoverview Landing Page for CruxAnalytics
 * A stunning, professional landing page designed to convert visitors
 * and showcase the value of the SME financial analysis tool.
 */

import React from 'react';
import { View, Text, ScrollView, Pressable, Image, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
    GlassCard,
    GradientButton,
    OutlineButton,
    FeatureCard,
    StatNumber,
    SectionHeading,
    TestimonialCard,
    Badge,
} from '@/components/landing/shared-components';

// ============================================
// HERO SECTION
// ============================================
function HeroSection() {
    const router = useRouter();

    return (
        <View className="min-h-screen justify-center items-center px-6 py-20 relative overflow-hidden">
            {/* Background gradient orbs */}
            <View className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#00C0D4]/20 blur-[120px]" />
            <View className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#A7F3D0]/20 blur-[120px]" />

            {/* Content */}
            <View className="max-w-4xl items-center z-10">
                <Badge variant="success">
                    <Text>✨ 100% Gratis • Sin registro</Text>
                </Badge>

                <Text className="text-4xl md:text-6xl lg:text-7xl font-bold text-white text-center mt-6 leading-tight">
                    Descubre si tu negocio{'\n'}
                    <Text className="bg-gradient-to-r from-[#00C0D4] to-[#A7F3D0] bg-clip-text text-transparent">
                        está en riesgo
                    </Text>
                </Text>

                <Text className="text-xl text-gray-400 text-center mt-6 max-w-2xl leading-relaxed">
                    El 80% de los negocios quiebran porque no conocen sus números.
                    CruxAnalytics te dice exactamente qué hacer para evitarlo.
                </Text>

                <View className="flex-row gap-4 mt-10">
                    <GradientButton
                        size="lg"
                        onPress={() => router.push('/crux')}
                    >
                        Analizar mi negocio →
                    </GradientButton>
                    <OutlineButton onPress={() => { }}>
                        Ver demo
                    </OutlineButton>
                </View>

                {/* Trust indicators */}
                <View className="flex-row gap-8 mt-12 opacity-60">
                    <Text className="text-gray-400 text-sm">🔒 Datos 100% privados</Text>
                    <Text className="text-gray-400 text-sm">⚡ Resultados en 2 min</Text>
                    <Text className="text-gray-400 text-sm">💡 Con IA explicativa</Text>
                </View>
            </View>
        </View>
    );
}

// ============================================
// PROBLEM SECTION
// ============================================
function ProblemSection() {
    return (
        <View className="px-6 py-20 bg-gradient-to-b from-transparent to-slate-900/50">
            <View className="max-w-6xl mx-auto">
                <SectionHeading
                    title="El problema que nadie te cuenta"
                    subtitle="La mayoría de emprendedores toman decisiones a ciegas"
                    centered
                />

                {/* Statistics */}
                <View className="flex-row flex-wrap justify-center gap-8 md:gap-16 mt-12">
                    <StatNumber value={80} suffix="%" label="de negocios quiebran en 5 años" />
                    <StatNumber value={60} suffix="%" label="no saben su punto de equilibrio" />
                    <StatNumber value={45} suffix="%" label="no proyectan flujo de caja" />
                </View>

                {/* Pain points */}
                <View className="flex-row flex-wrap gap-6 mt-16 justify-center">
                    <GlassCard className="max-w-xs">
                        <Text className="text-3xl mb-4">😰</Text>
                        <Text className="text-white font-bold text-lg mb-2">
                            "No sé cuánto debo vender"
                        </Text>
                        <Text className="text-gray-400">
                            Sin conocer tu punto de equilibrio, es imposible saber si estás ganando o perdiendo.
                        </Text>
                    </GlassCard>

                    <GlassCard className="max-w-xs">
                        <Text className="text-3xl mb-4">💸</Text>
                        <Text className="text-white font-bold text-lg mb-2">
                            "Se me acaba el dinero"
                        </Text>
                        <Text className="text-gray-400">
                            Sin proyectar tu flujo de caja, los gastos inesperados te toman por sorpresa.
                        </Text>
                    </GlassCard>

                    <GlassCard className="max-w-xs">
                        <Text className="text-3xl mb-4">❓</Text>
                        <Text className="text-white font-bold text-lg mb-2">
                            "¿Me conviene ese préstamo?"
                        </Text>
                        <Text className="text-gray-400">
                            Sin analizar opciones, podrías pagar miles de dólares de más en intereses.
                        </Text>
                    </GlassCard>
                </View>
            </View>
        </View>
    );
}

// ============================================
// SOLUTION SECTION
// ============================================
function SolutionSection() {
    return (
        <View className="px-6 py-20">
            <View className="max-w-6xl mx-auto">
                <View className="flex-row flex-wrap items-center gap-12">
                    {/* Text */}
                    <View className="flex-1 min-w-[300px]">
                        <Badge>La solución</Badge>
                        <Text className="text-3xl md:text-4xl font-bold text-white mt-4">
                            Tu analista financiero personal.{'\n'}
                            <Text className="text-[#00C0D4]">Gratis y en 2 minutos.</Text>
                        </Text>
                        <Text className="text-gray-400 text-lg mt-6 leading-relaxed">
                            CruxAnalytics analiza tu negocio y te da:
                        </Text>

                        <View className="mt-6 gap-4">
                            <View className="flex-row items-center gap-3">
                                <View className="w-8 h-8 rounded-full bg-emerald-500/20 items-center justify-center">
                                    <Ionicons name="checkmark" size={18} color="#10b981" />
                                </View>
                                <Text className="text-white">Tu punto de equilibrio exacto</Text>
                            </View>
                            <View className="flex-row items-center gap-3">
                                <View className="w-8 h-8 rounded-full bg-emerald-500/20 items-center justify-center">
                                    <Ionicons name="checkmark" size={18} color="#10b981" />
                                </View>
                                <Text className="text-white">Proyección de flujo de caja 12 meses</Text>
                            </View>
                            <View className="flex-row items-center gap-3">
                                <View className="w-8 h-8 rounded-full bg-emerald-500/20 items-center justify-center">
                                    <Ionicons name="checkmark" size={18} color="#10b981" />
                                </View>
                                <Text className="text-white">Comparación con tu industria</Text>
                            </View>
                            <View className="flex-row items-center gap-3">
                                <View className="w-8 h-8 rounded-full bg-emerald-500/20 items-center justify-center">
                                    <Ionicons name="checkmark" size={18} color="#10b981" />
                                </View>
                                <Text className="text-white">Recomendaciones con IA explicativa</Text>
                            </View>
                        </View>
                    </View>

                    {/* Visual */}
                    <View className="flex-1 min-w-[300px]">
                        <GlassCard gradient className="p-8">
                            <View className="bg-slate-900 rounded-xl p-6">
                                <Text className="text-emerald-400 text-sm font-bold mb-2">✅ TU NEGOCIO</Text>
                                <Text className="text-white text-2xl font-bold">ESTÁ SALUDABLE</Text>

                                <View className="flex-row gap-4 mt-6">
                                    <View className="flex-1 bg-slate-800 rounded-lg p-4">
                                        <Text className="text-gray-400 text-xs">Break-even</Text>
                                        <Text className="text-white text-xl font-bold">$8,500</Text>
                                        <Text className="text-emerald-400 text-xs">↑ 23% margen</Text>
                                    </View>
                                    <View className="flex-1 bg-slate-800 rounded-lg p-4">
                                        <Text className="text-gray-400 text-xs">Runway</Text>
                                        <Text className="text-white text-xl font-bold">14 meses</Text>
                                        <Text className="text-emerald-400 text-xs">Saludable</Text>
                                    </View>
                                </View>
                            </View>
                        </GlassCard>
                    </View>
                </View>
            </View>
        </View>
    );
}

// ============================================
// FEATURES SECTION
// ============================================
function FeaturesSection() {
    const features = [
        {
            icon: <Ionicons name="trending-up" size={24} color="white" />,
            title: 'Punto de Equilibrio',
            description: 'Descubre cuántas ventas necesitas para cubrir costos y empezar a ganar.',
            highlight: true,
        },
        {
            icon: <Ionicons name="wallet" size={24} color="white" />,
            title: 'Flujo de Caja',
            description: 'Proyecta 12 meses de ingresos y gastos. Anticipa problemas.',
            highlight: false,
        },
        {
            icon: <Ionicons name="pricetag" size={24} color="white" />,
            title: 'Calculadora de Precios',
            description: 'Calcula el precio óptimo para maximizar ganancias.',
            highlight: false,
        },
        {
            icon: <Ionicons name="card" size={24} color="white" />,
            title: 'Evaluador de Préstamos',
            description: 'Compara opciones de financiamiento y elige la mejor.',
            highlight: false,
        },
        {
            icon: <Ionicons name="people" size={24} color="white" />,
            title: 'ROI de Empleados',
            description: '¿Vale la pena contratar? Analiza costo vs. productividad.',
            highlight: false,
        },
        {
            icon: <Ionicons name="megaphone" size={24} color="white" />,
            title: 'ROI de Marketing',
            description: 'Mide qué canal te da mejor retorno por cada peso invertido.',
            highlight: false,
        },
    ];

    return (
        <View className="px-6 py-20 bg-gradient-to-b from-slate-900/50 to-transparent">
            <View className="max-w-6xl mx-auto">
                <SectionHeading
                    title="6 herramientas. Un solo objetivo."
                    subtitle="Tomar mejores decisiones para tu negocio"
                    centered
                />

                <View className="flex-row flex-wrap gap-6 mt-12 justify-center">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                    ))}
                </View>
            </View>
        </View>
    );
}

// ============================================
// TESTIMONIALS SECTION
// ============================================
function TestimonialsSection() {
    return (
        <View className="px-6 py-20">
            <View className="max-w-6xl mx-auto">
                <SectionHeading
                    title="Lo que dicen los emprendedores"
                    centered
                />

                <View className="flex-row flex-wrap gap-6 mt-12 justify-center">
                    <TestimonialCard
                        quote="Descubrí que estaba perdiendo dinero en un producto. Ahora sé exactamente cuánto cobrar."
                        author="María García"
                        role="Dueña de restaurante"
                    />
                    <TestimonialCard
                        quote="El análisis de flujo de caja me salvó. Vi que en 3 meses me quedaba sin efectivo y pude actuar a tiempo."
                        author="Carlos Mendoza"
                        role="E-commerce"
                    />
                    <TestimonialCard
                        quote="Gratis y mejor que un consultor de $5,000. No puedo creer que esto exista."
                        author="Ana Rodríguez"
                        role="Consultora independiente"
                    />
                </View>
            </View>
        </View>
    );
}

// ============================================
// CTA SECTION
// ============================================
function CTASection() {
    const router = useRouter();

    return (
        <View className="px-6 py-24">
            <View className="max-w-4xl mx-auto">
                <GlassCard gradient className="items-center p-12">
                    <Text className="text-3xl md:text-4xl font-bold text-white text-center">
                        ¿Listo para conocer la{'\n'}verdad sobre tu negocio?
                    </Text>
                    <Text className="text-gray-300 text-lg mt-4 text-center max-w-xl">
                        En 2 minutos tendrás más claridad que en meses de intuición.
                        Sin costo. Sin registro. Sin trucos.
                    </Text>

                    <GradientButton
                        size="lg"
                        className="mt-8"
                        onPress={() => router.push('/crux')}
                    >
                        Comenzar análisis gratis →
                    </GradientButton>

                    <Text className="text-gray-500 text-sm mt-6">
                        Tus datos nunca salen de tu dispositivo. 100% privado.
                    </Text>
                </GlassCard>
            </View>
        </View>
    );
}

// ============================================
// FOOTER
// ============================================
function Footer() {
    return (
        <View className="px-6 py-12 border-t border-white/10">
            <View className="max-w-6xl mx-auto flex-row flex-wrap justify-between items-center gap-6">
                <View>
                    <Text className="text-2xl font-bold text-white">
                        Crux<Text className="text-[#00C0D4]">Analytics</Text>
                    </Text>
                    <Text className="text-gray-500 text-sm mt-1">
                        Análisis financiero para emprendedores
                    </Text>
                </View>

                <View className="flex-row gap-8">
                    <Text className="text-gray-400 text-sm">GitHub</Text>
                    <Text className="text-gray-400 text-sm">Documentación</Text>
                    <Text className="text-gray-400 text-sm">Contacto</Text>
                </View>

                <Text className="text-gray-600 text-sm">
                    © 2026 CruxAnalytics. Open Source & Free Forever.
                </Text>
            </View>
        </View>
    );
}

// ============================================
// MAIN LANDING PAGE
// ============================================
export default function LandingPage() {
    return (
        <ScrollView
            className="flex-1 bg-slate-950"
            contentContainerStyle={{ flexGrow: 1 }}
        >
            {/* Navigation */}
            <View className="absolute top-0 left-0 right-0 z-50 flex-row justify-between items-center px-6 py-4">
                <Text className="text-xl font-bold text-white">
                    Crux<Text className="text-[#00C0D4]">Analytics</Text>
                </Text>
                <View className="flex-row gap-4">
                    <Link href="/crux" asChild>
                        <Pressable className="px-4 py-2">
                            <Text className="text-white font-medium">Iniciar</Text>
                        </Pressable>
                    </Link>
                </View>
            </View>

            <HeroSection />
            <ProblemSection />
            <SolutionSection />
            <FeaturesSection />
            <TestimonialsSection />
            <CTASection />
            <Footer />
        </ScrollView>
    );
}
