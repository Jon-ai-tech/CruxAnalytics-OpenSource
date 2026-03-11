/**
 * @fileoverview Landing Page for CruxAnalytics
 * Aesthetic: Editorial, bold typography, generous whitespace.
 * Inspired by wearecollins.com — dark theme variant.
 * Mobile-first responsive design.
 */

import React from 'react';
import {
    View,
    Text,
    ScrollView,
    Pressable,
    Platform,
    Linking,
    Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LanguageSelector } from '@/components/language-selector';
import { useTranslation } from '@/lib/i18n-context';
import {
    GlassCard,
    GradientButton,
    OutlineButton,
    FeatureCard,
    StatNumber,
    SectionHeading,
    TestimonialCard,
    Badge,
    TractionStat,
    RoadmapCard,
    PricingCard,
    VanguardMetricCard,
} from '@/components/landing/shared-components';

const ACCENT = '#00C0D4';
const MINT = '#A7F3D0';
const CORAL = '#FDBA74';
const BG = '#0A0A0A';

function useIsSmall() {
    return Dimensions.get('window').width < 768;
}

// ============================================
// NAV BAR — minimal Collins-style
// ============================================
function NavBar() {
    const router = useRouter();
    const { t } = useTranslation();

    return (
        <View style={{
            position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50,
            backgroundColor: 'rgba(10,10,10,0.85)',
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(255,255,255,0.06)',
        }}>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 20,
                paddingVertical: 16,
                maxWidth: 1200,
                marginHorizontal: 'auto',
                width: '100%',
            }}>
                <Text style={{ fontSize: 18, fontWeight: '800', color: '#FFFFFF' }}>
                    Crux<Text style={{ color: ACCENT }}>Analytics</Text>
                </Text>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <LanguageSelector />
                    <Pressable
                        onPress={() => router.push('/(tabs)')}
                        style={{
                            backgroundColor: ACCENT,
                            paddingHorizontal: 16,
                            paddingVertical: 8,
                            borderRadius: 100,
                        }}
                    >
                        <Text style={{ color: '#0A0A0A', fontWeight: '700', fontSize: 13 }}>
                            {t('landing.nav.enter_app')}
                        </Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

