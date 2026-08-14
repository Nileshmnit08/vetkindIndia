"use server";

import { createServerClient } from "@/lib/supabase/client";
import { auth } from "@/auth";

const supabase = createServerClient();

export async function getSiteSettings() {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .single();
      
    if (error && error.code !== 'PGRST116') {
      console.error("Error fetching site settings:", {
        message: error.message,
        code: error.code,
        hint: error.hint
      });
      return null;
    }
    
    return data || null;
  } catch (error) {
    console.error("Error in getSiteSettings:", error);
    return null;
  }
}

export async function updateSiteSettings(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const whatsappNumber = formData.get("whatsappNumber") as string;
    const whatsappMessage = formData.get("whatsappMessage") as string;
    const whatsappEnabled = formData.get("whatsappEnabled") === "true";

    if (!whatsappNumber || !whatsappMessage) {
      return { success: false, error: "Please fill out all required fields." };
    }

    const { validateWhatsAppNumber } = await import("@/lib/validators");
    const validation = validateWhatsAppNumber(whatsappNumber);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }
    
    // Clean number for storage (digits only)
    const cleanNumber = validation.cleanNumber;

    const { error } = await supabase
      .from('site_settings')
      .upsert({
        id: 1,
        whatsapp_number: cleanNumber,
        whatsapp_message: whatsappMessage,
        whatsapp_enabled: whatsappEnabled,
        updated_by: session.user.id,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error("Supabase error updating settings:", {
        message: error.message,
        code: error.code,
        hint: error.hint
      });
      
      let userFriendlyError = "Failed to save settings due to a database error.";
      if (error.message.includes("schema cache") || error.message.includes("Could not find the table")) {
         userFriendlyError = "Database configuration is missing. Please run the settings migration script.";
      }
      
      return { success: false, error: userFriendlyError };
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating site settings:", error);
    return { success: false, error: "An unexpected error occurred while saving." };
  }
}
