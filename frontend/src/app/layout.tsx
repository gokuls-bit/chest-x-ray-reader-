import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "next-themes";
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
    return (
        <ClerkProvider>
            <html lang="en" suppressHydrationWarning>
                <body className="min-h-screen bg-background font-sans antialiased">
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        {children}
                    </ThemeProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
