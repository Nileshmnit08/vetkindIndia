"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle2 } from "lucide-react";
import { submitContactForm } from "@/app/actions/contact";

interface ContactFormProps {
  productContext?: string;
  solutionContext?: string;
}

export function ContactForm({ productContext, solutionContext }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const defaultInquiryType = solutionContext ? "veterinary" : (productContext ? "product" : "general");
  
  let defaultMessage = "";
  if (solutionContext) {
    defaultMessage = `I would like to request advice regarding the solution for: ${solutionContext}.`;
  } else if (productContext) {
    defaultMessage = `I would like to request advice or a quote regarding the product: ${productContext}.`;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    const formData = new FormData(e.currentTarget);
    const result = await submitContactForm(formData);
    
    setIsSubmitting(false);
    
    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || "An unexpected error occurred. Please try again.");
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 rounded-full bg-green-100 p-4 dark:bg-green-900/30">
          <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-500" />
        </div>
        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white">Message Sent!</h3>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400 max-w-md">
          Thank you for reaching out. A VetKind representative will be in touch with you shortly.
        </p>
        <button 
          onClick={() => setSuccess(false)}
          className="mt-8 rounded-full border border-zinc-300 bg-white px-6 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-200 dark:bg-red-900/10 dark:border-red-900/30 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Hidden Context Fields */}
      {solutionContext && <input type="hidden" name="solution" value={solutionContext} />}
      {productContext && <input type="hidden" name="product" value={productContext} />}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="firstName" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">First Name *</label>
          <input required type="text" id="firstName" name="firstName" className="w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-3 text-zinc-900 outline-none transition-colors focus:border-green-600 dark:border-zinc-700 dark:text-white dark:focus:border-green-500" placeholder="John" />
        </div>
        <div className="space-y-2">
          <label htmlFor="lastName" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Last Name *</label>
          <input required type="text" id="lastName" name="lastName" className="w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-3 text-zinc-900 outline-none transition-colors focus:border-green-600 dark:border-zinc-700 dark:text-white dark:focus:border-green-500" placeholder="Doe" />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Email Address *</label>
          <input required type="email" id="email" name="email" className="w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-3 text-zinc-900 outline-none transition-colors focus:border-green-600 dark:border-zinc-700 dark:text-white dark:focus:border-green-500" placeholder="john@example.com" />
        </div>
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Phone Number *</label>
          <input required type="tel" id="phone" name="phone" className="w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-3 text-zinc-900 outline-none transition-colors focus:border-green-600 dark:border-zinc-700 dark:text-white dark:focus:border-green-500" placeholder="+1 (555) 000-0000" />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="farmName" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Farm / Company Name</label>
          <input type="text" id="farmName" name="farmName" className="w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-3 text-zinc-900 outline-none transition-colors focus:border-green-600 dark:border-zinc-700 dark:text-white dark:focus:border-green-500" placeholder="Green Valley Farms" />
        </div>
        <div className="space-y-2">
          <label htmlFor="location" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Location (City, Country)</label>
          <input type="text" id="location" name="location" className="w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-3 text-zinc-900 outline-none transition-colors focus:border-green-600 dark:border-zinc-700 dark:text-white dark:focus:border-green-500" placeholder="Auckland, NZ" />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="animalType" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Primary Animal Type</label>
          <select id="animalType" name="animalType" className="w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-3 text-zinc-900 outline-none transition-colors focus:border-green-600 dark:border-zinc-700 dark:text-white dark:focus:border-green-500">
            <option value="">Select an option</option>
            <option value="dairy_cattle">Dairy Cattle</option>
            <option value="beef_cattle">Beef Cattle</option>
            <option value="buffalo">Buffalo</option>
            <option value="poultry">Poultry</option>
            <option value="pets">Pets / Companion Animals</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="herdSize" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Herd / Flock Size</label>
          <select id="herdSize" name="herdSize" className="w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-3 text-zinc-900 outline-none transition-colors focus:border-green-600 dark:border-zinc-700 dark:text-white dark:focus:border-green-500">
            <option value="">Select an option</option>
            <option value="under_50">Under 50</option>
            <option value="50_200">50 - 200</option>
            <option value="200_500">200 - 500</option>
            <option value="over_500">Over 500</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="inquiryType" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Nature of Inquiry *</label>
        <select required id="inquiryType" name="inquiryType" defaultValue={defaultInquiryType} className="w-full rounded-xl border border-zinc-300 bg-transparent px-4 py-3 text-zinc-900 outline-none transition-colors focus:border-green-600 dark:border-zinc-700 dark:text-white dark:focus:border-green-500">
          <option value="general">General Inquiry</option>
          <option value="product">Product Information</option>
          <option value="veterinary">Veterinary Consultation</option>
          <option value="distribution">Distribution / Partnership</option>
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Message *</label>
        <textarea required id="message" name="message" rows={5} defaultValue={defaultMessage} className="w-full resize-none rounded-xl border border-zinc-300 bg-transparent px-4 py-3 text-zinc-900 outline-none transition-colors focus:border-green-600 dark:border-zinc-700 dark:text-white dark:focus:border-green-500" placeholder="How can we help you today?"></textarea>
      </div>

      <div className="flex items-start gap-3">
        <input required type="checkbox" id="consent" name="consent" className="mt-1 h-4 w-4 rounded border-zinc-300 text-green-600 focus:ring-green-600" />
        <label htmlFor="consent" className="text-sm text-zinc-600 dark:text-zinc-400">
          I consent to VetKind processing my personal data for the purpose of handling this inquiry in accordance with the Privacy Policy. *
        </label>
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 py-4 font-bold text-white transition-colors hover:bg-zinc-800 disabled:opacity-70 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
      >
        {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
