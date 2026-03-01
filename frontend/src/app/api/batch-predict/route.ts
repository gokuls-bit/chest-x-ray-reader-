import { auth } from "@clerk/nextjs/server";

interface BatchResult {
    filename: string;
    prediction: string;
    confidence: number;
    severity: string;
    probabilities: { label: string; score: number }[];
    error?: string;
}

export async function POST(req: Request) {
    const { userId } = await auth();
    if (!userId) {
        return new Response("Unauthorized", { status: 401 });
    }

    const inferenceUrl = process.env.AI_INFERENCE_URL;
    if (!inferenceUrl) {
        return Response.json(
            { error: "AI_INFERENCE_URL is not configured" },
            { status: 500 }
        );
    }

    try {
        const formData = await req.formData();
        const files = formData.getAll("files") as File[];

        if (!files || files.length === 0) {
            return Response.json({ error: "No files provided" }, { status: 400 });
        }

        // Process each file against FastAPI
        const results: BatchResult[] = [];

        for (const file of files) {
            try {
                const aiFormData = new FormData();
                aiFormData.append("file", file, file.name);

                const response = await fetch(inferenceUrl, {
                    method: "POST",
                    body: aiFormData,
                });

                if (!response.ok) {
                    results.push({
                        filename: file.name,
                        prediction: "Error",
                        confidence: 0,
                        severity: "Review",
                        probabilities: [],
                        error: `FastAPI returned ${response.status}`,
                    });
                    continue;
                }

                const result = await response.json();
                const confidence = result.confidence || result.probability || 0;
                let severity = "Normal";
                if (result.prediction !== "Normal") {
                    severity = confidence >= 0.8 ? "Critical" : "Review";
                }

                results.push({
                    filename: file.name,
                    prediction: result.prediction,
                    confidence,
                    severity,
                    probabilities: result.probabilities || [],
                });
            } catch {
                results.push({
                    filename: file.name,
                    prediction: "Error",
                    confidence: 0,
                    severity: "Review",
                    probabilities: [],
                    error: "Failed to process this file",
                });
            }
        }

        return Response.json({
            total: files.length,
            processed: results.filter((r) => !r.error).length,
            failed: results.filter((r) => r.error).length,
            results,
        });
    } catch (error) {
        console.error("Batch predict error:", error);
        return Response.json(
            { error: "Batch prediction failed" },
            { status: 500 }
        );
    }
}
