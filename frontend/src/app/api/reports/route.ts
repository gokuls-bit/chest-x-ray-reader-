import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import Report from "@/models/Report";
import User from "@/models/User";
import { reportSchema } from "@/lib/validations";

// GET /api/reports — Fetch all reports for authenticated user
export async function GET() {
    const { userId } = await auth();
    if (!userId) {
        return new Response("Unauthorized", { status: 401 });
    }

    await connectDB();

    const reports = await Report.find({ clerkId: userId })
        .sort({ createdAt: -1 })
        .lean();

    return Response.json(reports);
}

// POST /api/reports — Create a new report
export async function POST(req: Request) {
    const { userId } = await auth();
    if (!userId) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        const body = await req.json();

        // Validate request body
        const parsed = reportSchema.safeParse(body);
        if (!parsed.success) {
            return Response.json(
                { error: "Invalid data", details: parsed.error.flatten() },
                { status: 400 }
            );
        }

        await connectDB();

        // Find the MongoDB user
        const user = await User.findOne({ clerkId: userId });
        if (!user) {
            return Response.json(
                { error: "User not found in database" },
                { status: 404 }
            );
        }

        // Create report
        const report = await Report.create({
            ...parsed.data,
            userId: user._id,
            clerkId: userId,
        });

        return Response.json(report, { status: 201 });
    } catch (error) {
        console.error("Create report error:", error);
        return Response.json(
            { error: "Failed to create report" },
            { status: 500 }
        );
    }
}
