'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ShoppingCart, Heart, Menu, X, ChevronDown, ChevronRight, MessageCircle,
  Scale, LogOut, LayoutGrid, Package, User,
} from 'lucide-react';
import { cn, formatCompact, getInitials } from '@/lib/utils';
import { buildCategoryTree, categoryIcon } from '@/lib/categories';
import { useCategories } from '@/hooks/useCategories';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/auth-context';
import { Logo, ButtonLink } from '@/components/ui';
import { SearchOverlay } from './SearchOverlay';

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [activeRootId, setActiveRootId] = useState<string | null>(null);
  const [expandedMobileId, setExpandedMobileId] = useState<string | null>(null);
  const catalogRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  const { data: categories = [] } = useCategories();
  const tree = useMemo(() => buildCategoryTree(categories), [categories]);
  const activeRoot = tree.find((c) => c.id === activeRootId) ?? tree[0];

  const { totalItems } = useCart();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 4);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((open) => !open);
      }
      if (e.key === 'Escape') {
        setIsCatalogOpen(false);
        setIsAccountOpen(false);
      }
    };
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (catalogRef.current && !catalogRef.current.contains(target)) setIsCatalogOpen(false);
      if (accountRef.current && !accountRef.current.contains(target)) setIsAccountOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('pointerdown', handlePointerDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, []);

  // Close every menu after navigation.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setIsCatalogOpen(false);
    setIsAccountOpen(false);
    setIsMobileMenuOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  const navLinkClass = (href: string) =>
    cn(
      'px-3 h-9 inline-flex items-center text-sm font-medium rounded-sm transition-smooth',
      pathname.startsWith(href) ? 'text-ink-900 bg-ink-50' : 'text-ink-600 hover:text-ink-900 hover:bg-ink-50'
    );

  return (
    <>
      <header
        className={cn(
          'fixed top-0 inset-x-0 z-40 bg-white border-b transition-smooth',
          isScrolled ? 'border-ink-100 elev-sm' : 'border-transparent'
        )}
      >
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 lg:gap-5 h-16">
            <Link href="/" aria-label="B2BMarket home" className="shrink-0">
              <Logo />
            </Link>

            <nav aria-label="Primary" className="hidden lg:flex items-center gap-1">
              <div ref={catalogRef} className="relative">
                <button
                  type="button"
                  aria-expanded={isCatalogOpen}
                  aria-controls="catalog-menu"
                  onClick={() => setIsCatalogOpen((open) => !open)}
                  className={cn(
                    'px-3 h-9 inline-flex items-center gap-1.5 text-sm font-medium rounded-sm transition-smooth',
                    isCatalogOpen ? 'bg-ink-900 text-white' : 'text-ink-700 hover:bg-ink-50'
                  )}
                >
                  <LayoutGrid size={16} aria-hidden />
                  Categories
                  <ChevronDown size={14} aria-hidden className={cn('transition-smooth', isCatalogOpen && 'rotate-180')} />
                </button>

                <AnimatePresence>
                  {isCatalogOpen && tree.length > 0 && (
                    <motion.div
                      id="catalog-menu"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.14 }}
                      className="absolute top-full left-0 mt-2 w-[760px] bg-white rounded-lg elev-xl border border-ink-100 grid grid-cols-[260px_1fr] overflow-hidden"
                    >
                      <ul className="max-h-[440px] overflow-y-auto py-2 border-r border-ink-100 bg-ink-50/60">
                        {tree.map((root) => {
                          const Icon = categoryIcon(root.slug);
                          const active = activeRoot?.id === root.id;
                          return (
                            <li key={root.id}>
                              <Link
                                href={`/products?category=${root.slug}`}
                                onMouseEnter={() => setActiveRootId(root.id)}
                                onFocus={() => setActiveRootId(root.id)}
                                className={cn(
                                  'flex items-center gap-2.5 px-4 py-2 text-sm transition-smooth',
                                  active ? 'bg-white text-brand-700 font-medium' : 'text-ink-700 hover:text-ink-900'
                                )}
                              >
                                <Icon size={16} aria-hidden className={active ? 'text-brand-600' : 'text-ink-400'} />
                                <span className="flex-1 truncate">{root.name}</span>
                                <ChevronRight size={14} aria-hidden className={active ? 'text-brand-600' : 'text-ink-300'} />
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                      {activeRoot && (
                        <div className="p-5 max-h-[440px] overflow-y-auto">
                          <div className="flex items-baseline justify-between gap-4 mb-1">
                            <p className="font-display text-lg font-semibold text-ink-900">{activeRoot.name}</p>
                            <Link href={`/products?category=${activeRoot.slug}`} className="text-sm font-medium text-brand-600 hover:underline underline-offset-4 shrink-0">
                              View all
                            </Link>
                          </div>
                          <p className="text-sm text-ink-500 mb-4 line-clamp-2">
                            {activeRoot.description ?? `${activeRoot.totalProducts} products from verified suppliers`}
                          </p>
                          <ul className="grid grid-cols-2 gap-x-4 gap-y-0.5">
                            {activeRoot.children.map((child) => (
                              <li key={child.id}>
                                <Link
                                  href={`/products?category=${child.slug}`}
                                  className="flex items-center justify-between gap-2 px-2 -mx-2 py-1.5 rounded-sm text-sm text-ink-700 hover:bg-ink-50 hover:text-ink-900"
                                >
                                  <span className="truncate">{child.name}</span>
                                  {child.productCount > 0 && (
                                    <span className="text-xs text-ink-400 tabular">{child.productCount}</span>
                                  )}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Link href="/products" className={navLinkClass('/products')}>Products</Link>
              <Link href="/suppliers" className={navLinkClass('/suppliers')}>Suppliers</Link>
            </nav>

            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="hidden md:flex flex-1 max-w-[440px] items-center gap-2.5 h-10 px-3.5 bg-ink-50 border border-ink-200 rounded-md text-sm text-ink-400 hover:border-ink-300 hover:bg-white transition-smooth"
            >
              <Search size={16} aria-hidden />
              <span>Search products, categories, suppliers</span>
              <kbd className="ml-auto text-[11px] px-1.5 py-0.5 rounded-sm bg-white border border-ink-200 text-ink-400 font-sans">Ctrl K</kbd>
            </button>

            <div className="flex items-center gap-0.5 ml-auto">
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search"
                className="md:hidden p-2.5 rounded-sm text-ink-600 hover:bg-ink-50"
              >
                <Search size={20} aria-hidden />
              </button>

              <Link href="/compare" aria-label="Compare products" title="Compare" className="hidden md:inline-flex p-2.5 rounded-sm text-ink-600 hover:bg-ink-50 hover:text-ink-900">
                <Scale size={20} aria-hidden />
              </Link>
              <Link href="/wishlist" aria-label="Saved products" title="Saved" className="hidden md:inline-flex p-2.5 rounded-sm text-ink-600 hover:bg-ink-50 hover:text-ink-900">
                <Heart size={20} aria-hidden />
              </Link>
              <Link
                href="/cart"
                aria-label={totalItems > 0 ? `Cart, ${totalItems} items` : 'Cart'}
                title="Cart"
                className="relative p-2.5 rounded-sm text-ink-600 hover:bg-ink-50 hover:text-ink-900"
              >
                <ShoppingCart size={20} aria-hidden />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-brand-600 text-white text-[10px] leading-[18px] text-center font-semibold tabular">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </Link>

              <div className="hidden sm:block w-px h-6 bg-ink-200 mx-2" aria-hidden />

              {user ? (
                <div ref={accountRef} className="relative hidden sm:block">
                  <button
                    type="button"
                    aria-expanded={isAccountOpen}
                    aria-haspopup="menu"
                    onClick={() => setIsAccountOpen((open) => !open)}
                    className="flex items-center gap-2 h-10 pl-1 pr-2 rounded-md hover:bg-ink-50"
                  >
                    <span className="w-8 h-8 rounded-full bg-brand-600 text-white text-xs font-semibold flex items-center justify-center">
                      {getInitials(user.name || 'U')}
                    </span>
                    <span className="text-sm font-medium text-ink-800 max-w-[110px] truncate hidden xl:block">
                      {user.name?.split(' ')[0] || 'Account'}
                    </span>
                    <ChevronDown size={14} aria-hidden className="text-ink-400" />
                  </button>
                  <AnimatePresence>
                    {isAccountOpen && (
                      <motion.div
                        role="menu"
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.14 }}
                        className="absolute right-0 top-full mt-2 w-60 bg-white rounded-lg border border-ink-100 elev-xl py-1.5"
                      >
                        <div className="px-4 py-2.5 border-b border-ink-100 mb-1">
                          <p className="text-sm font-medium text-ink-900 truncate">{user.name}</p>
                          <p className="text-xs text-ink-400 truncate">{user.email}</p>
                        </div>
                        {[
                          { href: '/dashboard', label: 'Dashboard', icon: User },
                          { href: '/dashboard/orders', label: 'Orders', icon: Package },
                          { href: '/dashboard/messages', label: 'Messages', icon: MessageCircle },
                        ].map(({ href, label, icon: Icon }) => (
                          <Link key={href} role="menuitem" href={href} className="flex items-center gap-2.5 px-4 py-2 text-sm text-ink-700 hover:bg-ink-50 hover:text-ink-900">
                            <Icon size={16} aria-hidden className="text-ink-400" /> {label}
                          </Link>
                        ))}
                        <div className="border-t border-ink-100 mt-1 pt-1">
                          <button
                            type="button"
                            role="menuitem"
                            onClick={() => { logout(); setIsAccountOpen(false); }}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-ink-700 hover:bg-ink-50 hover:text-red-600"
                          >
                            <LogOut size={16} aria-hidden className="text-ink-400" /> Sign out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-1.5">
                  <Link href="/auth/login" className="px-3 h-10 inline-flex items-center text-sm font-medium text-ink-700 hover:text-ink-900 rounded-md hover:bg-ink-50">
                    Sign in
                  </Link>
                  <ButtonLink href="/auth/register" size="md">Join free</ButtonLink>
                </div>
              )}

              <button
                type="button"
                onClick={() => setIsMobileMenuOpen((open) => !open)}
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen}
                className="lg:hidden p-2.5 rounded-sm text-ink-700 hover:bg-ink-50"
              >
                {isMobileMenuOpen ? <X size={22} aria-hidden /> : <Menu size={22} aria-hidden />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 top-16 z-30 lg:hidden"
          >
            <div className="absolute inset-0 bg-ink-900/40" onClick={() => setIsMobileMenuOpen(false)} />
            <motion.nav
              aria-label="Mobile"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white overflow-y-auto"
            >
              <div className="p-4 space-y-6">
                {!user && (
                  <div className="grid grid-cols-2 gap-2">
                    <ButtonLink href="/auth/login" variant="secondary" fullWidth>Sign in</ButtonLink>
                    <ButtonLink href="/auth/register" fullWidth>Join free</ButtonLink>
                  </div>
                )}

                <div>
                  <p className="px-3 text-xs font-medium text-ink-400 mb-1">Browse</p>
                  {[
                    { href: '/products', label: 'All products', icon: Package },
                    { href: '/suppliers', label: 'Suppliers', icon: User },
                  ].map(({ href, label, icon: Icon }) => (
                    <Link key={href} href={href} className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-ink-800 hover:bg-ink-50">
                      <Icon size={18} aria-hidden className="text-ink-400" /> {label}
                    </Link>
                  ))}
                </div>

                <div>
                  <p className="px-3 text-xs font-medium text-ink-400 mb-1">Categories</p>
                  <ul>
                    {tree.map((root) => {
                      const Icon = categoryIcon(root.slug);
                      const expanded = expandedMobileId === root.id;
                      return (
                        <li key={root.id}>
                          <button
                            type="button"
                            aria-expanded={expanded}
                            onClick={() => setExpandedMobileId(expanded ? null : root.id)}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-ink-800 hover:bg-ink-50"
                          >
                            <Icon size={18} aria-hidden className="text-ink-400" />
                            <span className="flex-1 text-left">{root.name}</span>
                            <ChevronDown size={16} aria-hidden className={cn('text-ink-400 transition-smooth', expanded && 'rotate-180')} />
                          </button>
                          {expanded && (
                            <ul className="ml-[2.6rem] mb-2 border-l border-ink-100">
                              <li>
                                <Link href={`/products?category=${root.slug}`} className="block pl-3 py-1.5 text-sm font-medium text-brand-600">
                                  All {root.name}
                                </Link>
                              </li>
                              {root.children.map((child) => (
                                <li key={child.id}>
                                  <Link href={`/products?category=${child.slug}`} className="block pl-3 py-1.5 text-sm text-ink-600 hover:text-ink-900">
                                    {child.name}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="border-t border-ink-100 pt-4">
                  {[
                    { href: '/cart', label: `Cart${totalItems ? ` (${formatCompact(totalItems)})` : ''}`, icon: ShoppingCart },
                    { href: '/wishlist', label: 'Saved', icon: Heart },
                    { href: '/compare', label: 'Compare', icon: Scale },
                    ...(user
                      ? [
                          { href: '/dashboard', label: 'Dashboard', icon: User },
                          { href: '/dashboard/messages', label: 'Messages', icon: MessageCircle },
                        ]
                      : []),
                  ].map(({ href, label, icon: Icon }) => (
                    <Link key={href} href={href} className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-ink-800 hover:bg-ink-50">
                      <Icon size={18} aria-hidden className="text-ink-400" /> {label}
                    </Link>
                  ))}
                  {user && (
                    <button
                      type="button"
                      onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-ink-800 hover:bg-red-50 hover:text-red-700"
                    >
                      <LogOut size={18} aria-hidden className="text-ink-400" /> Sign out
                    </button>
                  )}
                </div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
