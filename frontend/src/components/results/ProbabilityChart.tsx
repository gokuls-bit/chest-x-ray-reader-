"use client";

import { cn } from "@/lib/utils";

interface ProbabilityChartProps {
    probabilities: { label: string; score: number }[];
}

export function ProbabilityChart({ probabilities }: ProbabilityChartProps) {
    const sorted = [...probabilities].sort((a, b) => b.score - a.score);
    const maxScore = sorted[0]?.score || 1;

    return (
        <div className="glass-card p-6 animate-fade-in">
            <h3 className="text-lg font-semibold text-foreground mb-1">
                Prediction Probabilities
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
                Confidence scores across all conditions
            </p>

            <div className="space-y-4">
                {sorted.map((item, i) => (
                    <div key={item.label}>
                        <div className="flex items-center justify-between mb-1.5">
                            <span
                                className={cn(
                                    "text-sm font-medium",
                                    i === 0 ? "text-foreground" : "text-muted-foreground"
                                )}
                            >
                                {item.label}
                            </span>
                            <span
                                className={cn(
                                    "text-sm font-semibold",
                                    i === 0
                                        ? "text-medical-blue-500"
                                        : "text-muted-foreground"
                                )}
                            >
                                {(item.score * 100).toFixed(1)}%
                            </span>
                        </div>
                        <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                            <div
                                className={cn(
                                    "h-full rounded-full transition-all duration-1000 ease-out",
                                    i === 0
                                        ? "bg-gradient-to-r from-medical-blue-500 to-medical-blue-400"
                                        : "bg-medical-blue-200 dark:bg-medical-blue-800"
                                )}
                                style={{
                                    width: `${(item.score / maxScore) * 100}%`,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
