"use client";

import { motion } from "framer-motion";
import { cn, formatConfidence } from "@/lib/utils";
import { 
    FileText, 
    MoreVertical, 
    Search
} from "lucide-react";

interface BatchResult {
    filename: string;
    prediction: string;
    confidence: number;
    severity: string;
    probabilities: { label: string; score: number }[];
    error?: string;
}

interface BatchResultsProps {
    data: {
        results: BatchResult[];
        total: number;
        processed: number;
        failed: number;
    };
}

export function BatchResults({ data }: BatchResultsProps) {
    const results = data.results || [];
    
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card overflow-hidden"
        >
            <div className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Manifest Stream</h3>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Parallel Processing Output | {data.processed} Units</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input 
                            type="text" 
                            placeholder="FILTER_FILE_ID..."
                            className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs font-bold text-white uppercase tracking-widest focus:ring-2 ring-medical-blue-600 outline-none w-64"
                        />
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-white/[0.02]">
                            <th className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Asset Index</th>
                            <th className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Neural Output</th>
                            <th className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Confidence</th>
                            <th className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Priority</th>
                            <th className="px-8 py-5 text-right text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Link</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {results.map((result, i) => (
                            <tr key={i} className="group hover:bg-white/[0.03] transition-colors">
                                <td className="px-8 py-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center group-hover:bg-medical-blue-600/20 transition-colors">
                                            <FileText className="w-5 h-5 text-slate-400 group-hover:text-medical-blue-500" />
                                        </div>
                                        <span className="text-sm font-black text-white uppercase tracking-tight max-w-[150px] truncate">{result.filename}</span>
                                    </div>
                                </td>
                                <td className="px-8 py-6">
                                    <span className="text-base font-black text-white tracking-tighter">{result.prediction}</span>
                                </td>
                                <td className="px-8 py-6">
                                    <div className="w-24 bg-white/5 h-1.5 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${result.confidence * 100}%` }}
                                            className="h-full bg-medical-blue-600 shadow-[0_0_10px_rgba(14,135,235,0.5)]"
                                        />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-500 mt-2 block">{formatConfidence(result.confidence)}</span>
                                </td>
                                <td className="px-8 py-6">
                                    <div className={cn(
                                        "inline-flex items-center gap-2 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border",
                                        result.severity === "Critical" ? "bg-rose-500/10 border-rose-500/20 text-rose-500" :
                                        result.severity === "Review" ? "bg-amber-400/10 border-amber-400/20 text-amber-400" :
                                        "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                                    )}>
                                        <div className={cn("w-1.5 h-1.5 rounded-full", result.severity === "Critical" ? "bg-rose-500 animate-pulse" : result.severity === "Review" ? "bg-amber-400" : "bg-emerald-500")} />
                                        {result.severity}
                                    </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                    <button className="p-2 rounded-xl bg-white/5 border border-white/5 text-slate-500 hover:text-white hover:border-white/10 transition-all">
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}
