import Link from "next/link";
import { Upload } from "lucide-react";

export function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="w-20 h-20 rounded-2xl bg-medical-blue-500/10 flex items-center justify-center mb-6">
                <Upload className="w-10 h-10 text-medical-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
                No reports yet
            </h3>
            <p className="text-muted-foreground text-center max-w-md mb-6">
                Upload your first chest X-ray to get started with AI-powered
                diagnostics. Results appear here automatically.
            </p>
            <Link
                href="/upload"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-medical-blue-600 text-white font-semibold rounded-xl hover:bg-medical-blue-700 transition-colors shadow-lg shadow-medical-blue-600/25"
            >
                <Upload className="w-4 h-4" />
                Upload X-Ray
            </Link>
        </div>
    );
}
