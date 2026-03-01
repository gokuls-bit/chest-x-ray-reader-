"use client";

import { cn } from "@/lib/utils";
import { getSeverityColor, formatConfidence, formatDate } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, Eye } from "lucide-react";

interface ResultCardProps {
    prediction: string;
    confidence: number;
    severity: string;
    timestamp?: string;
}

const severityIcons = {
    Normal: CheckCircle2,
    Review: Eye,
    Critical: AlertTriangle,
};

const recommendedActions: Record<string, string> = {
    Normal: "No further action required. Routine follow-up recommended.",
    Review: "Review by senior radiologist recommended within 24 hours.",
    Critical: "Immediate attention required. Notify attending physician.",
};

export function ResultCard({ prediction, confidence, severity, timestamp }: ResultCardProps) {
    const Icon = severityIcons[severity as keyof typeof severityIcons] || Eye;

    return (
        <div className="glass-card p-6 animate-fade-in">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">
                        AI Diagnosis
                    </p>
                    <h3 className="text-2xl font-bold text-foreground mt-1">
                        {prediction}
                    </h3>
                </div>
                <div
                    className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border",
                        getSeverityColor(severity)
                    )}
                >
                    <Icon className="w-3.5 h-3.5" />
                    {severity}
                </div>
            </div>

            <div className="flex items-center gap-6 mb-4">
                <div>
                    <p className="text-sm text-muted-foreground">Confidence</p>
                    <p className="text-xl font-bold text-medical-blue-500">
                        {formatConfidence(confidence)}
                    </p>
                </div>
                {timestamp && (
                    <div>
                        <p className="text-sm text-muted-foreground">Analyzed</p>
                        <p className="text-sm font-medium text-foreground">
                            {formatDate(timestamp)}
                        </p>
                    </div>
                )}
            </div>

            <div className="p-3 rounded-lg bg-muted/50 border border-border">
                <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Recommended: </span>
                    {recommendedActions[severity] || recommendedActions.Review}
                </p>
            </div>
        </div>
    );
}
