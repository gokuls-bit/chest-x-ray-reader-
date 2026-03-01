"use client";

import { useCallback, useState } from "react";
import { FileSpreadsheet, Upload, X, FileImage } from "lucide-react";
import { cn } from "@/lib/utils";

interface CsvUploadProps {
    onFilesSelect: (files: File[]) => void;
    disabled?: boolean;
}

export function CsvUpload({ onFilesSelect, disabled }: CsvUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [error, setError] = useState<string | null>(null);

    const validateFiles = (files: FileList): File[] => {
        const validFiles: File[] = [];
        const validTypes = ["image/jpeg", "image/png", "image/dicom", "application/dicom"];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (
                validTypes.includes(file.type) ||
                file.name.endsWith(".dcm") ||
                file.name.endsWith(".jpg") ||
                file.name.endsWith(".jpeg") ||
                file.name.endsWith(".png")
            ) {
                validFiles.push(file);
            }
        }

        if (validFiles.length === 0) {
            setError("No valid image files found. Accepted: JPEG, PNG, DICOM.");
            return [];
        }

        setError(null);
        return validFiles;
    };

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setIsDragging(false);
            if (disabled) return;
            const valid = validateFiles(e.dataTransfer.files);
            if (valid.length > 0) {
                setSelectedFiles(valid);
                onFilesSelect(valid);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [onFilesSelect, disabled]
    );

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        const valid = validateFiles(files);
        if (valid.length > 0) {
            setSelectedFiles(valid);
            onFilesSelect(valid);
        }
    };

    const removeFile = (index: number) => {
        const newFiles = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles(newFiles);
        onFilesSelect(newFiles);
    };

    return (
        <div className="space-y-4">
            {/* Drop zone */}
            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    if (!disabled) setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={cn(
                    "relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 cursor-pointer",
                    isDragging
                        ? "border-amber-500 bg-amber-500/5 scale-[1.02]"
                        : "border-border hover:border-amber-400 hover:bg-amber-500/5",
                    disabled && "opacity-50 cursor-not-allowed"
                )}
            >
                <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.dcm"
                    multiple
                    onChange={handleFileInput}
                    disabled={disabled}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center gap-3">
                    <div
                        className={cn(
                            "w-14 h-14 rounded-2xl flex items-center justify-center transition-colors",
                            isDragging ? "bg-amber-500/20" : "bg-amber-500/10"
                        )}
                    >
                        <FileSpreadsheet className="w-7 h-7 text-amber-500" />
                    </div>
                    <div>
                        <p className="text-lg font-semibold text-foreground">
                            {isDragging
                                ? "Drop files here"
                                : "Batch Upload X-Rays"}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Select multiple images for batch analysis
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            JPEG, PNG, or DICOM • Up to 50 files
                        </p>
                    </div>
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="flex items-center gap-2 text-sm text-red-500 bg-red-500/10 px-3 py-2 rounded-lg">
                    <X className="w-4 h-4 flex-shrink-0" />
                    {error}
                </div>
            )}

            {/* Selected files list */}
            {selectedFiles.length > 0 && (
                <div className="glass-card p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-foreground">
                            Selected Files
                        </h4>
                        <span className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-medium">
                            {selectedFiles.length} files
                        </span>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {selectedFiles.map((file, i) => (
                            <div
                                key={`${file.name}-${i}`}
                                className="flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                            >
                                <div className="flex items-center gap-2 min-w-0">
                                    <FileImage className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                    <span className="text-sm text-foreground truncate">
                                        {file.name}
                                    </span>
                                    <span className="text-xs text-muted-foreground flex-shrink-0">
                                        {(file.size / 1024).toFixed(0)} KB
                                    </span>
                                </div>
                                <button
                                    onClick={() => removeFile(i)}
                                    className="p-1 rounded text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
