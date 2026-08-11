"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FlaskConical, Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  const pathname = usePathname();
  
  if (pathname?.startsWith('/admin') || pathname?.startsWith('/distributor')) {
    return null;
  }

  return (
    <footer className="bg-zinc-950 text-zinc-300 py-12 md:py-16 mt-auto">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5 border-b border-zinc-800 pb-12 mb-8">
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2 inline-flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-600 text-white">
                <FlaskConical className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                VETKIND
              </span>
            </Link>
            <p className="max-w-xs text-sm text-zinc-400">
              Science-backed veterinary nutrition and phytogenic solutions designed for healthier animals and more productive farms. Serving dairy, poultry, and small ruminant farms across India.
            </p>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white transition-colors" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white transition-colors" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white transition-colors" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-white transition-colors" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/products" className="hover:text-green-400 transition-colors">Products</Link></li>
              <li><Link href="/solutions" className="hover:text-green-400 transition-colors">Solutions</Link></li>
              <li><Link href="/research" className="hover:text-green-400 transition-colors">Research</Link></li>
              <li><Link href="/about" className="hover:text-green-400 transition-colors">About Us</Link></li>
              <li><Link href="/knowledge" className="hover:text-green-400 transition-colors">Knowledge Centre</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/privacy-policy" className="hover:text-green-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-green-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="/cookie-policy" className="hover:text-green-400 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0" /> +91 98765 43210</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 shrink-0" /> info@vetkind.in</li>
              <li className="flex items-start gap-2"><MapPin className="h-4 w-4 shrink-0 mt-1" /> Jaipur, Rajasthan, India</li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row text-sm text-zinc-500">
          <div>&copy; {new Date().getFullYear()} VetKind. All rights reserved.</div>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-zinc-300">Privacy</Link>
            <Link href="/terms-of-service" className="hover:text-zinc-300">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
