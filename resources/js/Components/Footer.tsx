'use client';

import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Send, Check, Heart, Smile } from 'lucide-react';

export default function Footer() {
  const { siteSettings, apiSettings, cmsData, customPages }: any = usePage().props;
  const oldSettings = siteSettings || apiSettings || {};
  const global = cmsData?.global || {};
  const footerCms = cmsData?.footer || {};
  const settings = { ...oldSettings, ...global, ...footerCms };

  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  const businessName = global.site_name || settings.site_name || settings.siteName || 'Creative Toy';
  const footerLogo = global.logo_url || settings.logo_url || settings.site_logo || oldSettings.logo_url;

  // Dynamic Contact & Info from CMS Footer section with fallbacks to general settings
  const footerAbout = footerCms.about_text || settings.about_text || settings.footer_about || 'Making childhood magical, creative, and joyful with safe, eco-friendly, and educational toys.';
  const hotline = footerCms.contact_phone || settings.contact_phone || settings.phone;
  const contactEmail = footerCms.contact_email || settings.contact_email || settings.email;
  const contactAddress = footerCms.contact_address || settings.contact_address || settings.address;
  const copyrightText = footerCms.footerText || settings.footerText || `© ${new Date().getFullYear()} ${businessName}. All Rights Reserved.`;

  // Social Links with toggles
  const fbUrl = footerCms.facebook_url || settings.facebook_url;
  const fbEnabled = footerCms.facebook_enabled !== '0' && fbUrl;

  const igUrl = footerCms.instagram_url || settings.instagram_url;
  const igEnabled = footerCms.instagram_enabled !== '0' && igUrl;

  const twitterUrl = footerCms.twitter_url || settings.twitter_url;
  const twitterEnabled = footerCms.twitter_enabled !== '0' && twitterUrl;

  const ytUrl = footerCms.youtube_url || settings.youtube_url;
  const ytEnabled = footerCms.youtube_enabled !== '0' && ytUrl;

  const tiktokUrl = footerCms.tiktok_url || settings.tiktok_url;
  const tiktokEnabled = footerCms.tiktok_enabled !== '0' && tiktokUrl;

  const waUrl = footerCms.whatsapp_url || settings.whatsapp || settings.whatsapp_url;
  const waEnabled = footerCms.whatsapp_enabled !== '0' && waUrl;

  return (
    <footer className="bg-[#F8F9FA] text-slate-700 border-t border-slate-200 pt-16 pb-12 mt-12">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        
        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-slate-200">
          
          {/* Column 1: Brand Info & Customer Support Links (Span 4) */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              {footerLogo ? (
                <img
                  src={footerLogo}
                  alt={businessName}
                  className="h-10 sm:h-12 w-auto max-w-[180px] object-contain drop-shadow-xs"
                />
              ) : (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0FB5BA] to-[#48CAE4] flex items-center justify-center text-white">
                  <Smile size={18} />
                </div>
              )}
              <span className="font-extrabold text-[20px] text-slate-900 tracking-tight">
                {businessName}
              </span>
            </div>

            <p className="text-[13px] text-slate-500 leading-relaxed max-w-sm">
              {footerAbout}
            </p>

            <div className="text-[12px] text-slate-500 space-y-1 font-medium pt-1">
              {hotline && <div>📞 Hotline: {hotline}</div>}
              {contactEmail && <div>✉️ Email: {contactEmail}</div>}
              {contactAddress && <div>📍 {contactAddress}</div>}
            </div>
          </div>

          {/* Column 2: Quick Links & Categories (Span 2) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-[12px] uppercase font-extrabold tracking-wider text-slate-900">
              Customer Support
            </h4>
            <ul className="space-y-2 text-[13px] text-slate-600">
              <li>
                <Link href="/" className="hover:text-[#FF705A] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#FF705A] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-[#FF705A] transition-colors">
                  Toy Catalog
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#FF705A] transition-colors">
                  Our Safety Story
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#FF705A] transition-colors">
                  FAQs & Shipping
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Safety (Span 2) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-[12px] uppercase font-extrabold tracking-wider text-slate-900">
              Information
            </h4>
            <ul className="space-y-2 text-[13px] text-slate-600">
              {customPages && customPages.length > 0 ? (
                customPages.map((page: any) => (
                  <li key={page.slug}>
                    <Link href={`/pages/${page.slug}`} className="hover:text-[#FF705A] transition-colors">
                      {page.title}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <Link href="/pages/safety-standards" className="hover:text-[#FF705A] transition-colors">
                      Safety Standards
                    </Link>
                  </li>
                  <li>
                    <Link href="/pages/privacy-policy" className="hover:text-[#FF705A] transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/pages/terms" className="hover:text-[#FF705A] transition-colors">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="/pages/refund-policy" className="hover:text-[#FF705A] transition-colors">
                      Refund Guarantee
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Column 4: Newsletter & Community (Span 4) */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-[13px] uppercase font-extrabold tracking-wider text-slate-900 flex items-center gap-1.5">
              <span>Join the Fun!</span>
              <span>🥳🧸</span>
            </h4>

            <p className="text-[13px] text-slate-500">
              Sign up for our newsletter to get 15% off your first toy order, secret gift alerts, and fun activities for kids.
            </p>

            {subscribed ? (
              <div className="flex items-center space-x-2 text-[13px] text-emerald-600 font-bold py-2 bg-emerald-50 px-3 rounded-xl border border-emerald-200">
                <Check className="w-4 h-4" />
                <span>Yay! You're subscribed to Creative Toy News! 🎉</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="relative flex items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full text-[13px] text-slate-800 placeholder-slate-400 bg-white border border-slate-200 rounded-full pl-4 pr-12 py-2.5 outline-none focus:border-[#FF705A] shadow-xs"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#0FB5BA] hover:bg-[#0C9A9E] text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer"
                >
                  <Send size={14} className="ml-0.5" />
                </button>
              </form>
            )}

            {/* Social Media Circles */}
            <div className="pt-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
                Follow Us
              </span>
              <div className="flex items-center space-x-2.5 flex-wrap gap-y-2">
                {/* Facebook */}
                {fbEnabled && (
                  <a
                    href={fbUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Facebook"
                    className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-xs"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                )}

                {/* Instagram */}
                {igEnabled && (
                  <a
                    href={igUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                    className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-xs"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                )}

                {/* Twitter / X */}
                {twitterEnabled && (
                  <a
                    href={twitterUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="X"
                    className="w-8 h-8 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-xs"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                )}

                {/* YouTube */}
                {ytEnabled && (
                  <a
                    href={ytUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="YouTube"
                    className="w-8 h-8 rounded-full bg-[#FF0000] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-xs"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                )}

                {/* TikTok */}
                {tiktokEnabled && (
                  <a
                    href={tiktokUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="TikTok"
                    className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 transition-transform shadow-xs"
                  >
                    <span className="text-[11px] font-bold">TT</span>
                  </a>
                )}

                {/* WhatsApp */}
                {waEnabled && (
                  <a
                    href={waUrl.startsWith('http') ? waUrl : `https://wa.me/${waUrl.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="WhatsApp"
                    className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-xs"
                  >
                    <span className="text-[11px] font-bold">WA</span>
                  </a>
                )}
              </div>
            </div>

            {/* Payment Method Badges */}
            <div className="pt-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5">
                Guaranteed Safe & Secure Checkout
              </span>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-black text-blue-800">VISA</span>
                <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-black text-rose-600">MasterCard</span>
                <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-black text-sky-600">AMEX</span>
                <span className="px-2 py-1 bg-white border border-slate-200 rounded text-[10px] font-black text-amber-600">Discover</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-Footer Copyright & Credits */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center text-[12px] text-slate-500 gap-3">
          <div>
            {copyrightText}
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <span>Developed with</span>
            <Heart size={13} className="text-rose-500 fill-rose-500" />
            <span>by</span>
            <a
              href="https://www.itsolution.bd"
              target="_blank"
              rel="noreferrer"
              className="font-bold text-slate-700 hover:text-[#FF705A] transition-colors"
            >
              IT Solution
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
