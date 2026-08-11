"use server";

export async function submitContactForm(formData: FormData) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

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

  // Safely log in development
  if (process.env.NODE_ENV === "development") {
    console.log("[DEV] Contact form submitted:", data);
  }

  // TODO: Add CRM/Email provider integration here (e.g. SendGrid, HubSpot)
  // For now, we just return success in development

  return { success: true };
}
