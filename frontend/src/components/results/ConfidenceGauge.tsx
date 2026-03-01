"use client";

interface ConfidenceGaugeProps {
    confidence: number; // 0–1
}

export function ConfidenceGauge({ confidence }: ConfidenceGaugeProps) {
    const percentage = Math.round(confidence * 100);
    const circumference = 2 * Math.PI * 45; // r=45
    const offset = circumference - (confidence * circumference);

    const getColor = () => {
        if (percentage >= 90) return { stroke: "#10b981", text: "text-emerald-500" };
        if (percentage >= 70) return { stroke: "#f59e0b", text: "text-amber-500" };
        return { stroke: "#ef4444", text: "text-red-500" };
    };

    const color = getColor();

    return (
        <div className="glass-card p-6 flex flex-col items-center animate-fade-in">
            <h3 className="text-lg font-semibold text-foreground mb-4">
                Model Confidence
            </h3>

            <div className="relative w-32 h-32">
                <svg
                    className="w-full h-full -rotate-90"
                    viewBox="0 0 100 100"
                >
                    {/* Background circle */}
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="hsl(var(--muted))"
                        strokeWidth="8"
                    />
                    {/* Progress circle */}
                    <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke={color.stroke}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        className="transition-all duration-1500 ease-out"
                        style={
                            {
                                "--gauge-offset": offset,
                                animation: "gauge-fill 1.5s ease-out forwards",
                            } as React.CSSProperties
                        }
                    />
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-2xl font-bold ${color.text}`}>
                        {percentage}%
                    </span>
                </div>
            </div>

            <p className="text-sm text-muted-foreground mt-3">
                {percentage >= 90
                    ? "High confidence"
                    : percentage >= 70
                        ? "Moderate confidence"
                        : "Low confidence"}
            </p>
        </div>
    );
}
