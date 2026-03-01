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
    Stethoscope,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Upload", href: "/upload", icon: Upload },
    { label: "Reports", href: "/reports", icon: FileText },
    { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const pathname = usePathname();

    return (
        <aside
            className={cn(
                "hidden lg:flex flex-col h-screen bg-card border-r border-border transition-all duration-300 sticky top-0",
                collapsed ? "w-[72px]" : "w-64"
            )}
        >
            {/* Logo */}
            <div className="flex items-center gap-3 px-4 h-16 border-b border-border">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-medical-blue-600 text-white flex-shrink-0">
                    <Stethoscope className="w-5 h-5" />
                </div>
                {!collapsed && (
                    <div className="overflow-hidden">
                        <h1 className="font-bold text-lg gradient-text whitespace-nowrap">
                            X-Ray AI
                        </h1>
                        <p className="text-[10px] text-muted-foreground -mt-0.5">
                            Medical Intelligence
                        </p>
                    </div>
                )}
            </div>

            {/* Nav links */}
            <nav className="flex-1 py-4 px-2 space-y-1">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                        pathname === item.href || pathname.startsWith(item.href + "/");

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-medical-blue-500/10 text-medical-blue-600 dark:text-medical-blue-400 shadow-sm"
                                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                            )}
                        >
                            <Icon
                                className={cn(
                                    "w-5 h-5 flex-shrink-0",
                                    isActive && "text-medical-blue-500"
                                )}
                            />
                            {!collapsed && <span>{item.label}</span>}
                        </Link>
                    );
                })}
            </nav>

            {/* Collapse toggle */}
            <div className="px-2 pb-2">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="w-full flex items-center justify-center p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                    {collapsed ? (
                        <ChevronRight className="w-4 h-4" />
                    ) : (
                        <ChevronLeft className="w-4 h-4" />
                    )}
                </button>
            </div>

            {/* User */}
            <div className="border-t border-border p-4 flex items-center justify-center">
                <UserButton
                    afterSignOutUrl="/sign-in"
                    appearance={{
                        elements: {
                            avatarBox: "w-8 h-8",
                        },
                    }}
                />
            </div>
        </aside>
    );
}