// ============================================
// HERO — Collins editorial: huge type, max whitespace
// ============================================
function HeroSection() {
    const router = useRouter();
    const { t } = useTranslation();
    const isSmall = useIsSmall();

    const titleParts = t('landing.hero.title').split(
        t('common.language_code') === 'es' ? 'está en riesgo' : 'is at risk'
    );
    const highlight = t('common.language_code') === 'es' ? 'está en riesgo' : 'is at risk';

    return (
        <View style={{
            minHeight: isSmall ? undefined : Dimensions.get('window').height,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 24,
            paddingTop: isSmall ? 120 : 160,
            paddingBottom: isSmall ? 60 : 100,
        }}>
            <View style={{ maxWidth: 720, alignItems: 'center' }}>
                {/* Badge */}
                <Badge variant="success">
                    <Text style={{ color: MINT, fontSize: 12, fontWeight: '600' }}>
                        {t('landing.hero.badge')}
                    </Text>
                </Badge>

                {/* Title — editorial, huge */}
                <Text style={{
                    fontSize: isSmall ? 36 : 64,
                    fontWeight: '800',
                    color: '#FFFFFF',
                    textAlign: 'center',
                    marginTop: 24,
                    lineHeight: isSmall ? 44 : 74,
                    letterSpacing: -1,
                }}>
                    {titleParts[0]}
                    <Text style={{ color: ACCENT }}>{highlight}</Text>
                    {titleParts[1] || ''}
                </Text>

                {/* Subtitle */}
                <Text style={{
                    fontSize: isSmall ? 16 : 20,
                    color: 'rgba(255,255,255,0.45)',
                    textAlign: 'center',
                    marginTop: 20,
                    lineHeight: isSmall ? 26 : 32,
                    maxWidth: 520,
                }}>
                    {t('landing.hero.subtitle')}
                </Text>

                {/* CTAs */}
                <View style={{
                    flexDirection: isSmall ? 'column' : 'row',
                    gap: 12,
                    marginTop: 40,
                    alignItems: 'center',
                    width: isSmall ? '100%' : undefined,
                }}>
                    <GradientButton
                        size={isSmall ? 'md' : 'lg'}
                        onPress={() => router.push('/(tabs)')}
                    >
                        {t('landing.hero.cta')}
                    </GradientButton>
                    <OutlineButton
                        onPress={() => Linking.openURL('https://github.com/Jon-human-in-the-loop/CruxAnalytics')}
                    >
                        GitHub
                    </OutlineButton>
                </View>

                {/* Trust row */}
                <View style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: 20,
                    marginTop: 48,
                    justifyContent: 'center',
                    opacity: 0.5,
                }}>
                    {[
                        { icon: 'lock-closed' as const, text: t('landing.hero.privacy') },
                        { icon: 'flash' as const, text: t('landing.hero.results') },
                        { icon: 'bulb' as const, text: t('landing.hero.ai') },
                    ].map((item, i) => (
                        <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Ionicons name={item.icon} size={14} color="rgba(255,255,255,0.6)" />
                            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>
                                {item.text}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
}

// ============================================
// DIVIDER — thin line
// ============================================
function Divider() {
    return (
        <View style={{
            height: 1,
            backgroundColor: 'rgba(255,255,255,0.06)',
            marginHorizontal: 24,
        }} />
    );
}

// ============================================
// PROBLEM SECTION
// ============================================
function ProblemSection() {
    const { t } = useTranslation();
    const isSmall = useIsSmall();

    const pains = [
        { icon: 'alert-circle' as const, title: t('landing.problem.pain1_title'), desc: t('landing.problem.pain1_desc') },
        { icon: 'cash' as const, title: t('landing.problem.pain2_title'), desc: t('landing.problem.pain2_desc') },
        { icon: 'help-circle' as const, title: t('landing.problem.pain3_title'), desc: t('landing.problem.pain3_desc') },
    ];

    return (
        <View style={{ paddingHorizontal: 24, paddingVertical: isSmall ? 60 : 100 }}>
            <View style={{ maxWidth: 1100, marginHorizontal: 'auto', width: '100%' }}>
                <SectionHeading
                    title={t('landing.problem.title')}
                    subtitle={t('landing.problem.subtitle')}
                    centered
                />

                {/* Stats */}
                <View style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: isSmall ? 24 : 48,
                    marginBottom: isSmall ? 40 : 64,
                }}>
                    <StatNumber value={80} suffix="%" label={t('landing.problem.stat1')} />
                    <StatNumber value={60} suffix="%" label={t('landing.problem.stat2')} />
                    <StatNumber value={45} suffix="%" label={t('landing.problem.stat3')} />
                </View>

                {/* Pain cards */}
                <View style={{
                    flexDirection: isSmall ? 'column' : 'row',
                    gap: 16,
                }}>
                    {pains.map((pain, i) => (
                        <View key={i} style={{
                            flex: 1,
                            padding: 24,
                            borderRadius: 16,
                            backgroundColor: 'rgba(255,255,255,0.03)',
                            borderWidth: 1,
                            borderColor: 'rgba(255,255,255,0.06)',
                        }}>
                            <View style={{
                                width: 48, height: 48, borderRadius: 24,
                                backgroundColor: 'rgba(253,186,116,0.1)',
                                alignItems: 'center', justifyContent: 'center',
                                marginBottom: 16,
                            }}>
                                <Ionicons name={pain.icon} size={24} color={CORAL} />
                            </View>
                            <Text style={{ color: '#FFFFFF', fontSize: 17, fontWeight: '700', marginBottom: 8 }}>
                                {pain.title}
                            </Text>
                            <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, lineHeight: 22 }}>
                                {pain.desc}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
}

// ============================================
// SOLUTION SECTION
// ============================================
function SolutionSection() {
    const { t } = useTranslation();
    const isSmall = useIsSmall();

    const titleParts = t('landing.solution.title').split(
        t('common.language_code') === 'es' ? 'Gratis' : 'Free'
    );
    const highlight = t('common.language_code') === 'es' ? 'Gratis y en 2 minutos.' : 'Free and in 2 minutes.';

    const features = [
        t('landing.solution.feature1'),
        t('landing.solution.feature2'),
        t('landing.solution.feature3'),
        t('landing.solution.feature4'),
    ];

    return (
        <View style={{ paddingHorizontal: 24, paddingVertical: isSmall ? 60 : 100 }}>
            <View style={{ maxWidth: 1100, marginHorizontal: 'auto', width: '100%' }}>
                <View style={{
                    flexDirection: isSmall ? 'column' : 'row',
                    gap: isSmall ? 40 : 64,
                    alignItems: isSmall ? 'stretch' : 'center',
                }}>
                    {/* Text */}
                    <View style={{ flex: 1 }}>
                        <Badge>{t('landing.solution.badge')}</Badge>
                        <Text style={{
                            fontSize: isSmall ? 28 : 38,
                            fontWeight: '700',
                            color: '#FFFFFF',
                            marginTop: 16,
                            lineHeight: isSmall ? 36 : 48,
                            letterSpacing: -0.5,
                        }}>
                            {titleParts[0]}
                            <Text style={{ color: ACCENT }}>{highlight}</Text>
                        </Text>
                        <Text style={{
                            color: 'rgba(255,255,255,0.45)',
                            fontSize: 16,
                            marginTop: 16,
                            lineHeight: 26,
                        }}>
                            {t('landing.solution.subtitle')}
                        </Text>

                        <View style={{ gap: 14, marginTop: 24 }}>
                            {features.map((feat, i) => (
                                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                                    <View style={{
                                        width: 28, height: 28, borderRadius: 14,
                                        backgroundColor: 'rgba(167,243,208,0.15)',
                                        alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <Ionicons name="checkmark" size={16} color={MINT} />
                                    </View>
                                    <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15 }}>{feat}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Visual mock */}
                    <View style={{ flex: 1 }}>
                        <View style={{
                            borderRadius: 16,
                            backgroundColor: 'rgba(255,255,255,0.03)',
                            borderWidth: 1,
                            borderColor: 'rgba(255,255,255,0.08)',
                            padding: 24,
                        }}>
                            <View style={{
                                backgroundColor: 'rgba(0,0,0,0.4)',
                                borderRadius: 12,
                                padding: 20,
                            }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                    <Ionicons name="checkmark-circle" size={18} color={MINT} />
                                    <Text style={{ color: MINT, fontSize: 13, fontWeight: '600' }}>
                                        {t('landing.solution.visual_status')}
                                    </Text>
                                </View>
                                <Text style={{ color: '#FFFFFF', fontSize: 22, fontWeight: '700' }}>
                                    {t('landing.solution.visual_health')}
                                </Text>

                                <View style={{ flexDirection: 'row', gap: 12, marginTop: 20 }}>
                                    <View style={{
                                        flex: 1, borderRadius: 10, padding: 14,
                                        backgroundColor: 'rgba(255,255,255,0.04)',
                                    }}>
                                        <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>
                                            {t('landing.solution.visual_breakeven')}
                                        </Text>
                                        <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: '700', marginTop: 4 }}>
                                            $8,500
                                        </Text>
                                        <Text style={{ color: MINT, fontSize: 11, marginTop: 2 }}>
                                            {t('landing.solution.visual_margin')}
                                        </Text>
                                    </View>
                                    <View style={{
                                        flex: 1, borderRadius: 10, padding: 14,
                                        backgroundColor: 'rgba(255,255,255,0.04)',
                                    }}>
                                        <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>
                                            {t('landing.solution.visual_runway')}
                                        </Text>
                                        <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: '700', marginTop: 4 }}>
                                            {t('landing.solution.visual_runway_val')}
                                        </Text>
                                        <Text style={{ color: MINT, fontSize: 11, marginTop: 2 }}>
                                            {t('landing.solution.visual_health')}
                                        </Text>
                                    </View>
                                </View>

                                {/* Vanguard mini */}
                                <View style={{
                                    marginTop: 16, paddingTop: 16,
                                    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)',
                                }}>
                                    <Text style={{
                                        color: 'rgba(255,255,255,0.3)', fontSize: 10,
                                        letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 10,
                                    }}>
                                        Vanguard Crux Metrics
                                    </Text>
                                    <View style={{ flexDirection: 'row', gap: 12 }}>
                                        {[
                                            { label: 'OFI', value: '12%', color: ACCENT },
                                            { label: 'TFDI', value: '8%', color: MINT },
                                            { label: 'SER', value: '2.4x', color: CORAL },
                                        ].map(m => (
                                            <View key={m.label} style={{ flex: 1, alignItems: 'center' }}>
                                                <Text style={{ color: m.color, fontSize: 16, fontWeight: '700' }}>
                                                    {m.value}
                                                </Text>
                                                <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>
                                                    {m.label}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            </View>
                        </View>
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
    const { t } = useTranslation();
    const isSmall = useIsSmall();

    const features = [
        { icon: 'trending-up' as const, title: t('landing.features.f1_title'), description: t('landing.features.f1_desc'), highlight: true },
        { icon: 'wallet' as const, title: t('landing.features.f2_title'), description: t('landing.features.f2_desc'), highlight: false },
        { icon: 'pricetag' as const, title: t('landing.features.f3_title'), description: t('landing.features.f3_desc'), highlight: false },
        { icon: 'card' as const, title: t('landing.features.f4_title'), description: t('landing.features.f4_desc'), highlight: false },
        { icon: 'people' as const, title: t('landing.features.f5_title'), description: t('landing.features.f5_desc'), highlight: false },
        { icon: 'megaphone' as const, title: t('landing.features.f6_title'), description: t('landing.features.f6_desc'), highlight: false },
    ];

    return (
        <View style={{ paddingHorizontal: 24, paddingVertical: isSmall ? 60 : 100 }}>
            <View style={{ maxWidth: 1100, marginHorizontal: 'auto', width: '100%' }}>
                <SectionHeading
                    title={t('landing.features.title')}
                    subtitle={t('landing.features.subtitle')}
                    centered
                />

                <View style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: 16,
                    justifyContent: 'center',
                }}>
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            icon={<Ionicons name={feature.icon} size={22} color="#FFFFFF" />}
                            title={feature.title}
                            description={feature.description}
                            highlight={feature.highlight}
                        />
                    ))}
                </View>
            </View>
        </View>
    );
}

