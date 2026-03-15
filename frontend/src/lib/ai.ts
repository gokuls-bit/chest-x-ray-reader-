export interface PredictionResult {
    prediction: string;
    confidence: number;
    probabilities: { label: string; score: number }[];
    severity: string;
    findings: string[];
}

export async function getPrediction(imageUrl: string): Promise<PredictionResult> {
    const inferenceUrl = process.env.AI_INFERENCE_URL;
    
    if (!inferenceUrl) {
        throw new Error("AI_INFERENCE_URL is not configured");
    }

    const response = await fetch(inferenceUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.error || "AI prediction failed");
    }

    const result = await response.json();

    return {
        prediction: result.prediction,
        confidence: result.confidence ?? result.probability ?? 0,
        probabilities: result.probabilities ?? [],
        severity: result.severity ?? "Review",
        findings: result.findings ?? [],
    };
}
