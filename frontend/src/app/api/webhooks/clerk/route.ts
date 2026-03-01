import { Webhook } from "svix";
import { headers } from "next/headers";
import { type WebhookEvent } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error("Please add CLERK_WEBHOOK_SECRET to .env.local");
    }

    // Get Svix headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response("Error: Missing Svix headers", { status: 400 });
    }

    // Get body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Verify webhook
    const wh = new Webhook(WEBHOOK_SECRET);
    let evt: WebhookEvent;

    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent;
    } catch (err) {
        console.error("Webhook verification failed:", err);
        return new Response("Error: Verification failed", { status: 400 });
    }

    // Handle user.created event
    if (evt.type === "user.created") {
        const { id, email_addresses } = evt.data;

        const email = email_addresses[0]?.email_address;
        if (!email) {
            return new Response("No email found", { status: 400 });
        }

        await connectDB();

        await User.create({
            clerkId: id,
            email,
            role: "radiologist",
            notifications: {
                emailOnReport: true,
                criticalAlerts: true,
                weeklyDigest: true,
            },
        });

        console.log(`✓ Created MongoDB user for Clerk ID: ${id}`);
    }

    return new Response("Webhook processed", { status: 200 });
}
