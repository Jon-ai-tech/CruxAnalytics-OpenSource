/**
 * @fileoverview Crux Analytics App - Layout with sidebar navigation
 * Professional dashboard layout for the SME calculator tools
 */

import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, Platform } from 'react-native';
import { Slot, useRouter, usePathname, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassCard } from '@/components/landing/shared-components';

const NAV_ITEMS = [
    {
        icon: 'home-outline' as const,
        label: 'Dashboard',
        href: '/crux',
        description: 'Resumen de tu negocio'
    },
    {
        icon: 'trending-up-outline' as const,
        label: 'Break-even',
        href: '/crux/break-even',
        description: 'Punto de equilibrio'
    },
    {
        icon: 'wallet-outline' as const,
        label: 'Flujo de Caja',
        href: '/crux/cash-flow',
        description: 'Proyección 12 meses'
    },
    {
        icon: 'pricetag-outline' as const,
        label: 'Precios',
        href: '/crux/pricing',
        description: 'Precio óptimo'
    },
    {
        icon: 'card-outline' as const,
        label: 'Préstamos',
        href: '/crux/loan',
        description: 'Evaluación de créditos'
    },
    {
        icon: 'people-outline' as const,
        label: 'ROI Empleados',
        href: '/crux/employee-roi',
        description: '¿Vale la pena contratar?'
    },
    {
        icon: 'megaphone-outline' as const,
        label: 'ROI Marketing',
        href: '/crux/marketing',
        description: 'Mide tu publicidad'
    },
];

function NavItem({
    icon,
    label,
    href,
    description,
    isActive,
    collapsed
}: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    href: string;
    description: string;
    isActive: boolean;
    collapsed: boolean;
}) {
    return (
        <Link href={href as any} asChild>
            <Pressable
                className={`
          flex-row items-center gap-3 px-4 py-3 rounded-xl mb-1
          ${isActive
                        ? 'bg-gradient-to-r from-indigo-600/30 to-violet-600/20 border border-indigo-500/30'
                        : 'hover:bg-white/5'
                    }
        `}
            >
                <View
                    className={`
            w-10 h-10 rounded-lg items-center justify-center
            ${isActive ? 'bg-indigo-500' : 'bg-white/10'}
          `}
                >
                    <Ionicons
                        name={icon}
                        size={20}
                        color={isActive ? 'white' : '#9ca3af'}
                    />
                </View>
                {!collapsed && (
                    <View className="flex-1">
                        <Text className={`font-medium ${isActive ? 'text-white' : 'text-gray-300'}`}>
                            {label}
                        </Text>
                        <Text className="text-xs text-gray-500">{description}</Text>
                    </View>
                )}
            </Pressable>
        </Link>
    );
}

function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
    const pathname = usePathname();

    return (
        <View
            className={`
        bg-slate-900/80 backdrop-blur-xl border-r border-white/10
        ${collapsed ? 'w-20' : 'w-72'}
        transition-all duration-300
      `}
        >
            {/* Logo */}
            <View className="px-4 py-6 border-b border-white/10 flex-row items-center justify-between">
                {!collapsed && (
                    <Text className="text-xl font-bold text-white">
                        Crux<Text className="text-indigo-400">Analytics</Text>
                    </Text>
                )}
                <Pressable onPress={onToggle} className="p-2">
                    <Ionicons
                        name={collapsed ? 'chevron-forward' : 'chevron-back'}
                        size={20}
                        color="#9ca3af"
                    />
                </Pressable>
            </View>

            {/* Navigation */}
            <ScrollView className="flex-1 px-3 py-4">
                {NAV_ITEMS.map((item) => (
                    <NavItem
                        key={item.href}
                        {...item}
                        isActive={pathname === item.href}
                        collapsed={collapsed}
                    />
                ))}
            </ScrollView>

            {/* Footer */}
            <View className="px-4 py-4 border-t border-white/10">
                {!collapsed && (
                    <View className="bg-gradient-to-r from-indigo-600/20 to-violet-600/20 rounded-xl p-4">
                        <Text className="text-white font-medium text-sm">💡 Pro tip</Text>
                        <Text className="text-gray-400 text-xs mt-1">
                            Completa todos los análisis para ver tu Health Score general.
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
}

function TopBar() {
    const router = useRouter();

    return (
        <View className="h-16 px-6 flex-row items-center justify-between border-b border-white/10 bg-slate-900/50 backdrop-blur-xl">
            <View className="flex-row items-center gap-4">
                <Pressable
                    onPress={() => router.push('/landing')}
                    className="flex-row items-center gap-2"
                >
                    <Ionicons name="arrow-back" size={20} color="#9ca3af" />
                    <Text className="text-gray-400 text-sm">Volver al inicio</Text>
                </Pressable>
            </View>

            <View className="flex-row items-center gap-4">
                <View className="flex-row items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                    <View className="w-2 h-2 rounded-full bg-emerald-400" />
                    <Text className="text-emerald-400 text-sm">Datos privados</Text>
                </View>

                <Pressable className="p-2 rounded-lg bg-white/5">
                    <Ionicons name="download-outline" size={20} color="#9ca3af" />
                </Pressable>
            </View>
        </View>
    );
}

export default function CruxLayout() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const isWeb = Platform.OS === 'web';

    return (
        <View className="flex-1 flex-row bg-slate-950">
            {/* Sidebar - only on web or large screens */}
            {isWeb && (
                <Sidebar
                    collapsed={sidebarCollapsed}
                    onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                />
            )}

            {/* Main content */}
            <View className="flex-1">
                <TopBar />
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ padding: 24 }}
                >
                    <Slot />
                </ScrollView>
            </View>
        </View>
    );
}
