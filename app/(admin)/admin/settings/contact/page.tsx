import { getSiteSettings } from "@/app/actions/settings";
import ContactSettingsForm from "@/components/admin/ContactSettingsForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Settings | Admin | VetKind",
  description: "Manage WhatsApp and contact settings",
};

export default async function ContactSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Contact Settings</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Manage how customers contact VetKind across the platform.
        </p>
      </div>

      <ContactSettingsForm initialSettings={settings} />
    </div>
  );
}
