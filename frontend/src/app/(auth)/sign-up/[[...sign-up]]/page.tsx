import { SignUp } from "@clerk/nextjs";
import { AlertCircle, Info } from "lucide-react";

export default function SignUpPage() {
    const isPlaceholder = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.includes("abc.123");

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-medical-blue-50 to-white dark:from-medical-blue-950/20 dark:to-background px-4">
            <div className="w-full max-w-md">
                {isPlaceholder ? (
                    <div className="glass-card p-8 border-rose-500/50 bg-rose-500/5 text-center space-y-6">
                        <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto">
                            <AlertCircle className="w-8 h-8 text-rose-500" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-black tracking-tight">Configuration Required</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Clerk authentication keys are currently set to placeholders in <code className="bg-muted px-1 rounded">.env.local</code>.
                            </p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-left text-muted-foreground flex gap-3">
                           <Info className="w-4 h-4 shrink-0 text-medical-blue-500" />
                           <p>Please update your <code className="text-foreground">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> and <code className="text-foreground">CLERK_SECRET_KEY</code> with valid credentials from your Clerk Dashboard.</p>
                        </div>
                    </div>
                ) : (
                    <SignUp
                        appearance={{
                            elements: {
                                rootBox: "mx-auto",
                                card: "shadow-2xl border border-border rounded-2xl",
                            },
                        }}
                    />
                )}
            </div>
        </div>
    );
}
