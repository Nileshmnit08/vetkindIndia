import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { companyConfig } from "@/lib/constants/config";

export const metadata = {
  title: "Contact Us | VetKind",
  description: "Get in touch with VetKind for veterinary solutions, product inquiries, and expert consultations.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const resolvedParams = await searchParams;
  const productContext = resolvedParams.product;
  const solutionContext = resolvedParams.solution;

  const { getSiteSettings } = await import("@/app/actions/settings");
  const siteSettings = await getSiteSettings();

  const whatsappNumber = siteSettings?.whatsapp_number || companyConfig.contact.whatsapp;
  const whatsappEnabled = siteSettings?.whatsapp_enabled ?? true;

  return (
    <div className="flex min-h-screen flex-col font-sans bg-zinc-50 dark:bg-zinc-950">
      
      {/* Hero Section */}
      <section className="bg-green-900 py-16 text-white md:py-24">
        <div className="container mx-auto px-4 text-center md:px-6 max-w-3xl">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Get in Touch
          </h1>
          <p className="text-xl text-green-100 leading-relaxed">
            Have questions about our products, need veterinary advice, or want to become a distributor? Our team is ready to help.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12 md:px-6 md:py-20 max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-2">
          
          {/* Contact Information & Map */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-white">Contact Information</h2>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
              {/* Address */}
              <div className="flex gap-4 items-start rounded-2xl bg-white p-6 shadow-sm border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 dark:text-white text-lg">Corporate Headquarters</h3>
                  <p className="mt-2 text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {companyConfig.contact.address.street}<br />
                    {companyConfig.contact.address.city}, {companyConfig.contact.address.state}, {companyConfig.contact.address.zip}<br />
                    {companyConfig.contact.address.country}
                  </p>
                </div>
              </div>

              {/* Contact Methods */}
              <div className="flex gap-4 items-start rounded-2xl bg-white p-6 shadow-sm border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-900 dark:text-white text-lg">Direct Lines</h3>
                  <div className="mt-2 space-y-2 text-zinc-600 dark:text-zinc-400">
                    <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> {companyConfig.contact.phone}</p>
                    <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> {companyConfig.contact.email}</p>
                  </div>
                </div>
              </div>

              {/* WhatsApp Call to Action */}
              {whatsappEnabled && (
                <div className="flex gap-4 items-center rounded-2xl bg-green-50 p-6 border border-green-200 dark:bg-green-900/20 dark:border-green-900/50">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-500 text-white shadow-sm">
                    <MessageCircle className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-green-950 dark:text-green-50 text-lg">Instant Support</h3>
                    <p className="text-sm text-green-800 dark:text-green-300">Chat with an expert on WhatsApp</p>
                  </div>
                  <a 
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(siteSettings?.whatsapp_message || 'Hello! I would like to know more about VetKind solutions.')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-green-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-green-700"
                  >
                    Message
                  </a>
                </div>
              )}
            </div>

            {/* Map Area */}
            <div className="relative aspect-video w-full rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 overflow-hidden flex items-center justify-center">
              <div className="text-center p-4">
                <MapPin className="h-10 w-10 text-zinc-300 dark:text-zinc-700 mx-auto mb-2" />
                <p className="text-zinc-500 dark:text-zinc-500 font-medium text-sm">Interactive Map Coming Soon</p>
                <p className="text-xs text-zinc-400 dark:text-zinc-600 mt-1">Our exact coordinates will be published here shortly.</p>
              </div>
            </div>

          </div>

          {/* Contact Form */}
          <div className="rounded-3xl bg-white p-8 shadow-xl shadow-zinc-200/50 dark:bg-zinc-900 dark:shadow-none border border-zinc-100 dark:border-zinc-800">
            <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white">Send us a Message</h2>
            <ContactForm productContext={productContext} solutionContext={solutionContext} />
          </div>
        </div>
      </section>

    </div>
  );
}
