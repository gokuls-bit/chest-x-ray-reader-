"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Upload, 
    FileText, 
    Zap, 
    ShieldCheck, 
    AlertCircle, 
    Loader2, 
    Activity, 
    Database, 
    BrainCircuit,
    Sparkles,
    Search
} from "lucide-react";
import { useUpload } from "@/lib/hooks/useUpload";
import { ResultCard } from "@/components/results/ResultCard";
import { BatchResults } from "@/components/results/BatchResults";
import { PageHeader } from "@/components/layout/PageHeader";

export default function UploadPage() {
    const {
        files,
        uploading,
        results,
        batchResults,
        error,
        handleUpload,
        handleBatchPredict,
        removeFile,
    } = useUpload();

    const [activeTab, setActiveTab] = useState<"single" | "fast" | "bulk">("single");

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-24 px-4 pt-10">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col md:flex-row md:items-end justify-between gap-8"
            >
                <PageHeader
                    title="Neural Ingestion"
                    subtitle="Direct image stream into EfficientNet-B0 diagnostic core"
                />
                
                <div className="flex p-1.5 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-xl">
                    {(["single", "fast", "bulk"] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
                                activeTab === tab
                                    ? "bg-medical-blue-600 text-white shadow-lg"
                                    : "text-slate-500 hover:text-white"
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* Upload Section */}
                <div className="lg:col-span-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card p-12 relative group"
                    >
                         <div className="scan-line pointer-events-none opacity-20" />
                        
                        <div className="relative flex flex-col items-center justify-center text-center space-y-8">
                            <div className="w-24 h-24 rounded-[2rem] bg-medical-blue-500/10 flex items-center justify-center border border-medical-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                                <Upload className="w-10 h-10 text-medical-blue-500" />
                            </div>
                            
                            <div className="space-y-3">
                                <h3 className="text-3xl font-black text-white tracking-tighter uppercase">
                                    Load Data Source
                                </h3>
                                <p className="text-slate-400 font-medium max-w-sm mx-auto">
                                    Drag and drop DICOM, JPEG, or PNG assets into the neural relay.
                                </p>
                            </div>

                            <input
                                type="file"
                                multiple
                                onChange={(e) => handleUpload(e.target.files)}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                disabled={uploading}
                            />
                            
                            <div className="flex gap-4">
                                <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                    AES-256 Validated
                                </div>
                                <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                    Max: 50MB per slice
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Progress & Results */}
                <div className="lg:col-span-12 space-y-10">
                    <AnimatePresence mode="wait">
                        {uploading && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="glass-card p-10 flex flex-col items-center justify-center space-y-6 text-center"
                            >
                                <div className="relative">
                                   <Loader2 className="w-16 h-16 text-medical-blue-500 animate-spin" />
                                   <Search className="w-6 h-6 text-white absolute inset-0 m-auto" />
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-xl font-black text-white uppercase tracking-tight">AI Decoding Signal...</h4>
                                    <p className="text-slate-400 text-sm font-medium">Synthesizing clinical findings and anomaly mapping</p>
                                </div>
                            </motion.div>
                        )}

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-6 rounded-3xl bg-rose-500/5 border border-rose-500/20 flex items-center gap-4 text-rose-500"
                            >
                                <AlertCircle className="w-6 h-6 shrink-0" />
                                <span className="font-bold text-sm tracking-tight">{error}</span>
                            </motion.div>
                        )}

                        {results && results.length > 0 && activeTab === "single" && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-8"
                            >
                                <div className="flex items-center gap-3">
                                   <div className="w-2 h-8 bg-medical-blue-600 rounded-full" />
                                   <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Manifest Results</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {results.map((result, i) => (
                                        <ResultCard key={i} result={result} />
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {batchResults && activeTab === "bulk" && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <BatchResults data={batchResults} />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Files Management for Fast/Bulk */}
                    {files.length > 0 && !results && !batchResults && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card p-10"
                        >
                            <div className="flex items-center justify-between mb-10">
                                <h3 className="hud-label m-0">Queued Assets ({files.length})</h3>
                                <button
                                    onClick={() => handleBatchPredict(files)}
                                    disabled={uploading}
                                    className="cyber-button"
                                >
                                    {uploading ? "Executing..." : "Execute Batch Protocol"}
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {files.map((file, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 group hover:border-white/20 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                                                <FileText className="w-5 h-5 text-slate-400" />
                                            </div>
                                            <div className="max-w-[120px]">
                                                <p className="text-xs font-black text-white truncate uppercase tracking-tight">{file.name}</p>
                                                <p className="text-[10px] font-bold text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeFile(i)}
                                            className="p-2 text-slate-600 hover:text-rose-500 transition-colors"
                                        >
                                            <AlertCircle className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
