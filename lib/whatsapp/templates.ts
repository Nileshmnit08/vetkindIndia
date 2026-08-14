export type InquiryStatus = 'NEW' | 'OPEN' | 'IN PROGRESS' | 'CONTACTED' | 'QUALIFIED' | 'CONVERTED' | 'CLOSED' | 'SPAM';

export interface TemplateContext {
  customerName: string;
  inquiryId: string;
  company?: string;
  adminNote?: string;
}

export function generateWhatsAppMessage(status: InquiryStatus, context: TemplateContext): string {
  const { customerName, adminNote } = context;
  const name = customerName.split(' ')[0] || 'there'; // Use first name if possible
  
  let baseMessage = '';

  switch (status) {
    case 'NEW':
      baseMessage = `Hello ${name},\n\nThank you for reaching out to VetKind. We have received your inquiry and our team is reviewing it. We will get back to you shortly.`;
      break;
      
    case 'OPEN':
      baseMessage = `Hello ${name},\n\nYour inquiry with VetKind has been opened and assigned to a team member. We will be in touch soon.`;
      break;
      
    case 'IN PROGRESS':
      baseMessage = `Hello ${name},\n\nOur team is currently working on your inquiry. We appreciate your patience.`;
      break;
      
    case 'CONTACTED':
      baseMessage = `Hello ${name},\n\nYour VetKind inquiry is now being handled by our team.`;
      break;
      
    case 'QUALIFIED':
      baseMessage = `Hello ${name},\n\nYour inquiry has been reviewed and marked qualified. Our team will follow up shortly.`;
      break;
      
    case 'CONVERTED':
      baseMessage = `Hello ${name},\n\nGreat news — your inquiry has moved to converted status! Our team will contact you for the next steps.`;
      break;
      
    case 'CLOSED':
      baseMessage = `Hello ${name},\n\nYour inquiry has been closed. Reply to this WhatsApp message if you need further assistance.`;
      break;
      
    case 'SPAM':
      baseMessage = `Hello ${name},\n\nYour inquiry has been marked as spam.`; // Internal fallback, shouldn't really be sent
      break;
      
    default:
      baseMessage = `Hello ${name},\n\nThere is an update regarding your inquiry with VetKind.`;
  }

  if (adminNote) {
    baseMessage += `\n\n*Note from our team:*\n${adminNote}`;
  }

  return baseMessage;
}
