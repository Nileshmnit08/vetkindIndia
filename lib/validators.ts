export function validateWhatsAppNumber(number: string): { isValid: boolean; error?: string; cleanNumber?: string } {
  if (!number || number.trim() === '') {
    return { isValid: false, error: "WhatsApp number is required." };
  }

  // Check for any invalid characters (only digits allowed)
  if (/[^0-9]/.test(number)) {
    return { isValid: false, error: "Only digits are allowed. Remove spaces, plus signs, hyphens, or letters." };
  }

  // Check length (must be 10 to 15 digits, typically country code (1-3) + phone number (7-12))
  if (number.length < 10) {
    return { isValid: false, error: "Number is too short. Include country code (e.g. 91 for India) and full number." };
  }

  if (number.length > 15) {
    return { isValid: false, error: "Number is too long. Maximum 15 digits allowed." };
  }

  return { isValid: true, cleanNumber: number };
}
