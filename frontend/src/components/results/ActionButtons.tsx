"use client";

import { Save, Download, Share2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionButtonsProps {
    onSave?: () => void;
    onDownload?: () => void;
    onShare?: () => void;
    onReanalyze?: () => void;
    saved?: boolean;
}

const actions = [
    {
        key: "save",
        label: "Save Report",
        icon: Save,
        color: "bg-medical-blue-600 text-white hover:bg-medical-blue-700 shadow-lg shadow-medical-blue-600/25",
    },
    {
        key: "download",
        label: "Download PDF",
        icon: Download,
        color: "bg-card text-foreground border border-border hover:bg-accent",
    },
    {
        key: "share",
        label: "Share",
        icon: Share2,
        color: "bg-card text-foreground border border-border hover:bg-accent",
    },
    {
        key: "reanalyze",
        label: "Re-analyze",
        icon: RefreshCw,
        color: "bg-card text-foreground border border-border hover:bg-accent",
    },
];

export function ActionButtons({
    onSave,
    onDownload,
    onShare,
    onReanalyze,
    saved,
}: ActionButtonsProps) {
    const handlers: Record<string, (() => void) | undefined> = {
        save: onSave,
        download: onDownload,
        share: onShare,
        reanalyze: onReanalyze,
    };

    return (
        <div className="flex flex-wrap gap-3 animate-fade-in">
            {actions.map((action) => {
                const Icon = action.icon;
                const isSaved = action.key === "save" && saved;

                return (
                    <button
                        key={action.key}
                        onClick={handlers[action.key]}
                        disabled={isSaved}
                        className={cn(
                            "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
                            isSaved
                                ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 cursor-default"
                                : action.color
                        )}
                    >
                        <Icon className="w-4 h-4" />
                        {isSaved ? "Saved ✓" : action.label}
                    </button>
                );
            })}
        </div>
    );
}
