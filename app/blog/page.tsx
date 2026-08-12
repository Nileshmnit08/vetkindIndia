import { getBlogArticles } from "@/app/actions/blog";
import Link from "next/link";
import { FileText, Calendar, ChevronRight, FileSearch, User } from "lucide-react";

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
  const categoryFilter = resolvedParams.category;

  const blogResponse = await getBlogArticles(undefined, categoryFilter, "PUBLISHED");
  const items = blogResponse.success ? blogResponse.data || [] : [];
  
  let featuredItem = null;
  let gridItems = items;

  if (items.length > 0) {
    featuredItem = items.find(i => i.featured) || items[0];
    gridItems = items.filter(i => i.id !== featuredItem?.id);
  }

  return (
    <div className="flex min-h-screen flex-col font-sans bg-zinc-50 dark:bg-zinc-950">
      
      {/* Hero Header */}
      <section className="bg-green-900 py-16 text-white md:py-24">
        <div className="container mx-auto px-4 text-center md:px-6">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-800 text-green-300 border border-green-700">
            <FileText className="h-8 w-8" />
          </div>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            The VetKind Blog
          </h1>
          <p className="mx-auto text-xl text-green-100 max-w-2xl leading-relaxed">
            Insights, stories, and updates from the world of animal nutrition.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
        
        <div className="mb-8 flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="font-medium text-zinc-900 dark:text-zinc-100">{items.length} {items.length === 1 ? 'article' : 'articles'}</span>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center rounded-3xl border border-dashed border-zinc-300 bg-white dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-800">
              <FileSearch className="h-10 w-10" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-white">
              No articles published yet
            </h2>
            <p className="mb-8 max-w-md text-zinc-500 dark:text-zinc-400">
              We're constantly writing new content. Check back soon.
            </p>
            <Link 
              href="/blog" 
              className="rounded-xl bg-green-600 px-6 py-3 font-bold text-white transition-colors hover:bg-green-700 shadow-sm"
            >
              Clear Filters
            </Link>
          </div>
        ) : (
          <>
            {/* Featured Item */}
            {featuredItem && (
              <div className="mb-16 overflow-hidden rounded-3xl bg-white shadow-xl shadow-zinc-200/50 dark:bg-zinc-900 dark:shadow-none border border-zinc-100 dark:border-zinc-800 transition-all hover:shadow-2xl">
                <Link href={`/blog/${featuredItem.slug}`} className="grid lg:grid-cols-2 group">
                  <div className="relative aspect-video lg:aspect-auto bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                    {featuredItem.coverImage ? (
                      <img src={featuredItem.coverImage} alt={featuredItem.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-green-50 to-green-100 text-green-600 dark:from-zinc-800 dark:to-zinc-900 dark:text-green-500 p-12 text-center">
                        <FileText className="h-16 w-16 opacity-50 mb-4" />
                        <span className="font-bold opacity-50 tracking-widest uppercase">Featured Article</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-center p-8 lg:p-12">
                    {featuredItem.category && (
                      <span className="mb-4 inline-block w-fit rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        {featuredItem.category}
                      </span>
                    )}
                    <h2 className="mb-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      {featuredItem.title}
                    </h2>
                    <p className="mb-6 text-lg text-zinc-600 dark:text-zinc-400 line-clamp-3">
                      {featuredItem.excerpt}
                    </p>
                    <div className="mt-auto flex flex-wrap gap-4 text-sm text-zinc-500 border-t border-zinc-100 pt-6 dark:border-zinc-800">
                      {featuredItem.author && (
                         <span className="flex items-center gap-1 text-zinc-700 dark:text-zinc-300 font-medium">
                           <User className="h-4 w-4" />
                           {featuredItem.author}
                         </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {featuredItem.publishedAt ? new Date(featuredItem.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : new Date(featuredItem.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="flex items-center font-bold text-green-600 dark:text-green-400 ml-auto">
                        Read Article <ChevronRight className="ml-1 h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Items Grid */}
            <div className="mb-12">
              {featuredItem && gridItems.length > 0 && (
                <h2 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-white">More Articles</h2>
              )}
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {gridItems.map((item) => (
                  <Link key={item.id} href={`/blog/${item.slug}`} className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm border border-zinc-200 transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-zinc-900 dark:border-zinc-800">
                    <div className="relative aspect-video bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                      {item.coverImage ? (
                        <img src={item.coverImage} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-700">
                          <FileText className="h-10 w-10" />
                        </div>
                      )}
                      {item.category && (
                        <div className="absolute top-4 left-4 rounded-full bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold text-zinc-900 shadow-sm dark:bg-zinc-900/90 dark:text-zinc-100">
                          {item.category}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="mb-3 text-xl font-bold text-zinc-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="mb-6 flex-1 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">
                        {item.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-zinc-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        {item.author && (
                          <span className="flex items-center gap-1 font-medium">
                            <User className="h-3 w-3" />
                            {item.author}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
