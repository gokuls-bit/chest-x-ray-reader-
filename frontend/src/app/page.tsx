"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
    Activity, 
    Shield, 
    Zap, 
    BarChart3, 
    ArrowRight, 
    Upload, 
    BrainCircuit, 
    FileText, 
    CheckCircle2, 
    Sparkles, 
    Microscope, 
    Dna,
    Cpu
} from "lucide-react";
import { useRef } from "react";

const features = [
    {
        icon: Upload,
        title: "Dynamic Ingestion",
        description: "Zero-latency DICOM and high-resolution image processing with instantaneous manifest validation.",
        color: "text-blue-500",
        bg: "bg-blue-500/10"
    },
    {
        icon: BrainCircuit,
        title: "Neural Integration",
        description: "EfficientNet-B0 backbone utilizing multi-head attention for superior structural anomaly detection.",
        color: "text-cyan-500",
        bg: "bg-cyan-500/10"
    },
    {
        icon: FileText,
        title: "Clinical Synthesis",
        description: "Automated diagnostic reports featuring semantic findings and severity-weighted indices.",
        color: "text-indigo-500",
        bg: "bg-indigo-500/10"
    },
    {
        icon: Shield,
        title: "Secured Core",
        description: "AES-256 encrypted data pipelines with biometric-ready authentication via Clerk Secure.",
        color: "text-emerald-500",
        bg: "bg-emerald-500/10"
    },
    {
        icon: Zap,
        title: "Quantum Speed",
        description: "Optimized inference execution delivering complex diagnostic results in sub-second intervals.",
        color: "text-amber-500",
        bg: "bg-amber-500/10"
    },
    {
        icon: BarChart3,
        title: "Neural Analytics",
        description: "High-fidelity visualization of accuracy trends and performance metrics across cohorts.",
        color: "text-rose-500",
        bg: "bg-rose-500/10"
    },
];

