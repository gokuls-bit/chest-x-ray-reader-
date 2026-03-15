"use client";

import { motion } from "framer-motion";
import { cn, getSeverityColor, formatConfidence, formatDate } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, Eye, Activity, ShieldCheck } from "lucide-react";

interface ResultCardProps {
    result: {
        prediction: string;
        confidence: number;
        severity: string;
        timestamp?: string;
    };
}

const severityIcons = {
    Normal: CheckCircle2,
    Review: Eye,
    Critical: AlertTriangle,
};

const recommendedActions: Record<string, string> = {
    Normal: "No immediate clinical action required. Schedule routine follow-up.",
    Review: "Review by senior radiologist recommended within 24 hours.",
    Critical: "Immediate clinical intervention required. Alert attending physician.",
};

export function ResultCard({ result }: ResultCardProps) {
    const { prediction, confidence, severity, timestamp } = result;
    const Icon = severityIcons[severity as keyof typeof severityIcons] || Eye;
    const isCritical = severity === "Critical";

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="glass-card overflow-hidden group border-none relative"
        >
            {/* Animated Highlight Line */}
            <div className={cn(
              "absolute top-0 left-0 w-full h-1.5",
              isCritical ? "bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]" : 
              severity === "Review" ? "bg-amber-400" : "bg-emerald-500"
            )} />

            <div className="p-8 space-y-8">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                           <div className={cn(
                             "flex items-center justify-center w-10 h-10 rounded-xl",
                             isCritical ? "bg-rose-500/10 text-rose-500" : "bg-medical-blue-500/10 text-medical-blue-500"
                           )}>
                             <Activity className="w-5 h-5" />
                           </div>
                           <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/80">
                                AI Assessment System
                           </p>
                        </div>
                        
                        <div>
                            <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                                {prediction}
                            </h3>
                            <div className="flex items-center gap-2 mt-3">
                               <ShieldCheck className="w-4 h-4 text-emerald-500" />
                               <span className="text-sm font-medium text-slate-400">Certified AI Confidence: </span>
                               <span className="text-sm font-bold text-white bg-white/5 px-2 py-0.5 rounded-md border border-white/10">
                                  {formatConfidence(confidence)}
                               </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                        <div
                            className={cn(
                                "flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold shadow-lg transition-transform hover:scale-105",
                                getSeverityColor(severity)
                            )}
                        >
                            <Icon className={cn("w-4 h-4", isCritical && "animate-pulse")} />
                            {severity} Priority
                        </div>
                        {timestamp && (
                            <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Analyzed at {formatDate(timestamp)}
                            </p>
                        )}
                    </div>
                </div>

                <div className="relative p-6 rounded-3xl bg-slate-500/5 border border-white/5 overflow-hidden group-hover:bg-slate-500/10 transition-colors">
                    <div className="relative z-10 flex gap-4">
                      <div className="shrink-0 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                         <Activity className="w-4 h-4 text-medical-blue-400" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white uppercase tracking-widest">Protocol Recommendation</h4>
                        <p className="text-base text-slate-400 leading-relaxed italic">
                            "{recommendedActions[severity] || recommendedActions.Review}"
                        </p>
                      </div>
                    </div>
                    {/* Noise texture overlay */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none noise-bg" />
                </div>
            </div>
            
            {/* Background Blob */}
            <div className={cn(
              "absolute -bottom-24 -left-24 w-62 h-62 rounded-full blur-[100px] opacity-20 pointer-events-none",
              isCritical ? "bg-rose-500" : "bg-medical-blue-500"
            )} />
        </motion.div>
    );
}
