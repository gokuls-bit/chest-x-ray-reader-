interface PageHeaderProps {
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
                <h1 className="medical-heading">{title}</h1>
                {subtitle && <p className="medical-subtitle mt-1">{subtitle}</p>}
            </div>
            {action && <div className="flex-shrink-0">{action}</div>}
        </div>
    );
}
