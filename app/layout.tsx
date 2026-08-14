import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/navigation/Header";
import { Footer } from "@/components/footer/Footer";
import { FloatingCustomerCare } from "@/components/ui/FloatingCustomerCare";
import { auth } from "@/auth";
import { getSiteSettings } from "@/app/actions/settings";
import { getFilterOptions } from "@/lib/products";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VetKind | Smarter Animal Health",
  description: "VetKind provides premium veterinary solutions, products, and knowledge for professionals globally.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const isLoggedIn = !!session?.user;
  const userRole = session?.user?.role;
  const { species } = await getFilterOptions();
  
  // Fetch site settings
  const siteSettings = await getSiteSettings();
  const whatsappNumber = siteSettings?.whatsapp_number;
  const whatsappMessage = siteSettings?.whatsapp_message;
  const whatsappEnabled = siteSettings?.whatsapp_enabled;

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Header isLoggedIn={isLoggedIn} userRole={userRole} />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <Footer species={species} />
        <FloatingCustomerCare 
          whatsappNumber={whatsappNumber}
          whatsappMessage={whatsappMessage}
          whatsappEnabled={whatsappEnabled}
        />
      </body>
    </html>
  );
}
