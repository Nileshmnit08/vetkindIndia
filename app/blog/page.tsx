import { getBlogArticles, getBlogFilterOptions } from "@/app/actions/blog";
import Link from "next/link";
import { FileText, Calendar, ChevronRight, FileSearch, User } from "lucide-react";
import { BlogFilters } from "@/components/blog/BlogFilters";

export const metadata = {
  title: "Blog | VetKind",
  description: "Read the latest articles, insights, and stories from VetKind.",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const resolvedParams = await searchParams;
  const categoryFilter = resolvedParams.species || resolvedParams.category;
  const yearFilter = resolvedParams.year;

  const [blogResponse, filterOptionsResponse] = await Promise.all([
    getBlogArticles(undefined, categoryFilter, "PUBLISHED", yearFilter),
    getBlogFilterOptions()
  ]);

  const items = blogResponse.success ? blogResponse.data || [] : [];
  const categories = filterOptionsResponse.success ? filterOptionsResponse.data?.categories || [] : [];
  const years = filterOptionsResponse.success ? filterOptionsResponse.data?.years || [] : [];
  
  let featuredItem = null;
  let gridItems = items;

  // Only show featured item if no filters are active
  const hasActiveFilters = !!(categoryFilter || yearFilter);

  if (items.length > 0) {
    if (!hasActiveFilters) {
      featuredItem = items.find(i => i.featured) || items[0];
      gridItems = items.filter(i => i.id !== featuredItem?.id);
    } else {
      gridItems = items;
    }
  }

  return (
    <div className="flex min-h-screen flex-col font-sans bg-zinc-50 dark:bg-zinc-950">
      
      {/* Hero Header */}
      <section className="bg-zinc-900 py-20 text-white md:py-32">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl text-left">
          <div className="mb-6 inline-flex items-center rounded-full border border-zinc-700 bg-zinc-800/50 px-3 py-1 text-sm font-medium text-zinc-300">
            <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2"></span>
            Editorial & Insights
          </div>
          <h1 className="mb-6 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl text-white">
            The VetKind Blog
          </h1>
          <p className="text-xl text-zinc-400 max-w-3xl leading-relaxed">
            Science-backed strategies, nutritional insights, and practical management advice for modern veterinary and livestock professionals.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 md:px-8 md:py-24 max-w-7xl">
        
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center rounded-3xl border border-dashed border-zinc-300 bg-white dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-800">
              <FileSearch className="h-12 w-12" />
            </div>
            <h2 className="mb-4 text-3xl font-bold text-zinc-900 dark:text-white">
              No articles found
            </h2>
            <p className="mb-8 max-w-md text-lg text-zinc-500 dark:text-zinc-400">
              We're constantly writing new content. Check back soon.
            </p>
            <Link 
              href="/blog" 
              className="rounded-xl bg-green-700 px-8 py-4 font-bold text-white transition-all hover:bg-green-800 hover:shadow-md"
            >
              Clear Filters
            </Link>
          </div>
        ) : (
          <>
            {/* Featured Item */}
            {featuredItem && (
              <div className="mb-24 group rounded-3xl bg-white shadow-sm border border-zinc-200 transition-all hover:shadow-xl dark:bg-zinc-900 dark:border-zinc-800 overflow-hidden">
                <Link href={`/blog/${featuredItem.slug}`} className="grid lg:grid-cols-2">
                  <div className="relative aspect-square md:aspect-video lg:aspect-auto bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                    {featuredItem.coverImage ? (
                      <img src={featuredItem.coverImage} alt={featuredItem.title} className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center bg-zinc-100 text-zinc-300 dark:bg-zinc-800 p-12 text-center">
                        <FileText className="h-20 w-20 mb-4" />
                        <span className="font-bold tracking-widest uppercase">Featured</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-center p-8 md:p-12 lg:p-16">
                    {featuredItem.category && (
                      <span className="mb-6 inline-block w-fit rounded-full bg-zinc-100 px-4 py-1.5 text-sm font-bold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                        {featuredItem.category}
                      </span>
                    )}
                    <h2 className="mb-6 text-3xl font-black tracking-tight text-zinc-900 dark:text-white md:text-4xl lg:text-5xl group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors leading-tight">
                      {featuredItem.title}
                    </h2>
                    <p className="mb-8 text-lg text-zinc-600 dark:text-zinc-400 line-clamp-4 leading-relaxed">
                      {featuredItem.excerpt}
                    </p>
                    <div className="mt-auto flex flex-wrap items-center gap-6 text-sm text-zinc-500 pt-8 border-t border-zinc-100 dark:border-zinc-800/50">
                      <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {featuredItem.publishedAt ? new Date(featuredItem.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : new Date(featuredItem.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                      {featuredItem.author && (
                         <span className="flex items-center gap-2 font-medium text-zinc-700 dark:text-zinc-300">
                           <User className="h-4 w-4" />
                           By {featuredItem.author.replace(/^By\s+/i, '')}
                         </span>
                      )}
                      <span className="flex items-center font-bold text-green-700 dark:text-green-400 ml-auto group-hover:underline underline-offset-4">
                        Read Article <ChevronRight className="ml-1 h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Filters */}
            <BlogFilters categories={categories} years={years} totalResults={items.length} />

            {/* Items Grid */}
            {gridItems.length > 0 && (
              <div>
                <div className="mb-12 flex items-center justify-between border-b border-zinc-200 pb-4 dark:border-zinc-800">
                  {!hasActiveFilters && (
                    <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">More Articles</h2>
                  )}
                </div>
                <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                  {gridItems.map((item) => (
                    <Link key={item.id} href={`/blog/${item.slug}`} className="group flex flex-col">
                      <div className="relative mb-6 aspect-[4/3] overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm transition-all group-hover:shadow-md">
                        {item.coverImage ? (
                          <img src={item.coverImage} alt={item.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-zinc-300 dark:text-zinc-700">
                            <FileText className="h-12 w-12" />
                          </div>
                        )}
                        {item.category && (
                          <div className="absolute top-4 left-4 rounded-full bg-white/95 backdrop-blur-md px-3 py-1 text-xs font-bold text-zinc-800 shadow-sm dark:bg-zinc-900/95 dark:text-zinc-200">
                            {item.category}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="mb-4 flex items-center gap-4 text-xs font-medium text-zinc-500">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5" />
                            {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          {item.author && (
                            <span className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300">
                              <User className="h-3.5 w-3.5" />
                              By {item.author.replace(/^By\s+/i, '')}
                            </span>
                          )}
                        </div>
                        <h3 className="mb-3 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors line-clamp-3 leading-snug">
                          {item.title}
                        </h3>
                        <p className="flex-1 text-base text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                          {item.excerpt}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
