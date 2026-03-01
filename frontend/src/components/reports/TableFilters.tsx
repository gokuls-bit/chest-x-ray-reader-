"use client";

import { Search, Filter } from "lucide-react";

interface TableFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    statusFilter: string;
    onStatusChange: (status: string) => void;
}

export function TableFilters({
    searchQuery,
    onSearchChange,
    statusFilter,
    onStatusChange,
}: TableFiltersProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
            {/* Search */}
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search by patient ID, diagnosis..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring"
                />
            </div>

            {/* Status filter */}
            <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <select
                    value={statusFilter}
                    onChange={(e) => onStatusChange(e.target.value)}
                    className="pl-10 pr-8 py-2.5 text-sm bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
                >
                    <option value="All">All Status</option>
                    <option value="Normal">Normal</option>
                    <option value="Review">Review</option>
                    <option value="Critical">Critical</option>
                </select>
            </div>
        </div>
    );
}