// ============================================
// TRACTION SECTION
// ============================================
function TractionSection() {
    const { t } = useTranslation();
    const isSmall = useIsSmall();

    return (
        <View style={{ paddingHorizontal: 24, paddingVertical: isSmall ? 60 : 100 }}>
            <View style={{ maxWidth: 1100, marginHorizontal: 'auto', width: '100%' }}>
                <View style={{ alignItems: 'center', marginBottom: 16 }}>
                    <Badge variant="success">{t('landing.traction.badge')}</Badge>
                </View>
                <SectionHeading
                    title={t('landing.traction.title')}
                    subtitle={t('landing.traction.subtitle')}
                    centered
                />

                <View style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: 12,
                    justifyContent: 'center',
                }}>
                    <TractionStat value={t('landing.traction.stat1_value')} label={t('landing.traction.stat1_label')} color="teal" />
                    <TractionStat value={t('landing.traction.stat2_value')} label={t('landing.traction.stat2_label')} color="mint" />
                    <TractionStat value={t('landing.traction.stat3_value')} label={t('landing.traction.stat3_label')} color="coral" />
                    <TractionStat value={t('landing.traction.stat4_value')} label={t('landing.traction.stat4_label')} color="teal" />
                </View>

                {/* Quote */}
                <View style={{
                    marginTop: 48,
                    maxWidth: 600,
                    marginHorizontal: 'auto',
                    alignItems: 'center',
                    paddingVertical: 32,
                    paddingHorizontal: 24,
                    borderRadius: 16,
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.06)',
                }}>
                    <Text style={{
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: isSmall ? 18 : 22,
                        fontWeight: '600',
                        textAlign: 'center',
                        lineHeight: isSmall ? 28 : 34,
                        fontStyle: 'italic',
                    }}>
                        "{t('landing.traction.quote')}"
                    </Text>
                    <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, marginTop: 16 }}>
                        — {t('landing.traction.quote_author')}
                    </Text>
                </View>
            </View>
        </View>
    );
}

