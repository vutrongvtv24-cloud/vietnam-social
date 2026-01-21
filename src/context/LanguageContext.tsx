"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { en, vi, type TranslationKeys } from "@/i18n";
import { createClient } from "@/lib/supabase/client";

export type Language = "en" | "vi";

type LanguageContextType = {
    language: Language;
    setLanguage: (lang: Language) => Promise<void>;
    t: TranslationKeys;
};

const translations: Record<Language, TranslationKeys> = { en, vi };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>("vi"); // Default to Vietnamese
    const [userId, setUserId] = useState<string | null>(null);
    const supabase = createClient();

    // Load user's language preference
    useEffect(() => {
        const loadLanguage = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setUserId(session.user.id);

                const { data: profile } = await supabase
                    .from("profiles")
                    .select("language")
                    .eq("id", session.user.id)
                    .single();

                if (profile?.language) {
                    setLanguageState(profile.language as Language);
                }
            } else {
                // Check localStorage for guests
                const savedLang = localStorage.getItem("language") as Language;
                if (savedLang && (savedLang === "en" || savedLang === "vi")) {
                    setLanguageState(savedLang);
                }
            }
        };

        loadLanguage();
    }, [supabase]);

    // Set language and persist
    const setLanguage = useCallback(async (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem("language", lang);

        if (userId) {
            await supabase
                .from("profiles")
                .update({ language: lang })
                .eq("id", userId);
        }
    }, [userId, supabase]);

    const t = translations[language];

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}

// Helper hook for simple translation access
export function useTranslation() {
    const { t } = useLanguage();
    return t;
}
