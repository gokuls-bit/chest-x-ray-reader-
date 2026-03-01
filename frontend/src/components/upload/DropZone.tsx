"use client";

import { useCallback, useState } from "react";
import { Upload, X, FileImage } from "lucide-react";
import { cn } from "@/lib/utils";
import { MAX_UPLOAD_SIZE_BYTES, MAX_UPLOAD_SIZE_MB } from "@/lib/constants";

interface DropZoneProps {
    onFileSelect: (file: File) => void;
    disabled?: boolean;
}

export function DropZone({ onFileSelect, disabled }: DropZoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const validateFile = (file: File): boolean => {
        const validTypes = ["image/jpeg", "image/png", "image/dicom", "application/dicom"];
        if (!validTypes.includes(file.type) && !file.name.endsWith(".dcm")) {
            setError("Invalid file type. Please upload JPEG, PNG, or DICOM files.");
            return false;
        }
        if (file.size > MAX_UPLOAD_SIZE_BYTES) {
            setError(`File too large. Maximum size is ${MAX_UPLOAD_SIZE_MB}MB.`);
            return false;
        }
        setError(null);
        return true;
    };

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            if (disabled) return;
            const file = e.dataTransfer.files[0];
            if (file && validateFile(file)) {
                onFileSelect(file);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [onFileSelect, disabled]
    );

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && validateFile(file)) {
            onFileSelect(file);
        }
    };

    return (
        <div>
            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    if (!disabled) setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={cn(
                    "relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer",
                    isDragging
                        ? "border-medical-blue-500 bg-medical-blue-500/5 scale-[1.02]"
                        : "border-border hover:border-medical-blue-400 hover:bg-medical-blue-500/5",
                    disabled && "opacity-50 cursor-not-allowed"
                )}
            >
                <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.dcm"
                    onChange={handleFileInput}
                    disabled={disabled}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center gap-4">
                    <div className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center transition-colors",
                        isDragging ? "bg-medical-blue-500/20" : "bg-medical-blue-500/10"
                    )}>
                        {isDragging ? (
                            <FileImage className="w-8 h-8 text-medical-blue-500" />
                        ) : (
                            <Upload className="w-8 h-8 text-medical-blue-500" />
                        )}
                    </div>
                    <div>
                        <p className="text-lg font-semibold text-foreground">
                            {isDragging ? "Drop your X-ray here" : "Upload Chest X-Ray"}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Drag and drop or click to browse
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                            JPEG, PNG, or DICOM • Max {MAX_UPLOAD_SIZE_MB}MB
                        </p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="mt-3 flex items-center gap-2 text-sm text-red-500 bg-red-500/10 px-3 py-2 rounded-lg">
                    <X className="w-4 h-4 flex-shrink-0" />
                    {error}
                </div>
            )}
        </div>
    );
}
