import Link from 'next/link';
import { BadgeCheck, FileText, ShieldCheck, Truck } from 'lucide-react';
import { Logo } from '@/components/ui';

const footerLinks = [
  {
    title: 'Buy',
    links: [
      { label: 'All products', href: '/products' },
      { label: 'Suppliers', href: '/suppliers' },
      { label: 'Compare products', href: '/compare' },
      { label: 'Saved products', href: '/wishlist' },
    ],
  },
  {
    title: 'Sell',
    links: [
      { label: 'Start selling', href: '/auth/register' },
      { label: 'Supplier dashboard', href: '/dashboard' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Sign in', href: '/auth/login' },
      { label: 'Create account', href: '/auth/register' },
      { label: 'Orders', href: '/dashboard/orders' },
      { label: 'Messages', href: '/dashboard/messages' },
    ],
  },
];

const assurances = [
  { icon: BadgeCheck, label: 'GST-verified suppliers' },
  { icon: FileText, label: 'GST invoice on every order' },
  { icon: ShieldCheck, label: 'Payment held until delivery' },
  { icon: Truck, label: 'Tracked pan-India shipping' },
];

export function Footer() {
  return (
    <footer className="bg-ink-900 text-ink-300">
      <div className="border-b border-white/10">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {assurances.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 text-sm text-white">
              <Icon size={18} aria-hidden className="text-accent-500 shrink-0" />
              {label}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-[1.6fr_1fr_1fr_1fr] gap-10">
          <div className="col-span-2 md:col-span-1 max-w-sm">
            <Link href="/" aria-label="B2BMarket home">
              <Logo inverse />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-ink-300">
              Wholesale direct from Indian manufacturers and traders. Compare bulk prices, talk to
              suppliers and order with a GST invoice.
            </p>
            <a href="mailto:hello@b2bmarket.com" className="mt-4 inline-block text-sm text-white hover:underline underline-offset-4">
              hello@b2bmarket.com
            </a>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold text-white mb-4">{group.title}</h3>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-ink-300 hover:text-white transition-smooth">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm text-ink-300">
          <p>&copy; {new Date().getFullYear()} B2BMarket. All rights reserved.</p>
          <p>Prices in INR, exclusive of GST unless stated.</p>
        </div>
      </div>
    </footer>
  );
}
