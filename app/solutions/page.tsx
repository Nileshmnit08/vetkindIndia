import { getSolutions } from "@/app/actions/solutions";
import Link from "next/link";
import { ArrowRight, SearchX } from "lucide-react";
import { SolutionsToolbar } from "@/components/solutions/SolutionsToolbar";
import { SolutionsFilters } from "@/components/solutions/SolutionsFilters";
import { MobileSolutionFilters } from "@/components/solutions/MobileSolutionFilters";
import { DynamicIcon } from "@/components/ui/DynamicIcon";

export const metadata = {
  title: "Veterinary Solutions | VetKind",
  description: "Explore our problem-based nutritional and veterinary solutions for dairy, poultry, and companion animals.",
};

export default async function SolutionsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const resolvedParams = await searchParams;
  const solutionsResponse = await getSolutions(undefined, "PUBLISHED");
  const solutions = solutionsResponse.success ? solutionsResponse.data || [] : [];

  // Apply search and filter
  let filteredSolutions = solutions;
  
  if (resolvedParams.search) {
    const q = resolvedParams.search.toLowerCase();
    filteredSolutions = filteredSolutions.filter((s: any) => 
      s.title.toLowerCase().includes(q) || 
      (s.shortSummary && s.shortSummary.toLowerCase().includes(q))
    );
  }

  // Animal type filter (basic mock mapping since DB doesn't have animal_species for solutions directly yet)
  // For this catalogue, we'll assume solutions with products of a certain species match that species
  if (resolvedParams.species) {
    // const species = resolvedParams.species;
    // Currently disabled because species relation is removed from Product schema
  }

  return (
    <div className="flex min-h-screen flex-col font-sans bg-zinc-50 dark:bg-zinc-950">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-green-900 py-20 text-white md:py-32">
        <div className="absolute inset-0 z-0 opacity-20 mix-blend-overlay">
          {/* Subtle pattern or image could go here */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-400/20 via-transparent to-transparent" />
        </div>
        <div className="container relative z-10 mx-auto px-4 md:px-6 text-center max-w-4xl">
          <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Targeted Solutions for <span className="text-green-300">Peak Performance</span>
          </h1>
          <p className="mx-auto text-xl text-green-100 max-w-2xl leading-relaxed">
            Browse our comprehensive guides and tailored nutritional approaches to solve the most common challenges in animal health and dairy production.
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8 md:px-6 md:py-12 flex-1">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          
          <MobileSolutionFilters />

          {/* Sidebar */}
          <aside className="hidden lg:block space-y-8">
            <SolutionsFilters />
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <SolutionsToolbar totalCount={filteredSolutions.length} />
            
            {filteredSolutions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="mb-4 rounded-full bg-zinc-100 p-4 dark:bg-zinc-800">
                  <SearchX className="h-8 w-8 text-zinc-400" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white">No solutions found</h3>
                <p className="mt-2 text-zinc-500 dark:text-zinc-400">
                  Try adjusting your filters or search term to find what you&apos;re looking for.
                </p>
              </div>
            ) : (
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                {filteredSolutions.map((solution: any) => {
                  return (
                    <Link 
                      key={solution.id} 
                      href={`/solutions/${solution.slug}`}
                      className="group flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-green-900/5 dark:border-zinc-800 dark:bg-zinc-900"
                    >
                      <div>
                        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-green-50 text-green-600 transition-colors group-hover:bg-green-600 group-hover:text-white dark:bg-zinc-800 dark:text-green-400 dark:group-hover:bg-green-600">
                          <DynamicIcon name={solution.iconName} className="h-7 w-7" />
                        </div>
                        <h2 className="mb-3 text-xl font-bold text-zinc-900 dark:text-white">
                          {solution.title}
                        </h2>
                        <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">
                          {solution.shortSummary}
                        </p>
                      </div>
                      <div className="flex items-center text-sm font-bold text-green-600 dark:text-green-400 group-hover:text-green-700 dark:group-hover:text-green-300">
                        Explore Solution <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* CTA Section */}
      <section className="border-t border-zinc-200 bg-white py-16 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="container mx-auto px-4 text-center md:px-6">
          <h2 className="mb-4 text-3xl font-bold text-zinc-900 dark:text-white">Not sure where to start?</h2>
          <p className="mb-8 text-zinc-600 dark:text-zinc-400">Our veterinary experts are ready to help you diagnose and solve your herd&apos;s challenges.</p>
          <button className="rounded-full bg-green-600 px-8 py-4 font-bold text-white shadow-lg transition-colors hover:bg-green-700">
            Request Free Consultation
          </button>
        </div>
      </section>
    </div>
  );
}
