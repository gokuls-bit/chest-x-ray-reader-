import { auth, currentUser } from "@clerk/nextjs/server";

export { auth, currentUser };

export async function getUserFromClerk() {
    const { userId } = await auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }
    return userId;
}
