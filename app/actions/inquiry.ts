"use server";

import { createServerClient } from "@/lib/supabase/client";
import { auth } from "@/auth";

const supabase = createServerClient();

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
    let query = supabase.from('inquiries').select('id').eq('status', 'NEW');
    
    if (userId) {
      query = query.or(`email.eq.${email},user_id.eq.${userId}`);
    } else {
      query = query.eq('email', email);
    }
    
    const { data: existingInquiries } = await query;

    if (existingInquiries && existingInquiries.length > 0) {
      return { success: false, error: "You already have a pending inquiry. Our team will contact you soon." };
    }

    // Parse location for city/state if possible
    let city = null;
    let state = null;
    if (cityState) {
      const parts = cityState.split(',').map(p => p.trim());
      if (parts.length > 1) {
        city = parts[0];
        state = parts[1];
      } else {
        city = cityState;
      }
    }

    const formattedMessage = `
Business Type: ${businessType || 'Not provided'}
Products of Interest: ${productsOfInterest || 'Not provided'}

Message:
${userMessage || 'No additional message'}
    `.trim();

    const { error } = await supabase.from('inquiries').insert({
      name,
      company,
      email,
      phone,
      message: formattedMessage,
      user_id: userId || null,
      inquiry_type: 'distributor',
      product_interest: productsOfInterest,
      city,
      state,
      source: 'distributor_form',
      priority: 'High', // Distributor inquiries default to High priority
      status: 'NEW'
    });

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error("Error submitting distributor inquiry:", error);
    return { success: false, error: "An unexpected error occurred. Please try again later." };
  }
}

// --------------------------------------------------------
// CRM ADMIN APIs
// --------------------------------------------------------

