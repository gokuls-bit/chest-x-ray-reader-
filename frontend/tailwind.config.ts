import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                "medical-blue": {
                    50: "#f0f7ff",
                    100: "#e0eefe",
                    200: "#bae0fd",
                    300: "#7cc5fb",
                    400: "#38a5f8",
                    500: "#0e87eb",
                    600: "#0269ca",
                    700: "#0354a3",
                    800: "#074886",
                    900: "#0c3d6f",
                    950: "#082649",
                },
                "emerald-soft": {
                  50: '#ecfdf5',
                  500: '#10b981',
                  600: '#059669',
                },
                "rose-soft": {
                  50: '#fff1f2',
                  500: '#f43f5e',
                  600: '#e11d48',
                },
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
                "2xl": "1.25rem",
                "3xl": "1.75rem",
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
                display: ["Outfit", "Inter", "sans-serif"],
            },
            boxShadow: {
              'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
              'glass-hover': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
            },
            keyframes: {
                "fade-in": {
                    "0%": { opacity: "0", transform: "translateY(10px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                "scale-in": {
                  "0%": { opacity: "0", transform: "scale(0.95)" },
                  "100%": { opacity: "1", transform: "scale(1)" },
                },
                "slide-in": {
                    "0%": { transform: "translateX(-100%)" },
                    "100%": { transform: "translateX(0)" },
                },
                "gauge-fill": {
                    "0%": { strokeDashoffset: "283" },
                    "100%": { strokeDashoffset: "var(--gauge-offset)" },
                },
            },
            animation: {
                "fade-in": "fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                "scale-in": "scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                "slide-in": "slide-in 0.3s ease-out",
                "gauge-fill": "gauge-fill 1.5s cubic-bezier(0.65, 0, 0.35, 1) forwards",
            },
        },
    },
    plugins: [],
};
export default config;
