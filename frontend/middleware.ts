import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
    "/",
    "/sign-in(.*)",
    "/sign-up(.*)",
    "/api/webhooks/clerk",
]);

export default clerkMiddleware(async (auth, req) => {
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