// ============================================
// VANGUARD METRICS SECTION
// ============================================
function VanguardMetricsSection() {
    const { t } = useTranslation();
    const isSmall = useIsSmall();

    return (
        <View style={{ paddingHorizontal: 24, paddingVertical: isSmall ? 60 : 100 }}>
            <View style={{ maxWidth: 1100, marginHorizontal: 'auto', width: '100%' }}>
                <View style={{ alignItems: 'center', marginBottom: 16 }}>
                    <Badge>{t('landing.vanguard_section.badge')}</Badge>
                </View>
                <SectionHeading
                    title={t('landing.vanguard_section.title')}
                    subtitle={t('landing.vanguard_section.subtitle')}
                    centered
                />

                <View style={{
                    flexDirection: isSmall ? 'column' : 'row',
                    gap: 16,
                    justifyContent: 'center',
                }}>
                    <VanguardMetricCard
                        acronym="OFI"
                        title={t('landing.vanguard_section.m1_title')}
                        description={t('landing.vanguard_section.m1_desc')}
                        badge={t('landing.vanguard_section.m1_badge')}
                        color="teal"
                    />
                    <VanguardMetricCard
                        acronym="TFDI"
                        title={t('landing.vanguard_section.m2_title')}
                        description={t('landing.vanguard_section.m2_desc')}
                        badge={t('landing.vanguard_section.m2_badge')}
                        color="mint"
                    />
                    <VanguardMetricCard
                        acronym="SER"
                        title={t('landing.vanguard_section.m3_title')}
                        description={t('landing.vanguard_section.m3_desc')}
                        badge={t('landing.vanguard_section.m3_badge')}
                        color="coral"
                    />
                </View>
            </View>
        </View>
    );
}

