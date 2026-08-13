import { getResearchArticles } from "@/app/actions/research";
import Link from "next/link";
import { 
  FlaskConical, 
  Microscope, 
  FileText, 
  Beaker,
  ThermometerSun,
  Activity,
  Map,
  PawPrint,
  ChevronRight,
  FileSearch,
  Calendar
} from "lucide-react";
import { StatCard } from "@/components/research/StatCard";
import Script from "next/script";

export const metadata = {
  title: "Research & Science | VetKind – Multi-Species Veterinary Nutrition, Jaipur",
  description: "Discover the scientific foundation, field trials, and formulation process behind VetKind's phytogenic feed additives. Jaipur-based R&D with pan-India trials.",
};

export default async function ResearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const resolvedParams = await searchParams;
  const articlesResponse = await getResearchArticles(undefined, undefined, "PUBLISHED");
  const articles = articlesResponse.success ? articlesResponse.data || [] : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "VetKind",
    "description": "Evidence-Based Veterinary Nutrition and Phytogenic Solutions",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Jaipur",
      "addressRegion": "Rajasthan",
      "addressCountry": "IN"
    },
    "department": {
      "@type": "Organization",
      "name": "Research & Development"
    }
  };

  return (
    <div className="flex min-h-screen flex-col font-sans bg-zinc-50 dark:bg-zinc-950">
      <Script
        id="research-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-zinc-900 py-20 text-white md:py-32">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-700/30 via-zinc-900 to-zinc-950" />
        </div>
        <div className="container relative z-10 mx-auto px-4 text-center md:px-6 max-w-4xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800 text-zinc-300 border border-zinc-700">
            <Microscope className="h-8 w-8" />
          </div>
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Evidence-Based <span className="text-green-400">Veterinary Nutrition</span>
          </h1>
          <p className="mx-auto text-xl text-zinc-400 max-w-3xl leading-relaxed">
            VetKind’s R&D centre in Jaipur designs phytogenic nutrition solutions for Indian dairy, small ruminants, and poultry. Our formulations are validated through multi-state field trials under real farm conditions across India.
          </p>
        </div>
      </section>

      {/* Research Scope & Stats */}
      <section className="container mx-auto px-4 py-12 md:px-6 md:py-16 -mt-10 relative z-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard number="4+" label="Species Validated" icon={PawPrint} />
          <StatCard number="6+" label="Indian States" icon={Map} />
          <StatCard number="20+" label="Partner Farms" icon={Activity} />
          <StatCard number="10+" label="Active Phytogenics" icon={ThermometerSun} />
        </div>
      </section>

      {/* The Formulation Process */}
      <section className="container mx-auto px-4 py-12 md:px-6 md:pb-24">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            The Formulation Process
          </h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            From theoretical design to commercial production, every VetKind product undergoes a strict, multi-stage development cycle optimized for Indian conditions.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-4">
          {[
            {
              num: "01",
              title: "Literature & Context",
              desc: "Analyzing global nutritional research and identifying unique constraints in Indian farming, such as water scarcity, heat stress, and varying roughage quality.",
              icon: FileText
            },
            {
              num: "02",
              title: "Prototype Design",
              desc: "Formulating the active phytogenic matrix to maximize bioavailability and stability in our Jaipur R&D facility.",
              icon: FlaskConical
            },
            {
              num: "03",
              title: "Lab Validation",
              desc: "Rigorous in-vitro testing to ensure shelf-life, solubility, and resilience under typical high-temperature Indian climates.",
              icon: Beaker
            },
            {
              num: "04",
              title: "Field Trials",
              desc: "Controlled in-vivo testing on commercial Indian farms to validate efficacy against control groups under standard management practices.",
              icon: Microscope
            }
          ].map((step, idx) => (
            <div key={idx} className="relative rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <span className="absolute -top-5 left-8 text-5xl font-extrabold text-zinc-100 dark:text-zinc-800/50">
                {step.num}
              </span>
              <div className="relative z-10">
                <step.icon className="mb-4 h-8 w-8 text-green-600 dark:text-green-500" />
                <h3 className="mb-2 text-xl font-bold text-zinc-900 dark:text-white">{step.title}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Published Research & Field Trials */}
      <section className="bg-white py-16 dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12 text-center max-w-3xl mx-auto">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              Published Research & Field Trials
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              We believe that laboratory data must translate into real-world results. Explore our recent multi-species trials conducted across diverse Indian geographies.
            </p>
          </div>

          {articles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center rounded-3xl border border-dashed border-zinc-300 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-800">
                <FileSearch className="h-10 w-10" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-white">
                No research articles published yet
              </h2>
              <p className="max-w-md text-zinc-500 dark:text-zinc-400">
                Our R&D team is constantly working on new trials and formulations. Check back soon for our latest findings.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article: any) => (
                <Link key={article.id} href={`/research/${article.slug}`} className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm border border-zinc-200 transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-zinc-900 dark:border-zinc-800">
                  <div className="relative aspect-video bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                    {article.coverImage ? (
                      <img src={article.coverImage} alt={article.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-700">
                        <Microscope className="h-10 w-10" />
                      </div>
                    )}
                    {article.category && (
                      <div className="absolute top-4 left-4 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold text-zinc-900 shadow-sm dark:bg-zinc-900/90 dark:text-zinc-100">
                        {article.category}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="mb-3 text-xl font-bold text-zinc-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="mb-6 flex-1 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-zinc-500 border-t border-zinc-100 pt-4 dark:border-zinc-800">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="flex items-center font-semibold text-green-600 dark:text-green-400">
                        Read <ChevronRight className="ml-0.5 h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
  );
}
