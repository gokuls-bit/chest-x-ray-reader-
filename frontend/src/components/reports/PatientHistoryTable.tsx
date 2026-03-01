"use client";

import Link from "next/link";
import { Trash2, ExternalLink } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { formatDate, formatConfidence } from "@/lib/utils";
import type { IReport } from "@/models/Report";

interface PatientHistoryTableProps {
    reports: IReport[];
    onDelete?: (id: string) => void;
}

export function PatientHistoryTable({
    reports,
    onDelete,
}: PatientHistoryTableProps) {
    return (
        <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-border">
                            {[
                                "Patient ID",
                                "Diagnosis",
                                "Confidence",
                                "Status",
                                "Doctor",
                                "Date",
                                "Actions",
                            ].map((header) => (
                                <th
                                    key={header}
                                    className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((report) => (
                            <tr
                                key={String(report._id)}
                                className="border-b border-border last:border-0 hover:bg-accent/50 transition-colors"
                            >
                                <td className="px-4 py-3.5 text-sm font-medium text-foreground">
                                    {report.patientId || "—"}
                                </td>
                                <td className="px-4 py-3.5 text-sm text-foreground">
                                    {report.prediction}
                                </td>
                                <td className="px-4 py-3.5 text-sm font-medium text-medical-blue-500">
                                    {formatConfidence(report.probability)}
                                </td>
                                <td className="px-4 py-3.5">
                                    <StatusBadge
                                        status={report.severity as "Normal" | "Review" | "Critical"}
                                    />
                                </td>
                                <td className="px-4 py-3.5 text-sm text-muted-foreground">
                                    {report.referringDoctor || "—"}
                                </td>
                                <td className="px-4 py-3.5 text-sm text-muted-foreground whitespace-nowrap">
                                    {formatDate(report.createdAt)}
                                </td>
                                <td className="px-4 py-3.5">
                                    <div className="flex items-center gap-1">
                                        <Link
                                            href={`/reports/${String(report._id)}`}
                                            className="p-1.5 rounded-lg text-muted-foreground hover:text-medical-blue-500 hover:bg-medical-blue-500/10 transition-colors"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </Link>
                                        {onDelete && (
                                            <button
                                                onClick={() => onDelete(String(report._id))}
                                                className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
