"use server";

import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";

const prisma = new PrismaClient();

export async function submitDistributorInquiry(formData: FormData) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const name = formData.get("name") as string;
    const company = formData.get("company") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const cityState = formData.get("cityState") as string;
    const businessType = formData.get("businessType") as string;
    const productsOfInterest = formData.get("productsOfInterest") as string;
    const userMessage = formData.get("message") as string;

    if (!name || !email || !company || !phone) {
      return { success: false, error: "Please fill out all required fields." };
    }

    // Prevent duplicate pending inquiries from the same user or email
    const existingInquiry = await prisma.inquiry.findFirst({
      where: {
        OR: [
          { email },
          userId ? { userId } : {}
        ],
        status: "NEW"
      }
    });

    if (existingInquiry) {
      return { success: false, error: "You already have a pending inquiry. Our team will contact you soon." };
    }

    // Format the message with the extra fields
    const formattedMessage = `
City/State: ${cityState || 'Not provided'}
Business Type: ${businessType || 'Not provided'}
Products of Interest: ${productsOfInterest || 'Not provided'}

Message:
${userMessage || 'No additional message'}
    `.trim();

    await prisma.inquiry.create({
      data: {
        name,
        company,
        email,
        phone,
        message: formattedMessage,
        ...(userId && { user: { connect: { id: userId } } })
      }
    });

    return { success: true };
  } catch (error) {
    console.error("Error submitting distributor inquiry:", error);
    return { success: false, error: "An unexpected error occurred. Please try again later." };
  }
}
