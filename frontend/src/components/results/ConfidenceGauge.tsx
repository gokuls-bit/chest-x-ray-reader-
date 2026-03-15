"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ConfidenceGaugeProps {
    confidence: number;
}

export function ConfidenceGauge({ confidence }: ConfidenceGaugeProps) {
    const percentage = Math.round(confidence * 100);
    const circumference = 2 * Math.PI * 40;
    const offset = circumference - (confidence * circumference);

    const getStatus = () => {
        if (percentage >= 90) return { label: "High Precision", color: "text-emerald-500", stroke: "#10b981", bg: "bg-emerald-500/10" };
        if (percentage >= 70) return { label: "Reliable", color: "text-medical-blue-500", stroke: "#0e87eb", bg: "bg-medical-blue-500/10" };
        return { label: "Consult Human", color: "text-rose-500", stroke: "#f43f5e", bg: "bg-rose-500/10" };
    };

    const status = getStatus();

    return (
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-8 flex flex-col items-center justify-center min-h-[300px]"
        >
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-8">
                Certainty Index
            </h3>

            <div className="relative w-44 h-44">
                {/* Outer Glow Circle */}
                <div className={cn(
                  "absolute inset-0 rounded-full blur-2xl opacity-20",
                  status.bg
                )} />
                
                <svg className="w-full h-full -rotate-90 drop-shadow-2xl" viewBox="0 0 100 100">
                    {/* Background Track */}
                    <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-muted/30"
                    />
                    
                    {/* Progress Track */}
                    <motion.circle
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke={status.stroke}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                    />

                    {/* Inner Accent Circle */}
                    <circle
                        cx="50"
                        cy="50"
                        r="32"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeDasharray="2 4"
                        className="text-muted-foreground/20"
                    />
                </svg>

                {/* Center Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={cn("text-4xl font-black font-display", status.color)}
                    >
                        {percentage}<span className="text-xl">%</span>
                    </motion.span>
                </div>
            </div>

            <div className="mt-8 text-center space-y-1">
                <div className={cn("px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest inline-block border", 
                  status.color.replace('text-', 'bg-').replace('500', '500/10'),
                  status.color.replace('text-', 'border-').replace('500', '500/20'),
                  status.color
                )}>
                    {status.label}
                </div>
                <p className="text-xs text-muted-foreground font-medium max-w-[150px]">
                    Statistical probability of model accuracy
                </p>
            </div>
        </motion.div>
    );
}
