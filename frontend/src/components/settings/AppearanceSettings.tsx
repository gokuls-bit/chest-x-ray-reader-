"use client";

import { Palette, Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/lib/hooks/useTheme";
import { cn } from "@/lib/utils";

export function AppearanceSettings() {
    const { theme, setTheme } = useTheme();

    const themes = [
        { key: "light", label: "Light", icon: Sun },
        { key: "dark", label: "Dark", icon: Moon },
        { key: "system", label: "System", icon: Monitor },
    ];

    return (
        <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <Palette className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-foreground">
                        Appearance
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Customize the look and feel
                    </p>
                </div>
            </div>

            <div>
                <p className="text-sm font-medium text-foreground mb-3">Theme</p>
                <div className="grid grid-cols-3 gap-3">
                    {themes.map((t) => {
                        const Icon = t.icon;
                        return (
                            <button
                                key={t.key}
                                onClick={() => setTheme(t.key)}
                                className={cn(
                                    "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                                    theme === t.key
                                        ? "border-medical-blue-500 bg-medical-blue-500/5"
                                        : "border-border hover:border-medical-blue-300"
                                )}
                            >
                                <Icon
                                    className={cn(
                                        "w-5 h-5",
                                        theme === t.key
                                            ? "text-medical-blue-500"
                                            : "text-muted-foreground"
                                    )}
                                />
                                <span
                                    className={cn(
                                        "text-sm font-medium",
                                        theme === t.key
                                            ? "text-medical-blue-500"
                                            : "text-muted-foreground"
                                    )}
                                >
                                    {t.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
