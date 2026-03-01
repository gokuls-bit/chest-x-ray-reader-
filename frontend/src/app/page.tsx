import Link from "next/link";
import {
    Stethoscope,
    Shield,
    Zap,
    BarChart3,
    ArrowRight,
    Upload,
    Brain,
    FileText,
    CheckCircle2,
} from "lucide-react";

const features = [
    {
        icon: Upload,
        title: "Easy Upload",
        description:
            "Drag and drop chest X-ray images in JPEG, PNG, or DICOM format. Instant preview with file validation.",
    },
    {
        icon: Brain,
        title: "AI Analysis",
        description:
            "EfficientNet-B0 powered predictions with confidence scores and detailed probability breakdowns.",
    },
    {
        icon: FileText,
        title: "Smart Reports",
        description:
            "Comprehensive reports with severity badges, findings, and full patient history tracking.",
    },
    {
        icon: Shield,
        title: "HIPAA Ready",
        description:
            "Enterprise-grade security with Clerk authentication, encrypted data, and role-based access.",
    },
    {
        icon: Zap,
        title: "Real-Time",
        description:
            "Get diagnostic predictions in seconds, not hours. Optimized inference pipeline for speed.",
    },
    {
        icon: BarChart3,
        title: "Analytics",
        description:
            "Track scan volume, accuracy trends, and department metrics with interactive charts.",
    },
];

const steps = [
    {
        step: "01",
        title: "Upload X-Ray",
        description: "Drag and drop your chest X-ray image into the secure upload zone.",
    },
    {
        step: "02",
        title: "AI Analyzes",
        description:
            "Our AI model processes the image and generates diagnostic predictions.",
    },
    {
        step: "03",
        title: "Get Results",
        description:
            "Review the diagnosis, confidence score, and detailed findings instantly.",
    },
];

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Navbar */}
            <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-medical-blue-600 text-white">
                                <Stethoscope className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-xl gradient-text">X-Ray AI</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Link
                                href="/sign-in"
                                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/sign-up"
                                className="px-4 py-2 text-sm font-medium bg-medical-blue-600 text-white rounded-lg hover:bg-medical-blue-700 transition-colors shadow-lg shadow-medical-blue-600/25"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-medical-blue-50 to-white dark:from-medical-blue-950/20 dark:to-background" />
                <div className="absolute top-20 left-10 w-72 h-72 bg-medical-blue-400/20 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-medical-blue-600/10 rounded-full blur-3xl" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-medical-blue-500/10 text-medical-blue-600 dark:text-medical-blue-400 text-sm font-medium mb-8 border border-medical-blue-500/20">
                            <Zap className="w-3.5 h-3.5" />
                            AI-Powered Medical Diagnostics
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground mb-6">
                            Chest X-Ray Analysis
                            <br />
                            <span className="gradient-text">Powered by AI</span>
                        </h1>

                        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                            Upload chest X-ray images and receive instant AI-powered
                            diagnostic predictions with confidence scores, severity
                            assessments, and detailed findings.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href="/sign-up"
                                className="inline-flex items-center gap-2 px-8 py-3.5 bg-medical-blue-600 text-white font-semibold rounded-xl hover:bg-medical-blue-700 transition-all shadow-xl shadow-medical-blue-600/25 hover:shadow-2xl hover:shadow-medical-blue-600/30 hover:-translate-y-0.5"
                            >
                                Start Analyzing
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                href="/sign-in"
                                className="inline-flex items-center gap-2 px-8 py-3.5 bg-card text-foreground font-semibold rounded-xl border border-border hover:bg-accent transition-all"
                            >
                                Sign In
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
                            {[
                                { value: "99.2%", label: "Accuracy" },
                                { value: "<3s", label: "Analysis Time" },
                                { value: "24/7", label: "Availability" },
                            ].map((stat) => (
                                <div key={stat.label}>
                                    <div className="text-2xl sm:text-3xl font-bold gradient-text">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-muted-foreground mt-1">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-24 bg-muted/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                            Everything You Need
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            A complete medical imaging platform designed for radiologists and
                            healthcare professionals.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={feature.title}
                                    className="glass-card p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-medical-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-medical-blue-500/20 transition-colors">
                                        <Icon className="w-6 h-6 text-medical-blue-500" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-foreground mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                            How It Works
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Get from upload to diagnosis in three simple steps.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {steps.map((step, i) => (
                            <div key={step.step} className="relative">
                                {i < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-12 left-full w-full h-[2px] bg-gradient-to-r from-medical-blue-500/50 to-transparent -translate-x-4" />
                                )}
                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-medical-blue-500/10 text-medical-blue-600 text-2xl font-bold mb-4">
                                        {step.step}
                                    </div>
                                    <h3 className="text-xl font-semibold text-foreground mb-2">
                                        {step.title}
                                    </h3>
                                    <p className="text-muted-foreground">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-gradient-to-br from-medical-blue-600 to-medical-blue-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-50" />
                <div className="relative max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Ready to Transform Your Radiology Workflow?
                    </h2>
                    <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                        Join healthcare professionals using AI-powered diagnostics to
                        improve patient outcomes.
                    </p>
                    <Link
                        href="/sign-up"
                        className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-medical-blue-700 font-semibold rounded-xl hover:bg-white/90 transition-all shadow-xl hover:-translate-y-0.5"
                    >
                        <CheckCircle2 className="w-5 h-5" />
                        Get Started Free
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Stethoscope className="w-5 h-5 text-medical-blue-500" />
                            <span className="font-semibold gradient-text">X-Ray AI</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            © 2026 X-Ray AI. Medical Intelligence Platform.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
