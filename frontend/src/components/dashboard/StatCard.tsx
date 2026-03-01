"use client";

import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: "up" | "down" | "neutral";
    delta?: string;
    className?: string;
}

export function StatCard({
    title,
    value,
    icon: Icon,
    trend = "neutral",
    delta,
    className,
}: StatCardProps) {
    return (
        <div
            className={cn(
                "glass-card p-6 hover:shadow-xl transition-all duration-300 group",
                className
            )}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
                    {delta && (
                        <div className="flex items-center gap-1 mt-2">
                            <span
                                className={cn(
                                    "text-xs font-medium px-1.5 py-0.5 rounded-md",
                                    trend === "up" &&
                                    "text-emerald-600 bg-emerald-500/10",
                                    trend === "down" &&
                                    "text-red-600 bg-red-500/10",
                                    trend === "neutral" &&
                                    "text-muted-foreground bg-muted"
                                )}
                            >
                                {trend === "up" && "↑ "}
                                {trend === "down" && "↓ "}
                                {delta}
                            </span>
                            <span className="text-xs text-muted-foreground">vs last week</span>
                        </div>
                    )}
                </div>
                <div className="w-12 h-12 rounded-xl bg-medical-blue-500/10 flex items-center justify-center group-hover:bg-medical-blue-500/20 transition-colors">
                    <Icon className="w-6 h-6 text-medical-blue-500" />
                </div>
            </div>
        </div>
    );
}