// ============================================
// BUSINESS MODEL SECTION
// ============================================
function BusinessModelSection() {
    const { t } = useTranslation();
    const isSmall = useIsSmall();

    const tiers = [
        {
            name: t('landing.business_model.tier1_name'),
            price: t('landing.business_model.tier1_price'),
            description: t('landing.business_model.tier1_desc'),
            features: [t('landing.business_model.tier1_f1'), t('landing.business_model.tier1_f2'), t('landing.business_model.tier1_f3'), t('landing.business_model.tier1_f4')],
            highlighted: false,
        },
        {
            name: t('landing.business_model.tier2_name'),
            price: t('landing.business_model.tier2_price'),
            description: t('landing.business_model.tier2_desc'),
            badge: t('landing.business_model.tier2_badge'),
            features: [t('landing.business_model.tier2_f1'), t('landing.business_model.tier2_f2'), t('landing.business_model.tier2_f3'), t('landing.business_model.tier2_f4')],
            highlighted: true,
        },
        {
            name: t('landing.business_model.tier3_name'),
            price: t('landing.business_model.tier3_price'),
            description: t('landing.business_model.tier3_desc'),
            badge: t('landing.business_model.tier3_badge'),
            features: [t('landing.business_model.tier3_f1'), t('landing.business_model.tier3_f2'), t('landing.business_model.tier3_f3'), t('landing.business_model.tier3_f4')],
            highlighted: false,
        },
    ];

    return (
        <View style={{ paddingHorizontal: 24, paddingVertical: isSmall ? 60 : 100 }}>
            <View style={{ maxWidth: 1100, marginHorizontal: 'auto', width: '100%' }}>
                <View style={{ alignItems: 'center', marginBottom: 16 }}>
                    <Badge variant="warning">{t('landing.business_model.badge')}</Badge>
                </View>
                <SectionHeading
                    title={t('landing.business_model.title')}
                    subtitle={t('landing.business_model.subtitle')}
                    centered
                />

                <View style={{
                    flexDirection: isSmall ? 'column' : 'row',
                    gap: 16,
                    justifyContent: 'center',
                    marginTop: 16,
                }}>
                    {tiers.map((tier, i) => (
                        <PricingCard key={i} {...tier} />
                    ))}
                </View>
            </View>
        </View>
    );
}

