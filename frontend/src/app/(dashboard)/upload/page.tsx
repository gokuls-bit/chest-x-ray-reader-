"use client";

import { useState } from "react";
import { Zap, Save, Layers } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { DropZone } from "@/components/upload/DropZone";
import { ImagePreview } from "@/components/upload/ImagePreview";
import { UploadProgress } from "@/components/upload/UploadProgress";
import { PatientMetaForm } from "@/components/upload/PatientMetaForm";
import { CsvUpload } from "@/components/upload/CsvUpload";
import { ResultCard } from "@/components/results/ResultCard";
import { ProbabilityChart } from "@/components/results/ProbabilityChart";
import { ConfidenceGauge } from "@/components/results/ConfidenceGauge";
import { FindingsPanel } from "@/components/results/FindingsPanel";
import { ActionButtons } from "@/components/results/ActionButtons";
import { BatchResults } from "@/components/results/BatchResults";
import { useUpload } from "@/lib/hooks/useUpload";
import { cn } from "@/lib/utils";

type UploadMode = "single" | "quick" | "batch";

const tabs: { key: UploadMode; label: string; icon: typeof Save; desc: string }[] = [
    {
        key: "single",
        label: "Full Analysis",
        icon: Save,
        desc: "Upload → AI Analysis → Save Report",
    },
    {
        key: "quick",
        label: "Quick Predict",
        icon: Zap,
        desc: "Instant AI prediction (no save)",
    },
    {
        key: "batch",
        label: "Batch Upload",
        icon: Layers,
        desc: "Analyze multiple images at once",
    },
];

export default function UploadPage() {
    const [mode, setMode] = useState<UploadMode>("single");
    const [file, setFile] = useState<File | null>(null);
    const [batchFiles, setBatchFiles] = useState<File[]>([]);
    const {
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
    } = useUpload();

    const isProcessing = isUploading || isAnalyzing;

    // Full flow submit
    const onAnalyze = async (meta: {
        patientId: string;
        patientAge: string;
        patientGender: string;
        referringDoctor: string;
        notes: string;
    }) => {
        if (!file) return;
        try {
            await handleUpload(file, {
                patientId: meta.patientId || undefined,
                patientAge: meta.patientAge ? parseInt(meta.patientAge) : undefined,
                patientGender:
                    (meta.patientGender as "M" | "F" | "Other") || undefined,
                referringDoctor: meta.referringDoctor || undefined,
                notes: meta.notes || undefined,
            });
        } catch {
            // error is handled by the hook
        }
    };

    // Quick predict submit
    const onQuickPredict = async () => {
        if (!file) return;
        try {
            await handleDirectPredict(file);
        } catch {
            // error is handled by the hook
        }
    };

    // Batch submit
    const onBatchPredict = async () => {
        if (batchFiles.length === 0) return;
        try {
            await handleBatchPredict(batchFiles);
        } catch {
            // error is handled by the hook
        }
    };

    const handleReset = () => {
        setFile(null);
        setBatchFiles([]);
        reset();
    };

    // Check which result to show
    const activeResult = result || directResult;

    return (
        <div className="animate-fade-in">
            <PageHeader
                title="Upload X-Ray"
                subtitle="Upload chest X-ray images for AI-powered analysis"
            />

            {/* Mode tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => {
                                if (!isProcessing) {
                                    setMode(tab.key);
                                    handleReset();
                                }
                            }}
                            className={cn(
                                "flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left",
                                mode === tab.key
                                    ? "border-medical-blue-500 bg-medical-blue-500/5"
                                    : "border-border hover:border-medical-blue-300",
                                isProcessing && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            <div
                                className={cn(
                                    "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                                    mode === tab.key
                                        ? "bg-medical-blue-500/20"
                                        : "bg-muted"
                                )}
                            >
                                <Icon
                                    className={cn(
                                        "w-5 h-5",
                                        mode === tab.key
                                            ? "text-medical-blue-500"
                                            : "text-muted-foreground"
                                    )}
                                />
                            </div>
                            <div>
                                <p
                                    className={cn(
                                        "text-sm font-semibold",
                                        mode === tab.key
                                            ? "text-medical-blue-600 dark:text-medical-blue-400"
                                            : "text-foreground"
                                    )}
                                >
                                    {tab.label}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {tab.desc}
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* ═══════════ BATCH RESULTS ═══════════ */}
            {batchResult ? (
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleReset}
                            className="px-4 py-2.5 bg-medical-blue-600 text-white font-medium rounded-xl hover:bg-medical-blue-700 transition-colors text-sm"
                        >
                            New Batch
                        </button>
                    </div>
                    <BatchResults
                        results={batchResult.results}
                        total={batchResult.total}
                        processed={batchResult.processed}
                        failed={batchResult.failed}
                    />
                </div>
            ) : activeResult ? (
                /* ═══════════ SINGLE / QUICK RESULTS ═══════════ */
                <div className="space-y-6">
                    <ActionButtons
                        saved={!!result}
                        onReanalyze={handleReset}
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <ResultCard
                                prediction={activeResult.prediction}
                                confidence={activeResult.confidence}
                                severity={activeResult.severity}
                                timestamp={new Date().toISOString()}
                            />
                            <ProbabilityChart
                                probabilities={activeResult.probabilities}
                            />
                            <FindingsPanel findings={activeResult.findings} />
                        </div>
                        <div>
                            <ConfidenceGauge
                                confidence={activeResult.confidence}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                /* ═══════════ INPUT FORMS ═══════════ */
                <>
                    {mode === "batch" ? (
                        <div className="space-y-6">
                            <CsvUpload
                                onFilesSelect={setBatchFiles}
                                disabled={isProcessing}
                            />
                            {batchFiles.length > 0 && (
                                <button
                                    onClick={onBatchPredict}
                                    disabled={isProcessing}
                                    className="w-full py-3 bg-medical-blue-600 text-white font-semibold rounded-xl hover:bg-medical-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-medical-blue-600/25"
                                >
                                    {isProcessing
                                        ? "Analyzing..."
                                        : `Analyze ${batchFiles.length} Images`}
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Left: Upload zone + Preview */}
                            <div className="space-y-6">
                                {!file ? (
                                    <DropZone
                                        onFileSelect={setFile}
                                        disabled={isProcessing}
                                    />
                                ) : (
                                    <>
                                        <ImagePreview
                                            file={file}
                                            onRemove={() => setFile(null)}
                                        />
                                        {mode === "quick" && (
                                            <button
                                                onClick={onQuickPredict}
                                                disabled={isProcessing}
                                                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/25"
                                            >
                                                {isProcessing
                                                    ? "Analyzing..."
                                                    : "⚡ Quick Predict"}
                                            </button>
                                        )}
                                    </>
                                )}

                                {isProcessing && (
                                    <UploadProgress progress={progress} />
                                )}

                                {error && (
                                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-500">
                                        {error}
                                    </div>
                                )}
                            </div>

                            {/* Right: Patient form (Full Analysis only) */}
                            {mode === "single" && (
                                <PatientMetaForm
                                    onSubmit={onAnalyze}
                                    disabled={!file || isProcessing}
                                />
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
