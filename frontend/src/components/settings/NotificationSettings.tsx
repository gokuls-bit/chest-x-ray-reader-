"use client";

import { useState } from "react";
import { Bell } from "lucide-react";

export function NotificationSettings() {
    const [prefs, setPrefs] = useState({
        emailOnReport: true,
        criticalAlerts: true,
        weeklyDigest: true,
    });

    const toggle = (key: keyof typeof prefs) => {
        setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const items = [
        {
            key: "emailOnReport" as const,
            label: "Email on report ready",
            description: "Get notified when your X-ray analysis is complete",
        },
        {
            key: "criticalAlerts" as const,
            label: "Critical finding alerts",
            description: "Immediate alerts for critical diagnoses",
        },
        {
            key: "weeklyDigest" as const,
            label: "Weekly digest",
            description: "Summary of your diagnostic activity every Monday",
        },
    ];

    return (
        <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-foreground">
                        Notifications
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Configure how you receive alerts
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                {items.map((item) => (
                    <div
                        key={item.key}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-accent/50 transition-colors"
                    >
                        <div>
                            <p className="text-sm font-medium text-foreground">
                                {item.label}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {item.description}
                            </p>
                        </div>
                        <button
                            onClick={() => toggle(item.key)}
                            className={`relative w-11 h-6 rounded-full transition-colors ${prefs[item.key]
                                    ? "bg-medical-blue-500"
                                    : "bg-muted-foreground/30"
                                }`}
                        >
                            <span
                                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${prefs[item.key] ? "translate-x-5" : "translate-x-0"
                                    }`}
                            />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
