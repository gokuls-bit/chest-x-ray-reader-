import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-medical-blue-50 to-white dark:from-medical-blue-950/20 dark:to-background">
            <div className="w-full max-w-md">
                <SignUp
                    appearance={{
                        elements: {
                            rootBox: "mx-auto",
                            card: "shadow-2xl border border-border rounded-2xl",
                        },
                    }}
                />
            </div>
        </div>
    );
}
