"use client";

import { useState } from "react";

interface UploadResult {
    prediction: string;
    confidence: number;
    probabilities: { label: string; score: number }[];
    severity: string;
    findings: string[];
    imageUrl: string;
    imagePublicId: string;
    reportId?: string;
}

interface BatchResult {
    filename: string;
    prediction: string;
    confidence: number;
    severity: string;
    probabilities: { label: string; score: number }[];
    error?: string;
}

interface BatchResponse {
    total: number;
    processed: number;
    failed: number;
    results: BatchResult[];
}

interface PatientMeta {
    patientId?: string;
    patientAge?: number;
    patientGender?: "M" | "F" | "Other";
    referringDoctor?: string;
    notes?: string;
}

export function useUpload() {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [files, setFiles] = useState<File[]>([]);
    const [results, setResults] = useState<UploadResult[] | null>(null);
    const [batchResults, setBatchResults] = useState<BatchResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleUpload = async (newFiles: FileList | null) => {
        if (!newFiles) return;
        const fileList = Array.from(newFiles);
        setFiles(prev => [...prev, ...fileList]);
        
        // If it's a single file and we want instant analysis
        if (fileList.length === 1 && files.length === 0) {
            await analyzeSingle(fileList[0]);
        }
    };

    const analyzeSingle = async (file: File, meta?: PatientMeta) => {
        setError(null);
        setUploading(true);
        setProgress(10);

        try {
            // 1. Upload to Cloudinary
            const formData = new FormData();
            formData.append("file", file);

            const uploadRes = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!uploadRes.ok) throw new Error("Cloudinary upload failed");
            const { imageUrl, imagePublicId } = await uploadRes.json();
            setProgress(50);

            // 2. Get AI Prediction
            const predictRes = await fetch("/api/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ imageUrl }),
            });

            if (!predictRes.ok) throw new Error("AI Prediction failed");
            const prediction = await predictRes.json();
            setProgress(80);

            // 3. Save Report
            const reportRes = await fetch("/api/reports", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    imageUrl,
                    imagePublicId,
                    ...prediction,
                    ...meta,
                }),
            });

            const reportData = await reportRes.json().catch(() => ({}));
            setProgress(100);

            const result: UploadResult = {
                ...prediction,
                imageUrl,
                imagePublicId,
                reportId: reportData._id,
            };

            setResults([result]);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Analysis failed");
        } finally {
            setUploading(false);
        }
    };

    const handleBatchPredict = async () => {
        if (files.length === 0) return;
        
        setError(null);
        setUploading(true);
        setProgress(10);

        try {
            const formData = new FormData();
            files.forEach(file => formData.append("files", file));

            const res = await fetch("/api/batch-predict", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Batch processing failed");
            const data = await res.json();
            
            setBatchResults(data);
            setProgress(100);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Batch failed");
        } finally {
            setUploading(false);
        }
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const reset = () => {
        setFiles([]);
        setResults(null);
        setBatchResults(null);
        setError(null);
        setProgress(0);
        setUploading(false);
    };

    return {
        files,
        uploading,
        progress,
        results,
        batchResults,
        error,
        handleUpload,
        handleBatchPredict,
        removeFile,
        reset,
    };
}
