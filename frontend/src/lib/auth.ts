import { auth, currentUser } from "@clerk/nextjs/server";

export { auth, currentUser };

export async function getUserFromClerk() {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    return userId;
}

export async function getCurrentUser() {
    const user = await currentUser();

    if (!user) {
        throw new Error("User not found");
    }

    return user;
}

export async function getUserEmail() {
    const user = await getCurrentUser();

    return (
        user.emailAddresses.find(
            (email) => email.id === user.primaryEmailAddressId
        )?.emailAddress || null
    );
}

export async function getUserName() {
    const user = await getCurrentUser();

    return (
        user.fullName ||
        `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
    );
}

export async function getUserImage() {
    const user = await getCurrentUser();

    return user.imageUrl;
}
export async function getUserProfile() {
    const user = await getCurrentUser();

    return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        username: user.username,
        email:
            user.emailAddresses.find(
                (email) => email.id === user.primaryEmailAddressId
            )?.emailAddress || null,
        imageUrl: user.imageUrl,
        createdAt: user.createdAt,
        lastSignInAt: user.lastSignInAt,
    };
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated() {
    const { userId } = await auth();

    return !!userId;
}


export async function requireAuth() {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Authentication required");
    }

    return userId;
}


export async function isAdmin() {
    const user = await getCurrentUser();

    return user.publicMetadata?.role === "admin";
}


export async function getUserRole() {
    const user = await getCurrentUser();

    return user.publicMetadata?.role || "user";
}
