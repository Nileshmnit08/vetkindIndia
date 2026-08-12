import { getNewsEventBySlug } from "@/app/actions/news-events";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Calendar, MapPin, Share2, Megaphone } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const item = await getNewsEventBySlug(resolvedParams.slug);
  
  if (!item) {
    return { title: 'Not Found | VetKind' };
  }

  return {
    title: item.seoTitle || `${item.title} | VetKind News & Events`,
    description: item.seoDescription || item.summary,
    openGraph: {
      title: item.seoTitle || item.title,
      description: item.seoDescription || item.summary,
      type: 'article',
      publishedTime: item.publishedAt ? new Date(item.publishedAt).toISOString() : undefined,
    }
  };
}

export default async function NewsEventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const resolvedParams = await params;
  const item = await getNewsEventBySlug(resolvedParams.slug);

  if (!item) {
    notFound();
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': item.type === 'EVENT' ? 'Event' : 'NewsArticle',
    headline: item.title,
    name: item.title,
    description: item.summary,
    image: item.coverImage ? [item.coverImage] : [],
    datePublished: item.publishedAt || item.createdAt,
    ...(item.type === 'EVENT' && item.eventDate ? {
      startDate: item.eventDate,
      location: {
        '@type': 'Place',
        name: item.location || 'Online / Various',
      }
    } : {}),
  };

  return (
    <div className="flex min-h-screen flex-col font-sans bg-zinc-50 dark:bg-zinc-950">
      
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="bg-white py-4 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500">
            <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/news-events" className="hover:text-green-600 transition-colors">News & Events</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-zinc-900 dark:text-zinc-100 font-medium truncate max-w-[200px] sm:max-w-xs">
              {item.title}
            </span>
          </div>
        </div>
      </div>

      <section className="bg-white py-12 md:py-20 dark:bg-zinc-900">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl text-center">
          <span className="mb-6 inline-block rounded-full bg-green-100 px-4 py-1.5 text-sm font-bold tracking-wider text-green-800 dark:bg-green-900/30 dark:text-green-400">
            {item.type === 'EVENT' ? 'Event' : 'Company News'}
          </span>
          <h1 className="mb-8 text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-5xl md:text-6xl leading-tight">
            {item.title}
          </h1>
          <p className="mx-auto mb-10 text-xl text-zinc-600 dark:text-zinc-400 max-w-3xl leading-relaxed">
            {item.summary}
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-500 dark:text-zinc-400 border-t border-zinc-100 dark:border-zinc-800 pt-8">
            {item.type === 'EVENT' && item.eventDate && (
              <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-medium">
                <Calendar className="h-5 w-5" />
                <span>Event Date: {new Date(item.eventDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
            )}
            {item.type === 'EVENT' && item.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>{item.location}</span>
              </div>
            )}
            {item.type !== 'EVENT' && (
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>Published on {new Date(item.publishedAt || item.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 md:px-6 md:py-16">
        <div className="grid gap-12 lg:grid-cols-[1fr_300px]">
          
          <article className="max-w-[750px] mx-auto lg:mx-0 w-full">
            {item.coverImage && (
              <div className="mb-12 aspect-video w-full overflow-hidden rounded-3xl bg-zinc-100 dark:bg-zinc-800">
                <img src={item.coverImage} alt={item.title} className="h-full w-full object-cover" />
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
              dangerouslySetInnerHTML={{ __html: item.content || '' }}
            />

            <div className="mt-16 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-zinc-200 dark:border-zinc-800 pt-8">
              <div></div>
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
              </div>
            </div>
          </article>

          <aside className="space-y-10 lg:border-l lg:border-zinc-200 lg:pl-12 lg:dark:border-zinc-800">
            <div className="rounded-2xl bg-green-50 p-6 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30">
              <h3 className="mb-2 text-xl font-bold text-green-950 dark:text-green-50">Get Notified</h3>
              <p className="mb-4 text-sm text-green-800 dark:text-green-200">Never miss an event or company announcement.</p>
              <form className="space-y-2">
                <input type="email" placeholder="Your email address" className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none focus:border-green-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white" />
                <button className="w-full rounded-xl bg-green-600 px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-green-700">Subscribe</button>
              </form>
            </div>
          </aside>
          
        </div>
      </section>

    </div>
  );
}
