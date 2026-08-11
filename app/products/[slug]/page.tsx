import { getProductBySlug } from "@/lib/products";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ShieldCheck, MessageCircle, Phone, Star } from "lucide-react";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductTabs } from "@/components/products/ProductTabs";
import { RelatedProducts } from "@/components/products/RelatedProducts";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);
  
  if (!product) {
    return { title: 'Product Not Found | VetKind' };
  }

  return {
    title: `${product.name} | VetKind`,
    description: product.shortDescription,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  // Generate Structured Data for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.image || "/product-mockup.png",
    "description": product.description || product.shortDescription,
    "sku": product.id,
    "brand": {
      "@type": "Brand",
      "name": "VetKind"
    },
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": product.price,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock",
    },
    "category": product.category || "Veterinary Product"
  };

  return (
    <div className="flex min-h-screen flex-col font-sans bg-white dark:bg-zinc-950">
      {/* Inject SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="border-b border-zinc-200 bg-zinc-50 py-3 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
              <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <Link href="/products" className="hover:text-green-600 transition-colors">Products</Link>
              {product.category && (
                <>
                  <ChevronRight className="h-3 w-3" />
                  <Link href={`/products?category=${product.category.toLowerCase()}`} className="hover:text-green-600 transition-colors">
                    {product.category}
                  </Link>
                </>
              )}
              <ChevronRight className="h-3 w-3" />
              <span className="text-zinc-900 dark:text-zinc-100 truncate max-w-[120px] sm:max-w-none">
                {product.name}
              </span>
            </div>
          </div>
        </div>

        {/* Hero Layout: Left/Right Split */}
        <div className="container mx-auto px-4 py-8 md:px-6 md:py-16">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            
            {/* LEFT: Image Gallery */}
            <div className="lg:sticky lg:top-24 h-fit">
              <ProductGallery image={product.image} productName={product.name} />
            </div>

            {/* RIGHT: Product Details */}
            <div className="flex flex-col">
              <div className="mb-3 flex flex-wrap items-center gap-3">
                {product.category && (
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/50">
                    {product.category}
                  </span>
                )}
                {product.bestseller && (
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">
                    Bestseller
                  </span>
                )}
              </div>
              
              <h1 className="mb-2 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl lg:text-5xl">
                {product.name}
              </h1>
              
              {/* Rating Placeholder */}
              <div className="mb-6 flex items-center gap-2">
                <div className="flex text-amber-400">
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current" />
                  <Star className="h-5 w-5 fill-current opacity-50" />
                </div>
                <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  4.8 (124 reviews)
                </span>
              </div>
              
              <p className="mb-8 text-xl text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {product.shortDescription}
              </p>

              {/* Price & Pack Sizes */}
              <div className="mb-8 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
                <div className="flex items-end gap-4 mb-4">
                  <span className="text-4xl font-bold text-zinc-900 dark:text-white">
                    ₹{product.price?.toLocaleString()}
                  </span>
                  <span className="text-sm font-medium text-zinc-500 mb-1">
                    MRP (Inclusive of all taxes)
                  </span>
                </div>

                {product.packSize && (
                  <div>
                    <h4 className="mb-3 text-sm font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">Available Pack Size</h4>
                    <div className="flex flex-wrap gap-2">
                      <span className="rounded-lg border border-zinc-200 bg-white px-4 py-2 font-medium text-zinc-700 shadow-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-300">
                        {product.packSize}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mb-10 flex flex-col gap-3 sm:flex-row">
                <Link 
                  href={`/contact?product=${product.slug}`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-green-600 py-4 text-base font-bold text-white shadow-lg shadow-green-600/20 transition-all hover:bg-green-700 hover:shadow-green-600/40"
                >
                  <MessageCircle className="h-5 w-5" /> Request Product Advice
                </Link>
                <Link 
                  href={`/contact?product=${product.slug}`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-zinc-200 bg-white py-4 text-base font-bold text-zinc-900 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
                >
                  <Phone className="h-5 w-5" /> Request a Quote
                </Link>
              </div>

              {/* Quick Facts Box */}
              <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
                <div className="border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
                  <h3 className="font-bold text-zinc-900 dark:text-zinc-100">Quick Facts</h3>
                </div>
                <div className="p-6">
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Product Type</dt>
                      <dd className="mt-1 font-semibold text-zinc-900 dark:text-zinc-100">{product.category || "N/A"}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Target Animal</dt>
                      <dd className="mt-1 font-semibold text-zinc-900 dark:text-zinc-100">
                        Multiple Species
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Primary Benefit</dt>
                      <dd className="mt-1 font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
                        <ShieldCheck className="h-4 w-4 text-green-600" />
                        Health Support
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Administration</dt>
                      <dd className="mt-1 font-semibold text-zinc-900 dark:text-zinc-100">Oral</dd>
                    </div>
                  </dl>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Detailed Info Tabs Section */}
        <div className="container mx-auto px-4 pb-16 md:px-6 md:pb-24">
          <ProductTabs product={product} />
        </div>

      </main>

      {/* Recommended Products */}
      <RelatedProducts currentProductId={product.id} category={product.category} />

    </div>
  );
}
