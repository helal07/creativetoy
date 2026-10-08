import React from 'react';
import { usePage, Link } from '@inertiajs/react';
import '../../css/app.css';
import { CartProvider } from '@/Contexts/CartContext';
import { SiteSettingsProvider } from '@/Contexts/SiteSettingsContext';
import Header from '@/Components/Header';
import CartDrawer from '@/Components/CartDrawer';
import Footer from '@/Components/Footer';
import { Home, Store, Search, Heart, User } from 'lucide-react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { url: pathname } = usePage();
  const { menuTree, categoriesTree, apiSettings, cmsData } = usePage().props as any;

  // Merge CMS global settings (logo, favicon) into initial settings
  const mergedSettings = {
    ...apiSettings,
    ...(cmsData?.global?.logo_url ? { logo_url: cmsData.global.logo_url } : {}),
    ...(cmsData?.global?.favicon_url ? { favicon_url: cmsData.global.favicon_url } : {})
  };

  const isHome = pathname === '/' || pathname === '';
  const isShop = pathname.startsWith('/perfumes') || pathname.startsWith('/shop') || pathname.startsWith('/toys');
  const isAccount = pathname.startsWith('/admin') || pathname.startsWith('/login');

  return (
    <div className="min-h-screen flex flex-col antialiased selection:bg-[#FF705A] selection:text-white font-sans text-slate-800 bg-[#FFFDF9]">
      <SiteSettingsProvider initialSettings={mergedSettings}>
        <CartProvider>
          <Header initialMenu={menuTree} initialCategories={categoriesTree} />
          
          <main className="flex-grow pb-16 md:pb-0">{children}</main>
          
          <CartDrawer />
          <Footer />

          {/* ── Mobile Bottom Navigation Bar (1:1 with PlayPalace Mobile UI) ── */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 py-2 px-4 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] flex justify-around items-center">
            <Link
              href="/"
              className={`flex flex-col items-center gap-0.5 transition-colors ${
                isHome ? 'text-[#FF705A]' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className={`p-1 rounded-xl ${isHome ? 'bg-orange-50' : ''}`}>
                <Home size={20} className={isHome ? 'stroke-[2.5]' : 'stroke-2'} />
              </div>
              <span className="text-[10px] font-bold">Home</span>
            </Link>

            <Link
              href="/shop"
              className={`flex flex-col items-center gap-0.5 transition-colors ${
                isShop ? 'text-[#FF705A]' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className={`p-1 rounded-xl ${isShop ? 'bg-orange-50' : ''}`}>
                <Store size={20} className={isShop ? 'stroke-[2.5]' : 'stroke-2'} />
              </div>
              <span className="text-[10px] font-bold">Shop</span>
            </Link>

            <Link
              href="/shop"
              className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <div className="p-1">
                <Search size={20} className="stroke-2" />
              </div>
              <span className="text-[10px] font-bold">Search</span>
            </Link>

            <Link
              href="/shop?collection=bestsellers"
              className="flex flex-col items-center gap-0.5 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <div className="p-1">
                <Heart size={20} className="stroke-2" />
              </div>
              <span className="text-[10px] font-bold">Wishlist</span>
            </Link>

            <Link
              href="/admin"
              className={`flex flex-col items-center gap-0.5 transition-colors ${
                isAccount ? 'text-[#FF705A]' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className={`p-1 rounded-xl ${isAccount ? 'bg-orange-50' : ''}`}>
                <User size={20} className={isAccount ? 'stroke-[2.5]' : 'stroke-2'} />
              </div>
              <span className="text-[10px] font-bold">Account</span>
            </Link>
          </nav>
        </CartProvider>
      </SiteSettingsProvider>
    </div>
  );
}
