"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { ProfileForm } from "@/components/settings/ProfileForm";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { AppearanceSettings } from "@/components/settings/AppearanceSettings";
import { DangerZone } from "@/components/settings/DangerZone";

export default function SettingsPage() {
    return (
        <div className="animate-fade-in">
            <PageHeader
                title="Settings"
                subtitle="Manage your account preferences"
            />

            <div className="max-w-3xl space-y-6">
                <ProfileForm />
                <NotificationSettings />
                <AppearanceSettings />
                <DangerZone />
            </div>
        </div>
    );
}
