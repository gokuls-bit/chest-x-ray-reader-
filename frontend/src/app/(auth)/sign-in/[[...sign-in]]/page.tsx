import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-medical-blue-50 to-white dark:from-medical-blue-950/20 dark:to-background px-4">
            <div className="w-full max-w-md">
                <SignIn
                    appearance={{
                        elements: {
                            rootBox: "mx-auto",
                            card: "shadow-2xl border border-white/10 rounded-[2rem] bg-white/5 backdrop-blur-xl",
                        },
                    }}
                />
            </div>
        </div>
    );
}
