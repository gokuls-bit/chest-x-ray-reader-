"use client";

import { cn } from "@/lib/utils";
import { CheckCircle2, AlertTriangle, XCircle, Download } from "lucide-react";

interface BatchResult {
    filename: string;
    prediction: string;
    confidence: number;
    severity: string;
    probabilities: { label: string; score: number }[];
    error?: string;
}

interface BatchResultsProps {
    results: BatchResult[];
    total: number;
    processed: number;
    failed: number;
}

const severityConfig = {
    Normal: {
        icon: CheckCircle2,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
    },
    Review: {
        icon: AlertTriangle,
        color: "text-amber-500",
        bg: "bg-amber-500/10",
    },
    Critical: {
        icon: XCircle,
        color: "text-red-500",
        bg: "bg-red-500/10",
    },
};

export function BatchResults({
    results,
    total,
    processed,
    failed,
}: BatchResultsProps) {
    const downloadCsv = () => {
        const headers = ["Filename", "Prediction", "Confidence", "Severity", "Error"];
        const rows = results.map((r) => [
            r.filename,
            r.prediction,
            (r.confidence * 100).toFixed(1) + "%",
            r.severity,
            r.error || "",
        ]);

        const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join(
            "\n"
        );
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `xray-batch-results-${Date.now()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-4 animate-fade-in">
            {/* Summary stats */}
            <div className="grid grid-cols-3 gap-4">
                <div className="glass-card p-4 text-center">
                    <p className="text-2xl font-bold text-foreground">{total}</p>
                    <p className="text-xs text-muted-foreground mt-1">Total</p>
                </div>
                <div className="glass-card p-4 text-center">
                    <p className="text-2xl font-bold text-emerald-500">
                        {processed}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        Processed
                    </p>
                </div>
                <div className="glass-card p-4 text-center">
                    <p className="text-2xl font-bold text-red-500">{failed}</p>
                    <p className="text-xs text-muted-foreground mt-1">Failed</p>
                </div>
            </div>

            {/* Download button */}
            <button
                onClick={downloadCsv}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-card text-foreground font-medium rounded-xl border border-border hover:bg-accent transition-colors text-sm"
            >
                <Download className="w-4 h-4" />
                Export Results as CSV
            </button>

            {/* Results table */}
            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-border">
                                {["File", "Prediction", "Confidence", "Severity", "Status"].map(
                                    (header) => (
                                        <th
                                            key={header}
                                            className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                                        >
                                            {header}
                                        </th>
                                    )
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((result, i) => {
                                const config =
                                    severityConfig[
                                    result.severity as keyof typeof severityConfig
                                    ] || severityConfig.Review;
                                const Icon = config.icon;

                                return (
                                    <tr
                                        key={`${result.filename}-${i}`}
                                        className="border-b border-border last:border-0 hover:bg-accent/50 transition-colors"
                                    >
                                        <td className="px-4 py-3 text-sm font-medium text-foreground max-w-[200px] truncate">
                                            {result.filename}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-foreground">
                                            {result.prediction}
                                        </td>
                                        <td className="px-4 py-3 text-sm font-medium text-medical-blue-500">
                                            {(result.confidence * 100).toFixed(1)}%
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={cn(
                                                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
                                                    config.color,
                                                    config.bg
                                                )}
                                            >
                                                <Icon className="w-3 h-3" />
                                                {result.severity}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            {result.error ? (
                                                <span className="text-red-500">
                                                    {result.error}
                                                </span>
                                            ) : (
                                                <span className="text-emerald-500">
                                                    ✓ Done
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
