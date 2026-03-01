import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import Report, { type IReport } from "@/models/Report";
import { deleteXrayImage } from "@/lib/cloudinary";
import { type NextRequest } from "next/server";

// GET /api/reports/[id] — Fetch single report
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { userId } = await auth();
    if (!userId) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { id } = await params;

    await connectDB();

    const report = await Report.findById(id).lean() as IReport | null;

    if (!report) {
        return Response.json({ error: "Report not found" }, { status: 404 });
    }

    // Verify ownership
    if (report.clerkId !== userId) {
        return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    return Response.json(report);
}

// DELETE /api/reports/[id] — Delete report + Cloudinary image
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { userId } = await auth();
    if (!userId) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { id } = await params;

    await connectDB();

    const report = await Report.findById(id);

    if (!report) {
        return Response.json({ error: "Report not found" }, { status: 404 });
    }

    // Verify ownership
    if (report.clerkId !== userId) {
        return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete Cloudinary image
    try {
        await deleteXrayImage(report.imagePublicId);
    } catch (err) {
        console.error("Failed to delete Cloudinary image:", err);
    }

    // Delete MongoDB document
    await Report.findByIdAndDelete(id);

    return Response.json({ message: "Report deleted" });
}
