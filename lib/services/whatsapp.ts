import { validateWhatsAppNumber } from "@/lib/validators";

export interface WhatsAppSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
  provider: 'MOCK' | 'WHATSAPP_CLOUD' | 'TWILIO';
}

export class WhatsAppService {
  private static instance: WhatsAppService;
  
  // Read config from env (in real life)
  private hasLiveKeys = !!process.env.WHATSAPP_API_KEY;

  private constructor() {}

  public static getInstance(): WhatsAppService {
    if (!WhatsAppService.instance) {
      WhatsAppService.instance = new WhatsAppService();
    }
    return WhatsAppService.instance;
  }

  public async sendMessage(phone: string, message: string): Promise<WhatsAppSendResult> {
    const validation = validateWhatsAppNumber(phone);
    
    if (!validation.isValid) {
      return {
        success: false,
        error: `Invalid phone number: ${validation.error}`,
        provider: 'MOCK'
      };
    }

    // Default to +91 if no country code provided, per user approval assumption.
    let cleanNumber = validation.cleanNumber;
    if (cleanNumber && cleanNumber.length === 10) {
       cleanNumber = '91' + cleanNumber;
    }

    if (this.hasLiveKeys) {
      // return this.sendViaLiveProvider(cleanNumber, message);
      return { success: false, error: 'Live provider not fully implemented', provider: 'MOCK' };
    } else {
      return this.sendViaMockProvider(cleanNumber as string, message);
    }
  }

  private async sendViaMockProvider(phone: string, message: string): Promise<WhatsAppSendResult> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    console.log(`\n======================================================`);
    console.log(`[MOCK WHATSAPP PROVIDER] Message Sent!`);
    console.log(`To: +${phone}`);
    console.log(`Message:\n${message}`);
    console.log(`======================================================\n`);

    return {
      success: true,
      messageId: `mock_wa_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      provider: 'MOCK'
    };
  }
}

export const whatsappService = WhatsAppService.getInstance();
