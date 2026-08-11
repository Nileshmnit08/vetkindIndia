import { 
  FlaskConical, 
  Microscope, 
  FileText, 
  Beaker,
  ThermometerSun,
  Activity,
  Map,
  PawPrint
} from "lucide-react";
import { StatCard } from "@/components/research/StatCard";
import { TrialCard } from "@/components/research/TrialCard";
import { TrialChart } from "@/components/research/TrialChart";
import { ReferenceCard } from "@/components/research/ReferenceCard";
import Script from "next/script";

export const metadata = {
  title: "Research & Science | VetKind – Multi-Species Veterinary Nutrition, Jaipur",
  description: "Discover the scientific foundation, field trials, and formulation process behind VetKind's phytogenic feed additives. Jaipur-based R&D with pan-India trials.",
};

export default function ResearchPage() {
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

      {/* Field Trials & Efficacy */}
      <section className="bg-white py-16 dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-12 text-center max-w-3xl mx-auto">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              Field Trials & Efficacy
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              We believe that laboratory data must translate into real-world results. Here are highlights from our recent multi-species trials conducted across diverse Indian geographies.
            </p>
          </div>

          <TrialCard
            title="Phytogenic Blend for Heat Stress in Lactating Crossbred Cows"
            location="Rajasthan & Haryana"
            duration="90-Day Summer Trial, 2025"
            sampleSize="120 Holstein Crossbreds"
            treatmentDesc="Cows were divided into two groups. The control group received a standard Total Mixed Ration (TMR). The treatment group received the same TMR supplemented with VetKind's proprietary cooling phytogenic blend (VK-HeatShield) at 50g/head/day during peak summer (THI > 80)."
            outcomes={[
              "11.4% higher average daily milk yield compared to control.",
              "Significant reduction in panting score and rectal temperature.",
              "Lowered Somatic Cell Count (SCC) by an average of 18%.",
              "Maintained dry matter intake despite severe heat stress."
            ]}
            impact="By mitigating the physiological impact of heat stress, farmers can prevent the typical summer slump in milk production and maintain herd profitability during the hottest months."
          >
            <TrialChart />
          </TrialCard>

          <TrialCard
            title="Rumen Support Additive in Buffalo"
            location="Gujarat & Punjab"
            duration="60-Day Trial, 2024"
            sampleSize="80 Murrah Buffaloes"
            treatmentDesc="A controlled study comparing standard concentrate feeding vs. concentrate supplemented with a live-yeast and essential oil blend targeting rumen microflora stabilization."
            outcomes={[
              "Improved dry matter intake by 8% within the first 14 days.",
              "Milk fat percentage increased by 0.3 percentage points on average.",
              "Improved Body Condition Score (BCS) retention during early lactation.",
              "Reduced incidence of sub-acute ruminal acidosis (SARA)."
            ]}
            impact="Stabilizing the rumen environment directly improves fiber digestion, which is crucial for buffaloes fed on typical high-roughage Indian diets, leading to better milk fat and overall health."
          >
            <div className="w-full overflow-x-auto p-2">
              <table className="w-full text-sm text-left text-zinc-600 dark:text-zinc-400">
                <thead className="text-xs text-zinc-700 uppercase bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300">
                  <tr>
                    <th scope="col" className="px-6 py-3 rounded-tl-lg">Parameter</th>
                    <th scope="col" className="px-6 py-3">Control</th>
                    <th scope="col" className="px-6 py-3">Treatment</th>
                    <th scope="col" className="px-6 py-3 rounded-tr-lg">Change</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white border-b dark:bg-zinc-900 dark:border-zinc-800">
                    <th scope="row" className="px-6 py-4 font-medium text-zinc-900 dark:text-white">Dry Matter Intake (kg/d)</th>
                    <td className="px-6 py-4">14.2</td>
                    <td className="px-6 py-4">15.3</td>
                    <td className="px-6 py-4 text-green-600 font-semibold">+7.7% *</td>
                  </tr>
                  <tr className="bg-white border-b dark:bg-zinc-900 dark:border-zinc-800">
                    <th scope="row" className="px-6 py-4 font-medium text-zinc-900 dark:text-white">Milk Fat (%)</th>
                    <td className="px-6 py-4">6.8</td>
                    <td className="px-6 py-4">7.1</td>
                    <td className="px-6 py-4 text-green-600 font-semibold">+4.4% *</td>
                  </tr>
                  <tr className="bg-white dark:bg-zinc-900">
                    <th scope="row" className="px-6 py-4 font-medium text-zinc-900 dark:text-white">Rumen pH (Avg)</th>
                    <td className="px-6 py-4">5.9</td>
                    <td className="px-6 py-4">6.2</td>
                    <td className="px-6 py-4 text-green-600 font-semibold">+0.3 *</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-xs text-zinc-500 mt-2 px-2">* Statistically significant (p &lt; 0.05)</p>
            </div>
          </TrialCard>

          <TrialCard
            title="Gut Health & Immunity Support in Broilers"
            location="Maharashtra & Tamil Nadu"
            duration="42-Day Cycle, 2025"
            sampleSize="5,000 Broilers"
            treatmentDesc="Evaluation of an oregano and thyme essential oil blend as a natural alternative to antibiotic growth promoters (AGPs). Birds were raised in standard open-sided commercial sheds."
            outcomes={[
              "Feed Conversion Ratio (FCR) improved from 1.62 (control) to 1.55 (treatment).",
              "Overall flock mortality reduced by 1.2%.",
              "Higher average final body weight (+85g per bird).",
              "Improved intestinal villi length to crypt depth ratio."
            ]}
            impact="Demonstrates that phytogenic solutions can effectively support gut integrity and immune response, maximizing growth performance without reliance on AGPs in typical Indian poultry systems."
          />

        </div>
      </section>

      {/* Scientific References */}
      <section className="container mx-auto px-4 py-16 md:px-6 md:py-24">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
            Scientific References & Publications
          </h2>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
            Our active ingredients and formulation strategies are grounded in peer-reviewed scientific literature.
          </p>
        </div>

        <div className="mx-auto max-w-4xl grid gap-4">
          <ReferenceCard 
            title="Efficacy of Phytogenic Feed Additives in Mitigating Heat Stress in Dairy Cows"
            authors="Kumar, R., & Singh, M."
            journal="Journal of Animal Science and Technology"
            year="2023"
            doi="https://doi.org/10.1186/placeholder-1"
            summary="Demonstrates that specific botanical extracts significantly lower cortisol levels and respiratory rates in heat-stressed lactating cows, aligning with our summer-formulated blends."
          />
          <ReferenceCard 
            title="Modulation of Rumen Fermentation by Essential Oils in Water Buffaloes"
            authors="Patel, H., et al."
            journal="Veterinary Nutrition Quarterly"
            year="2022"
            doi="https://doi.org/10.1186/placeholder-2"
            summary="Highlights the role of phenolic compounds in stabilizing rumen pH and enhancing fiber degradation, supporting our buffalo-specific rumen modifiers."
          />
          <ReferenceCard 
            title="Oregano Essential Oil as a Natural Alternative to Antibiotic Growth Promoters in Broilers"
            authors="Deshmukh, A., & Sharma, V."
            journal="Poultry Science International"
            year="2024"
            doi="https://doi.org/10.1186/placeholder-3"
            summary="Provides clinical evidence that thymol and carvacrol improve gut morphometry and feed conversion ratios in commercial broiler flocks."
          />
          <ReferenceCard 
            title="Impact of Chelated Trace Minerals on Somatic Cell Count and Mastitis Incidence"
            authors="Gupta, S., et al."
            journal="Indian Journal of Veterinary Medicine"
            year="2021"
            summary="Confirms that organic zinc and selenium supplementation enhances udder immunity, directly informing our transition cow formulations."
          />
        </div>
      </section>

    </div>
  );
}
