import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
    "/",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/api/webhooks/clerk",
]);

const isPlaceholderKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.includes("abc") || 
                        !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default clerkMiddleware(async (auth, req) => {
    // If keys are placeholders, skip clerk auth to avoid SSL/instance errors
    if (isPlaceholderKey) {
        return NextResponse.next();
    }

    if (!isPublicRoute(req)) {
        const authObj = await auth();
        if (!authObj.userId) {
            return authObj.redirectToSignIn();
        }
    }
});

export const config = {
    matcher: ["/((?!_next|.*\\..*).*)", "/"],
};
