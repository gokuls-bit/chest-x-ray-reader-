import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadXray(
    fileBuffer: Buffer,
    fileName: string
): Promise<{ url: string; publicId: string }> {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "medical-xray",
                resource_type: "image",
                format: "jpg",
                quality: "auto:best",
                public_id: `xray_${Date.now()}_${fileName.replace(/\.[^/.]+$/, "")}`,
            },
            (error, result) => {
                if (error || !result) {
                    reject(error || new Error("Upload failed"));
                    return;
                }
                resolve({
                    url: result.secure_url,
                    publicId: result.public_id,
                });
            }
        );

        uploadStream.end(fileBuffer);
    });
}

export async function deleteXrayImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
}

export default cloudinary;
