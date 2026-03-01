"use client";

import { usePathname } from "next/navigation";
import { Bell, Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/hooks/useTheme";
import { MobileNav } from "./MobileNav";

const pageTitles: Record<string, string> = {
    "/dashboard": "Dashboard",
    "/upload": "Upload X-Ray",
    "/reports": "Reports",
    "/settings": "Settings",
};

export function Topbar() {
    const pathname = usePathname();
    const { isDark, toggle } = useTheme();

    const title =
        pageTitles[pathname] ||
        (pathname.startsWith("/reports/") ? "Report Details" : "X-Ray AI");

    return (
        <header className="sticky top-0 z-40 h-16 border-b border-border bg-card/80 backdrop-blur-xl">
            <div className="flex items-center justify-between h-full px-4 lg:px-6">
                {/* Left: Mobile nav + Page title */}
                <div className="flex items-center gap-3">
                    <MobileNav />
                    <div>
                        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    {/* Notification bell */}
                    <button className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                    </button>

                    {/* Dark mode toggle */}
                    <button
                        onClick={toggle}
                        className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                    >
                        {isDark ? (
                            <Sun className="w-5 h-5" />
                        ) : (
                            <Moon className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
}
