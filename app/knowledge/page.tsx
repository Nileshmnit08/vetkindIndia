/* eslint-disable @next/next/no-img-element */
import { getKnowledgeArticles } from "@/app/actions/knowledge";
import Link from "next/link";
import { BookOpen, Calendar, Clock, ChevronRight, FileSearch } from "lucide-react";
import { CategoryFilters } from "@/components/knowledge/CategoryFilters";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const resolvedParams = await searchParams;
  const categorySlug = resolvedParams.category;

  if (categorySlug) {
    return {
      title: `${categorySlug} | Knowledge Centre | VetKind`,
      description: `${categorySlug}-backed veterinary nutrition insights and farm management tips from VetKind.`,
    };
  }

  return {
    title: "Knowledge Centre | VetKind",
    description: "Expert insights, farm management tips, and veterinary research to optimize your dairy and animal health practices.",
  };
}

export default async function KnowledgeHubPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const resolvedParams = await searchParams;
  const categorySlug = resolvedParams.category;

  const articlesResponse = await getKnowledgeArticles(undefined, categorySlug, "PUBLISHED");
  const articles = articlesResponse.success ? articlesResponse.data || [] : [];
  
  const categories = [
    { id: "c1", slug: "Dairy nutrition", name: "Dairy nutrition", description: null },
    { id: "c2", slug: "Animal health", name: "Animal health", description: null },
    { id: "c3", slug: "Feed technology", name: "Feed technology", description: null },
    { id: "c4", slug: "Farm management", name: "Farm management", description: null },
  ];

  const activeCategory = categorySlug 
    ? categories.find(c => c.slug === categorySlug) 
    : null;

  // Determine dynamic heading
  let heading = "Knowledge Centre";
  let subheading = "Science-backed articles, farm management strategies, and nutritional insights from our veterinary experts.";
  
  if (activeCategory) {
    heading = `${activeCategory.name} Knowledge`;
  }

  // Conditional Layout Logic
  let featuredArticle = null;
  let gridArticles = articles;

  if (articles.length >= 3) {
    featuredArticle = articles[0];
    gridArticles = articles.slice(1);
  } else if (articles.length > 0) {
    featuredArticle = articles[0];
    gridArticles = articles.slice(1);
  }

  return (
    <div className="flex min-h-screen flex-col font-sans bg-zinc-50 dark:bg-zinc-950">
      
      {/* Hero Header */}
      <section className="bg-green-900 py-16 text-white md:py-24">
        <div className="container mx-auto px-4 text-center md:px-6">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-800 text-green-300 border border-green-700">
            <BookOpen className="h-8 w-8" />
          </div>
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
            {heading}
          </h1>
          <p className="mx-auto text-xl text-green-100 max-w-2xl leading-relaxed">
            {subheading}
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
        
        <CategoryFilters categories={categories} activeCategorySlug={categorySlug} />

        <div className="mb-8 flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <Link href="/knowledge" className="hover:text-green-600 transition-colors">Knowledge Centre</Link>
            {activeCategory && (
              <>
                <ChevronRight className="h-4 w-4" />
                <span className="font-medium text-zinc-900 dark:text-zinc-100">{activeCategory.name}</span>
              </>
            )}
          </div>
          <div className="font-medium bg-zinc-100 px-3 py-1 rounded-full dark:bg-zinc-900">
            {articles.length} {articles.length === 1 ? 'article' : 'articles'}
          </div>
        </div>

        {articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center rounded-3xl border border-dashed border-zinc-300 bg-white dark:border-zinc-800 dark:bg-zinc-900/50">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-800">
              <FileSearch className="h-10 w-10" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-zinc-900 dark:text-white">
              No {activeCategory?.name.toLowerCase()} articles published yet
            </h2>
            <p className="mb-8 max-w-md text-zinc-500 dark:text-zinc-400">
              We&apos;re constantly working on new research and insights. Check back soon or browse our other categories.
            </p>
            <Link 
              href="/knowledge" 
              className="rounded-xl bg-green-600 px-6 py-3 font-bold text-white transition-colors hover:bg-green-700 shadow-sm"
            >
              View All Articles
            </Link>
          </div>
        ) : (
          <>
            {/* Featured Article */}
            {featuredArticle && (
              <div className="mb-16 overflow-hidden rounded-3xl bg-white shadow-xl shadow-zinc-200/50 dark:bg-zinc-900 dark:shadow-none border border-zinc-100 dark:border-zinc-800 transition-all hover:shadow-2xl">
                <Link href={`/knowledge/${featuredArticle.slug}`} className="grid lg:grid-cols-2 group">
                  <div className="relative aspect-video lg:aspect-auto bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                    {featuredArticle.coverImage ? (
                      <img src={featuredArticle.coverImage} alt={featuredArticle.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-green-50 to-green-100 text-green-600 dark:from-zinc-800 dark:to-zinc-900 dark:text-green-500 p-12 text-center">
                        <BookOpen className="h-16 w-16 opacity-50 mb-4" />
                        <span className="font-bold opacity-50 tracking-widest uppercase">Featured Article</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-center p-8 lg:p-12">
                    {featuredArticle.category && (
                      <span className="mb-4 inline-block w-fit rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        {featuredArticle.category}
                      </span>
                    )}
                    <h2 className="mb-4 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-4xl group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      {featuredArticle.title}
                    </h2>
                    <p className="mb-6 text-lg text-zinc-600 dark:text-zinc-400 line-clamp-3">
                      {featuredArticle.excerpt}
                    </p>
                    <div className="mt-auto flex items-center justify-between text-sm text-zinc-500 border-t border-zinc-100 pt-6 dark:border-zinc-800">
                      <div className="flex items-center gap-4">
                        {featuredArticle.author && (
                          <span className="font-medium text-zinc-900 dark:text-zinc-200">{featuredArticle.author}</span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {featuredArticle.publishedAt ? new Date(featuredArticle.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : new Date(featuredArticle.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <span className="flex items-center font-bold text-green-600 dark:text-green-400">
                        Read Article <ChevronRight className="ml-1 h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Articles Grid */}
            <div className="mb-12">
              {featuredArticle && (
                <h2 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-white">Latest Articles</h2>
              )}
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {gridArticles.map((article) => (
                  <Link key={article.id} href={`/knowledge/${article.slug}`} className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm border border-zinc-200 transition-all hover:-translate-y-1 hover:shadow-xl dark:bg-zinc-900 dark:border-zinc-800">
                    <div className="relative aspect-video bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                      {article.coverImage ? (
                        <img src={article.coverImage} alt={article.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-zinc-100 text-zinc-300 dark:bg-zinc-800 dark:text-zinc-700">
                          <BookOpen className="h-10 w-10" />
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
                      <div className="flex items-center gap-4 text-xs text-zinc-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : new Date(article.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        {article.readTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {article.readTime}
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
