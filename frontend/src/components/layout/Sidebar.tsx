"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
    LayoutDashboard,
    Upload,
    FileText,
    Settings,
    ChevronLeft,
    ChevronRight,
    Activity,
    Cpu,
    Database,
    Binary
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Neural Scan", href: "/upload", icon: Cpu },
    { label: "Archive", href: "/reports", icon: Database },
    { label: "Interface", href: "/settings", icon: Binary },
];

export function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();

    return (
        <aside
            className={cn(
                "hidden lg:flex flex-col h-screen bg-[#020617]/40 backdrop-blur-3xl border-r border-white/5 transition-all duration-500 sticky top-0 z-50",
                collapsed ? "w-[84px]" : "w-[300px]"
            )}
        >
            <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-medical-blue-600/5 to-transparent pointer-events-none" />
            
            {/* Logo Section */}
            <div className="flex items-center gap-4 px-6 h-28 mb-4">
                <div className="relative group shrink-0">
                    <div className="absolute inset-0 bg-medical-blue-500 blur-lg opacity-40" />
                    <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-medical-blue-600 text-white shadow-xl overflow-hidden">
                        <Activity className="w-7 h-7 animate-pulse" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                </div>
                <AnimatePresence>
                    {!collapsed && (
                        <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="overflow-hidden"
                        >
                            <h1 className="font-black text-xl tracking-tighter text-white">
                                ANTIGRAVITY<span className="text-medical-blue-500">_</span>
                            </h1>
                            <p className="hud-label m-0 text-[8px]">NV-4.0 Core</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-3">
                <div className="px-4 mb-4">
                   {!collapsed && <p className="hud-label text-[8px]">Control Plane</p>}
                </div>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "group relative flex items-center gap-4 px-4 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 overflow-hidden",
                                isActive
                                    ? "bg-white text-black shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                                    : "text-slate-500 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <Icon className={cn("w-5 h-5 shrink-0 transition-transform duration-500", isActive ? "" : "group-hover:scale-110")} />
                            {!collapsed && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    {item.label}
                                </motion.span>
                            )}
                            {isActive && (
                                <div className="absolute left-0 w-1 h-6 bg-medical-blue-600 rounded-full" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer and User Profile */}
            <div className="p-6 space-y-6">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="w-full flex items-center justify-center h-12 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white transition-all border border-white/5"
                >
                    {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                </button>

                <div className="p-4 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-between group">
                    <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                            elements: {
                                avatarBox: "w-10 h-10 rounded-xl",
                            },
                        }}
                    />
                    {!collapsed && (
                        <div className="text-right">
                            <p className="text-[10px] font-black text-white uppercase tracking-tighter">Status: Authorized</p>
                            <p className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest">Active Link</p>
                        </div>
                    )}
                </div>
            </div>
            
            <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-medical-blue-600/10 to-transparent pointer-events-none" />
        </aside>
    );
}
