"use client";

import { useLanguage, type Language } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

const languages: { code: Language; name: string; flag: string }[] = [
    { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
    { code: "en", name: "English", flag: "🇺🇸" },
];

interface LanguageSelectorProps {
    variant?: "icon" | "full";
    size?: "sm" | "default";
}

export function LanguageSelector({ variant = "icon", size = "default" }: LanguageSelectorProps) {
    const { language, setLanguage } = useLanguage();
    const currentLang = languages.find((l) => l.code === language);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size={size === "sm" ? "sm" : "default"}
                    className="gap-2"
                >
                    {variant === "icon" ? (
                        <>
                            <Globe className="h-4 w-4" />
                            <span className="text-lg">{currentLang?.flag}</span>
                        </>
                    ) : (
                        <>
                            <span className="text-lg">{currentLang?.flag}</span>
                            <span>{currentLang?.name}</span>
                        </>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => setLanguage(lang.code)}
                        className={language === lang.code ? "bg-accent" : ""}
                    >
                        <span className="text-lg mr-2">{lang.flag}</span>
                        {lang.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

// Language selection cards for onboarding
export function LanguageCards({ onSelect }: { onSelect: (lang: Language) => void }) {
    return (
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {languages.map((lang) => (
                <button
                    key={lang.code}
                    onClick={() => onSelect(lang.code)}
                    className="flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all duration-200 group"
                >
                    <span className="text-5xl">{lang.flag}</span>
                    <span className="font-medium text-lg group-hover:text-primary transition-colors">
                        {lang.name}
                    </span>
                </button>
            ))}
        </div>
    );
}
