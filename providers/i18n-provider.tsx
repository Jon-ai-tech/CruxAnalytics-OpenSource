import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import esTranslations from '../locales/es.json';
import enTranslations from '../locales/en.json';

export type Language = 'es' | 'en';

type Translations = typeof esTranslations;

interface I18nContextType {
    language: Language;
    setLanguage: (lang: Language) => Promise<void>;
    t: (key: string, params?: Record<string, string>) => string;
    translations: Translations;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = '@business_case_analyzer:language';

const translationsMap: Record<Language, Translations> = {
    es: esTranslations,
    en: enTranslations,
};

export function I18nProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>('es');
    const [translations, setTranslations] = useState<Translations>(esTranslations);

    useEffect(() => {
        loadLanguage();
    }, []);

    const loadLanguage = async () => {
        try {
            const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
            if (savedLanguage && (savedLanguage === 'es' || savedLanguage === 'en')) {
                setLanguageState(savedLanguage);
                setTranslations(translationsMap[savedLanguage]);
            }
        } catch (error) {
            console.error('Error loading language:', error);
        }
    };

    const setLanguage = async (lang: Language) => {
        try {
            await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
            setLanguageState(lang);
            setTranslations(translationsMap[lang]);
        } catch (error) {
            console.error('Error saving language:', error);
        }
    };

    const t = (key: string, params?: Record<string, string>): string => {
        const keys = key.split('.');
        let value: any = translations;

        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return key; // Return key if translation not found
            }
        }

        if (typeof value !== 'string') {
            return key;
        }

        // Replace parameters if provided
        if (params) {
            return Object.entries(params).reduce((acc, [paramKey, paramValue]) => {
                return acc.replace(new RegExp(`{{${paramKey}}}`, 'g'), paramValue);
            }, value);
        }

        return value;
    };

    return (
        <I18nContext.Provider value={{ language, setLanguage, t, translations }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useTranslation() {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error('useTranslation must be used within I18nProvider');
    }
    return context;
}
