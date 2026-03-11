import React from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useTranslation } from '@/providers/i18n-provider';

const ACCENT = '#00C0D4';
const BG = '#000000';

export function LanguageSelector() {
    const { language, setLanguage } = useTranslation();

    const handleLanguageChange = async (lang: 'es' | 'en') => {
        if (Platform.OS !== 'web') {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        await setLanguage(lang);
    };

    return (
        <View
            style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                borderRadius: 999, 
                padding: 4,
                flexDirection: 'row',
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.1)',
            }}
        >
            <Pressable
                onPress={() => handleLanguageChange('es')}
                style={({ pressed }) => ({
                    opacity: pressed ? 0.7 : 1,
                    backgroundColor: language === 'es' ? ACCENT : 'transparent',
                    borderRadius: 999,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                })}
            >
                <Text style={{ 
                    color: language === 'es' ? BG : 'rgba(255, 255, 255, 0.5)', 
                    fontWeight: '700',
                    fontFamily: 'Inter-Bold',
                    fontSize: 12,
                }}>
                    ES
                </Text>
            </Pressable>

            <Pressable
                onPress={() => handleLanguageChange('en')}
                style={({ pressed }) => ({
                    opacity: pressed ? 0.7 : 1,
                    backgroundColor: language === 'en' ? ACCENT : 'transparent',
                    borderRadius: 999,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                })}
            >
                <Text style={{ 
                    color: language === 'en' ? BG : 'rgba(255, 255, 255, 0.5)', 
                    fontWeight: '700',
                    fontFamily: 'Inter-Bold',
                    fontSize: 12,
                }}>
                    EN
                </Text>
            </Pressable>
        </View>
    );
}
