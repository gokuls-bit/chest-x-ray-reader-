import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
import { Activity, ShieldAlert } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
    title: "X-Ray AI — Medical Intelligence Platform",
    description:
        "AI-powered chest X-ray analysis for radiologists. Upload, analyze, and manage diagnostic reports with advanced machine learning.",
    keywords: ["X-ray", "AI", "medical", "radiology", "pneumonia", "diagnosis"],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "";
    // Check for common placeholders or invalid keys
    const isPlaceholderKey = 
        clerkKey.includes("abc") || 
        clerkKey.includes("123") || 
        clerkKey.includes("xxx") ||
        clerkKey.length < 20 ||
        !clerkKey.startsWith("pk_");

    return (
        <html lang="en" suppressHydrationWarning>
            <body className="min-h-screen bg-background font-sans antialiased">
                {isPlaceholderKey ? (
                    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-6">
                        <div className="glass-card max-w-md w-full p-10 text-center space-y-8 relative overflow-hidden bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-3xl">
                            <div className="scan-line pointer-events-none opacity-20" />
                            <div className="flex justify-center">
                                <div className="w-20 h-20 rounded-[2.2rem] bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.15)]">
                                    <ShieldAlert className="w-10 h-10 text-amber-500" />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <h1 className="text-2xl font-black tracking-tighter uppercase">Neural Security Handshake Failed</h1>
                                <p className="text-slate-400 text-xs leading-relaxed font-bold uppercase tracking-widest">
                                    Diagnostic Status: MISSING_AUTH_CREDENTIALS
                                </p>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    Valid Clerk API keys are required to establish the diagnostic stream. Update .env.local to proceed.
                                </p>
                            </div>
                            <div className="p-5 bg-black/40 border border-white/10 rounded-2xl text-[10px] text-slate-400 font-bold uppercase tracking-widest text-left space-y-3">
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span>INSTANCE_IDENTITY</span>
                                    <span className="text-rose-500">INVALID</span>
                                </div>
                                <ul className="space-y-2">
                                    <li className="flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-medical-blue-500" />
                                        <span>Obtain keys from dashboard.clerk.com</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <div className="w-1 h-1 rounded-full bg-medical-blue-500" />
                                        <span>Apply pk_test and sk_test variables</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="pt-2 flex items-center justify-center gap-2 text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">
                                <Activity className="w-3 h-3 animate-pulse" />
                                System_Standby // Waiting for Sync
                            </div>
                        </div>
                    </div>
                ) : (
                    <ClerkProvider>
                        <ThemeProvider
                            attribute="class"
                            defaultTheme="system"
                            enableSystem
                            disableTransitionOnChange
                        >
                            {children}
                        </ThemeProvider>
                    </ClerkProvider>
                )}
            </body>
        </html>
    );
}
