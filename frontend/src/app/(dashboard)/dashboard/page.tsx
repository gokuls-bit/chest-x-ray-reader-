"use client";

import { Activity, FileText, Target, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { AccuracyChart } from "@/components/dashboard/AccuracyChart";
import { PageHeader } from "@/components/layout/PageHeader";

export default function DashboardPage() {
    return (
        <div className="animate-fade-in">
            <PageHeader
                title="Dashboard"
                subtitle="Overview of your diagnostic activity"
            />

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard
                    title="Total Scans"
                    value="1,284"
                    icon={Activity}
                    trend="up"
                    delta="+12.5%"
                />
                <StatCard
                    title="Reports Today"
                    value="23"
                    icon={FileText}
                    trend="up"
                    delta="+8.2%"
                />
                <StatCard
                    title="Accuracy Rate"
                    value="97.3%"
                    icon={Target}
                    trend="up"
                    delta="+1.2%"
                />
                <StatCard
                    title="Avg. Confidence"
                    value="94.1%"
                    icon={TrendingUp}
                    trend="neutral"
                    delta="0.0%"
                />
            </div>

            {/* Charts + Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <AccuracyChart />
                </div>
                <div className="space-y-6">
                    <QuickActions />
                    <ActivityFeed />
                </div>
            </div>
        </div>
    );
}
