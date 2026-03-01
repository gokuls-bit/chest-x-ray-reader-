import { auth } from "@clerk/nextjs/server";
import { uploadXray } from "@/lib/cloudinary";
import { MAX_UPLOAD_SIZE_BYTES, ACCEPTED_FILE_TYPES } from "@/lib/constants";

export async function POST(req: Request) {
    const { userId } = await auth();
    if (!userId) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return Response.json({ error: "No file provided" }, { status: 400 });
        }

        // Validate file type
        if (
            !ACCEPTED_FILE_TYPES.includes(file.type) &&
            !file.name.endsWith(".dcm")
        ) {
            return Response.json(
                { error: "Invalid file type. Accepted: JPEG, PNG, DICOM" },
                { status: 400 }
            );
        }

        // Validate file size
        if (file.size > MAX_UPLOAD_SIZE_BYTES) {
            return Response.json(
                { error: "File too large. Maximum size is 20MB" },
                { status: 400 }
            );
        }

        // Upload to Cloudinary
        const buffer = Buffer.from(await file.arrayBuffer());
        const { url, publicId } = await uploadXray(buffer, file.name);

        return Response.json({
            imageUrl: url,
            imagePublicId: publicId,
        });
    } catch (error) {
        console.error("Upload error:", error);
        return Response.json(
            { error: "Upload failed" },
            { status: 500 }
        );
    }
}
