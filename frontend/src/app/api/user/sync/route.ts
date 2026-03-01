import { auth } from "@clerk/nextjs/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST() {
    const { userId } = await auth();
    if (!userId) {
        return new Response("Unauthorized", { status: 401 });
    }

    await connectDB();

    // Upsert: create user if not exists, update if exists
    const user = await User.findOneAndUpdate(
        { clerkId: userId },
        {
            $setOnInsert: {
                clerkId: userId,
                role: "radiologist",
                notifications: {
                    emailOnReport: true,
                    criticalAlerts: true,
                    weeklyDigest: true,
                },
            },
        },
        { upsert: true, new: true }
    );

    return Response.json(user);
}
