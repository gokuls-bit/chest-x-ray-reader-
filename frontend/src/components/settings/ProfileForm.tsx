"use client";

import { useState } from "react";
import { User } from "lucide-react";

interface ProfileFormProps {
    initialData?: {
        fullName: string;
        email: string;
        hospitalName: string;
        department: string;
    };
}

export function ProfileForm({ initialData }: ProfileFormProps) {
    const [form, setForm] = useState({
        fullName: initialData?.fullName || "",
        email: initialData?.email || "",
        hospitalName: initialData?.hospitalName || "",
        department: initialData?.department || "",
    });
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        // In production, this would call Clerk user.update() + MongoDB sync
        setTimeout(() => setSaving(false), 1000);
    };

    return (
        <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-medical-blue-500/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-medical-blue-500" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-foreground">Profile</h3>
                    <p className="text-sm text-muted-foreground">
                        Manage your account details
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                        Full Name
                    </label>
                    <input
                        type="text"
                        value={form.fullName}
                        onChange={(e) =>
                            setForm((prev) => ({ ...prev, fullName: e.target.value }))
                        }
                        className="w-full px-3 py-2 text-sm bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>
                <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                        Email
                    </label>
                    <input
                        type="email"
                        value={form.email}
                        disabled
                        className="w-full px-3 py-2 text-sm bg-muted border border-input rounded-lg text-muted-foreground cursor-not-allowed"
                    />
                </div>
                <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                        Hospital Name
                    </label>
                    <input
                        type="text"
                        value={form.hospitalName}
                        onChange={(e) =>
                            setForm((prev) => ({ ...prev, hospitalName: e.target.value }))
                        }
                        placeholder="General Hospital"
                        className="w-full px-3 py-2 text-sm bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>
                <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">
                        Department
                    </label>
                    <input
                        type="text"
                        value={form.department}
                        onChange={(e) =>
                            setForm((prev) => ({ ...prev, department: e.target.value }))
                        }
                        placeholder="Radiology"
                        className="w-full px-3 py-2 text-sm bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                </div>
            </div>

            <button
                onClick={handleSave}
                disabled={saving}
                className="mt-6 px-6 py-2.5 bg-medical-blue-600 text-white font-medium rounded-xl hover:bg-medical-blue-700 transition-colors text-sm disabled:opacity-50 shadow-lg shadow-medical-blue-600/25"
            >
                {saving ? "Saving..." : "Save Changes"}
            </button>
        </div>
    );
}
