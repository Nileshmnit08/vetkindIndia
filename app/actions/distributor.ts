// @ts-nocheck
"use server";

import { auth } from "@/auth";
import { createServerClient } from "@/lib/supabase/client";
import { revalidatePath } from "next/cache";

const supabase = createServerClient();

async function checkDistributorAuth() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "DISTRIBUTOR" && session.user.role !== "ADMIN")) {
    throw new Error("Unauthorized");
  }
  return session.user;
}

export async function submitInquiry(prevState: any, formData: FormData) {
  try {
    const user = await checkDistributorAuth();
    
    const name = formData.get("name") as string;
    const company = formData.get("company") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    const { error } = await supabase.from('inquiries').insert({
      user_id: user.id,
      name,
      company,
      email,
      message,
    });
    
    if (error) throw error;

    revalidatePath("/distributor/inquiries");
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: "Failed to submit inquiry" };
  }
}

