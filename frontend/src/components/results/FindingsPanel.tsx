"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Scan } from "lucide-react";

interface FindingsPanelProps {
    findings: string[];
}

export function FindingsPanel({ findings }: FindingsPanelProps) {
    const [expanded, setExpanded] = useState(true);

    if (!findings || findings.length === 0) {
        return null;
    }

    return (
        <div className="glass-card p-6 animate-fade-in">
            <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center justify-between w-full"
            >
                <div className="flex items-center gap-2">
                    <Scan className="w-5 h-5 text-medical-blue-500" />
                    <h3 className="text-lg font-semibold text-foreground">
                        AI Findings
                    </h3>
                    <span className="text-xs bg-medical-blue-500/10 text-medical-blue-500 px-2 py-0.5 rounded-full font-medium">
                        {findings.length}
                    </span>
                </div>
                {expanded ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
            </button>

            {expanded && (
                <ul className="mt-4 space-y-2">
                    {findings.map((finding, i) => (
                        <li
                            key={i}
                            className="flex items-start gap-3 text-sm text-muted-foreground p-2 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-medical-blue-500 flex-shrink-0" />
                            {finding}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
