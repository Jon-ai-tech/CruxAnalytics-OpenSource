/**
 * @fileoverview Landing Page for CruxAnalytics
 * Aesthetic: Tendril Studio inspired — Playfair Display, Glass-cards, smooth layout
 * Dark theme with sophisticated typography and translucent elements
 */

import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    Pressable,
    Linking,
    Dimensions,
    StyleSheet,
    Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LanguageSelector } from '@/components/language-selector';
import { useTranslation } from '@/providers/i18n-provider';
import { 
    GradientButton, 
    OutlineButton, 
    GlassCard, 
    SectionHeading,
    FeatureCard,
    Badge
} from '@/components/landing/shared-components';

const ACCENT = '#00C0D4';
const BG = '#000000';

function useIsSmall() {
    const [isSmall, setIsSmall] = useState(Dimensions.get('window').width < 768);
    
    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            setIsSmall(window.width < 768);
        });
        return () => subscription.remove();
    }, []);
    
    return isSmall;
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
            backgroundColor: 'rgba(0,0,0,0.5)',
            paddingHorizontal: 24,
            paddingVertical: 20,
            ...Platform.select({
                web: {
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                }
            })
        }}>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                maxWidth: 1200,
                marginHorizontal: 'auto',
                width: '100%',
            }}>
                <Text style={{ fontSize: 22, fontWeight: '900', color: '#FFFFFF', fontFamily: 'Inter-Bold' }}>
                    Crux<Text style={{ color: ACCENT }}>Analytics</Text>
                </Text>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                    <LanguageSelector />
                    <Pressable
                        onPress={() => router.push('/(tabs)')}
                        style={({ pressed }) => ({
                            backgroundColor: '#FFFFFF',
                            paddingHorizontal: 20,
                            paddingVertical: 12,
                            borderRadius: 100,
                            opacity: pressed ? 0.8 : 1,
                        })}
                    >
                        <Text style={{ color: BG, fontWeight: '800', fontSize: 14, fontFamily: 'Inter-Bold' }}>
                            {t('landing.nav.enter_app')}
                        </Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

