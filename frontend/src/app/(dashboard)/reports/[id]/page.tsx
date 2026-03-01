"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Printer } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ResultCard } from "@/components/results/ResultCard";
import { ProbabilityChart } from "@/components/results/ProbabilityChart";
import { ConfidenceGauge } from "@/components/results/ConfidenceGauge";
import { FindingsPanel } from "@/components/results/FindingsPanel";
import { formatDate } from "@/lib/utils";
import type { IReport } from "@/models/Report";

export default function ReportDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [report, setReport] = useState<IReport | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchReport() {
            try {
                const res = await fetch(`/api/reports/${params.id}`);
                if (!res.ok) throw new Error("Report not found");
                const data = await res.json();
                setReport(data);
            } catch {
                router.push("/reports");
            } finally {
                setLoading(false);
            }
        }
        fetchReport();
    }, [params.id, router]);

    if (loading || !report) {
        return (
            <div className="animate-fade-in">
                <div className="h-8 w-48 bg-muted rounded-lg animate-pulse mb-8" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="h-64 bg-muted rounded-2xl animate-pulse" />
                        <div className="h-48 bg-muted rounded-2xl animate-pulse" />
                    </div>
                    <div className="h-48 bg-muted rounded-2xl animate-pulse" />
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <PageHeader
                title="Report Details"
                subtitle={`Report from ${formatDate(report.createdAt)}`}
                action={
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => router.back()}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-card text-foreground font-medium rounded-xl border border-border hover:bg-accent transition-colors text-sm"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </button>
                        <button
                            onClick={() => window.print()}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-medical-blue-600 text-white font-medium rounded-xl hover:bg-medical-blue-700 transition-colors text-sm"
                        >
                            <Printer className="w-4 h-4" />
                            Print
                        </button>
                    </div>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* X-ray image */}
                    <div className="glass-card p-4">
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-black/5 dark:bg-white/5">
                            <Image
                                src={report.imageUrl}
                                alt="Chest X-ray"
                                fill
                                className="object-contain"
                                unoptimized
                            />
                        </div>
                    </div>

                    <ResultCard
                        prediction={report.prediction}
                        confidence={report.probability}
                        severity={report.severity}
                        timestamp={report.createdAt.toString()}
                    />

                    <ProbabilityChart probabilities={report.probabilities} />

                    <FindingsPanel findings={report.findings || []} />
                </div>

                {/* Right column */}
                <div className="space-y-6">
                    <ConfidenceGauge confidence={report.probability} />

                    {/* Patient metadata */}
                    <div className="glass-card p-6">
                        <h3 className="text-lg font-semibold text-foreground mb-4">
                            Patient Information
                        </h3>
                        <div className="space-y-3">
                            {[
                                { label: "Patient ID", value: report.patientId },
                                { label: "Age", value: report.patientAge },
                                { label: "Gender", value: report.patientGender },
                                { label: "Referring Doctor", value: report.referringDoctor },
                            ].map((item) => (
                                <div key={item.label}>
                                    <p className="text-xs text-muted-foreground">{item.label}</p>
                                    <p className="text-sm font-medium text-foreground">
                                        {item.value || "—"}
                                    </p>
                                </div>
                            ))}
                            {report.notes && (
                                <div className="pt-3 border-t border-border">
                                    <p className="text-xs text-muted-foreground">Notes</p>
                                    <p className="text-sm text-foreground mt-1">
                                        {report.notes}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