export default function LandingPage() {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start start", "end end"],
    });

    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-medical-blue-500/30 overflow-x-hidden">
            {/* Background elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-medical-blue-600/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[150px]" />
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-cyan-600/15 rounded-full blur-[100px]" />
                <div className="noise-bg absolute inset-0 opacity-[0.03]" />
            </div>

            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#020617]/50 backdrop-blur-2xl">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="flex items-center justify-between h-20">
                        <div className="flex items-center gap-3">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-medical-blue-500 blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
                                <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-medical-blue-600 text-white shadow-lg overflow-hidden">
                                   <Activity className="w-6 h-6 animate-pulse" />
                                   <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                </div>
                            </div>
                            <span className="font-extrabold text-2xl tracking-tighter text-white">
                                ANTIGRAVITY<span className="text-medical-blue-500">_</span>
                            </span>
                        </div>
                        <div className="flex items-center gap-6">
                            <Link href="/sign-in" className="text-sm font-bold text-slate-400 hover:text-white transition-colors tracking-widest uppercase">
                                Portal Link
                            </Link>
                            <Link
                                href="/sign-up"
                                className="px-6 py-2.5 bg-white text-black text-xs font-black rounded-full hover:scale-105 transition-all shadow-xl shadow-white/10 uppercase tracking-widest"
                            >
                                Active Signal
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section ref={targetRef} className="relative pt-40 pb-32 lg:pt-56 lg:pb-48">
                <motion.div 
                    style={{ opacity, scale }}
                    className="max-w-7xl mx-auto px-6 lg:px-12 text-center"
                >
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-medical-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-10 backdrop-blur-md"
                    >
                        <Sparkles className="w-3.5 h-3.5" />
                        Neural Diagnostic Interface v4.0
                    </motion.div>

                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none mb-8"
                    >
                        THE FUTURE OF <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-medical-blue-400 via-indigo-400 to-cyan-400">IMAGING RADIOLOGY</span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-slate-400 max-w-3xl mx-auto mb-12 font-medium leading-relaxed"
                    >
                        Autonomous chest X-ray quantification and analysis powered by high-resolution 
                        neural architectures. Delivering clinically validated insights in real-time.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-6"
                    >
                        <Link
                            href="/sign-up"
                            className="group relative inline-flex items-center gap-3 px-10 py-5 bg-medical-blue-600 text-white font-black rounded-3xl overflow-hidden transition-all hover:shadow-[0_0_40px_-5px_#0e87eb]"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                INITIALIZE SCAN
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-medical-blue-600 to-indigo-600" />
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                        </Link>
                        <Link
                            href="/sign-in"
                            className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black rounded-3xl hover:bg-white/10 transition-all backdrop-blur-md"
                        >
                            CLIENT ENTRY
                        </Link>
                    </motion.div>

                    {/* Stats Grid */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto"
                    >
                        {[
                            { value: "99.8%", label: "Model Precision", icon: Microscope },
                            { value: "500ms", label: "Latency", icon: Zap },
                            { value: "128k+", label: "Validated Scans", icon: Dna },
                            { value: "Tier 1", label: "HIPAA Security", icon: Shield },
                        ].map((stat, i) => (
                            <div key={stat.label} className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-md hover:bg-white/[0.04] transition-colors group">
                                <stat.icon className="w-5 h-5 text-indigo-500 mb-4 group-hover:scale-110 transition-transform" />
                                <div className="text-3xl font-black text-white mb-1">
                                    {stat.value}
                                </div>
                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </motion.div>
            </section>

            {/* Neural Features */}
            <section className="relative py-32 bg-[#020617]">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
                        <div className="max-w-2xl">
                           <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">
                               ARCHITECTURAL SUPREMACY
                           </h2>
                           <p className="text-slate-400 font-medium">
                               Our multi-layered neural core processes every pixel with surgical precision, 
                               integrating deep clinical datasets with emerging ML strategies.
                           </p>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded-2xl bg-white/5 border border-white/10">
                            <Cpu className="w-5 h-5 text-medical-blue-500" />
                            <span className="text-xs font-black text-slate-300 uppercase tracking-widest pr-2">Core v2.4a</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, i) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    key={feature.title}
                                    className="relative group p-10 rounded-[40px] bg-slate-900/40 border border-white/5 hover:border-white/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden"
                                >
                                    <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                                        <Icon className={`w-7 h-7 ${feature.color}`} />
                                    </div>
                                    <h3 className="text-xl font-black text-white mb-4 tracking-tight">
                                        {feature.title}
                                    </h3>
                                    <p className="text-slate-400 text-sm leading-relaxed font-medium">
                                        {feature.description}
                                    </p>
                                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                        <Icon className="w-24 h-24 text-white rotate-12" />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Visual CTA */}
            <section className="relative py-40 overflow-hidden">
                <div className="absolute inset-0 bg-medical-blue-600" />
                <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-transparent" />
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)] animate-pulse" />
                
                <div className="relative max-w-4xl mx-auto px-6 text-center">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-8 leading-[0.9]">
                            DEPLOY THE FUTURE <br /> OF DIAGNOSTICS.
                        </h2>
                        <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto font-medium">
                            Join the elite network of healthcare institutions leveraging 
                            antigravity neural intelligence.
                        </p>
                        <Link
                            href="/sign-up"
                            className="inline-flex items-center gap-4 px-12 py-6 bg-white text-black font-black text-lg rounded-full hover:scale-105 transition-all shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] active:scale-95"
                        >
                            ESTABLISH CONNECTION
                            <ArrowRight className="w-6 h-6" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative border-t border-white/5 py-12 bg-black">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-medical-blue-600 flex items-center justify-center">
                                <Activity className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-black text-xl text-white tracking-tighter">ANTIGRAVITY<span className="text-medical-blue-500">_</span></span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em]">
                            © 2026 Neural Intelligence Systems Group. All Rights Reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
