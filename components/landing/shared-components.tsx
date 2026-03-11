/**
 * @fileoverview Shared UI components for the landing page.
 * Aesthetic: Editorial, bold typography, generous whitespace.
 * Inspired by wearecollins.com — dark theme variant.
 */

import React from 'react';
import { View, Text, Pressable, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const ACCENT = '#00C0D4';
const MINT = '#A7F3D0';
const CORAL = '#FDBA74';

function useIsSmall() {
    return Dimensions.get('window').width < 768;
}

// ============================================
// GLASS CARD — simplified, less "glassy"
// ============================================
export function GlassCard({
    children,
    className = '',
    gradient = false,
}: {
    children: React.ReactNode;
    className?: string;
    gradient?: boolean;
}) {
    return (
        <View
            className={`rounded-2xl p-6 bg-white/[0.04] border border-white/[0.08] ${className}`}
        >
            {gradient && (
                <View className="absolute inset-0 rounded-2xl overflow-hidden opacity-10">
                    <LinearGradient
                        colors={[ACCENT, MINT]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{ flex: 1 }}
                    />
                </View>
            )}
            {children}
        </View>
    );
}

// ============================================
// PRIMARY BUTTON — solid, no gradient noise
// ============================================
export function GradientButton({
    children,
    onPress,
    size = 'md',
    className = '',
}: {
    children: React.ReactNode;
    onPress?: () => void;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}) {
    const sizeStyles = {
        sm: { paddingHorizontal: 20, paddingVertical: 10 },
        md: { paddingHorizontal: 28, paddingVertical: 14 },
        lg: { paddingHorizontal: 36, paddingVertical: 18 },
    };

    const fontSizes = { sm: 14, md: 16, lg: 18 };

    return (
        <Pressable
            onPress={onPress}
            style={[
                sizeStyles[size],
                {
                    backgroundColor: ACCENT,
                    borderRadius: 100,
                },
            ]}
            className={`active:opacity-80 ${className}`}
        >
            <Text style={{
                color: '#0A0A0A',
                fontWeight: '700',
                fontSize: fontSizes[size],
                textAlign: 'center',
            }}>
                {children}
            </Text>
        </Pressable>
    );
}

// ============================================
// OUTLINE BUTTON — minimal
// ============================================
export function OutlineButton({
    children,
    onPress,
    className = '',
}: {
    children: React.ReactNode;
    onPress?: () => void;
    className?: string;
}) {
    return (
        <Pressable
            onPress={onPress}
            style={{
                paddingHorizontal: 28,
                paddingVertical: 14,
                borderRadius: 100,
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.25)',
            }}
            className={`active:opacity-70 ${className}`}
        >
            <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 16, textAlign: 'center' }}>
                {children}
            </Text>
        </Pressable>
    );
}

// ============================================
// SECTION HEADING — Collins-style editorial
// ============================================
export function SectionHeading({
    title,
    subtitle,
    centered = false,
    light = false,
}: {
    title: string;
    subtitle?: string;
    centered?: boolean;
    light?: boolean;
}) {
    const isSmall = useIsSmall();

    return (
        <View style={{ marginBottom: isSmall ? 32 : 48, width: '100%', alignItems: centered ? 'center' : 'flex-start' }}>
            <Text
                style={{
                    fontSize: isSmall ? 28 : 42,
                    fontWeight: '700',
                    color: light ? '#0A0A0A' : '#FFFFFF',
                    textAlign: centered ? 'center' : 'left',
                    lineHeight: isSmall ? 36 : 52,
                    letterSpacing: -0.5,
                }}
            >
                {title}
            </Text>
            {subtitle && (
                <Text
                    style={{
                        color: light ? 'rgba(10,10,10,0.5)' : 'rgba(255,255,255,0.45)',
                        fontSize: isSmall ? 16 : 18,
                        marginTop: 12,
                        textAlign: centered ? 'center' : 'left',
                        lineHeight: isSmall ? 24 : 28,
                        maxWidth: 560,
                    }}
                >
                    {subtitle}
                </Text>
            )}
        </View>
    );
}

// ============================================
// BADGE — pill, subtle
// ============================================
export function Badge({
    children,
    variant = 'default',
    className = '',
}: {
    children: React.ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'danger';
    className?: string;
}) {
    const colors = {
        default: ACCENT,
        success: MINT,
        warning: CORAL,
        danger: '#F87171',
    };

    const c = colors[variant];

    return (
        <View
            style={{
                paddingHorizontal: 14,
                paddingVertical: 6,
                borderRadius: 100,
                borderWidth: 1,
                borderColor: `${c}40`,
                backgroundColor: `${c}15`,
            }}
            className={className}
        >
            {typeof children === 'string' ? (
                <Text style={{ color: c, fontSize: 12, fontWeight: '600', letterSpacing: 0.5 }}>
                    {children}
                </Text>
            ) : (
                children
            )}
        </View>
    );
}

