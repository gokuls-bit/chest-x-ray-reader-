"use client";

import { motion } from "framer-motion";
import { Activity, FileText, Target, TrendingUp, Sparkles, BrainCircuit, ShieldCheck, Zap } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { AccuracyChart } from "@/components/dashboard/AccuracyChart";
import { PageHeader } from "@/components/layout/PageHeader";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
};

export default function DashboardPage() {
    return (
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-10 max-w-7xl mx-auto pb-20 px-4"
        >
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-10">
                <PageHeader
                    title="Neural Dashboard"
                    subtitle="Proprietary AI diagnostic metrics and processing states"
                />
                <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-2 rounded-2xl backdrop-blur-xl">
                   <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-medical-blue-500/10 text-medical-blue-500 border border-medical-blue-500/20">
                      <Zap className="w-4 h-4 animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Signal: Active</span>
                   </div>
                </div>
            </motion.div>

            {/* Stat cards Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: "Quantum Scans", value: "1,284", icon: Activity, delta: "+12.5%", trend: "up" },
                    { title: "Neural Reports", value: "23", icon: FileText, delta: "+8.2%", trend: "up" },
                    { title: "Core Precision", value: "98.1%", icon: BrainCircuit, delta: "+1.2%", trend: "up" },
                    { title: "Safe Latency", value: "480ms", icon: ShieldCheck, delta: "-40ms", trend: "up" },
                ].map((stat, i) => (
                    <div key={i} className="glass-card p-8 group">
                        <div className="flex items-center justify-between mb-6">
                            <div className="p-3 rounded-2xl bg-white/5 group-hover:bg-medical-blue-500/20 transition-colors">
                                <stat.icon className="w-6 h-6 text-medical-blue-500" />
                            </div>
                            <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">
                                {stat.delta}
                            </span>
                        </div>
                        <h3 className="hud-label">{stat.title}</h3>
                        <p className="text-4xl font-black text-white tracking-tighter">{stat.value}</p>
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-medical-blue-500/20 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                    </div>
                ))}
            </motion.div>

            {/* Main Analytical Section */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8">
                    <div className="glass-card group relative">
                        <div className="scan-line pointer-events-none" />
                        <div className="p-8 border-b border-white/5 flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <Sparkles className="w-5 h-5 text-amber-500" />
                              <h3 className="text-xl font-black tracking-tight uppercase">High-Fidelity Reliability Chart</h3>
                           </div>
                           <div className="text-[10px] font-black text-slate-500 tracking-widest uppercase">7d Interval</div>
                        </div>
                        <div className="p-10">
                           <AccuracyChart />
                        </div>
                    </div>
                </div>
                
                <div className="lg:col-span-4 space-y-8">
                    <QuickActions />
                    <ActivityFeed />
                </div>
            </motion.div>
        </motion.div>
    );
}
