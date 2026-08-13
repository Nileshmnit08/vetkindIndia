import { getResearchArticleBySlug } from "@/app/actions/research";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, FileText, FlaskConical, Microscope } from "lucide-react";
import Script from "next/script";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const article = await getResearchArticleBySlug(resolvedParams.slug);

  if (!article) {
    return {
      title: "Article Not Found | VetKind",
    };
  }

  return {
    title: `${article.seoTitle || article.title} | Research | VetKind`,
    description: article.seoDescription || article.excerpt,
  };
}

export default async function ResearchArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const article = await getResearchArticleBySlug(resolvedParams.slug);

  if (!article) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.seoTitle || article.title,
    "description": article.seoDescription || article.excerpt,
    "image": article.coverImage,
    "datePublished": article.publishedAt || article.createdAt,
    "author": {
      "@type": "Person",
      "name": article.author || "VetKind R&D"
    }
  };

  return (
    <div className="flex min-h-screen flex-col font-sans bg-white dark:bg-zinc-950">
      <Script
        id={`research-jsonld-${article.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-zinc-900 pt-20 pb-16 text-white md:pt-32 md:pb-24">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-800/50 to-zinc-950" />
          {article.coverImage && (
            <img 
              src={article.coverImage} 
              alt="" 
              className="absolute inset-0 h-full w-full object-cover opacity-20 mix-blend-overlay"
            />
          )}
        </div>
        <div className="container relative z-10 mx-auto px-4 max-w-4xl text-center">
          <Link 
            href="/research" 
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Research
          </Link>
          
          <div className="mb-6 flex justify-center gap-3">
            {article.category && (
              <span className="inline-block rounded-full bg-green-500/20 px-3 py-1 text-xs font-bold text-green-300 border border-green-500/30">
                {article.category}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-300 border border-zinc-700">
              <Calendar className="h-3.5 w-3.5" />
              {new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <h1 className="mb-6 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl leading-tight">
            {article.title}
          </h1>
          
          <p className="mx-auto text-xl text-zinc-300 max-w-3xl leading-relaxed">
            {article.excerpt}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 md:px-6 md:py-16 max-w-4xl">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 md:p-12">
          {article.author && (
            <div className="mb-10 flex items-center gap-4 border-b border-zinc-100 pb-8 dark:border-zinc-800">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
                <Microscope className="h-6 w-6 text-zinc-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-900 dark:text-white">Principal Investigator / Author</p>
                <p className="text-zinc-600 dark:text-zinc-400">{article.author}</p>
              </div>
            </div>
          )}
          
          <div 
            className="prose prose-zinc max-w-none dark:prose-invert prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-12 prose-h3:text-xl prose-a:text-green-600 dark:prose-a:text-green-400 hover:prose-a:text-green-500 prose-img:rounded-xl prose-img:shadow-sm"
            dangerouslySetInnerHTML={{ __html: article.articleContent || "<p>No content provided.</p>" }}
          />
        </div>
      </div>
    </div>
  );
}
