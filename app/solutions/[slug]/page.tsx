import { getSolutionBySlug } from "@/app/actions/solutions";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, CheckCircle2, MessageCircle } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import { getProducts } from "@/lib/products";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const solution = await getSolutionBySlug(resolvedParams.slug);
  
  if (!solution) {
    return { title: 'Solution Not Found | VetKind' };
  }

  return {
    title: solution.seoTitle || `${solution.title} Solutions | VetKind`,
    description: solution.seoDescription || solution.shortSummary,
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
  
  // Parse JSON fields
  let benefitsList: string[] = [];
  try {
    if (solution.benefits) benefitsList = JSON.parse(solution.benefits);
  } catch(e) {}
  
  let relatedProductIds: string[] = [];
  try {
    if (solution.relatedProducts) relatedProductIds = JSON.parse(solution.relatedProducts);
  } catch(e) {}

  // Fetch actual products based on IDs (Mocking fetching them from lib for now, but in reality you'd fetch from DB)
  // For the sake of this implementation, we will fetch top products if no related products exist
  const productsRes = await getProducts({ limit: 4 });
  const products = relatedProductIds.length > 0 
    ? productsRes.data.filter(p => relatedProductIds.includes(p.id)) 
    : productsRes.data.slice(0, 4);

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
              {solution.title}
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-zinc-900 py-16 md:py-24">
        {solution.heroImage && (
          <div className="absolute inset-0 z-0">
            <Image 
              src={solution.heroImage} 
              alt={solution.title} 
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
              {solution.title}
            </h1>
            <p className="text-xl text-zinc-300 leading-relaxed max-w-2xl">
              {solution.shortSummary}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="container mx-auto px-4 py-12 md:px-6 md:py-20">
        <div className="grid gap-12 lg:grid-cols-3">
          
          {/* Left Content Area (2/3) */}
          <div className="lg:col-span-2 space-y-16">
            
            {/* Full Content */}
            {solution.fullContent && (
              <section className="prose prose-zinc max-w-none dark:prose-invert">
                <div dangerouslySetInnerHTML={{ __html: solution.fullContent.replace(/\n/g, '<br/>') }} />
              </section>
            )}

            {/* Benefits */}
            {benefitsList && benefitsList.length > 0 && (
              <section>
                <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-white">Key Benefits & Considerations</h2>
                <ul className="space-y-4">
                  {benefitsList.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <CheckCircle2 className="mt-1 h-6 w-6 shrink-0 text-green-600 dark:text-green-500" />
                      <span className="text-lg text-zinc-700 dark:text-zinc-300">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            
          </div>

          {/* Right Sidebar Area (1/3) */}
          <div className="space-y-8 lg:sticky lg:top-8 h-fit">
            
            {/* Expert Consultation Box */}
            <div className="rounded-2xl bg-zinc-900 p-6 text-white shadow-xl">
              <h3 className="mb-2 text-xl font-bold">Need Veterinary Advice?</h3>
              <p className="mb-6 text-zinc-400 text-sm">
                Discuss {solution.title.toLowerCase()} challenges with our animal health experts for a tailored management protocol.
              </p>
              <Link href={`/contact?solution=${solution.slug}`} className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 py-3.5 font-bold transition-colors hover:bg-green-500">
                <MessageCircle className="h-5 w-5" /> Talk to an Expert
              </Link>
            </div>
            
          </div>
        </div>
      </div>

      {/* Recommended Products Section */}
      {products && products.length > 0 ? (
        <section className="border-t border-zinc-200 bg-white py-16 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                  Recommended Products for {solution.title}
                </h2>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400 max-w-2xl">
                  Science-backed nutritional formulations specifically designed to address these challenges and improve outcomes.
                </p>
              </div>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

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
