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
    reportId: string;
}

interface DirectPredictResult {
    prediction: string;
    confidence: number;
    probabilities: { label: string; score: number }[];
    severity: string;
    findings: string[];
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
    const [isUploading, setIsUploading] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [result, setResult] = useState<UploadResult | null>(null);
    const [directResult, setDirectResult] = useState<DirectPredictResult | null>(null);
    const [batchResult, setBatchResult] = useState<BatchResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Full flow: Upload to Cloudinary → Predict → Save report
    const handleUpload = async (file: File, meta?: PatientMeta) => {
        setError(null);
        setResult(null);
        setDirectResult(null);
        setBatchResult(null);
        setProgress(0);

        try {
            // Step 1: Upload image to Cloudinary
            setIsUploading(true);
            setProgress(20);

            const formData = new FormData();
            formData.append("file", file);

            const uploadRes = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!uploadRes.ok) {
                const err = await uploadRes.json().catch(() => ({}));
                throw new Error(err.error || "Failed to upload image");
            }

            const { imageUrl, imagePublicId } = await uploadRes.json();
            setProgress(50);

            // Step 2: Get AI prediction
            setIsUploading(false);
            setIsAnalyzing(true);

            const predictRes = await fetch("/api/predict", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ imageUrl }),
            });

            if (!predictRes.ok) {
                const err = await predictRes.json().catch(() => ({}));
                throw new Error(err.error || "AI analysis failed");
            }

            const prediction = await predictRes.json();
            setProgress(80);

            // Step 3: Save report
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

            if (!reportRes.ok) {
                const err = await reportRes.json().catch(() => ({}));
                throw new Error(err.error || "Failed to save report");
            }

            const savedReport = await reportRes.json();
            setProgress(100);

            const uploadResult: UploadResult = {
                prediction: prediction.prediction,
                confidence: prediction.confidence,
                probabilities: prediction.probabilities,
                severity: prediction.severity,
                findings: prediction.findings || [],
                imageUrl,
                imagePublicId,
                reportId: savedReport._id,
            };

            setResult(uploadResult);
            return uploadResult;
        } catch (err) {
            const message = err instanceof Error ? err.message : "An error occurred";
            setError(message);
            throw err;
        } finally {
            setIsUploading(false);
            setIsAnalyzing(false);
        }
    };

    // Direct predict: Send file straight to FastAPI (no Cloudinary, no save)
    const handleDirectPredict = async (file: File) => {
        setError(null);
        setResult(null);
        setDirectResult(null);
        setBatchResult(null);
        setProgress(0);

        try {
            setIsAnalyzing(true);
            setProgress(30);

            const formData = new FormData();
            formData.append("file", file);

            const res = await fetch("/api/direct-predict", {
                method: "POST",
                body: formData,
            });

            setProgress(80);

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(
                    err.error || "AI analysis failed. Is the FastAPI server running?"
                );
            }

            const prediction = await res.json();
            setProgress(100);

            setDirectResult(prediction);
            return prediction;
        } catch (err) {
            const message = err instanceof Error ? err.message : "An error occurred";
            setError(message);
            throw err;
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Batch predict: Send multiple files to FastAPI
    const handleBatchPredict = async (files: File[]) => {
        setError(null);
        setResult(null);
        setDirectResult(null);
        setBatchResult(null);
        setProgress(0);

        try {
            setIsAnalyzing(true);
            setProgress(10);

            const formData = new FormData();
            files.forEach((file) => formData.append("files", file));

            const res = await fetch("/api/batch-predict", {
                method: "POST",
                body: formData,
            });

            setProgress(90);

            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || "Batch prediction failed");
            }

            const data: BatchResponse = await res.json();
            setProgress(100);

            setBatchResult(data);
            return data;
        } catch (err) {
            const message = err instanceof Error ? err.message : "An error occurred";
            setError(message);
            throw err;
        } finally {
            setIsAnalyzing(false);
        }
    };

    const reset = () => {
        setResult(null);
        setDirectResult(null);
        setBatchResult(null);
        setError(null);
        setProgress(0);
        setIsUploading(false);
        setIsAnalyzing(false);
    };

    return {
        handleUpload,
        handleDirectPredict,
        handleBatchPredict,
        isUploading,
        isAnalyzing,
        progress,
        result,
        directResult,
        batchResult,
        error,
        reset,
    };
}
