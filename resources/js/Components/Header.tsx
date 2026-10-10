'use client';

import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
  Search,
  Menu,
  X,
  ShoppingCart,
  Heart,
  User,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Flame,
  Sun,
  Smile
} from 'lucide-react';
import { useCart } from '@/Contexts/CartContext';
import { useSiteSettings } from '@/Contexts/SiteSettingsContext';
import { MenuItem, Category, FALLBACK_CATEGORIES, FALLBACK_MENU } from '@/lib/api';

interface HeaderProps {
  initialMenu?: MenuItem[];
  initialCategories?: Category[];
}

export default function Header({ initialMenu, initialCategories }: HeaderProps) {
  const { url: pathname, props } = usePage();
  const pageProps = props as any;
  const { totalCount, openCart } = useCart();
  const { settings } = useSiteSettings();

  // Dynamic menu items tree from props or database shared menuTree or fallback
  const navItems: MenuItem[] = (initialMenu && initialMenu.length > 0)
    ? initialMenu
    : (pageProps.menuTree && pageProps.menuTree.length > 0)
      ? pageProps.menuTree
      : FALLBACK_MENU;

  // Dynamic brand logo from CMS or settings
  const dynamicLogo = pageProps.cmsData?.global?.logo_url
    || settings.logo_url
    || settings.site_logo
    || pageProps.apiSettings?.logo_url
    || pageProps.apiSettings?.site_logo;

  const brandName = pageProps.cmsData?.global?.site_name
    || settings.siteName
    || pageProps.siteSettings?.siteName
    || 'Creative Toy';

  const brandTagline = pageProps.cmsData?.global?.site_tagline
    || settings.tagline
    || 'Kids Toy Wonderland';

  const [menuDrawerOpen, setMenuDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<number | string, boolean>>({});

  const toggleCategory = (id: number | string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  useEffect(() => {
    if (menuDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [menuDrawerOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  // Announcement bar visibility and content
  const rawAnnouncementEnabled = settings.announcement_enabled !== undefined 
    ? settings.announcement_enabled 
    : pageProps.siteSettings?.announcement_enabled;
  const isAnnouncementEnabled = rawAnnouncementEnabled !== false && rawAnnouncementEnabled !== '0' && rawAnnouncementEnabled !== 0 && rawAnnouncementEnabled !== 'false';
  const announcementText = (pageProps.siteSettings?.announcement || settings.announcement || '').trim();
  const showAnnouncement = isAnnouncementEnabled && announcementText.length > 0;

  return (
    <>
      {/* ── 1. Top Colorful Announcement Bar ── */}
      {showAnnouncement && (
        <div className="bg-gradient-to-r from-[#FF705A] via-[#FFB703] to-[#0FB5BA] text-white py-1.5 px-4 text-center text-[11px] sm:text-[12px] font-bold tracking-wide shadow-xs relative z-50 flex items-center justify-center gap-2">
          <Sun size={14} className="animate-spin duration-3000 text-yellow-100 hidden sm:inline" />
          <span>{announcementText}</span>
          <Sparkles size={13} className="text-yellow-100 hidden sm:inline" />
        </div>
      )}

      {/* ── 2. Main Navigation Header Bar ── */}
      <header className="sticky top-0 left-0 w-full z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04)]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
          <div className="relative h-16 sm:h-20 md:h-24 lg:h-26 flex items-center justify-between gap-4">

            {/* Mobile Left: Hamburger Menu */}
            <div className="flex items-center md:hidden z-20">
              <button
                type="button"
                onClick={() => setMenuDrawerOpen(true)}
                className="p-2 -ml-2 text-slate-700 hover:text-[#FF705A] hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                aria-label="Open Navigation Menu"
              >
                <Menu size={24} />
              </button>
            </div>

            {/* Mobile Center Logo (Precisely centered on mobile devices) */}
            <div className="md:hidden absolute left-1/2 -translate-x-1/2 flex items-center justify-center z-10 pointer-events-auto">
              <Link href="/" className="flex items-center justify-center group py-1">
                {dynamicLogo ? (
                  <img
                    src={dynamicLogo}
                    alt={brandName}
                    className="h-11 sm:h-13 w-auto max-w-[170px] object-contain group-hover:scale-105 transition-transform drop-shadow-xs"
                  />
                ) : (
                  <div className="flex items-center gap-1.5">
                    <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0FB5BA] via-[#48CAE4] to-[#90E0EF] flex items-center justify-center shadow-xs">
                      <Smile size={16} className="text-[#FF705A]" />
                    </div>
                    <span className="font-extrabold text-[18px] bg-gradient-to-r from-[#FF705A] via-[#FFB703] to-[#0FB5BA] bg-clip-text text-transparent">
                      {brandName}
                    </span>
                  </div>
                )}
              </Link>
            </div>

            {/* Desktop Left: Brand Logo (Prominent, High-Res & Large on Desktop) */}
            <div className="hidden md:flex shrink-0 items-center">
              <Link href="/" className="flex items-center gap-3 group py-1">
                {dynamicLogo ? (
                  <img
                    src={dynamicLogo}
                    alt={brandName}
                    className="h-16 md:h-18 lg:h-20 w-auto max-w-[240px] lg:max-w-[280px] object-contain group-hover:scale-105 transition-transform drop-shadow-sm"
                  />
                ) : (
                  <>
                    {/* Cute Toy Cube SVG / Icon */}
                    <div className="relative w-11 h-11 lg:w-12 lg:h-12 rounded-2xl bg-gradient-to-tr from-[#0FB5BA] via-[#48CAE4] to-[#90E0EF] flex items-center justify-center shadow-md shadow-cyan-500/20 group-hover:scale-105 group-hover:rotate-3 transition-transform">
                      <div className="w-6 h-6 lg:w-7 lg:h-7 rounded-lg bg-white/90 flex items-center justify-center">
                        <Smile size={20} className="text-[#FF705A]" />
                      </div>
                      <span className="absolute -top-1 -right-1 text-amber-400 text-xs animate-bounce">✨</span>
                    </div>

                    <div className="flex flex-col">
                      <span className="font-extrabold text-[22px] lg:text-[26px] tracking-tight leading-none bg-gradient-to-r from-[#FF705A] via-[#FFB703] to-[#0FB5BA] bg-clip-text text-transparent">
                        {brandName}
                      </span>
                      <span className="text-[10px] lg:text-[11px] font-bold text-slate-400 tracking-widest uppercase mt-0.5">
                        {brandTagline}
                      </span>
                    </div>
                  </>
                )}
              </Link>
            </div>

            {/* Desktop Center: Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <input
                  type="text"
                  placeholder="Search toys, teddy bears, blocks, games..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-slate-200 focus:border-[#FF705A] focus:bg-white text-slate-800 text-[13px] rounded-full pl-10 pr-4 py-2.5 outline-none transition-all placeholder:text-slate-400 shadow-inner"
                />
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                  >
                    <X size={14} />
                  </button>
                )}
              </form>
            </div>

            {/* Right Actions: Account, Favorites, Cart */}
            <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">

              {/* Mobile Search Toggle */}
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="md:hidden p-2 text-slate-600 hover:text-[#FF705A] rounded-xl hover:bg-slate-50 transition-colors"
                aria-label="Search"
              >
                <Search size={20} />
              </button>

              {/* Desktop Account Link */}
              <Link
                href="/admin"
                className="hidden sm:flex items-center gap-1.5 text-[12px] font-bold text-slate-600 hover:text-[#FF705A] p-2 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <User size={18} />
                <span>Account</span>
              </Link>

              {/* Desktop Favorites Link */}
              <Link
                href="/shop"
                className="hidden sm:flex items-center gap-1.5 text-[12px] font-bold text-slate-600 hover:text-[#FF705A] p-2 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <Heart size={18} />
                <span>Favorites</span>
              </Link>

              {/* Shopping Cart Pill Button */}
              <button
                type="button"
                onClick={openCart}
                className="flex items-center gap-2 bg-gradient-to-r from-[#FF705A] to-[#FF8E7D] hover:from-[#F05D46] hover:to-[#FF705A] text-white px-3.5 sm:px-4 py-2 rounded-full font-bold text-[12px] shadow-sm shadow-[#FF705A]/30 hover:shadow-md active:scale-95 transition-all cursor-pointer"
                aria-label="View Shopping Cart"
              >
                <ShoppingCart size={17} className="stroke-[2.5]" />
                <span className="hidden sm:inline">Cart</span>
                <span className="bg-white text-[#FF705A] text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {totalCount}
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Search Input Overlay (Expandable) */}
          {searchOpen && (
            <div className="md:hidden pb-3 pt-1">
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <input
                  type="text"
                  placeholder="Search toys, plush, blocks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-slate-200 focus:border-[#FF705A] text-slate-800 text-[13px] rounded-full pl-9 pr-8 py-2 outline-none"
                  autoFocus
                />
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  <X size={15} />
                </button>
              </form>
            </div>
          )}

          {/* ── 3. Desktop Navigation Menu Bar (Dynamic from Backend CMS / Database with Dropdown Submenus) ── */}
          <nav className="hidden md:flex items-center justify-center flex-wrap gap-x-1 lg:gap-x-2 py-2 border-t border-slate-100 text-[13px] font-bold tracking-wide">
            {navItems.map((item) => {
              const hasChildren = Boolean(item.children && item.children.length > 0);
              const isSale = item.label.toLowerCase().includes('sale');
              const isActive = pathname === item.url || (item.url && item.url !== '/' && pathname.startsWith(item.url));

              return (
                <div key={item.id} className="relative group">
                  <Link
                    href={item.url || '#'}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${isSale
                        ? 'text-[#FF705A] hover:bg-[#FFF5F3] font-black'
                        : isActive
                          ? 'text-[#FF705A] bg-orange-50/80'
                          : 'text-slate-700 hover:text-[#FF705A] hover:bg-slate-50'
                      }`}
                  >
                    {isSale && <Flame size={15} className="fill-[#FF705A] animate-pulse" />}
                    <span>{item.label}</span>
                    {hasChildren && (
                      <ChevronDown size={13} className="text-slate-400 group-hover:rotate-180 group-hover:text-[#FF705A] transition-transform duration-200" />
                    )}
                  </Link>

                  {/* Dropdown Floating Submenu */}
                  {hasChildren && (
                    <div className="absolute left-0 top-full pt-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none group-hover:pointer-events-auto">
                      <div className="bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-2xl shadow-xl shadow-slate-900/10 p-2 min-w-[220px] space-y-0.5 animate-fade-in">
                        {item.children!.map((sub) => (
                          <Link
                            key={sub.id}
                            href={sub.url || '#'}
                            className="flex items-center justify-between px-3 py-2 text-[13px] font-semibold text-slate-700 hover:text-[#FF705A] hover:bg-[#FFF5F3] rounded-xl transition-colors group/sub"
                          >
                            <span>{sub.label}</span>
                            <ChevronRight size={13} className="text-slate-300 group-hover/sub:text-[#FF705A] group-hover/sub:translate-x-0.5 transition-all" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </header>

      {/* ── 4. Mobile Navigation Drawer (Dynamic from Backend CMS / Database with Accordion Submenus) ── */}
      {menuDrawerOpen && (
        <div className="fixed inset-0 z-50 flex animate-fade-in">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMenuDrawerOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-full max-w-[320px] bg-white text-slate-800 h-full flex flex-col justify-between p-6 shadow-2xl z-10 overflow-y-auto">
            {/* Top Bar */}
            <div className="flex justify-between items-center pb-5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                {dynamicLogo ? (
                  <img src={dynamicLogo} alt={brandName} className="h-8 w-auto max-w-[150px] object-contain" />
                ) : (
                  <>
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0FB5BA] to-[#48CAE4] flex items-center justify-center text-white font-black text-sm">
                      🧸
                    </div>
                    <span className="font-extrabold text-[18px] text-[#FF705A]">
                      {brandName}
                    </span>
                  </>
                )}
              </div>
              <button
                type="button"
                onClick={() => setMenuDrawerOpen(false)}
                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Dynamic Navigation Menu Items */}
            <div className="py-4 flex-1 space-y-1.5">
              <span className="text-[11px] font-extrabold tracking-wider uppercase text-slate-400 block px-2 mb-2">
                NAVIGATION MENU
              </span>

              {navItems.map((item) => {
                const isExpanded = expandedCategories[item.id];
                const hasChildren = Boolean(item.children && item.children.length > 0);
                const isSale = item.label.toLowerCase().includes('sale');

                return (
                  <div key={item.id} className="rounded-xl overflow-hidden">
                    <div className={`flex items-center justify-between p-2 rounded-xl transition-colors ${isSale ? 'bg-gradient-to-r from-rose-50 to-orange-50 text-[#FF705A]' : 'hover:bg-slate-50'
                      }`}>
                      <Link
                        href={item.url || '#'}
                        onClick={() => setMenuDrawerOpen(false)}
                        className={`flex-1 font-bold text-[14px] flex items-center gap-2 ${isSale ? 'text-[#FF705A]' : 'text-slate-800 hover:text-[#FF705A]'
                          }`}
                      >
                        {isSale && <Flame size={15} className="fill-[#FF705A]" />}
                        <span>{item.label}</span>
                      </Link>

                      {hasChildren && (
                        <button
                          type="button"
                          onClick={() => toggleCategory(item.id)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-lg transition-colors cursor-pointer"
                          aria-label={`Toggle ${item.label} submenus`}
                        >
                          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                      )}
                    </div>

                    {/* Submenu Children Accordion */}
                    {hasChildren && isExpanded && (
                      <div className="pl-4 pr-2 py-1 space-y-1 bg-slate-50/70 rounded-xl my-1 border-l-2 border-[#FF705A]/50">
                        {item.children!.map((sub) => (
                          <Link
                            key={sub.id}
                            href={sub.url || '#'}
                            onClick={() => setMenuDrawerOpen(false)}
                            className="block py-2 px-2.5 text-[13px] text-slate-600 hover:text-[#FF705A] hover:bg-white rounded-lg font-medium transition-colors"
                          >
                            ↳ {sub.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bottom Support Info */}
            <div className="pt-4 border-t border-slate-100 space-y-2 text-[12px] text-slate-500">
              <Link
                href="/contact"
                onClick={() => setMenuDrawerOpen(false)}
                className="block font-bold text-slate-800 hover:text-[#FF705A]"
              >
                Customer Support & FAQs
              </Link>
              <div className="text-[11px] text-slate-400">
                {settings.phone && <div>Call: {settings.phone}</div>}
                {settings.email && <div>Email: {settings.email}</div>}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
