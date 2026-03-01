"use client";

import Image from "next/image";
import { X, Printer } from "lucide-react";
import { ResultCard } from "@/components/results/ResultCard";
import { ProbabilityChart } from "@/components/results/ProbabilityChart";
import type { IReport } from "@/models/Report";
import { formatDate } from "@/lib/utils";

interface ReportDetailModalProps {
    report: IReport;
    onClose: () => void;
}

export function ReportDetailModal({ report, onClose }: ReportDetailModalProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Content */}
            <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background rounded-2xl shadow-2xl border border-border m-4">
                {/* Header */}
                <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between z-10">
                    <h2 className="text-lg font-semibold text-foreground">
                        Report Details
                    </h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => window.print()}
                            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                        >
                            <Printer className="w-4 h-4" />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* X-ray image */}
                        <div className="relative aspect-square rounded-xl overflow-hidden bg-black/5 dark:bg-white/5 border border-border">
                            <Image
                                src={report.imageUrl}
                                alt="X-ray image"
                                fill
                                className="object-contain"
                                unoptimized
                            />
                        </div>

                        {/* Result */}
                        <div className="space-y-4">
                            <ResultCard
                                prediction={report.prediction}
                                confidence={report.probability}
                                severity={report.severity}
                                timestamp={report.createdAt.toString()}
                            />

                            {/* Patient metadata */}
                            <div className="glass-card p-4">
                                <h4 className="text-sm font-semibold text-foreground mb-3">
                                    Patient Info
                                </h4>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">Patient ID:</span>
                                        <p className="font-medium">{report.patientId || "—"}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Age:</span>
                                        <p className="font-medium">{report.patientAge || "—"}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Gender:</span>
                                        <p className="font-medium">{report.patientGender || "—"}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Doctor:</span>
                                        <p className="font-medium">
                                            {report.referringDoctor || "—"}
                                        </p>
                                    </div>
                                </div>
                                {report.notes && (
                                    <div className="mt-3 pt-3 border-t border-border">
                                        <span className="text-muted-foreground text-sm">
                                            Notes:
                                        </span>
                                        <p className="text-sm mt-1">{report.notes}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Probabilities */}
                    <ProbabilityChart probabilities={report.probabilities} />
                </div>
            </div>
        </div>
    );
}
