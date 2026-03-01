"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PatientHistoryTable } from "@/components/reports/PatientHistoryTable";
import { TableFilters } from "@/components/reports/TableFilters";
import { EmptyState } from "@/components/reports/EmptyState";
import { useReports } from "@/lib/hooks/useReports";
import Link from "next/link";
import { Upload } from "lucide-react";

export default function ReportsPage() {
    const { reports, isLoading, refetch } = useReports();
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const filteredReports = reports.filter((report) => {
        const matchesSearch =
            !searchQuery ||
            report.patientId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            report.prediction.toLowerCase().includes(searchQuery.toLowerCase()) ||
            report.referringDoctor?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus =
            statusFilter === "All" || report.severity === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this report?")) return;

        await fetch(`/api/reports/${id}`, { method: "DELETE" });
        refetch();
    };

    if (isLoading) {
        return (
            <div className="animate-fade-in">
                <PageHeader title="Reports" subtitle="Loading your diagnostic reports..." />
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className="h-16 bg-muted rounded-xl animate-pulse"
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            <PageHeader
                title="Reports"
                subtitle={`${reports.length} diagnostic reports`}
                action={
                    <Link
                        href="/upload"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-medical-blue-600 text-white font-medium rounded-xl hover:bg-medical-blue-700 transition-colors text-sm shadow-lg shadow-medical-blue-600/25"
                    >
                        <Upload className="w-4 h-4" />
                        New Upload
                    </Link>
                }
            />

            {reports.length === 0 ? (
                <EmptyState />
            ) : (
                <>
                    <TableFilters
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        statusFilter={statusFilter}
                        onStatusChange={setStatusFilter}
                    />
                    <PatientHistoryTable
                        reports={filteredReports}
                        onDelete={handleDelete}
                    />
                </>
            )}
        </div>
    );
}
