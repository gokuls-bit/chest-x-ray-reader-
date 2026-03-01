import { z } from "zod";

export const reportSchema = z.object({
    imageUrl: z.string().url(),
    imagePublicId: z.string().min(1),
    prediction: z.string().min(1),
    probability: z.number().min(0).max(1),
    probabilities: z.array(
        z.object({
            label: z.string(),
            score: z.number().min(0).max(1),
        })
    ),
    severity: z.enum(["Normal", "Review", "Critical"]),
    findings: z.array(z.string()).optional(),
    patientId: z.string().optional(),
    patientAge: z.number().min(0).max(150).optional(),
    patientGender: z.enum(["M", "F", "Other"]).optional(),
    referringDoctor: z.string().optional(),
    notes: z.string().optional(),
});

export const uploadSchema = z.object({
    file: z.any(),
});

export const settingsSchema = z.object({
    hospitalName: z.string().optional(),
    department: z.string().optional(),
    notifications: z
        .object({
            emailOnReport: z.boolean(),
            criticalAlerts: z.boolean(),
            weeklyDigest: z.boolean(),
        })
        .optional(),
});

export type ReportInput = z.infer<typeof reportSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
