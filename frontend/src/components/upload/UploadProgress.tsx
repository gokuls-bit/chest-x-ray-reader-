"use client";

import { cn } from "@/lib/utils";

interface UploadProgressProps {
    progress: number;
}

const stages = [
    { label: "Uploading", min: 0, max: 49 },
    { label: "Analyzing", min: 50, max: 89 },
    { label: "Complete", min: 90, max: 100 },
];

export function UploadProgress({ progress }: UploadProgressProps) {
    const currentStage =
        stages.find((s) => progress >= s.min && progress <= s.max) || stages[0];

    return (
        <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-foreground">
                    {currentStage.label}...
                </p>
                <p className="text-sm font-semibold text-medical-blue-500">
                    {Math.round(progress)}%
                </p>
            </div>

            <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                <div
                    className={cn(
                        "h-full rounded-full transition-all duration-500 ease-out",
                        progress === 100
                            ? "bg-emerald-500"
                            : "bg-gradient-to-r from-medical-blue-500 to-medical-blue-400"
                    )}
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Stage indicators */}
            <div className="flex justify-between mt-3">
                {stages.map((stage) => (
                    <div key={stage.label} className="flex items-center gap-1.5">
                        <div
                            className={cn(
                                "w-2 h-2 rounded-full transition-colors",
                                progress >= stage.min
                                    ? progress >= stage.max
                                        ? "bg-emerald-500"
                                        : "bg-medical-blue-500 animate-pulse"
                                    : "bg-muted-foreground/30"
                            )}
                        />
                        <span
                            className={cn(
                                "text-xs transition-colors",
                                progress >= stage.min
                                    ? "text-foreground font-medium"
                                    : "text-muted-foreground"
                            )}
                        >
                            {stage.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
