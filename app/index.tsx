/**
 * @fileoverview Landing Page for CruxAnalytics
 * Aesthetic: Collins-inspired — Editorial serif, extreme whitespace, strategic neon accents
 * Dark theme with bold typography and grid-based structure
 */

import React from 'react';
import {
    View,
    Text,
    ScrollView,
    Pressable,
    Linking,
    Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LanguageSelector } from '@/components/language-selector';
import { useTranslation } from '@/lib/i18n-context';
import { GradientButton, OutlineButton } from '@/components/landing/shared-components';

const ACCENT = '#00C0D4';
const MINT = '#A7F3D0';
const BG = '#0A0A0A';
const GRID_COLOR = 'rgba(0, 192, 212, 0.08)';

function useIsSmall() {
    return Dimensions.get('window').width < 768;
}

// ============================================
// NAVIGATION BAR
// ============================================
function NavBar() {
    const router = useRouter();
    const { t } = useTranslation();

    return (
        <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            backgroundColor: BG,
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(255,255,255,0.08)',
            paddingHorizontal: 24,
            paddingVertical: 16,
        }}>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                maxWidth: 1400,
                marginHorizontal: 'auto',
                width: '100%',
            }}>
                <Text style={{ fontSize: 20, fontWeight: '800', color: '#FFFFFF', fontFamily: 'Georgia' }}>
                    Crux<Text style={{ color: ACCENT }}>Analytics</Text>
                </Text>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <LanguageSelector />
                    <Pressable
                        onPress={() => router.push('/(tabs)')}
                        style={{
                            backgroundColor: '#FFFFFF',
                            paddingHorizontal: 18,
                            paddingVertical: 10,
                            borderRadius: 100,
                        }}
                    >
                        <Text style={{ color: BG, fontWeight: '800', fontSize: 13 }}>
                            {t('landing.nav.enter_app')}
                        </Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

