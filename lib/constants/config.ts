export const companyConfig = {
  companyName: "VetKind",
  contact: {
    phone: "+91 98765 43210", // TODO: Replace with real VetKind contact number
    email: "info@vetkind.in", // TODO: Replace with real VetKind email
    whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+919876543210",
    address: {
      street: "RIICO Industrial Area", // TODO: Update to exact street
      city: "Jaipur",
      state: "Rajasthan",
      zip: "302001", // TODO: Verify zip
      country: "India"
    }
  },
  socials: {
    facebook: "https://facebook.com/vetkind", // TODO: Update to real Facebook URL
    twitter: "https://twitter.com/vetkind", // TODO: Update to real Twitter URL
    instagram: "https://instagram.com/vetkind", // TODO: Update to real Instagram URL
    linkedin: "https://linkedin.com/company/vetkind" // TODO: Update to real LinkedIn URL
  }
};
