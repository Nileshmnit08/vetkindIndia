"use server";

export async function submitContactForm(formData: FormData) {
  // Remove simulate network delay
  
  // Extract fields
  const data = {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string,
    farmName: formData.get("farmName") as string,
    location: formData.get("location") as string,
    animalType: formData.get("animalType") as string,
    herdSize: formData.get("herdSize") as string,
    inquiryType: formData.get("inquiryType") as string,
    solution: formData.get("solution") as string,
    product: formData.get("product") as string,
    message: formData.get("message") as string,
    consent: formData.get("consent") === "on",
  };

  // Basic server-side validation
  if (!data.firstName || !data.lastName || !data.email || !data.phone || !data.message || !data.consent) {
    return { success: false, error: "Please fill out all required fields and provide consent." };
  }

  try {
    const { createServerClient } = await import("@/lib/supabase/client");
    const supabase = createServerClient();
    
    // Parse location for city/state if possible
    let city = null;
    let state = null;
    if (data.location) {
      const parts = data.location.split(',').map(p => p.trim());
      if (parts.length > 1) {
        city = parts[0];
        state = parts[1];
      } else {
        city = data.location;
      }
    }

    const formattedMessage = `
Animal Type: ${data.animalType || '-'}
Herd Size: ${data.herdSize || '-'}

Message:
${data.message}
    `.trim();

    const { error } = await supabase.from('inquiries').insert({
      name: `${data.firstName} ${data.lastName}`.trim(),
      email: data.email,
      phone: data.phone,
      company: data.farmName || null,
      message: formattedMessage,
      inquiry_type: data.inquiryType || 'general',
      product_interest: data.product || data.solution || null,
      city,
      state,
      source: 'contact_form',
      priority: 'Medium',
      status: 'NEW'
    });

    if (error) {
      console.error("Database error saving contact form:", error);
      return { success: false, error: "Failed to save inquiry. Please try again." };
    }

    return { success: true };
  } catch (err) {
    console.error("Unexpected error saving contact form:", err);
    return { success: false, error: "An unexpected error occurred. Please try again." };
  }
}
