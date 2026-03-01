"use client";

import Image from "next/image";
import { X, FileImage } from "lucide-react";

interface ImagePreviewProps {
    file: File;
    onRemove: () => void;
}

export function ImagePreview({ file, onRemove }: ImagePreviewProps) {
    const imageUrl = URL.createObjectURL(file);
    const fileSize = (file.size / (1024 * 1024)).toFixed(2);

    return (
        <div className="glass-card p-4 relative group">
            <button
                onClick={onRemove}
                className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            >
                <X className="w-4 h-4" />
            </button>

            <div className="relative aspect-square rounded-xl overflow-hidden bg-black/5 dark:bg-white/5">
                <Image
                    src={imageUrl}
                    alt="X-ray preview"
                    fill
                    className="object-contain grayscale"
                    unoptimized
                />
            </div>

            <div className="flex items-center gap-2 mt-3">
                <FileImage className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                        {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{fileSize} MB</p>
                </div>
            </div>
        </div>
    );
}