// ============================================
// HERO SECTION — Collins-style tagline
// ============================================
function HeroSection() {
    const router = useRouter();
    const { t } = useTranslation();
    const isSmall = useIsSmall();

    return (
        <View style={{
            minHeight: isSmall ? undefined : Dimensions.get('window').height,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 24,
            paddingTop: isSmall ? 120 : 160,
            paddingBottom: isSmall ? 80 : 120,
        }}>
            <View style={{ maxWidth: 800, alignItems: 'center' }}>
                {/* Tagline — huge serif */}
                <Text style={{
                    fontSize: isSmall ? 42 : 72,
                    fontWeight: '800',
                    color: '#FFFFFF',
                    textAlign: 'center',
                    fontFamily: 'Georgia',
                    lineHeight: isSmall ? 52 : 88,
                    marginBottom: 32,
                    letterSpacing: -1,
                }}>
                    Discover if your business is at risk.
                </Text>

                {/* Subtitle */}
                <Text style={{
                    fontSize: isSmall ? 16 : 20,
                    color: 'rgba(255,255,255,0.6)',
                    textAlign: 'center',
                    lineHeight: isSmall ? 26 : 32,
                    maxWidth: 600,
                    marginBottom: 48,
                }}>
                    {t('landing.hero.subtitle')}
                </Text>

                {/* CTAs */}
                <View style={{
                    flexDirection: isSmall ? 'column' : 'row',
                    gap: 16,
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
                    gap: 24,
                    marginTop: 64,
                    justifyContent: 'center',
                }}>
                    {[
                        { icon: 'lock-closed' as const, text: 'Privacy First' },
                        { icon: 'flash' as const, text: '2 Minutes' },
                        { icon: 'bulb' as const, text: 'AI-Powered' },
                    ].map((item, i) => (
                        <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <Ionicons name={item.icon} size={16} color={ACCENT} />
                            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14 }}>
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
// GRID DIVIDER — Collins aesthetic
// ============================================
function GridDivider() {
    return (
        <View style={{
            height: 1,
            backgroundColor: GRID_COLOR,
            marginHorizontal: 24,
            marginVertical: 80,
        }} />
    );
}

// ============================================
// PROGRAMS SECTION — Collins-style grid
// ============================================
function ProgramsSection() {
    const { t } = useTranslation();
    const isSmall = useIsSmall();

    const programs = [
        { title: 'Break-Even', subtitle: 'Find your financial threshold' },
        { title: 'Cash Flow', subtitle: 'Understand your liquidity' },
        { title: 'Pricing', subtitle: 'Optimize your revenue' },
        { title: 'Marketing', subtitle: 'Calculate ROI by channel' },
    ];

    return (
        <View style={{ paddingHorizontal: 24, paddingVertical: 80 }}>
            <View style={{ maxWidth: 1200, marginHorizontal: 'auto', width: '100%' }}>
                {/* Section title */}
                <Text style={{
                    fontSize: isSmall ? 32 : 48,
                    fontWeight: '800',
                    color: '#FFFFFF',
                    fontFamily: 'Georgia',
                    marginBottom: 16,
                    lineHeight: isSmall ? 40 : 56,
                }}>
                    Calculators
                </Text>
                <Text style={{
                    fontSize: isSmall ? 16 : 18,
                    color: 'rgba(255,255,255,0.5)',
                    marginBottom: 56,
                    lineHeight: 28,
                }}>
                    Professional financial analysis tools built for entrepreneurs
                </Text>

                {/* Grid */}
                <View style={{
                    flexDirection: isSmall ? 'column' : 'row',
                    flexWrap: 'wrap',
                    gap: 24,
                }}>
                    {programs.map((prog, i) => (
                        <View
                            key={i}
                            style={{
                                flex: isSmall ? 1 : 0.48,
                                borderWidth: 1,
                                borderColor: GRID_COLOR,
                                borderStyle: 'dashed',
                                padding: 32,
                                minHeight: 200,
                                justifyContent: 'space-between',
                            }}
                        >
                            <View>
                                <Text style={{
                                    fontSize: isSmall ? 24 : 28,
                                    fontWeight: '700',
                                    color: '#FFFFFF',
                                    marginBottom: 12,
                                }}>
                                    {prog.title}
                                </Text>
                                <Text style={{
                                    fontSize: 14,
                                    color: 'rgba(255,255,255,0.5)',
                                    lineHeight: 22,
                                }}>
                                    {prog.subtitle}
                                </Text>
                            </View>
                            <View style={{
                                width: 32,
                                height: 32,
                                borderRadius: 16,
                                backgroundColor: ACCENT,
                                alignItems: 'center',
                                justifyContent: 'center',
                                alignSelf: 'flex-start',
                                marginTop: 24,
                            }}>
                                <Text style={{ color: BG, fontWeight: '800', fontSize: 16 }}>→</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
}

// ============================================
// VANGUARD METRICS SECTION
// ============================================
function VanguardSection() {
    const { t } = useTranslation();
    const isSmall = useIsSmall();

    const metrics = [
        { acronym: 'OFI', name: 'Operating Flow Index', desc: 'Measure business health' },
        { acronym: 'TFDI', name: 'Total Financial Dependency Index', desc: 'Understand dependencies' },
        { acronym: 'SER', name: 'Stability Efficiency Ratio', desc: 'Track sustainability' },
    ];

    return (
        <View style={{ paddingHorizontal: 24, paddingVertical: 80 }}>
            <View style={{ maxWidth: 1200, marginHorizontal: 'auto', width: '100%' }}>
                <Text style={{
                    fontSize: isSmall ? 32 : 48,
                    fontWeight: '800',
                    color: '#FFFFFF',
                    fontFamily: 'Georgia',
                    marginBottom: 16,
                    lineHeight: isSmall ? 40 : 56,
                }}>
                    Vanguard Metrics
                </Text>
                <Text style={{
                    fontSize: isSmall ? 16 : 18,
                    color: 'rgba(255,255,255,0.5)',
                    marginBottom: 56,
                    lineHeight: 28,
                }}>
                    Proprietary financial indicators designed for decision makers
                </Text>

                <View style={{
                    flexDirection: isSmall ? 'column' : 'row',
                    gap: 24,
                }}>
                    {metrics.map((m, i) => (
                        <View
                            key={i}
                            style={{
                                flex: 1,
                                borderWidth: 1,
                                borderColor: GRID_COLOR,
                                borderStyle: 'dashed',
                                padding: 32,
                            }}
                        >
                            <View style={{
                                width: 56,
                                height: 56,
                                borderRadius: 12,
                                backgroundColor: `${ACCENT}20`,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 20,
                            }}>
                                <Text style={{
                                    color: ACCENT,
                                    fontSize: 18,
                                    fontWeight: '900',
                                    fontFamily: 'monospace',
                                }}>
                                    {m.acronym}
                                </Text>
                            </View>
                            <Text style={{
                                fontSize: 18,
                                fontWeight: '700',
                                color: '#FFFFFF',
                                marginBottom: 8,
                            }}>
                                {m.name}
                            </Text>
                            <Text style={{
                                fontSize: 14,
                                color: 'rgba(255,255,255,0.5)',
                                lineHeight: 22,
                            }}>
                                {m.desc}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
}

// ============================================
// CASE STUDIES SECTION
// ============================================
function CaseStudiesSection() {
    const isSmall = useIsSmall();

    const cases = [
        { title: 'E-Commerce Startup', result: '3x Revenue Growth' },
        { title: 'SaaS Platform', result: '45% Cost Reduction' },
        { title: 'Consulting Firm', result: '2.1x Profitability' },
        { title: 'Tech Startup', result: '18-Month Runway' },
    ];

    return (
        <View style={{ paddingHorizontal: 24, paddingVertical: 80 }}>
            <View style={{ maxWidth: 1200, marginHorizontal: 'auto', width: '100%' }}>
                <Text style={{
                    fontSize: isSmall ? 32 : 48,
                    fontWeight: '800',
                    color: '#FFFFFF',
                    fontFamily: 'Georgia',
                    marginBottom: 16,
                    lineHeight: isSmall ? 40 : 56,
                }}>
                    Results
                </Text>
                <Text style={{
                    fontSize: isSmall ? 16 : 18,
                    color: 'rgba(255,255,255,0.5)',
                    marginBottom: 56,
                    lineHeight: 28,
                }}>
                    Real outcomes from real businesses using CruxAnalytics
                </Text>

                <View style={{
                    flexDirection: isSmall ? 'column' : 'row',
                    flexWrap: 'wrap',
                    gap: 24,
                }}>
                    {cases.map((c, i) => (
                        <View
                            key={i}
                            style={{
                                flex: isSmall ? 1 : 0.48,
                                borderWidth: 1,
                                borderColor: GRID_COLOR,
                                borderStyle: 'dashed',
                                padding: 32,
                                minHeight: 160,
                                justifyContent: 'space-between',
                            }}
                        >
                            <Text style={{
                                fontSize: 18,
                                fontWeight: '700',
                                color: '#FFFFFF',
                                marginBottom: 16,
                            }}>
                                {c.title}
                            </Text>
                            <View>
                                <Text style={{
                                    fontSize: 12,
                                    color: 'rgba(255,255,255,0.4)',
                                    marginBottom: 4,
                                    textTransform: 'uppercase',
                                    letterSpacing: 1,
                                }}>
                                    Result
                                </Text>
                                <Text style={{
                                    fontSize: 28,
                                    fontWeight: '800',
                                    color: ACCENT,
                                }}>
                                    {c.result}
                                </Text>
                            </View>
                        </View>
                    ))}
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
        <View style={{ paddingHorizontal: 24, paddingVertical: 80 }}>
            <View style={{
                maxWidth: 900,
                marginHorizontal: 'auto',
                width: '100%',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: GRID_COLOR,
                borderStyle: 'dashed',
                paddingVertical: 80,
                paddingHorizontal: 32,
            }}>
                <Text style={{
                    fontSize: isSmall ? 36 : 56,
                    fontWeight: '800',
                    color: '#FFFFFF',
                    textAlign: 'center',
                    fontFamily: 'Georgia',
                    lineHeight: isSmall ? 44 : 68,
                    marginBottom: 24,
                    letterSpacing: -1,
                }}>
                    Ready to analyze your business?
                </Text>
                <Text style={{
                    fontSize: 16,
                    color: 'rgba(255,255,255,0.5)',
                    textAlign: 'center',
                    marginBottom: 48,
                    lineHeight: 26,
                }}>
                    Get started in 2 minutes. No credit card required.
                </Text>

                <GradientButton
                    size="lg"
                    onPress={() => router.push('/(tabs)')}
                >
                    {t('landing.cta.button')}
                </GradientButton>
            </View>
        </View>
    );
}

// ============================================
// FOOTER
// ============================================
function Footer() {
    const isSmall = useIsSmall();

    return (
        <View style={{
            paddingHorizontal: 24,
            paddingVertical: 48,
            borderTopWidth: 1,
            borderTopColor: GRID_COLOR,
        }}>
            <View style={{
                maxWidth: 1200,
                marginHorizontal: 'auto',
                width: '100%',
                flexDirection: isSmall ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: isSmall ? 'center' : 'center',
                gap: 24,
            }}>
                <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>
                    © 2026 CruxAnalytics. All rights reserved.
                </Text>

                <View style={{ flexDirection: 'row', gap: 24 }}>
                    <Pressable onPress={() => Linking.openURL('https://github.com/Jon-human-in-the-loop/CruxAnalytics')}>
                        <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>GitHub</Text>
                    </Pressable>
                    <Pressable onPress={() => Linking.openURL('https://www.vanguardcrux.com/')}>
                        <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Contact</Text>
                    </Pressable>
                </View>
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
            <GridDivider />
            <ProgramsSection />
            <GridDivider />
            <VanguardSection />
            <GridDivider />
            <CaseStudiesSection />
            <GridDivider />
            <CTASection />
            <Footer />
        </ScrollView>
    );
}
