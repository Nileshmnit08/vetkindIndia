// @ts-nocheck
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  FlaskConical,
  Stethoscope,
  Users,
  Award,
  ChevronRight,
  Beef,
  Bird,
  Dog,
  Wheat,
  Activity,
  Droplet,
  Heart,
  Thermometer,
  Zap,
  CheckCircle2,
} from "lucide-react";
import { getProducts, getFilterOptions } from "@/lib/products";
import { getSolutions } from "@/app/actions/solutions";
import { getKnowledgeArticles } from "@/app/actions/knowledge";
import { ProductCard } from "@/components/products/ProductCard";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { getSpeciesTaxonomyMeta } from "@/lib/constants/taxonomy";


export default async function Home() {
  const [{ data: bestSellingProducts }, { data: featuredProducts }, filterOptions] = await Promise.all([
    getProducts({ sortBy: 'popular', limit: 4 }),
    getProducts({ sortBy: 'featured', limit: 3 }),
    getFilterOptions()
  ]);
  const activeSpecies = filterOptions.species || [];
  
  const solutionsResponse = await getSolutions(undefined, "PUBLISHED");
  const solutions = solutionsResponse.success ? solutionsResponse.data || [] : [];
  
  const articlesResponse = await getKnowledgeArticles(undefined, undefined, "PUBLISHED");
  const articles = articlesResponse.success ? articlesResponse.data || [] : [];
  return (
    <div className="flex min-h-screen flex-col font-sans">


      <main className="flex-1">
        {/* SECTION 1 — HERO */}
        <section className="relative overflow-hidden bg-zinc-50 pt-16 pb-24 dark:bg-zinc-950 md:pt-24 md:pb-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
              <div className="flex flex-col justify-center space-y-8">
                <div className="space-y-4">
                  <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl xl:text-6xl/none">
                    Smarter Animal Health. <br />
                    <span className="text-green-600 dark:text-green-500">Better Dairy Performance.</span>
                  </h1>
                  <p className="max-w-[600px] text-lg text-zinc-600 dark:text-zinc-400 md:text-xl/relaxed">
                    Science-backed veterinary nutrition and phytogenic solutions designed for healthier animals and more productive farms.
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/products"
                    className="inline-flex h-12 items-center justify-center rounded-full bg-green-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                  >
                    Explore Products
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-200 bg-white px-8 text-sm font-medium text-zinc-900 shadow-sm transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-800"
                  >
                    Talk to an Expert
                  </Link>
                </div>
              </div>
              <div className="relative mx-auto w-full max-w-[600px] lg:max-w-none aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/hero.png"
                  alt="Healthy dairy cows in a modern farm"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2 — TRUST BAR */}
        <section className="border-y border-zinc-200 bg-white py-8 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5 md:gap-8">
              {[
                { icon: FlaskConical, label: "Science Backed" },
                { icon: ShieldCheck, label: "Quality Assured" },
                { icon: Award, label: "Research Driven" },
                { icon: Stethoscope, label: "Veterinary Expertise" },
                { icon: Users, label: "Farmer Focused" },
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center justify-center space-y-2 text-center group">
                  <div className="rounded-full bg-green-50 p-3 text-green-600 transition-colors group-hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:group-hover:bg-green-900/40">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3 — EXPLORE BY ANIMAL */}
        <section id="categories" className="py-16 md:py-24 bg-zinc-50 dark:bg-zinc-950">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-10 flex flex-col items-center justify-center text-center">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                Explore by Animal
              </h2>
              <p className="mt-4 max-w-[700px] text-zinc-600 dark:text-zinc-400">
                Targeted nutritional solutions designed for specific species requirements.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
              {activeSpecies.slice(0, 5).map((category: any, index: number) => {
                const { icon: Icon, color, bg } = getSpeciesTaxonomyMeta(category.slug);
                return (
                  <Link
                    key={index}
                    href={`/products?species=${category.slug}`}
                    className="group flex flex-col items-center justify-center rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-green-500 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-green-500"
                  >
                    <div className={`mb-4 rounded-full p-4 transition-transform group-hover:scale-110 ${bg} ${color}`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                      {category.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION 4 — BEST SELLING PRODUCTS */}
        <section id="products" className="py-16 md:py-24 bg-white dark:bg-zinc-900">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                  Best Selling Products
                </h2>
                <p className="mt-4 max-w-[700px] text-zinc-600 dark:text-zinc-400">
                  Our most trusted formulas, proven to deliver results on farms worldwide.
                </p>
              </div>
              <Link href="/products" className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300">
                View all products <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {bestSellingProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5 — SOLUTIONS BY NEED */}
        <section id="solutions" className="py-16 md:py-24 bg-zinc-50 dark:bg-zinc-950">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                Solutions by Need
              </h2>
              <p className="mt-4 max-w-[700px] mx-auto text-zinc-600 dark:text-zinc-400">
                Find the right nutritional support for specific health challenges.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {solutions.filter(s => s.featured).slice(0, 8).map((solution) => (
                <Link
                  key={solution.id}
                  href={`/solutions/${solution.slug}`}
                  className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-green-500 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <div className="mb-4 inline-flex rounded-lg bg-green-50 p-3 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                    <DynamicIcon name={solution.iconName} className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-900 group-hover:text-green-600 dark:text-zinc-100 dark:group-hover:text-green-400 transition-colors">
                    {solution.title}
                  </h3>
                  <div className="absolute right-4 bottom-4 opacity-0 transition-all group-hover:opacity-100">
                    <ArrowRight className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 6 — WHY VETKIND */}
        <section className="py-16 md:py-24 bg-white dark:bg-zinc-900">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl mb-6">
                  Why Choose VetKind?
                </h2>
                <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
                  We bridge the gap between advanced veterinary science and practical farm management, delivering solutions that genuinely improve animal welfare and farm profitability.
                </p>
                <div className="grid gap-6 sm:grid-cols-2">
                  {[
                    "Science-backed formulations",
                    "Quality-controlled manufacturing",
                    "Research & field validation",
                    "Veterinary expertise",
                    "Farmer-centric solutions",
                    "Transparent product info",
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="mt-1 flex-shrink-0 rounded-full bg-green-100 p-1 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <span className="font-medium text-zinc-800 dark:text-zinc-200">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative aspect-square md:aspect-[4/3] lg:aspect-square overflow-hidden rounded-3xl bg-zinc-100 dark:bg-zinc-800">
                {/* Fallback image representing trust/science if hero isn't reused */}
                <Image
                  src="/hero.png"
                  alt="VetKind scientific approach"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-green-900/20 mix-blend-multiply"></div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 7 — OUR APPROACH */}
        <section className="py-16 md:py-24 bg-green-50 dark:bg-green-950/20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                Our Approach
              </h2>
              <p className="mt-4 max-w-[700px] mx-auto text-zinc-600 dark:text-zinc-400">
                A rigorous three-step process ensures every VetKind product delivers on its promise.
              </p>
            </div>
            <div className="relative grid gap-8 md:grid-cols-3">
              {/* Connector line for desktop */}
              <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-green-200 dark:bg-green-800/50 -z-10"></div>
              
              {[
                { step: "01", title: "Research", desc: "Identifying specific nutritional gaps and health challenges on modern farms." },
                { step: "02", title: "Formulate", desc: "Developing precise, synergistic blends of vitamins, minerals, and phytogenics." },
                { step: "03", title: "Validate", desc: "Rigorous field testing to ensure efficacy, safety, and return on investment." },
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center text-center relative z-10">
                  <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-green-100 text-3xl font-bold text-green-700 shadow-xl dark:border-zinc-950 dark:bg-green-900 dark:text-green-300">
                    {item.step}
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-zinc-900 dark:text-zinc-100">{item.title}</h3>
                  <p className="text-zinc-600 dark:text-zinc-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 8 — FEATURED PRODUCTS */}
        <section className="py-16 md:py-24 bg-zinc-50 dark:bg-zinc-950">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-10">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                Featured Products
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 9 — KNOWLEDGE CENTRE */}
        <section className="py-16 md:py-24 bg-white dark:bg-zinc-900">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                  Knowledge Centre
                </h2>
                <p className="mt-4 max-w-[700px] text-zinc-600 dark:text-zinc-400">
                  Insights, research, and best practices from our veterinary experts.
                </p>
              </div>
              <Link href="/knowledge" className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300">
                View all articles <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {articles.slice(0, 3).map((article) => (
                <Link key={article.id} href={`/knowledge/${article.slug}`} className="group flex flex-col">
                  <div className="relative mb-4 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800">
                    <div className="absolute inset-0 bg-green-900/10 transition-colors group-hover:bg-transparent z-10"></div>
                    {article.coverImage ? (
                      <Image 
                        src={article.coverImage} 
                        alt={article.title} 
                        fill 
                        className="object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-zinc-400">
                        <BookOpenIcon />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 mb-2">
                    {article.category && <span className="font-semibold text-green-600 dark:text-green-400">{article.category}</span>}
                    {article.category && <span>•</span>}
                    <span>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    {article.readTime && <span>•</span>}
                    {article.readTime && <span>{article.readTime}</span>}
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 group-hover:text-green-600 dark:text-zinc-100 dark:group-hover:text-green-400 transition-colors">
                    {article.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 10 — CTA */}
        <section className="py-20 md:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-green-600 dark:bg-green-900"></div>
          <div className="absolute inset-0 bg-[url('/hero.png')] bg-cover bg-center opacity-20 mix-blend-multiply"></div>
          <div className="container relative z-10 mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl mb-6">
              Need help choosing the right solution?
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-green-50 mb-10">
              Our team of veterinary nutritionists is ready to help you optimize your herd&apos;s health and productivity.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/contact" className="inline-flex h-12 items-center justify-center rounded-full bg-white px-8 text-sm font-bold text-green-700 shadow-lg transition-transform hover:scale-105">
                Talk to Veterinary Expert
              </Link>
              <Link href="/products" className="inline-flex h-12 items-center justify-center rounded-full border-2 border-white bg-transparent px-8 text-sm font-bold text-white shadow-lg transition-colors hover:bg-white/10">
                Explore Products
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

// Temporary icon component for articles without images
function BookOpenIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  );
}
