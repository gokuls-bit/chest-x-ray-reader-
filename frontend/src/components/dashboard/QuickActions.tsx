"use client";

import Link from "next/link";
import { Upload, FileText, Download } from "lucide-react";

const actions = [
    {
        label: "New Upload",
        description: "Upload a new X-ray",
        href: "/upload",
        icon: Upload,
        color: "bg-medical-blue-500/10 text-medical-blue-500 hover:bg-medical-blue-500/20",
    },
    {
        label: "View Reports",
        description: "Browse all reports",
        href: "/reports",
        icon: FileText,
        color: "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20",
    },
    {
        label: "Export CSV",
        description: "Download report data",
        href: "#",
        icon: Download,
        color: "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20",
    },
];

export function QuickActions() {
    return (
        <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
                Quick Actions
            </h3>
            <div className="space-y-3">
                {actions.map((action) => {
                    const Icon = action.icon;
                    return (
                        <Link
                            key={action.label}
                            href={action.href}
                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent transition-all group"
                        >
                            <div
                                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${action.color}`}
                            >
                                <Icon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-foreground group-hover:text-medical-blue-500 transition-colors">
                                    {action.label}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {action.description}
                                </p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