export async function getInquiries(params?: { 
  status?: string, 
  search?: string, 
  priority?: string,
  source?: string,
  page?: number,
  limit?: number
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  let query = supabase.from('inquiries').select('*, assigned_to:users!inquiries_assigned_to_fkey(name)', { count: 'exact' });

  if (params?.status && params.status !== 'ALL') {
    query = query.eq('status', params.status);
  }
  
  if (params?.priority && params.priority !== 'ALL') {
    query = query.eq('priority', params.priority);
  }

  if (params?.source && params.source !== 'ALL') {
    query = query.eq('source', params.source);
  }

  if (params?.search) {
    const search = params.search;
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%,phone.ilike.%${search}%`);
  }

  query = query.order('created_at', { ascending: false });

  if (params?.page && params?.limit) {
    const from = (params.page - 1) * params.limit;
    const to = from + params.limit - 1;
    query = query.range(from, to);
  }

  const { data, count, error } = await query;
  
  if (error) {
    console.error("Error fetching inquiries:", {
      message: error.message,
      code: error.code,
      hint: error.hint,
      details: error.details
    });
    return { 
      success: false, 
      inquiries: [], 
      count: 0,
      error: {
        message: error.message,
        code: error.code
      }
    };
  }

  return { success: true, inquiries: data || [], count: count || 0 };
}

export async function getInquiryById(id: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  // Get inquiry details
  const { data: inquiry, error } = await supabase
    .from('inquiries')
    .select('*, assigned_to:users!inquiries_assigned_to_fkey(id, name, email)')
    .eq('id', id)
    .single();

  if (error) {
    console.error("Error fetching inquiry:", error);
    throw new Error("Failed to fetch inquiry");
  }

  // Get activity timeline
  const { data: activities, error: actError } = await supabase
    .from('inquiry_activities')
    .select('*, user:users!inquiry_activities_user_id_fkey(id, name)')
    .eq('inquiry_id', id)
    .order('created_at', { ascending: false });

  return {
    inquiry,
    activities: activities || []
  };
}

export async function getAdminUsers() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, role')
    .in('role', ['ADMIN', 'SUPER_ADMIN']);

  if (error) throw new Error("Failed to fetch admin users");
  return data;
}

// Reusable activity logger
async function logActivity(inquiryId: string, userId: string, type: string, content?: string, oldVal?: string, newVal?: string) {
  await supabase.from('inquiry_activities').insert({
    inquiry_id: inquiryId,
    user_id: userId,
    activity_type: type,
    content,
    old_value: oldVal,
    new_value: newVal
  });
}

export async function updateInquiryStatus(id: string, newStatus: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") return { success: false, error: "Unauthorized" };

  // Fetch current
  const { data: current } = await supabase.from('inquiries').select('status').eq('id', id).single();
  if (!current) return { success: false, error: "Not found" };

  if (current.status === newStatus) return { success: true }; // No change

  const { error } = await supabase.from('inquiries')
    .update({ status: newStatus, updated_by: session.user.id })
    .eq('id', id);

  if (error) return { success: false, error: error.message };

  await logActivity(id, session.user.id, 'STATUS_CHANGE', `Status changed to ${newStatus}`, current.status, newStatus);
  return { success: true };
}

export async function updateInquiryStatusWithNotification(
  id: string, 
  newStatus: string, 
  notify: boolean, 
  adminNote?: string
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") return { success: false, error: "Unauthorized" };

  // Fetch current
  const { data: current } = await supabase.from('inquiries').select('status, name, phone, company').eq('id', id).single();
  if (!current) return { success: false, error: "Not found" };

  if (current.status === newStatus && !notify) return { success: true };

  // Update status in DB
  const { error } = await supabase.from('inquiries')
    .update({ status: newStatus, updated_by: session.user.id })
    .eq('id', id);

  if (error) return { success: false, error: error.message };

  if (current.status !== newStatus) {
    await logActivity(id, session.user.id, 'STATUS_CHANGE', `Status changed to ${newStatus}`, current.status, newStatus);
  }

  // Handle WhatsApp Notification
  if (notify && current.phone) {
    const { whatsappService } = await import('@/lib/services/whatsapp');
    const { generateWhatsAppMessage } = await import('@/lib/whatsapp/templates');

    const message = generateWhatsAppMessage(newStatus as any, {
      customerName: current.name,
      inquiryId: id,
      company: current.company,
      adminNote
    });

    const result = await whatsappService.sendMessage(current.phone, message);

    // Log the notification attempt
    await supabase.from('whatsapp_notification_logs').insert({
      inquiry_id: id,
      phone: current.phone,
      template_key: newStatus,
      message_body: message,
      status: result.success ? 'DELIVERED' : 'FAILED',
      error_message: result.error || null,
      sent_by: session.user.id,
      provider: result.provider
    });

    // Update the inquiry with the latest whatsapp status
    await supabase.from('inquiries').update({
      last_whatsapp_notification_at: new Date().toISOString(),
      last_whatsapp_notification_status: result.success ? 'DELIVERED' : 'FAILED',
      last_whatsapp_message_id: result.messageId || null,
      last_whatsapp_error: result.error || null,
    }).eq('id', id);

    // Log in the activity timeline too
    await logActivity(
      id, 
      session.user.id, 
      'WHATSAPP', 
      result.success ? `Sent WhatsApp update for status: ${newStatus}` : `Failed to send WhatsApp update: ${result.error}`
    );

    if (!result.success) {
      return { success: true, warning: `Status updated, but WhatsApp notification failed: ${result.error}` };
    }
  }

  return { success: true };
}

export async function assignInquiry(id: string, assignedToId: string | null) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") return { success: false, error: "Unauthorized" };

  const { error } = await supabase.from('inquiries')
    .update({ assigned_to: assignedToId, updated_by: session.user.id })
    .eq('id', id);

  if (error) return { success: false, error: error.message };

  await logActivity(id, session.user.id, 'ASSIGNMENT', `Assigned inquiry to user`, null, assignedToId || 'Unassigned');
  return { success: true };
}

export async function addInquiryNote(id: string, content: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") return { success: false, error: "Unauthorized" };

  await logActivity(id, session.user.id, 'NOTE', content);
  
  // Update last contacted optionally
  await supabase.from('inquiries').update({ updated_by: session.user.id }).eq('id', id);

  return { success: true };
}

export async function markInquirySpam(id: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") return { success: false, error: "Unauthorized" };

  const { error } = await supabase.from('inquiries')
    .update({ status: 'Spam', is_spam: true, updated_by: session.user.id })
    .eq('id', id);

  if (error) return { success: false, error: error.message };

  await logActivity(id, session.user.id, 'STATUS_CHANGE', 'Marked as spam');
  return { success: true };
}
