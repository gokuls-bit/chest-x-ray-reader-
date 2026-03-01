"use client";

import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";

interface ActivityItem {
    id: string;
    patientId: string;
    diagnosis: string;
    status: "Normal" | "Review" | "Critical";
    timestamp: string;
}

const mockActivity: ActivityItem[] = [
    {
        id: "1",
        patientId: "PX-A1B2C",
        diagnosis: "Normal",
        status: "Normal",
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
        id: "2",
        patientId: "PX-D3E4F",
        diagnosis: "Pneumonia (Bacterial)",
        status: "Critical",
        timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    },
    {
        id: "3",
        patientId: "PX-G5H6I",
        diagnosis: "Normal",
        status: "Normal",
        timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
    {
        id: "4",
        patientId: "PX-J7K8L",
        diagnosis: "Pneumonia (Viral)",
        status: "Review",
        timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    },
    {
        id: "5",
        patientId: "PX-M9N0O",
        diagnosis: "Normal",
        status: "Normal",
        timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    },
];

const statusColors = {
    Normal: "bg-emerald-500",
    Review: "bg-amber-500",
    Critical: "bg-red-500",
};

export function ActivityFeed() {
    return (
        <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
                Recent Activity
            </h3>
            <div className="space-y-4">
                {mockActivity.map((item, i) => (
                    <div
                        key={item.id}
                        className={cn(
                            "flex items-start gap-3 pb-4",
                            i < mockActivity.length - 1 && "border-b border-border"
                        )}
                    >
                        {/* Status dot */}
                        <div className="mt-2">
                            <div
                                className={cn(
                                    "w-2.5 h-2.5 rounded-full",
                                    statusColors[item.status]
                                )}
                            />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                                <p className="text-sm font-medium text-foreground">
                                    {item.patientId}
                                </p>
                                <p className="text-xs text-muted-foreground whitespace-nowrap">
                                    {formatDate(item.timestamp)}
                                </p>
                            </div>
                            <p className="text-sm text-muted-foreground mt-0.5">
                                {item.diagnosis}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
