"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const data = [
    { week: "Mon", scans: 12, accuracy: 96 },
    { week: "Tue", scans: 19, accuracy: 94 },
    { week: "Wed", scans: 15, accuracy: 97 },
    { week: "Thu", scans: 22, accuracy: 95 },
    { week: "Fri", scans: 18, accuracy: 98 },
    { week: "Sat", scans: 8, accuracy: 93 },
    { week: "Sun", scans: 5, accuracy: 99 },
];

export function AccuracyChart() {
    return (
        <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-foreground mb-1">
                Weekly Overview
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
                Scan volume and accuracy trend
            </p>

            <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data} barGap={4}>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="hsl(var(--border))"
                    />
                    <XAxis
                        dataKey="week"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "hsl(var(--card))",
                            border: "1px solid hsl(var(--border))",
                            borderRadius: "12px",
                            boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                        }}
                        labelStyle={{
                            color: "hsl(var(--foreground))",
                            fontWeight: 600,
                        }}
                    />
                    <Bar
                        dataKey="scans"
                        fill="#3b82f6"
                        radius={[6, 6, 0, 0]}
                        name="Scans"
                    />
                    <Bar
                        dataKey="accuracy"
                        fill="#93c5fd"
                        radius={[6, 6, 0, 0]}
                        name="Accuracy %"
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
