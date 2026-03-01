export interface PredictionResult {
    prediction: string;
    confidence: number;
    probabilities: { label: string; score: number }[];
    severity: string;
    findings: string[];
}

export async function getPrediction(imageUrl: string): Promise<PredictionResult> {
    const inferenceUrl = process.env.AI_INFERENCE_URL;
    const apiKey = process.env.AI_API_KEY;

    if (!inferenceUrl) {
        throw new Error("AI_INFERENCE_URL is not configured");
    }

    // Fetch the image and send it to the FastAPI backend
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
        throw new Error("Failed to fetch image for prediction");
    }

    const imageBlob = await imageResponse.blob();
    const formData = new FormData();
    formData.append("file", imageBlob, "xray.jpg");

    const response = await fetch(inferenceUrl, {
        method: "POST",
        headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {},
        body: formData,
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`AI prediction failed: ${errorText}`);
    }

    const result = await response.json();

    // Derive severity from confidence
    const confidence = result.confidence || result.probability || 0;
    let severity = "Normal";
    if (result.prediction !== "Normal") {
        severity = confidence >= 0.8 ? "Critical" : "Review";
    }

    return {
        prediction: result.prediction,
        confidence,
        probabilities: result.probabilities || [],
        severity,
        findings: result.findings || [],
    };
}
