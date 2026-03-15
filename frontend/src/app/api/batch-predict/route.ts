import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
    const { userId } = await auth();
    if (!userId) {
        return new Response("Unauthorized", { status: 401 });
    }

    const batchUrl = process.env.AI_BATCH_URL;
    if (!batchUrl) {
        return Response.json(
            { error: "AI_BATCH_URL is not configured" },
            { status: 500 }
        );
    }

    try {
        const formData = await req.formData();
        const files = formData.getAll("files") as File[];

        if (!files || files.length === 0) {
            return Response.json({ error: "No files provided" }, { status: 400 });
        }

        // Forward to FastAPI batch endpoint
        const aiFormData = new FormData();
        files.forEach((file) => aiFormData.append("files", file));

        const response = await fetch(batchUrl, {
            method: "POST",
            body: aiFormData,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.detail || "FastAPI batch processing failed");
        }

        const data = await response.json();

        return Response.json({
            total: files.length,
            processed: data.results.length,
            failed: files.length - data.results.length,
            results: data.results,
        });
    } catch (error) {
        console.error("Batch predict error:", error);
        return Response.json(
            { error: error instanceof Error ? error.message : "Batch prediction failed" },
            { status: 500 }
        );
    }
}
