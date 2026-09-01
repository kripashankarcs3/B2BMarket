import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = {
  'For Buyers': [
    { label: 'Browse Products', href: '/products' },
    { label: 'Find Suppliers', href: '/suppliers' },
    { label: 'Request for Quotation', href: '#' },
    { label: 'Buyer Protection', href: '#' },
    { label: 'How to Order', href: '#' },
  ],
  'For Suppliers': [
    { label: 'Sell on B2BMarket', href: '#' },
    { label: 'Supplier Membership', href: '#' },
    { label: 'Supplier Learning Center', href: '#' },
    { label: 'Advertising', href: '#' },
  ],
  'Company': [
    { label: 'About Us', href: '#' },
    { label: 'Careers', href: '#' },
    { label: 'Press & Media', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
  ],
  'Support': [
    { label: 'Help Center', href: '#' },
    { label: 'Shipping & Delivery', href: '#' },
    { label: 'Returns & Refunds', href: '#' },
    { label: 'Contact Us', href: '#' },
    { label: 'Report IP Infringement', href: '#' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-apple-gray-50 border-t border-apple-gray-100">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-apple-blue flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <span className="font-semibold text-lg text-apple-gray-900">B2BMarket</span>
            </Link>
            <p className="text-sm text-apple-gray-400 leading-relaxed mb-6 max-w-xs">
              The world&apos;s leading B2B marketplace connecting global buyers with premium suppliers.
            </p>
            <div className="flex items-center gap-3">
              {[
                <svg key="linkedin" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
                <svg key="twitter" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
                <svg key="youtube" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>,
              ].map((icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-white border border-apple-gray-200 flex items-center justify-center hover:bg-apple-gray-50 apple-transition group">
                  <span className="text-apple-gray-400 group-hover:text-apple-blue apple-transition">{icon}</span>
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-apple-gray-900 mb-4">{title}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-apple-gray-400 hover:text-apple-blue apple-transition">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-apple-gray-200 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-apple-gray-400">
            &copy; 2026 B2BMarket. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-apple-gray-400">
            <span className="flex items-center gap-1.5"><MapPin size={14} /> Singapore</span>
            <span className="flex items-center gap-1.5"><Phone size={14} /> +65 6789 0123</span>
            <span className="flex items-center gap-1.5"><Mail size={14} /> hello@b2bmarket.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
