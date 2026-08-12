import { getKnowledgeArticleBySlug } from "@/app/actions/knowledge";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Calendar, User, Tag, ArrowRight, Share2 } from "lucide-react";
import { ProductCard } from "@/components/products/ProductCard";
import { getProducts } from "@/lib/products";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const article = await getKnowledgeArticleBySlug(resolvedParams.slug);
  
  if (!article) {
    return { title: 'Article Not Found | VetKind' };
  }

  return {
    title: article.seoTitle || `${article.title} | VetKind Knowledge Centre`,
    description: article.seoDescription || article.excerpt,
    openGraph: {
      title: article.seoTitle || article.title,
      description: article.seoDescription || article.excerpt,
      type: 'article',
      publishedTime: article.publishedAt ? new Date(article.publishedAt).toISOString() : undefined,
      authors: article.author ? [article.author] : undefined,
    }
  };
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const resolvedParams = await params;
  const article = await getKnowledgeArticleBySlug(resolvedParams.slug);

  if (!article) {
    notFound();
  }

  // Generate Article JSON-LD for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.coverImage ? [article.coverImage] : [],
    datePublished: article.publishedAt || article.createdAt,
    author: article.author ? [{
      '@type': 'Person',
      name: article.author,
      url: `https://vetkind.com/authors/team`
    }] : []
  };
  
  // Fetch actual products based on IDs (Mocking fetching them from lib for now, but in reality you'd fetch from DB)
  // For KnowledgeArticle we don't have relatedProducts in schema yet, so we won't fetch any products
  const products: any[] = [];

  return (
    <div className="flex min-h-screen flex-col font-sans bg-zinc-50 dark:bg-zinc-950">
      
      {/* Inject JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb Header */}
      <div className="bg-white py-4 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500">
            <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/knowledge" className="hover:text-green-600 transition-colors">Knowledge Centre</Link>
            <ChevronRight className="h-4 w-4" />
            {article.category && (
              <>
                <Link href={`/knowledge?category=${article.category}`} className="hover:text-green-600 transition-colors">{article.category}</Link>
                <ChevronRight className="h-4 w-4" />
              </>
            )}
            <span className="text-zinc-900 dark:text-zinc-100 font-medium truncate max-w-[200px] sm:max-w-xs">
              {article.title}
            </span>
          </div>
        </div>
      </div>

      {/* Article Header */}
      <section className="bg-white py-12 md:py-20 dark:bg-zinc-900">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
          {article.category && (
            <span className="mb-6 inline-block rounded-full bg-green-100 px-4 py-1.5 text-sm font-bold tracking-wider text-green-800 dark:bg-green-900/30 dark:text-green-400">
              {article.category}
            </span>
          )}
          <h1 className="mb-8 text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-5xl md:text-6xl leading-tight">
            {article.title}
          </h1>
          <p className="mx-auto mb-10 text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
            {article.excerpt}
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-500 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-800 pt-8">
            {article.author && (
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <User className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-zinc-900 dark:text-zinc-100">{article.author}</p>
                </div>
              </div>
            )}
            <div className="h-8 w-[1px] bg-zinc-200 dark:bg-zinc-700 hidden sm:block"></div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Published on {new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Sidebar */}
      <section className="container mx-auto px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_300px]">
          
          {/* Article Body */}
          <article className="max-w-[750px] mx-auto lg:mx-0 w-full">
            {article.coverImage && (
              <div className="mb-12 aspect-video w-full overflow-hidden rounded-3xl bg-zinc-100 dark:bg-zinc-800">
                <img src={article.coverImage} alt={article.title} className="h-full w-full object-cover" />
              </div>
            )}
            
            <div 
              className="
                text-lg text-zinc-700 dark:text-zinc-300 leading-loose
                [&>h2]:mt-12 [&>h2]:mb-6 [&>h2]:text-3xl [&>h2]:font-bold [&>h2]:text-zinc-900 [&>h2]:dark:text-white
                [&>h3]:mt-10 [&>h3]:mb-4 [&>h3]:text-2xl [&>h3]:font-bold [&>h3]:text-zinc-900 [&>h3]:dark:text-white
                [&>p]:mb-6
                [&>ul]:mb-6 [&>ul]:list-disc [&>ul]:pl-6 [&>ul>li]:mb-2
                [&>ol]:mb-6 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol>li]:mb-2
                [&>blockquote]:border-l-4 [&>blockquote]:border-green-600 [&>blockquote]:bg-green-50 [&>blockquote]:p-6 [&>blockquote]:my-8 [&>blockquote]:italic [&>blockquote]:text-green-900 [&>blockquote]:dark:bg-green-900/10 [&>blockquote]:dark:text-green-100
                [&_a]:text-green-600 [&_a]:underline [&_a]:hover:text-green-700
              "
              dangerouslySetInnerHTML={{ __html: article.articleContent || '' }}
            />

            {/* Tags & Share */}
            <div className="mt-16 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-zinc-200 dark:border-zinc-800 pt-8">
              <div className="flex flex-wrap gap-2">
                {/* No tags mapped yet */}
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                  <Share2 className="h-4 w-4" /> Share:
                </span>
                <button className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 transition-colors hover:bg-[#1DA1F2] hover:text-white dark:bg-zinc-800 dark:text-zinc-400">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                </button>
                <button className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 transition-colors hover:bg-[#0A66C2] hover:text-white dark:bg-zinc-800 dark:text-zinc-400">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>
                </button>
                <button className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 transition-colors hover:bg-[#1877F2] hover:text-white dark:bg-zinc-800 dark:text-zinc-400">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </button>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="space-y-10 lg:border-l lg:border-zinc-200 lg:pl-12 lg:dark:border-zinc-800">
            {/* Newsletter CTA */}
            <div className="rounded-2xl bg-green-50 p-6 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30">
              <h3 className="mb-2 text-xl font-bold text-green-950 dark:text-green-50">Subscribe to Insights</h3>
              <p className="mb-4 text-sm text-green-800 dark:text-green-200">Get the latest farm management tips and veterinary research directly in your inbox.</p>
              <form className="space-y-2">
                <input type="email" placeholder="Your email address" className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-green-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" />
                <button className="w-full rounded-xl bg-green-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-green-700">Subscribe</button>
              </form>
            </div>

            {/* Popular Categories */}
            <div>
              <h3 className="mb-4 text-lg font-bold text-zinc-900 dark:text-white">Topics</h3>
              <ul className="space-y-2">
                {['Dairy Nutrition', 'Animal Health', 'Herbal Solutions', 'Farm Management'].map((topic) => (
                  <li key={topic}>
                    <Link href={`/knowledge?category=${topic}`} className="flex items-center justify-between group">
                      <span className="text-sm text-zinc-600 group-hover:text-green-600 dark:text-zinc-400 dark:group-hover:text-green-400 transition-colors">{topic}</span>
                      <ChevronRight className="h-4 w-4 text-zinc-300 group-hover:text-green-600 dark:text-zinc-600" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
          
        </div>
      </section>

      {/* Related Products Section */}
      {products && products.length > 0 && (
        <section className="border-t border-zinc-200 bg-white py-16 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                  Mentioned Products
                </h2>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400 max-w-2xl">
                  Nutritional solutions discussed in this article.
                </p>
              </div>
              <Link href="/products" className="inline-flex items-center text-sm font-bold text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300">
                View catalog <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
