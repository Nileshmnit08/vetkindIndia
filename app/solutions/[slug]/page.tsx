import { getSolutionBySlug } from "@/lib/solutions";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ArrowRight, CheckCircle2, AlertTriangle, BookOpen, MessageCircle } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const solution = await getSolutionBySlug(resolvedParams.slug);
  
  if (!solution) {
    return { title: 'Solution Not Found | VetKind' };
  }

  return {
    title: solution.seo_title || `${solution.name} Solutions | VetKind`,
    description: solution.seo_description || solution.problem_explanation,
  };
}

export default async function SolutionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const resolvedParams = await params;
  const solution = await getSolutionBySlug(resolvedParams.slug);

  if (!solution) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col font-sans bg-zinc-50 dark:bg-zinc-950">
      
      {/* Breadcrumb Header */}
      <div className="bg-white py-4 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/solutions" className="hover:text-green-600 transition-colors">Solutions</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-zinc-900 dark:text-zinc-100 font-medium">
              {solution.name}
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-zinc-900 py-16 md:py-24">
        {solution.hero_image_url && (
          <div className="absolute inset-0 z-0">
            <Image 
              src={solution.hero_image_url} 
              alt={solution.name} 
              fill 
              className="object-cover opacity-40 mix-blend-overlay"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-900/80 to-transparent" />
          </div>
        )}
        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <div className="max-w-3xl">
            <span className="mb-4 inline-block rounded-full bg-green-500/20 px-4 py-1.5 text-sm font-bold tracking-wider text-green-400 border border-green-500/30">
              VETKIND SOLUTION
            </span>
            <h1 className="mb-6 text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl leading-tight">
              {solution.hero_headline}
            </h1>
            <p className="text-xl text-zinc-300 leading-relaxed max-w-2xl">
              {solution.problem_explanation}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="container mx-auto px-4 py-12 md:px-6 md:py-20">
        <div className="grid gap-12 lg:grid-cols-3">
          
          {/* Left Content Area (2/3) */}
          <div className="lg:col-span-2 space-y-16">
            
            {/* Common Signs & Diagnosis */}
            {solution.common_signs && solution.common_signs.length > 0 && (
              <section>
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-500">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Common Signs to Watch For</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {solution.common_signs.map((sign, idx) => (
                    <div key={idx} className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                      <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-amber-500" />
                      <span className="text-zinc-700 dark:text-zinc-300">{sign}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Management Considerations */}
            {solution.management_considerations && solution.management_considerations.length > 0 && (
              <section>
                <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white">Nutritional & Management Considerations</h2>
                <ul className="space-y-4">
                  {solution.management_considerations.map((consideration, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-green-600 dark:text-green-500" />
                      <span className="text-lg text-zinc-700 dark:text-zinc-300">{consideration}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* VetKind Approach */}
            <section className="rounded-3xl bg-green-50 p-8 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30">
              <h2 className="mb-4 text-2xl font-bold text-green-950 dark:text-green-50">The VetKind Approach</h2>
              <p className="text-lg leading-relaxed text-green-900 dark:text-green-100/80">
                {solution.vetkind_approach}
              </p>
            </section>
            
            {/* FAQ */}
            {solution.faqs && solution.faqs.length > 0 && (
              <section>
                <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {solution.faqs.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)).map((faq) => (
                    <div key={faq.id} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                      <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100">{faq.question}</h3>
                      <p className="mt-2 text-zinc-600 dark:text-zinc-400 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* Right Sidebar Area (1/3) */}
          <div className="space-y-8 lg:sticky lg:top-8 h-fit">
            
            {/* Expert Consultation Box */}
            <div className="rounded-2xl bg-zinc-900 p-6 text-white shadow-xl">
              <h3 className="mb-2 text-xl font-bold">Need Veterinary Advice?</h3>
              <p className="mb-6 text-zinc-400 text-sm">
                Discuss {solution.name.toLowerCase()} challenges with our animal health experts for a tailored management protocol.
              </p>
              <Link href={`/contact?solution=${solution.slug}`} className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3.5 font-bold transition-colors hover:bg-green-500">
                <MessageCircle className="h-5 w-5" /> Talk to an Expert
              </Link>
            </div>

            {/* Related Knowledge Articles */}
            {solution.articles && solution.articles.length > 0 && (
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="mb-4 flex items-center gap-2 font-bold text-zinc-900 dark:text-white">
                  <BookOpen className="h-5 w-5 text-green-600" />
                  <h3>Knowledge Center</h3>
                </div>
                <div className="space-y-4">
                  {solution.articles.map((article) => (
                    <Link key={article.id} href={`/knowledge/${article.slug}`} className="group block">
                      <h4 className="font-semibold text-zinc-800 group-hover:text-green-600 dark:text-zinc-200 dark:group-hover:text-green-400 transition-colors line-clamp-2">
                        {article.title}
                      </h4>
                      <p className="mt-1 text-sm text-zinc-500 line-clamp-2">{article.excerpt}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>

      {/* Recommended Products Section */}
      {solution.products && solution.products.length > 0 ? (
        <section className="border-t border-zinc-200 bg-white py-16 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                  Recommended Products for {solution.name}
                </h2>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400 max-w-2xl">
                  Science-backed nutritional formulations specifically designed to address these challenges and improve outcomes.
                </p>
              </div>
              <Link href="/products" className="inline-flex items-center text-sm font-bold text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300">
                View all products <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {solution.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="border-t border-zinc-200 bg-white py-16 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Recommended Products for {solution.name}
            </h2>
            <div className="mx-auto max-w-2xl rounded-2xl border border-zinc-200 bg-zinc-50 p-8 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="mb-6 text-lg text-zinc-600 dark:text-zinc-400">
                We are currently developing specific product formulations for {solution.name.toLowerCase()}. 
                Our veterinary team can provide personalized recommendations for your herd based on our existing catalogue or custom solutions.
              </p>
              <Link href={`/contact?solution=${solution.slug}`} className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-bold text-white transition-colors hover:bg-green-700">
                <MessageCircle className="h-5 w-5" /> Speak with an expert for a recommendation
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Veterinary Disclaimer */}
      <section className="bg-zinc-100 py-8 dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 md:px-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          <p>
            <strong>Disclaimer:</strong> The information provided on this page is for educational purposes only. 
            It does not replace diagnosis, treatment advice, or consultation from a qualified veterinarian. 
            Always consult your vet before making major changes to your herd&apos;s nutritional or health management protocol.
          </p>
        </div>
      </section>

    </div>
  );
}
