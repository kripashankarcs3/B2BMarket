'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, Heart, User, Menu, X, ChevronDown, MessageCircle, BarChart3, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCategories } from '@/hooks/useCategories';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/contexts/auth-context';
import { SearchOverlay } from './SearchOverlay';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { data: categories = [] } = useCategories();
  const { totalItems } = useCart();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 apple-transition',
          isScrolled
            ? 'glass shadow-sm'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-2 shrink-0">
                <div className="w-8 h-8 rounded-lg bg-apple-blue flex items-center justify-center">
                  <span className="text-white font-bold text-sm">B</span>
                </div>
                <span className="font-semibold text-lg text-apple-gray-900 hidden sm:block">
                  B2B<span className="text-apple-blue">Market</span>
                </span>
              </Link>

              <nav className="hidden lg:flex items-center gap-1">
                <div
                  className="relative"
                  onMouseEnter={() => setActiveDropdown('products')}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <button className="flex items-center gap-1 px-3 py-2 text-sm text-apple-gray-600 hover:text-apple-gray-900 rounded-[10px] hover:bg-apple-gray-50 apple-transition">
                    Products
                    <ChevronDown size={14} className={cn('apple-transition', activeDropdown === 'products' && 'rotate-180')} />
                  </button>
                  <AnimatePresence>
                    {activeDropdown === 'products' && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-2 w-[600px] bg-white rounded-[16px] ios-shadow-lg border border-apple-gray-100 p-4 grid grid-cols-2 gap-2"
                      >
                        {categories.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/products?category=${cat.slug}`}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] hover:bg-apple-gray-50 apple-transition group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-apple-gray-50 flex items-center justify-center group-hover:bg-apple-blue-light apple-transition">
                              <span className="text-xs font-medium text-apple-gray-500 group-hover:text-apple-blue">{cat.name[0]}</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-apple-gray-900">{cat.name}</p>
                              <p className="text-xs text-apple-gray-400">{cat.productCount.toLocaleString()} products</p>
                            </div>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <Link href="/products" className="px-3 py-2 text-sm text-apple-gray-600 hover:text-apple-gray-900 rounded-[10px] hover:bg-apple-gray-50 apple-transition">
                  Suppliers
                </Link>
                <Link href="/products" className="px-3 py-2 text-sm text-apple-gray-600 hover:text-apple-gray-900 rounded-[10px] hover:bg-apple-gray-50 apple-transition">
                  Industries
                </Link>
              </nav>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="hidden sm:flex items-center gap-2 px-4 py-2 bg-apple-gray-50 border border-apple-gray-100 rounded-[12px] text-sm text-apple-gray-400 hover:text-apple-gray-600 hover:border-apple-gray-200 apple-transition w-[200px] lg:w-[260px]"
              >
                <Search size={16} />
                <span>Search products...</span>
                <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-md bg-apple-gray-100 text-apple-gray-400 font-medium">⌘K</span>
              </button>

              <button onClick={() => setIsSearchOpen(true)} className="sm:hidden p-2 rounded-full hover:bg-apple-gray-50 apple-transition">
                <Search size={20} className="text-apple-gray-500" />
              </button>

              <Link href="/compare" className="hidden md:flex p-2 rounded-full hover:bg-apple-gray-50 apple-transition relative">
                <BarChart3 size={20} className="text-apple-gray-500" />
              </Link>

              <Link href="/wishlist" className="hidden md:flex p-2 rounded-full hover:bg-apple-gray-50 apple-transition relative">
                <Heart size={20} className="text-apple-gray-500" />
              </Link>

              <Link href="/cart" className="p-2 rounded-full hover:bg-apple-gray-50 apple-transition relative">
                <ShoppingCart size={20} className="text-apple-gray-500" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-apple-blue text-white text-[9px] flex items-center justify-center font-medium">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </Link>

              {user ? (
                <Link href="/dashboard" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-apple-gray-900 text-white rounded-[12px] text-sm font-medium hover:bg-apple-gray-800 apple-transition">
                  <User size={16} />
                  <span>{user.name?.split(' ')[0] || 'Account'}</span>
                </Link>
              ) : (
                <Link href="/auth/login" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-apple-gray-900 text-white rounded-[12px] text-sm font-medium hover:bg-apple-gray-800 apple-transition">
                  <User size={16} />
                  <span>Sign In</span>
                </Link>
              )}

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-full hover:bg-apple-gray-50 apple-transition"
              >
                {isMobileMenuOpen ? <X size={20} className="text-apple-gray-500" /> : <Menu size={20} className="text-apple-gray-500" />}
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
            className="fixed inset-0 z-30 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-xl"
            >
              <div className="pt-24 px-6 pb-8">
                <div className="space-y-6">
                  <div>
                    <p className="text-xs font-medium text-apple-gray-400 uppercase tracking-wider mb-3">Categories</p>
                    <div className="space-y-1">
                      {categories.slice(0, 6).map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/products?category=${cat.slug}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center justify-between px-3 py-2.5 rounded-[12px] hover:bg-apple-gray-50 apple-transition"
                        >
                          <span className="text-sm text-apple-gray-800">{cat.name}</span>
                          <span className="text-xs text-apple-gray-400">{cat.productCount.toLocaleString()}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-apple-gray-100 pt-6 space-y-1">
                    <Link href="/cart" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] hover:bg-apple-gray-50 apple-transition">
                      <ShoppingCart size={18} className="text-apple-gray-500" /> <span className="text-sm">Cart ({totalItems})</span>
                    </Link>
                    <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] hover:bg-apple-gray-50 apple-transition">
                      <Heart size={18} className="text-apple-gray-500" /> <span className="text-sm">Wishlist</span>
                    </Link>
                    <Link href="/compare" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] hover:bg-apple-gray-50 apple-transition">
                      <BarChart3 size={18} className="text-apple-gray-500" /> <span className="text-sm">Compare</span>
                    </Link>
                    <Link href="/dashboard/messages" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] hover:bg-apple-gray-50 apple-transition">
                      <MessageCircle size={18} className="text-apple-gray-500" /> <span className="text-sm">Messages</span>
                    </Link>
                    {user ? (
                      <>
                        <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] hover:bg-apple-gray-50 apple-transition">
                          <User size={18} className="text-apple-gray-500" /> <span className="text-sm">Dashboard</span>
                        </Link>
                        <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] hover:bg-red-50 apple-transition w-full text-left">
                          <LogOut size={18} className="text-apple-gray-500" /> <span className="text-sm">Sign Out</span>
                        </button>
                      </>
                    ) : (
                      <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] hover:bg-apple-gray-50 apple-transition">
                        <User size={18} className="text-apple-gray-500" /> <span className="text-sm">Sign In</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