// ============================================
// FEATURE CARD — clean, no heavy glass
// ============================================
export function FeatureCard({
    icon,
    title,
    description,
    highlight,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
    highlight?: boolean;
}) {
    const isSmall = useIsSmall();

    return (
        <View
            style={{
                flex: 1,
                minWidth: isSmall ? '100%' : 280,
                maxWidth: isSmall ? '100%' : 360,
                padding: 24,
                borderRadius: 16,
                backgroundColor: highlight ? 'rgba(0,192,212,0.06)' : 'rgba(255,255,255,0.03)',
                borderWidth: 1,
                borderColor: highlight ? 'rgba(0,192,212,0.2)' : 'rgba(255,255,255,0.06)',
            }}
        >
            <View style={{
                width: 48, height: 48, borderRadius: 12,
                backgroundColor: 'rgba(0,192,212,0.1)',
                alignItems: 'center', justifyContent: 'center',
                marginBottom: 16,
            }}>
                {icon}
            </View>
            <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '700', marginBottom: 8 }}>
                {title}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, lineHeight: 22 }}>
                {description}
            </Text>
        </View>
    );
}

// ============================================
// STAT NUMBER — editorial, large
// ============================================
export function StatNumber({
    value,
    label,
    suffix = '',
}: {
    value: number;
    label: string;
    suffix?: string;
}) {
    const isSmall = useIsSmall();

    return (
        <View style={{ alignItems: 'center', minWidth: isSmall ? 100 : 140 }}>
            <Text style={{
                fontSize: isSmall ? 40 : 56,
                fontWeight: '800',
                color: '#FFFFFF',
                letterSpacing: -2,
            }}>
                {value.toLocaleString()}{suffix}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, marginTop: 4, textAlign: 'center' }}>
                {label}
            </Text>
        </View>
    );
}

// ============================================
// TESTIMONIAL CARD — minimal
// ============================================
export function TestimonialCard({
    quote,
    author,
    role,
    avatar,
}: {
    quote: string;
    author: string;
    role: string;
    avatar?: string;
}) {
    const initials = author.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    const isSmall = useIsSmall();

    return (
        <View style={{
            flex: 1,
            minWidth: isSmall ? '100%' : 280,
            maxWidth: isSmall ? '100%' : 380,
            padding: 28,
            borderRadius: 16,
            backgroundColor: 'rgba(255,255,255,0.03)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.06)',
        }}>
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, lineHeight: 26, marginBottom: 20 }}>
                "{quote}"
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{
                    width: 36, height: 36, borderRadius: 18,
                    backgroundColor: ACCENT,
                    alignItems: 'center', justifyContent: 'center',
                }}>
                    <Text style={{ color: '#0A0A0A', fontWeight: '700', fontSize: 13 }}>{initials}</Text>
                </View>
                <View>
                    <Text style={{ color: '#FFFFFF', fontWeight: '600', fontSize: 14 }}>{author}</Text>
                    <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>{role}</Text>
                </View>
            </View>
        </View>
    );
}

// ============================================
// TRACTION STAT — bold number
// ============================================
export function TractionStat({
    value,
    label,
    color = 'teal',
}: {
    value: string;
    label: string;
    color?: 'teal' | 'mint' | 'coral';
}) {
    const colorMap = { teal: ACCENT, mint: MINT, coral: CORAL };
    const isSmall = useIsSmall();

    return (
        <View style={{
            flex: 1,
            minWidth: isSmall ? '45%' : 160,
            alignItems: 'center',
            paddingVertical: 24,
            paddingHorizontal: 16,
            borderRadius: 16,
            backgroundColor: 'rgba(255,255,255,0.03)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.06)',
        }}>
            <Text style={{
                color: colorMap[color],
                fontSize: isSmall ? 32 : 40,
                fontWeight: '800',
                letterSpacing: -1,
            }}>
                {value}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, textAlign: 'center', marginTop: 6 }}>
                {label}
            </Text>
        </View>
    );
}

// ============================================
// ROADMAP CARD — timeline
// ============================================
export function RoadmapCard({
    quarter,
    title,
    description,
    status,
    isLast = false,
}: {
    quarter: string;
    title: string;
    description: string;
    status: 'completed' | 'in_progress' | 'planned';
    isLast?: boolean;
}) {
    const statusConfig = {
        completed: { color: MINT, icon: 'checkmark' as const },
        in_progress: { color: ACCENT, icon: 'arrow-forward' as const },
        planned: { color: '#6b7280', icon: 'ellipse-outline' as const },
    };

    const config = statusConfig[status];

    return (
        <View style={{ flexDirection: 'row', gap: 16, marginBottom: 24 }}>
            <View style={{ alignItems: 'center', width: 40 }}>
                <View style={{
                    width: 40, height: 40, borderRadius: 20,
                    borderWidth: 2, borderColor: config.color,
                    backgroundColor: `${config.color}15`,
                    alignItems: 'center', justifyContent: 'center',
                }}>
                    <Ionicons name={config.icon} size={16} color={config.color} />
                </View>
                {!isLast && (
                    <View style={{
                        flex: 1, width: 2, marginTop: 8,
                        backgroundColor: status === 'completed' ? MINT : '#374151',
                        minHeight: 32,
                    }} />
                )}
            </View>
            <View style={{ flex: 1, paddingBottom: 8 }}>
                <Text style={{
                    color: config.color, fontSize: 11, fontWeight: '700',
                    letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 4,
                }}>
                    {quarter}
                </Text>
                <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 17, marginBottom: 4 }}>
                    {title}
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, lineHeight: 22 }}>
                    {description}
                </Text>
            </View>
        </View>
    );
}

