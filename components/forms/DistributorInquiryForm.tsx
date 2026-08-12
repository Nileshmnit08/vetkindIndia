"use client";

import { useState } from "react";
import { submitDistributorInquiry } from "@/app/actions/inquiry";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export function DistributorInquiryForm({ user }: { user?: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await submitDistributorInquiry(formData);
      
      if (result.success) {
        setStatus({
          type: 'success',
          message: 'Your application has been received successfully! Our team will contact you shortly.'
        });
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus({
          type: 'error',
          message: result.error || 'Something went wrong. Please try again.'
        });
      }
    } catch (err) {
      setStatus({
        type: 'error',
        message: 'An unexpected error occurred. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status?.type === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CheckCircle2 className="h-16 w-16 text-green-500 mb-6" />
        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
          Application Received
        </h3>
        <p className="text-zinc-600 dark:text-zinc-400 max-w-md">
          {status.message}
        </p>
        <button 
          onClick={() => setStatus(null)} 
          className="mt-8 text-green-600 hover:underline"
        >
          Submit another inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {status?.type === 'error' && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900/50">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <p className="text-sm">{status.message}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">Full Name *</label>
          <input 
            id="name"
            name="name"
            type="text" 
            required 
            defaultValue={user?.name || ''}
            className="w-full h-11 px-4 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
            placeholder="John Doe"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">Email Address *</label>
          <input 
            id="email"
            name="email"
            type="email" 
            required 
            defaultValue={user?.email || ''}
            className="w-full h-11 px-4 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
            placeholder="john@example.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="company" className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">Company / Dealership Name *</label>
          <input 
            id="company"
            name="company"
            type="text" 
            required 
            className="w-full h-11 px-4 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
            placeholder="Agro Vet Supplies"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="phone" className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">Phone Number *</label>
          <input 
            id="phone"
            name="phone"
            type="tel" 
            required 
            className="w-full h-11 px-4 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
            placeholder="+91 98765 43210"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="cityState" className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">City / State *</label>
          <input 
            id="cityState"
            name="cityState"
            type="text" 
            required 
            className="w-full h-11 px-4 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
            placeholder="Jaipur, Rajasthan"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="businessType" className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">Business Type *</label>
          <select 
            id="businessType"
            name="businessType"
            required
            className="w-full h-11 px-4 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
          >
            <option value="">Select Business Type</option>
            <option value="Wholesale Distributor">Wholesale Distributor</option>
            <option value="Retailer / Medical Store">Retailer / Medical Store</option>
            <option value="Veterinary Clinic">Veterinary Clinic</option>
            <option value="Large Farm Operations">Large Farm Operations</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="productsOfInterest" className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">Products of Interest</label>
        <select 
          id="productsOfInterest"
          name="productsOfInterest"
          className="w-full h-11 px-4 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none"
        >
          <option value="">All Categories</option>
          <option value="Dairy Nutrition">Dairy Nutrition</option>
          <option value="Poultry Formulations">Poultry Formulations</option>
          <option value="Small Ruminants">Small Ruminants</option>
          <option value="Aqua Culture">Aqua Culture</option>
          <option value="Phytogenic Extracts">Phytogenic Extracts</option>
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">Additional Information *</label>
        <textarea 
          id="message"
          name="message"
          required
          rows={4}
          className="w-full p-4 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white focus:ring-2 focus:ring-green-500 outline-none resize-y"
          placeholder="Please tell us about your current distribution network, years in business, and any specific requirements..."
        />
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full h-12 flex items-center justify-center gap-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <><Loader2 className="h-5 w-5 animate-spin" /> Submitting Application...</>
        ) : (
          "Submit Application"
        )}
      </button>
    </form>
  );
}
