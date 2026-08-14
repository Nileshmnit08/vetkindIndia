"use client";

import { useState, useMemo } from "react";
import { updateSiteSettings } from "@/app/actions/settings";
import { Save, AlertCircle, Phone, MessageCircle } from "lucide-react";
import { validateWhatsAppNumber } from "@/lib/validators";

export default function ContactSettingsForm({ initialSettings }: { initialSettings: any }) {
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const [previewNumber, setPreviewNumber] = useState(initialSettings?.whatsapp_number || "");
  const [previewText, setPreviewText] = useState(initialSettings?.whatsapp_message || "");
  const [isEnabled, setIsEnabled] = useState(initialSettings?.whatsapp_enabled ?? true);

  const validation = useMemo(() => validateWhatsAppNumber(previewNumber), [previewNumber]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validation.isValid) {
      setMessage({ type: 'error', text: validation.error || "Invalid WhatsApp number." });
      return;
    }
    
    if (isEnabled && !previewText.trim()) {
      setMessage({ type: 'error', text: "Default message is required when WhatsApp CTA is enabled." });
      return;
    }

    setIsPending(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    formData.set("whatsappEnabled", isEnabled.toString());
    
    const result = await updateSiteSettings(formData);

    if (result.success) {
      setMessage({ type: 'success', text: "Settings saved successfully." });
    } else {
      setMessage({ type: 'error', text: result.error || "Failed to save settings." });
    }

    setIsPending(false);
  };

  const previewUrl = validation.isValid 
    ? `https://wa.me/${validation.cleanNumber}?text=${encodeURIComponent(previewText)}` 
    : "#";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-zinc-900 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          
          {message && (
            <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-400'} flex items-start`}>
              <AlertCircle className="h-5 w-5 mr-2 shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{message.text}</p>
            </div>
          )}

          <div>
            <h2 className="text-lg font-medium text-zinc-900 dark:text-white">WhatsApp Configuration</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Configure the WhatsApp contact button that appears across the website.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Enable WhatsApp CTA
                </label>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Show or hide the floating WhatsApp button on the website.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEnabled(!isEnabled)}
                className={`${
                  isEnabled ? 'bg-green-600' : 'bg-zinc-200 dark:bg-zinc-700'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2`}
              >
                <span className="sr-only">Use setting</span>
                <span
                  className={`${
                    isEnabled ? 'translate-x-5' : 'translate-x-0'
                  } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </button>
            </div>

            <div>
              <label htmlFor="whatsappNumber" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                WhatsApp Number <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className={`h-5 w-5 ${!validation.isValid && previewNumber.length > 0 ? 'text-red-400' : 'text-zinc-400'}`} />
                </div>
                <input
                  type="text"
                  name="whatsappNumber"
                  id="whatsappNumber"
                  required
                  value={previewNumber}
                  onChange={(e) => {
                    setPreviewNumber(e.target.value);
                    if (message?.type === 'error') setMessage(null);
                  }}
                  className={`block w-full pl-10 rounded-md shadow-sm sm:text-sm px-3 py-2 border focus:ring-green-500 focus:border-green-500 dark:bg-zinc-800 dark:text-white ${
                    !validation.isValid && previewNumber.length > 0 
                      ? 'border-red-300 dark:border-red-700 focus:border-red-500 focus:ring-red-500' 
                      : 'border-zinc-300 dark:border-zinc-700'
                  }`}
                  placeholder="e.g. 919876543210"
                />
              </div>
              {!validation.isValid && previewNumber.length > 0 ? (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">{validation.error}</p>
              ) : (
                <p className="mt-1 text-xs text-zinc-500">Enter full international WhatsApp number with country code (e.g. 919876543210 for India). Digits only.</p>
              )}
            </div>

            <div>
              <label htmlFor="whatsappMessage" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Default Message {isEnabled && <span className="text-red-500">*</span>}
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                 <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                  <MessageCircle className="h-5 w-5 text-zinc-400" />
                </div>
                <textarea
                  id="whatsappMessage"
                  name="whatsappMessage"
                  rows={3}
                  required={isEnabled}
                  value={previewText}
                  onChange={(e) => setPreviewText(e.target.value)}
                  className="block w-full pl-10 rounded-md border-zinc-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm dark:bg-zinc-800 dark:border-zinc-700 dark:text-white px-3 py-2 border"
                  placeholder="Hello! I would like to know more about VetKind solutions."
                />
              </div>
              <p className="mt-1 text-xs text-zinc-500">The pre-filled message when users click the WhatsApp button.</p>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <button
              type="submit"
              disabled={isPending || !validation.isValid}
              className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
            >
              <Save className="mr-2 -ml-1 h-4 w-4" aria-hidden="true" />
              {isPending ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-6">
        <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <h3 className="text-base font-medium text-zinc-900 dark:text-white mb-4">Live Preview</h3>
          
          <div className="space-y-6">
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 bg-white dark:bg-zinc-800">
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">Floating Button Output:</p>
              
              <div className="relative h-20 w-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 rounded border border-dashed border-zinc-300 dark:border-zinc-700 overflow-hidden">
                {isEnabled && validation.isValid ? (
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center rounded-full bg-[#25D366] p-4 text-white shadow-lg transition-transform hover:scale-105"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </a>
                ) : (
                  <p className="text-xs text-zinc-400 italic">
                    {!isEnabled ? "Button is hidden" : "Invalid WhatsApp number"}
                  </p>
                )}
              </div>
            </div>

            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 bg-white dark:bg-zinc-800">
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">Generated URL:</p>
              <div className="bg-zinc-100 dark:bg-zinc-900 p-2 rounded text-xs font-mono break-all text-zinc-700 dark:text-zinc-300">
                {validation.isValid ? previewUrl : <span className="text-red-500 text-xs">A valid number is required to generate the link.</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
