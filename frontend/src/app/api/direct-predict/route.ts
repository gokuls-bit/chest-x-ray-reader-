import { auth } from "@clerk/nextjs/server";

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
        const file = formData.get("file") as File | null;

        if (!file) {
            return Response.json({ error: "No file provided" }, { status: 400 });
        }

        // Forward the file directly to FastAPI
        const aiFormData = new FormData();
        aiFormData.append("file", file, file.name);

        const response = await fetch(inferenceUrl, {
            method: "POST",
            body: aiFormData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            return Response.json(
                { error: `AI prediction failed: ${errorText}` },
                { status: response.status }
            );
        }

        const result = await response.json();

        // Derive severity from prediction and confidence
        const confidence = result.confidence || result.probability || 0;
        let severity = "Normal";
        if (result.prediction !== "Normal") {
            severity = confidence >= 0.8 ? "Critical" : "Review";
        }

        return Response.json({
            prediction: result.prediction,
            confidence,
            probabilities: result.probabilities || [],
            severity,
            findings: result.findings || [],
        });
    } catch (error) {
        console.error("Direct predict error:", error);
        return Response.json(
            { error: "Failed to connect to AI backend. Is FastAPI running on port 8000?" },
            { status: 502 }
        );
    }
}
