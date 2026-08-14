import { getInquiryById, getAdminUsers } from "@/app/actions/inquiry";
import InquiryDetailClient from "./InquiryDetailClient";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Inquiry Details | Admin | VetKind",
};

export default async function InquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  try {
    const { inquiry, activities } = await getInquiryById(resolvedParams.id);
    const admins = await getAdminUsers();
    
    if (!inquiry) {
      notFound();
    }

    return (
      <InquiryDetailClient 
        initialInquiry={inquiry} 
        activities={activities}
        admins={admins || []}
      />
    );
  } catch (error) {
    notFound();
  }
}
