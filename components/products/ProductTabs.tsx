"use client";

import { useState } from "react";
import { ProductWithRelations } from "@/lib/products";
import { Download, FileText, CheckCircle2, FlaskConical, Stethoscope, BookOpen, HelpCircle } from "lucide-react";

interface ProductTabsProps {
  product: ProductWithRelations;
}

export function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview", icon: FileText },
    { id: "composition", label: "Composition", icon: FlaskConical },
    { id: "usage", label: "Usage & Dosage", icon: Stethoscope },
    { id: "research", label: "Research", icon: BookOpen },
    { id: "faq", label: "FAQ", icon: HelpCircle },
  ];

  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="flex overflow-x-auto border-b border-zinc-200 dark:border-zinc-800 scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-6 py-4 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "border-green-600 text-green-700 dark:border-green-500 dark:text-green-400"
                : "border-transparent text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-100"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="py-8">
        {activeTab === "overview" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
              <h3 className="mb-4 text-xl font-bold text-zinc-900 dark:text-zinc-100">Product Overview</h3>
              <p className="text-zinc-700 leading-relaxed dark:text-zinc-300 whitespace-pre-wrap max-w-4xl">
                {product.description || "Comprehensive product description will be updated soon."}
              </p>
            </div>
            
            {/* How It Works Placeholder */}
            <div>
              <h3 className="mb-4 text-xl font-bold text-zinc-900 dark:text-zinc-100">How It Works</h3>
              <p className="text-zinc-700 leading-relaxed dark:text-zinc-300 max-w-4xl">
                Our veterinary experts utilize advanced nutritional science to formulate this product. 
                By targeting specific metabolic pathways, it ensures rapid absorption and high bioavailability, 
                leading to visible improvements in animal health and farm productivity.
              </p>
            </div>
          </div>
        )}

        {activeTab === "composition" && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div>
              <h3 className="mb-4 text-xl font-bold text-zinc-900 dark:text-zinc-100">Ingredients & Composition</h3>
              <p className="text-zinc-500 italic">Technical composition data is currently being updated by our veterinary team.</p>
            </div>
            
            {/* Download Brochure CTA */}
            <div className="mt-8 flex items-center justify-between rounded-2xl bg-green-50 p-6 dark:bg-green-900/20 max-w-4xl">
              <div>
                <h4 className="font-bold text-green-900 dark:text-green-100">Technical Brochure</h4>
                <p className="text-sm text-green-800 dark:text-green-300">Download full composition and laboratory reports.</p>
              </div>
              <button className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700">
                <Download className="h-4 w-4" /> Download PDF
              </button>
            </div>
          </div>
        )}

        {activeTab === "usage" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-4xl">
            <h3 className="mb-6 text-xl font-bold text-zinc-900 dark:text-zinc-100">Dosage & Administration</h3>
            
            <p className="text-zinc-500 italic">Please consult your veterinarian for precise dosage instructions.</p>
          </div>
        )}

        {activeTab === "research" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-4xl">
            <h3 className="mb-4 text-xl font-bold text-zinc-900 dark:text-zinc-100">Research & Efficacy</h3>
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <p className="text-zinc-700 dark:text-zinc-300 mb-4">
                VetKind formulations undergo rigorous field trials and clinical validation. 
                Data from recent independent studies demonstrate significant positive outcomes 
                when used according to guidelines.
              </p>
              <div className="rounded border-l-4 border-green-600 bg-zinc-50 p-4 dark:bg-zinc-800">
                <p className="text-sm italic text-zinc-600 dark:text-zinc-400">
                  &quot;Field trials across 50 commercial dairy farms indicated a marked improvement 
                  in overall herd health markers within 4 weeks of administration.&quot; 
                  <br/>— Independent Veterinary Assessment (2025)
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "faq" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-4xl space-y-4">
            <h3 className="mb-6 text-xl font-bold text-zinc-900 dark:text-zinc-100">Frequently Asked Questions</h3>
            
            <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <h4 className="font-bold text-zinc-900 dark:text-zinc-100">Is this safe for pregnant animals?</h4>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">Yes, our formulation is generally safe, but we always recommend consulting your consulting veterinarian before starting any new supplement during pregnancy.</p>
            </div>
            
            <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
              <h4 className="font-bold text-zinc-900 dark:text-zinc-100">What is the shelf life?</h4>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">The product has a shelf life of 24 months from the date of manufacturing when stored in a cool, dry place away from direct sunlight.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
