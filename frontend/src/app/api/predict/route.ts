import { auth } from "@clerk/nextjs/server";
import { getPrediction } from "@/lib/ai";

export async function POST(req: Request) {
    const { userId } = await auth();
    if (!userId) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        const { imageUrl } = await req.json();

        if (!imageUrl) {
            return Response.json(
                { error: "imageUrl is required" },
                { status: 400 }
            );
        }

        const result = await getPrediction(imageUrl);

        return Response.json(result);
    } catch (error) {
        console.error("Prediction error:", error);
        return Response.json(
            { error: "AI prediction failed" },
            { status: 500 }
        );
    }
}
