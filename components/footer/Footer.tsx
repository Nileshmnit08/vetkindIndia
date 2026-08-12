"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FlaskConical, Phone, Mail, MapPin } from "lucide-react";

export function Footer({ species = [] }: { species?: { name: string, slug: string }[] }) {
  const pathname = usePathname();
  
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/distributor')) {
    return null;
  }

  return (
    <footer className="bg-zinc-950 text-zinc-300 py-16 md:py-24 mt-auto border-t border-zinc-900">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5 border-b border-zinc-900 pb-16 mb-8">
          <div className="lg:col-span-2 space-y-8 pr-0 lg:pr-12">
            <Link href="/" className="flex items-center gap-3 inline-flex">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-700 text-white">
                <FlaskConical className="h-6 w-6" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                VETKIND
              </span>
            </Link>
            <p className="text-base text-zinc-400 leading-relaxed max-w-sm">
              Science-backed veterinary nutrition and phytogenic solutions designed for healthier animals and more productive farms. Serving dairy, poultry, and small ruminant farms across India.
            </p>
            <div className="flex gap-5">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-green-500 transition-colors" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-green-500 transition-colors" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-green-500 transition-colors" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-green-500 transition-colors" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white text-lg font-bold mb-6 tracking-wide">Catalogue</h4>
            <ul className="space-y-4 text-base">
              <li><Link href="/products" className="text-zinc-400 hover:text-green-400 transition-colors">All Products</Link></li>
              {species.map(spec => (
                <li key={spec.slug}>
                  <Link href={`/products?species=${spec.slug}`} className="text-zinc-400 hover:text-green-400 transition-colors">
                    {spec.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-lg font-bold mb-6 tracking-wide">Learn & Partner</h4>
            <ul className="space-y-4 text-base">
              <li><Link href="/solutions" className="text-zinc-400 hover:text-green-400 transition-colors">Targeted Solutions</Link></li>
              <li><Link href="/knowledge" className="text-zinc-400 hover:text-green-400 transition-colors">Knowledge Centre</Link></li>
              <li><Link href="/research" className="text-zinc-400 hover:text-green-400 transition-colors">Research</Link></li>
              <li><Link href="/news-events" className="text-zinc-400 hover:text-green-400 transition-colors">News & Events</Link></li>
              <li><Link href="/blog" className="text-zinc-400 hover:text-green-400 transition-colors">Blog</Link></li>
              <li><Link href="/distributor-inquiry" className="text-zinc-400 hover:text-green-400 transition-colors">Become a Distributor</Link></li>
              <li><Link href="/about" className="text-zinc-400 hover:text-green-400 transition-colors">About Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-lg font-bold mb-6 tracking-wide">Contact</h4>
            <ul className="space-y-5 text-base text-zinc-400">
              <li className="flex items-center gap-3"><Phone className="h-5 w-5 shrink-0 text-green-500" /> +91 98765 43210</li>
              <li className="flex items-center gap-3"><Mail className="h-5 w-5 shrink-0 text-green-500" /> info@vetkind.in</li>
              <li className="flex items-start gap-3"><MapPin className="h-5 w-5 shrink-0 mt-0.5 text-green-500" /> Jaipur, Rajasthan, India</li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row text-sm text-zinc-500">
          <div>&copy; {new Date().getFullYear()} VetKind. All rights reserved.</div>
          <div className="flex gap-8">
            <Link href="/privacy-policy" className="hover:text-zinc-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms-of-service" className="hover:text-zinc-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
