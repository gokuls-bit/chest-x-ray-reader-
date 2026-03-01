export const DIAGNOSIS_LABELS = [
    "Normal",
    "Pneumonia",
    "COVID-19",
    "Tuberculosis",
    "Pleural Effusion",
    "Cardiomegaly",
] as const;

export type DiagnosisLabel = (typeof DIAGNOSIS_LABELS)[number];

export const SEVERITY_THRESHOLDS = {
    Normal: { max: 0.5, label: "Normal" as const },
    Review: { max: 0.8, label: "Review" as const },
    Critical: { max: 1.0, label: "Critical" as const },
} as const;

export type Severity = "Normal" | "Review" | "Critical";

export const MAX_UPLOAD_SIZE_MB = 20;
export const MAX_UPLOAD_SIZE_BYTES = MAX_UPLOAD_SIZE_MB * 1024 * 1024;

export const ACCEPTED_FILE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/dicom",
    "application/dicom",
];

export const ACCEPTED_FILE_EXTENSIONS = ".jpg,.jpeg,.png,.dcm";

export const API_ROUTES = {
    REPORTS: "/api/reports",
    UPLOAD: "/api/upload",
    PREDICT: "/api/predict",
    USER_SYNC: "/api/user/sync",
    WEBHOOKS_CLERK: "/api/webhooks/clerk",
} as const;

export const NAV_LINKS = [
    { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { label: "Upload", href: "/upload", icon: "Upload" },
    { label: "Reports", href: "/reports", icon: "FileText" },
    { label: "Settings", href: "/settings", icon: "Settings" },
] as const;