// ============================================
// HERO SECTION
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
            paddingTop: isSmall ? 140 : 160,
            paddingBottom: isSmall ? 80 : 120,
        }}>
            <View style={{ maxWidth: 900, alignItems: 'center' }}>
                <Badge variant="success">
                    <Text style={{ color: '#A7F3D0', fontSize: 12, fontWeight: '700', fontFamily: 'Inter-Bold' }}>
                        {t('landing.hero.badge')}
                    </Text>
                </Badge>

                <Text style={{
                    fontSize: isSmall ? 48 : 84,
                    fontWeight: '800',
                    color: '#FFFFFF',
                    textAlign: 'center',
                    fontFamily: 'PlayfairDisplay-Bold',
                    lineHeight: isSmall ? 56 : 94,
                    marginTop: 32,
                    marginBottom: 24,
                    letterSpacing: -2,
                }}>
                    {t('landing.hero.title')}
                </Text>

                <Text style={{
                    fontSize: isSmall ? 18 : 22,
                    color: 'rgba(255,255,255,0.5)',
                    textAlign: 'center',
                    lineHeight: isSmall ? 28 : 34,
                    maxWidth: 640,
                    marginBottom: 48,
                    fontFamily: 'Inter-Regular',
                }}>
                    {t('landing.hero.subtitle')}
                </Text>

                <View style={{
                    flexDirection: isSmall ? 'column' : 'row',
                    gap: 16,
                    alignItems: 'center',
                    width: isSmall ? '100%' : undefined,
                }}>
                    <GradientButton
                        size="lg"
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

                <View style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: 32,
                    marginTop: 80,
                    justifyContent: 'center',
                }}>
                    {[
                        { icon: 'lock-closed' as const, text: t('landing.hero.privacy') },
                        { icon: 'flash' as const, text: t('landing.hero.results') },
                        { icon: 'bulb' as const, text: t('landing.hero.ai') },
                    ].map((item, i) => (
                        <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <Ionicons name={item.icon} size={18} color={ACCENT} />
                            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 15, fontFamily: 'Inter-Medium' }}>
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
// FEATURES SECTION
// ============================================
function FeaturesSection() {
    const { t } = useTranslation();
    const isSmall = useIsSmall();

    const features = [
        { icon: 'analytics', title: t('landing.features.f1_title'), desc: t('landing.features.f1_desc') },
        { icon: 'cash', title: t('landing.features.f2_title'), desc: t('landing.features.f2_desc') },
        { icon: 'pricetag', title: t('landing.features.f3_title'), desc: t('landing.features.f3_desc') },
        { icon: 'trending-up', title: t('landing.features.f4_title'), desc: t('landing.features.f4_desc') },
        { icon: 'people', title: t('landing.features.f5_title'), desc: t('landing.features.f5_desc') },
        { icon: 'megaphone', title: t('landing.features.f6_title'), desc: t('landing.features.f6_desc') },
    ];

    return (
        <View style={{ paddingHorizontal: 24, paddingVertical: 120 }}>
            <View style={{ maxWidth: 1200, marginHorizontal: 'auto', width: '100%' }}>
                <SectionHeading 
                    title={t('landing.features.title')}
                    subtitle={t('landing.features.subtitle')}
                    badge="Features"
                />
                
                <View style={{
                    flexDirection: isSmall ? 'column' : 'row',
                    flexWrap: 'wrap',
                    gap: 24,
                }}>
                    {features.map((f, i) => (
                        <View key={i} style={{ flex: isSmall ? 1 : 0.3 }}>
                            <FeatureCard {...f} />
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
}

// ============================================
// VANGUARD SECTION
// ============================================
function VanguardSection() {
    const { t } = useTranslation();
    const isSmall = useIsSmall();

    return (
        <View style={{ paddingHorizontal: 24, paddingVertical: 120, backgroundColor: 'rgba(255,255,255,0.02)' }}>
            <View style={{ maxWidth: 1200, marginHorizontal: 'auto', width: '100%' }}>
                <SectionHeading 
                    title="Vanguard Metrics"
                    subtitle="Proprietary indicators for deep financial insight"
                    badge="Innovation"
                />

                <View style={{ flexDirection: isSmall ? 'column' : 'row', gap: 24 }}>
                    {[
                        { id: 'OFI', name: 'Operating Flow Index', desc: 'Real-time operational health' },
                        { id: 'TFDI', name: 'Total Financial Dependency', desc: 'Risk and dependency analysis' },
                        { id: 'SER', name: 'Stability Efficiency Ratio', desc: 'Growth sustainability metric' }
                    ].map((m, i) => (
                        <GlassCard key={i} style={{ flex: 1 }}>
                            <Text style={{ color: ACCENT, fontSize: 32, fontWeight: '900', marginBottom: 16, fontFamily: 'Inter-Bold' }}>{m.id}</Text>
                            <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: '700', marginBottom: 12, fontFamily: 'Inter-Bold' }}>{m.name}</Text>
                            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, lineHeight: 24, fontFamily: 'Inter-Regular' }}>{m.desc}</Text>
                        </GlassCard>
                    ))}
                </View>
            </View>
        </View>
    );
}

// ============================================
// FOOTER
// ============================================
function Footer() {
    const { t } = useTranslation();
    const isSmall = useIsSmall();

    return (
        <View style={{
            paddingHorizontal: 24,
            paddingVertical: 64,
            borderTopWidth: 1,
            borderTopColor: 'rgba(255,255,255,0.05)',
        }}>
            <View style={{
                maxWidth: 1200,
                marginHorizontal: 'auto',
                width: '100%',
                flexDirection: isSmall ? 'column' : 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 32,
            }}>
                <View>
                    <Text style={{ fontSize: 20, fontWeight: '900', color: '#FFFFFF', marginBottom: 8, fontFamily: 'Inter-Bold' }}>
                        Crux<Text style={{ color: ACCENT }}>Analytics</Text>
                    </Text>
                    <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, fontFamily: 'Inter-Regular' }}>
                        {t('landing.footer.copyright')}
                    </Text>
                </View>

                <View style={{ flexDirection: 'row', gap: 32 }}>
                    <Pressable onPress={() => Linking.openURL('https://github.com/Jon-human-in-the-loop/CruxAnalytics')}>
                        <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, fontFamily: 'Inter-Medium' }}>GitHub</Text>
                    </Pressable>
                    <Pressable onPress={() => Linking.openURL('https://www.vanguardcrux.com/')}>
                        <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, fontFamily: 'Inter-Medium' }}>Contact</Text>
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
    const { isReady } = useTranslation();

    if (!isReady) {
        return <View style={{ flex: 1, backgroundColor: BG }} />;
    }

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: BG }}
            contentContainerStyle={{ flexGrow: 1 }}
        >
            <NavBar />
            <HeroSection />
            <FeaturesSection />
            <VanguardSection />
            <Footer />
        </ScrollView>
    );
}
