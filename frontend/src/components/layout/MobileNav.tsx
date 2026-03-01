"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
    Menu,
    X,
    LayoutDashboard,
    Upload,
    FileText,
    Settings,
    Stethoscope,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Upload", href: "/upload", icon: Upload },
    { label: "Reports", href: "/reports", icon: FileText },
    { label: "Settings", href: "/settings", icon: Settings },
];

export function MobileNav() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    return (
        <div className="lg:hidden">
            {/* Hamburger */}
            <button
                onClick={() => setOpen(true)}
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Overlay */}
            {open && (
                <div
                    className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Drawer */}
            <div
                className={cn(
                    "fixed top-0 left-0 z-50 h-full w-72 bg-card border-r border-border shadow-2xl transition-transform duration-300",
                    open ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 h-16 border-b border-border">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-medical-blue-600 text-white">
                            <Stethoscope className="w-5 h-5" />
                        </div>
                        <h1 className="font-bold text-lg gradient-text">X-Ray AI</h1>
                    </div>
                    <button
                        onClick={() => setOpen(false)}
                        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Nav */}
                <nav className="p-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive =
                            pathname === item.href || pathname.startsWith(item.href + "/");

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all",
                                    isActive
                                        ? "bg-medical-blue-500/10 text-medical-blue-600 dark:text-medical-blue-400"
                                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                )}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