// ============================================
// ROADMAP SECTION
// ============================================
function RoadmapSection() {
    const { t } = useTranslation();
    const isSmall = useIsSmall();

    const steps = [
        { quarter: t('landing.roadmap.q1_label'), title: t('landing.roadmap.q1_title'), description: t('landing.roadmap.q1_desc'), status: 'completed' as const },
        { quarter: t('landing.roadmap.q2_label'), title: t('landing.roadmap.q2_title'), description: t('landing.roadmap.q2_desc'), status: 'in_progress' as const },
        { quarter: t('landing.roadmap.q3_label'), title: t('landing.roadmap.q3_title'), description: t('landing.roadmap.q3_desc'), status: 'planned' as const },
        { quarter: t('landing.roadmap.q4_label'), title: t('landing.roadmap.q4_title'), description: t('landing.roadmap.q4_desc'), status: 'planned' as const, isLast: true },
    ];

    return (
        <View style={{ paddingHorizontal: 24, paddingVertical: isSmall ? 60 : 100 }}>
            <View style={{ maxWidth: 1100, marginHorizontal: 'auto', width: '100%' }}>
                <View style={{ alignItems: 'center', marginBottom: 16 }}>
                    <Badge>{t('landing.roadmap.badge')}</Badge>
                </View>
                <SectionHeading
                    title={t('landing.roadmap.title')}
                    subtitle={t('landing.roadmap.subtitle')}
                    centered
                />

                <View style={{ maxWidth: 560, marginHorizontal: 'auto', width: '100%' }}>
                    {steps.map((step, i) => (
                        <RoadmapCard key={i} {...step} />
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
    const { t } = useTranslation();
    const isSmall = useIsSmall();

    return (
        <View style={{ paddingHorizontal: 24, paddingVertical: isSmall ? 60 : 100 }}>
            <View style={{ maxWidth: 1100, marginHorizontal: 'auto', width: '100%' }}>
                <SectionHeading
                    title={t('landing.testimonials.title')}
                    centered
                />

                <View style={{
                    flexDirection: isSmall ? 'column' : 'row',
                    gap: 16,
                    justifyContent: 'center',
                }}>
                    <TestimonialCard
                        quote={t('landing.testimonials.t1_quote')}
                        author={t('landing.testimonials.t1_author')}
                        role={t('landing.testimonials.t1_role')}
                    />
                    <TestimonialCard
                        quote={t('landing.testimonials.t2_quote')}
                        author={t('landing.testimonials.t2_author')}
                        role={t('landing.testimonials.t2_role')}
                    />
                    <TestimonialCard
                        quote={t('landing.testimonials.t3_quote')}
                        author={t('landing.testimonials.t3_author')}
                        role={t('landing.testimonials.t3_role')}
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
    const { t } = useTranslation();
    const isSmall = useIsSmall();

    return (
        <View style={{ paddingHorizontal: 24, paddingVertical: isSmall ? 60 : 100 }}>
            <View style={{
                maxWidth: 720,
                marginHorizontal: 'auto',
                width: '100%',
                alignItems: 'center',
                paddingVertical: isSmall ? 48 : 72,
                paddingHorizontal: 24,
                borderRadius: 20,
                backgroundColor: 'rgba(0,192,212,0.04)',
                borderWidth: 1,
                borderColor: 'rgba(0,192,212,0.15)',
            }}>
                <Text style={{
                    fontSize: isSmall ? 28 : 38,
                    fontWeight: '700',
                    color: '#FFFFFF',
                    textAlign: 'center',
                    lineHeight: isSmall ? 36 : 48,
                    letterSpacing: -0.5,
                }}>
                    {t('landing.cta.title')}
                </Text>
                <Text style={{
                    color: 'rgba(255,255,255,0.45)',
                    fontSize: 16,
                    marginTop: 16,
                    textAlign: 'center',
                    maxWidth: 480,
                    lineHeight: 26,
                }}>
                    {t('landing.cta.subtitle')}
                </Text>

                <GradientButton
                    size="lg"
                    onPress={() => router.push('/(tabs)')}
                    className="mt-8"
                >
                    {t('landing.cta.button')}
                </GradientButton>

                <Text style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, marginTop: 20 }}>
                    {t('landing.cta.privacy')}
                </Text>
            </View>
        </View>
    );
}

// ============================================
// FOOTER — minimal
// ============================================
function Footer() {
    const { t } = useTranslation();
    const isSmall = useIsSmall();

    return (
        <View style={{
            paddingHorizontal: 24,
            paddingVertical: 32,
            borderTopWidth: 1,
            borderTopColor: 'rgba(255,255,255,0.06)',
        }}>
            <View style={{
                maxWidth: 1100,
                marginHorizontal: 'auto',
                width: '100%',
                flexDirection: isSmall ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: isSmall ? 'center' : 'center',
                gap: 16,
            }}>
                <View style={{ alignItems: isSmall ? 'center' : 'flex-start' }}>
                    <Text style={{ fontSize: 18, fontWeight: '800', color: '#FFFFFF' }}>
                        Crux<Text style={{ color: ACCENT }}>Analytics</Text>
                    </Text>
                    <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, marginTop: 4 }}>
                        {t('landing.footer.description')}
                    </Text>
                </View>

                <View style={{ flexDirection: 'row', gap: 24 }}>
                    <Pressable onPress={() => Linking.openURL('https://github.com/Jon-human-in-the-loop/CruxAnalytics')}>
                        <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
                            {t('landing.footer.github')}
                        </Text>
                    </Pressable>
                    <Pressable onPress={() => Linking.openURL('https://www.vanguardcrux.com/')}>
                        <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
                            {t('landing.footer.contact')}
                        </Text>
                    </Pressable>
                </View>

                <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>
                    {t('landing.footer.copyright')}
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
            style={{ flex: 1, backgroundColor: BG }}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <NavBar />
            <HeroSection />
            <Divider />
            <ProblemSection />
            <Divider />
            <SolutionSection />
            <Divider />
            <FeaturesSection />
            <Divider />
            <TractionSection />
            <Divider />
            <VanguardMetricsSection />
            <Divider />
            <BusinessModelSection />
            <Divider />
            <RoadmapSection />
            <Divider />
            <TestimonialsSection />
            <Divider />
            <CTASection />
            <Footer />
        </ScrollView>
    );
}
