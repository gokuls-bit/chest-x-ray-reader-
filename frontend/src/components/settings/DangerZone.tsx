"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";

export function DangerZone() {
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmText, setConfirmText] = useState("");

    const handleDelete = async () => {
        if (confirmText !== "DELETE") return;
        // In production: call Clerk user deletion + MongoDB cleanup
        alert("Account deletion would occur here in production");
        setShowConfirm(false);
        setConfirmText("");
    };

    return (
        <div className="glass-card p-6 border-2 border-red-500/20">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-red-500">Danger Zone</h3>
                    <p className="text-sm text-muted-foreground">
                        Irreversible and destructive actions
                    </p>
                </div>
            </div>

            {!showConfirm ? (
                <button
                    onClick={() => setShowConfirm(true)}
                    className="px-4 py-2 bg-red-500/10 text-red-500 font-medium rounded-xl border border-red-500/20 hover:bg-red-500/20 transition-colors text-sm"
                >
                    Delete Account
                </button>
            ) : (
                <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl space-y-3">
                    <p className="text-sm text-foreground">
                        This will permanently delete your account and all associated data
                        including reports and uploaded images.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Type <strong>DELETE</strong> to confirm:
                    </p>
                    <input
                        type="text"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        placeholder="DELETE"
                        className="w-full px-3 py-2 text-sm bg-background border border-red-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={handleDelete}
                            disabled={confirmText !== "DELETE"}
                            className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Delete My Account
                        </button>
                        <button
                            onClick={() => {
                                setShowConfirm(false);
                                setConfirmText("");
                            }}
                            className="px-4 py-2 bg-card text-foreground font-medium rounded-lg border border-border hover:bg-accent transition-colors text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
