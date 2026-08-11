import { ShieldCheck, CheckCircle2, Award, ClipboardCheck } from "lucide-react";

export const metadata = {
  title: "Quality Assurance | VetKind",
  description: "Learn about VetKind's stringent quality control, raw material testing, and manufacturing standards.",
};

export default function QualityPage() {
  return (
    <div className="flex min-h-screen flex-col font-sans bg-zinc-50 dark:bg-zinc-950">
      
      {/* Hero Section */}
      <section className="bg-white py-20 dark:bg-zinc-900 md:py-32 border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 text-center md:px-6 max-w-4xl">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-500">
            <ShieldCheck className="h-10 w-10" />
          </div>
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-5xl lg:text-6xl">
            Uncompromising <span className="text-green-600 dark:text-green-500">Quality Assurance</span>
          </h1>
          <p className="mx-auto text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
            From raw material sourcing to final batch release, every VetKind product is backed by stringent quality control measures to ensure safety, purity, and efficacy.
          </p>
        </div>
      </section>

      {/* Quality Philosophy & Ridhi Sidhi Laboratories */}
      <section className="container mx-auto px-4 py-16 md:px-6 md:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <h2 className="mb-6 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              Our Quality Philosophy
            </h2>
            <div className="prose prose-lg text-zinc-700 dark:text-zinc-300">
              <p className="mb-4">
                We believe that the effectiveness of any veterinary solution is inherently tied to the purity of its ingredients. There are no shortcuts in our manufacturing process.
              </p>
              <p className="mb-6">
                Our quality architecture is built on three pillars: rigorous vendor vetting, advanced analytical testing, and continuous process monitoring.
              </p>
            </div>
            
            <div className="rounded-2xl bg-zinc-900 p-8 text-white shadow-xl dark:bg-zinc-800">
              <h3 className="mb-3 text-2xl font-bold flex items-center gap-3">
                <ClipboardCheck className="h-6 w-6 text-green-400" />
                Ridhi Sidhi Laboratories
              </h3>
              <p className="text-zinc-300">
                All VetKind formulations are meticulously analyzed in partnership with Ridhi Sidhi Laboratories. 
                This advanced testing infrastructure ensures that our raw materials and finished products meet the highest industry standards for potency and safety.
              </p>
            </div>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2">
            {[
              { title: "Raw Material Testing", desc: "Every batch of raw ingredients is tested for active compounds, heavy metals, and microbiological contaminants before entering the facility." },
              { title: "In-Process QC", desc: "Continuous monitoring during blending and formulation to guarantee homogeneous mixing and stability." },
              { title: "Finished Batch Release", desc: "Final products undergo strict analytical assays to verify label claims and ensure zero degradation." },
              { title: "Traceability", desc: "End-to-end barcode tracking allows us to trace any finished product back to its exact raw material source." }
            ].map((item, idx) => (
              <div key={idx} className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <CheckCircle2 className="mb-4 h-8 w-8 text-green-600 dark:text-green-500" />
                <h4 className="mb-2 font-bold text-zinc-900 dark:text-zinc-100">{item.title}</h4>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications & Compliance */}
      <section className="bg-zinc-100 py-16 dark:bg-zinc-900/50 md:py-24 border-t border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              Certifications & Compliance
            </h2>
            <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              We adhere strictly to local and international manufacturing standards.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-4 max-w-5xl mx-auto">
            {/* Placeholders for Certifications */}
            {[1, 2, 3, 4].map((cert) => (
              <div key={cert} className="flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-zinc-200 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
                <Award className="h-12 w-12 text-zinc-300 dark:text-zinc-700 mb-4" />
                <h4 className="font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                  [Placeholder Certification {cert}]
                </h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  [e.g. GMP Certified, ISO 9001:2015, FSSAI]
                </p>
              </div>
            ))}
          </div>
          
          <div className="mt-12 max-w-3xl mx-auto text-center">
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-6 dark:bg-amber-900/10 dark:border-amber-900/30">
              <p className="text-sm text-amber-800 dark:text-amber-400">
                <strong>Note:</strong> Exact certification badges and licensing numbers will be updated here once verified documentation is finalized.
              </p>
            </div>
          </div>
          
        </div>
      </section>

    </div>
  );
}