// ============================================
// PRICING CARD — clean tiers
// ============================================
export function PricingCard({
    name,
    price,
    description,
    features,
    badge,
    highlighted = false,
}: {
    name: string;
    price: string;
    description: string;
    features: string[];
    badge?: string;
    highlighted?: boolean;
}) {
    const isSmall = useIsSmall();

    return (
        <View style={{
            flex: 1,
            minWidth: isSmall ? '100%' : 240,
            maxWidth: isSmall ? '100%' : 320,
            padding: 28,
            borderRadius: 16,
            backgroundColor: highlighted ? 'rgba(0,192,212,0.06)' : 'rgba(255,255,255,0.03)',
            borderWidth: highlighted ? 2 : 1,
            borderColor: highlighted ? 'rgba(0,192,212,0.3)' : 'rgba(255,255,255,0.06)',
            position: 'relative',
        }}>
            {badge && (
                <View style={{
                    position: 'absolute', top: -12, alignSelf: 'center',
                    paddingHorizontal: 12, paddingVertical: 4, borderRadius: 100,
                    backgroundColor: highlighted ? ACCENT : '#374151',
                }}>
                    <Text style={{
                        color: highlighted ? '#0A0A0A' : '#9ca3af',
                        fontSize: 11, fontWeight: '700',
                    }}>
                        {badge}
                    </Text>
                </View>
            )}

            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, marginBottom: 4 }}>{name}</Text>
            <Text style={{ color: '#FFFFFF', fontSize: 32, fontWeight: '800', letterSpacing: -1, marginBottom: 4 }}>
                {price}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, marginBottom: 20 }}>{description}</Text>

            <View style={{ gap: 10 }}>
                {features.map((feature, i) => (
                    <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Ionicons name="checkmark" size={14} color={MINT} />
                        <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14 }}>{feature}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}

// ============================================
// VANGUARD METRIC CARD — proprietary metrics
// ============================================
export function VanguardMetricCard({
    acronym,
    title,
    description,
    badge,
    color = 'teal',
}: {
    acronym: string;
    title: string;
    description: string;
    badge: string;
    color?: 'teal' | 'mint' | 'coral';
}) {
    const colorMap = { teal: ACCENT, mint: MINT, coral: CORAL };
    const c = colorMap[color];
    const isSmall = useIsSmall();

    return (
        <View style={{
            flex: 1,
            minWidth: isSmall ? '100%' : 260,
            maxWidth: isSmall ? '100%' : 340,
            padding: 28,
            borderRadius: 16,
            backgroundColor: 'rgba(255,255,255,0.03)',
            borderWidth: 1,
            borderColor: `${c}30`,
        }}>
            <View style={{
                width: 56, height: 56, borderRadius: 16,
                backgroundColor: `${c}15`,
                alignItems: 'center', justifyContent: 'center',
                marginBottom: 20,
            }}>
                <Text style={{
                    color: c, fontSize: 20, fontWeight: '900',
                    fontFamily: 'monospace',
                }}>
                    {acronym}
                </Text>
            </View>

            <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 17, marginBottom: 8 }}>
                {title}
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, lineHeight: 22, marginBottom: 16 }}>
                {description}
            </Text>

            <View style={{
                paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6,
                backgroundColor: `${c}15`, borderWidth: 1, borderColor: `${c}30`,
                alignSelf: 'flex-start',
            }}>
                <Text style={{ color: c, fontSize: 11, fontWeight: '700' }}>{badge}</Text>
            </View>
        </View>
    );
}

// ============================================
// METRIC CARD — kept for app usage
// ============================================
export function MetricCard({
    icon,
    label,
    value,
    subValue,
    trend,
    color = 'indigo',
}: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    subValue?: string;
    trend?: 'up' | 'down' | 'neutral';
    color?: 'indigo' | 'emerald' | 'amber' | 'rose';
}) {
    return (
        <View style={{
            flex: 1, minWidth: 160, padding: 20, borderRadius: 16,
            backgroundColor: 'rgba(255,255,255,0.04)',
            borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
        }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <View style={{
                    width: 40, height: 40, borderRadius: 10,
                    backgroundColor: 'rgba(0,192,212,0.1)',
                    alignItems: 'center', justifyContent: 'center',
                }}>
                    {icon}
                </View>
                <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, flex: 1 }}>{label}</Text>
            </View>
            <Text style={{ color: '#FFFFFF', fontSize: 24, fontWeight: '700' }}>{value}</Text>
            {subValue && (
                <Text style={{
                    fontSize: 13, marginTop: 4,
                    color: trend === 'up' ? MINT : trend === 'down' ? '#F87171' : 'rgba(255,255,255,0.4)',
                }}>
                    {subValue}
                </Text>
            )}
        </View>
    );
}
