"use client";

import { useState } from "react";

interface PatientMeta {
    patientId: string;
    patientAge: string;
    patientGender: string;
    referringDoctor: string;
    notes: string;
}

interface PatientMetaFormProps {
    onSubmit: (meta: PatientMeta) => void;
    disabled?: boolean;
}

export function PatientMetaForm({ onSubmit, disabled }: PatientMetaFormProps) {
    const [form, setForm] = useState<PatientMeta>({
        patientId: "",
        patientAge: "",
        patientGender: "",
        referringDoctor: "",
        notes: "",
    });

    const update = (field: keyof PatientMeta, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <div className="glass-card p-6 space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
                Patient Information
                <span className="text-xs text-muted-foreground font-normal ml-2">
                    (Optional)
                </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                        Patient ID
                    </label>
                    <input
                        type="text"
                        placeholder="PX-XXXXX"
                        value={form.patientId}
                        onChange={(e) => update("patientId", e.target.value)}
                        disabled={disabled}
                        className="w-full px-3 py-2 text-sm bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                        Age
                    </label>
                    <input
                        type="number"
                        placeholder="45"
                        min={0}
                        max={150}
                        value={form.patientAge}
                        onChange={(e) => update("patientAge", e.target.value)}
                        disabled={disabled}
                        className="w-full px-3 py-2 text-sm bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                        Gender
                    </label>
                    <select
                        value={form.patientGender}
                        onChange={(e) => update("patientGender", e.target.value)}
                        disabled={disabled}
                        className="w-full px-3 py-2 text-sm bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                    >
                        <option value="">Select</option>
                        <option value="M">Male</option>
                        <option value="F">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                        Referring Doctor
                    </label>
                    <input
                        type="text"
                        placeholder="Dr. Smith"
                        value={form.referringDoctor}
                        onChange={(e) => update("referringDoctor", e.target.value)}
                        disabled={disabled}
                        className="w-full px-3 py-2 text-sm bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                    />
                </div>
            </div>

            <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">
                    Notes
                </label>
                <textarea
                    rows={3}
                    placeholder="Clinical notes..."
                    value={form.notes}
                    onChange={(e) => update("notes", e.target.value)}
                    disabled={disabled}
                    className="w-full px-3 py-2 text-sm bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none disabled:opacity-50"
                />
            </div>

            <button
                onClick={() => onSubmit(form)}
                disabled={disabled}
                className="w-full py-2.5 bg-medical-blue-600 text-white font-semibold rounded-xl hover:bg-medical-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-medical-blue-600/25"
            >
                Analyze X-Ray
            </button>
        </div>
    );
}
