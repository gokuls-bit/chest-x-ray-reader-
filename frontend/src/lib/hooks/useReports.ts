"use client";

import useSWR from "swr";
import type { IReport } from "@/models/Report";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useReports() {
    const { data, error, isLoading, mutate } = useSWR<IReport[]>(
        "/api/reports",
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
        }
    );

    return {
        reports: data || [],
        isLoading,
        isError: !!error,
        error,
        refetch: mutate,
    };
}
