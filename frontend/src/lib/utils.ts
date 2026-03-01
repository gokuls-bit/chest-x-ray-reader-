import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
    return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(date));
}

export function formatConfidence(value: number): string {
    return `${(value * 100).toFixed(1)}%`;
}

export function getSeverityColor(severity: string): string {
    switch (severity) {
        case "Normal":
            return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
        case "Review":
            return "text-amber-500 bg-amber-500/10 border-amber-500/20";
        case "Critical":
            return "text-red-500 bg-red-500/10 border-red-500/20";
        default:
            return "text-slate-500 bg-slate-500/10 border-slate-500/20";
    }
}

export function truncate(str: string, length: number): string {
    if (str.length <= length) return str;
    return str.slice(0, length) + "...";
}

export function generatePatientId(): string {
    const prefix = "PX";
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
}
