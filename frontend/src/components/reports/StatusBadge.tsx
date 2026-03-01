import { cn } from "@/lib/utils";
import { getSeverityColor } from "@/lib/utils";

interface StatusBadgeProps {
    status: "Normal" | "Review" | "Critical";
}

export function StatusBadge({ status }: StatusBadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                getSeverityColor(status)
            )}
        >
            {status}
        </span>
    );
}
