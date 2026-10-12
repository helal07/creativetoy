import React, { useState, useRef } from 'react';
import { Link, Head, usePage } from '@inertiajs/react';
import ProductCard from '@/Components/ProductCard';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  HeartHandshake,
  Star,
  Flame,
  ChevronRight,
  Smile,
  Sun,
  Volume2,
  VolumeX
} from 'lucide-react';

interface HomePageProps {
  featuredProducts?: any[];
  newArrivals?: any[];
  categoriesWithProducts?: any[];
  activeCampaigns?: any[];
}

export default function HomePage({
  featuredProducts = [],
  newArrivals = [],
  categoriesWithProducts = [],
  activeCampaigns = []
}: HomePageProps) {
  const { siteSettings, apiSettings, cmsData }: any = usePage().props;
  const settings = siteSettings || apiSettings || {};

  const heroVideo =
    cmsData?.home_hero?.hero_video_url ||
    settings?.hero_video_url ||
    settings?.hero_video ||
    '/uploads/videos/hero_clip_1785931997.mp4';
  const heroPoster =
    settings?.hero_poster_url ||
    settings?.hero_poster ||
    '/images/toys/hero_banner.jpg';

  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const brandName = settings.siteName || 'PlayJoy Toys';
  const tagline = settings.tagline || 'Where Fun & Imagination Begin!';
  const metaDesc = settings.seo_meta_description || 'Explore high quality toys, plush animals, wooden educational toys, building blocks, and games for kids of all ages.';

  // Interactive categories matching UI screenshots
  const categoriesList = [
    {
      name: 'Soft Toys',
      slug: 'soft-toys',
      color: 'bg-[#FFEBE7] text-[#FF5A36] border-[#FFD5CC]',
      icon: '🧸',
      badge: 'Cuddly'
    },
    {
      name: 'Dolls',
      slug: 'dolls',
      color: 'bg-[#FFF0F5] text-[#E03177] border-[#FCD6E5]',
      icon: '👧',
      badge: 'Playsets'
    },
    {
      name: 'Build',
      slug: 'build-blocks',
      color: 'bg-[#EBF9F1] text-[#2EA464] border-[#CCEEDC]',
      icon: '🧱',
      badge: 'STEM'
    },
    {
      name: 'Outdoor',
      slug: 'outdoor',
      color: 'bg-[#EBF7FD] text-[#0284C7] border-[#CDEBFA]',
      icon: '🚲',
      badge: 'Active'
    },
    {
      name: 'Learn',
      slug: 'learn-stem',
      color: 'bg-[#FFF9E6] text-[#D97706] border-[#FEEBB3]',
      icon: '🔤',
      badge: 'Puzzles'
    },
    {
      name: 'Arts & Crafts',
      slug: 'arts-crafts',
      color: 'bg-[#F5F0FF] text-[#7C3AED] border-[#E5D6FE]',
      icon: '🎨',
      badge: 'Creative'
    },
  ];

  // Customer Reviews matching the UI mockup
  const customerReviews = [
    {
      id: 1,
      name: 'Sarah M.',
      role: 'Mother of two',
      stars: 5,
      comment: 'The Mr. Cuddles Bear is unbelievably soft and well-made! My 2-year-old daughter cannot sleep without it.',
      product: 'Mr. Cuddles Bear'
    },
    {
      id: 2,
      name: 'David K.',
      role: 'Verified Buyer',
      stars: 5,
      comment: 'Exceptional craftsmanship on the wooden stacking rings. Safe, non-toxic colors and splinter-free wood.',
      product: 'Rainbow Stacking Ring'
    },
    {
      id: 3,
      name: 'Emma L.',
      role: 'Preschool Teacher',
      stars: 5,
      comment: 'The colorful building blocks keep our toddler classroom happily engaged for hours every day!',
      product: 'Colorful Stacking Blocks'
    }
  ];

  return (
    <div className="bg-[#FFFDF9] text-slate-800 font-sans pb-16">
      <Head>
        <title>{`${brandName} — ${tagline}`}</title>
        <meta name="description" content={metaDesc} />
        <meta property="og:title" content={`${brandName} — ${tagline}`} />
        <meta property="og:description" content={metaDesc} />
      </Head>

      {/* ── 1. HERO BANNER SECTION (Desktop & Mobile 1:1 Responsive) ── */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
        
        {/* Desktop Hero Banner (Matching "PlayJoy Toys Summer Fun Sale" Mockup) */}
        <div className="hidden md:block relative w-full rounded-3xl overflow-hidden shadow-lg border border-sky-100 bg-gradient-to-r from-[#C3E8FF] via-[#DCF1FF] to-[#BFE3FF]">
          <div className="grid grid-cols-12 items-center min-h-[440px] lg:min-h-[500px]">
            
            {/* Left Content */}
            <div className="col-span-6 p-8 lg:p-14 z-10 space-y-6">
              
              {/* Smiling Cartoon Sun Badge */}
              <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-xs px-4 py-1.5 rounded-full shadow-xs border border-amber-200">
                <Sun size={20} className="text-amber-500 fill-amber-400 animate-spin duration-3000" />
                <span className="text-[12px] font-extrabold uppercase tracking-wider text-amber-700">
                  SUMMER FUN SALE! 30% OFF!
                </span>
              </div>

              {/* Main Headline */}
              <div className="space-y-2">
                <h1 className="text-[40px] lg:text-[54px] font-black text-slate-900 tracking-tight leading-[1.1]">
                  Dive into Play!
                </h1>
                <p className="text-[16px] lg:text-[18px] text-slate-600 font-medium max-w-md leading-relaxed">
                  Discover toys for every adventure. Spark imagination, curiosity, and endless smiles for every child.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-2">
                <Link
                  href="/shop"
                  className="bg-[#FF705A] hover:bg-[#F05D46] text-white px-8 py-3.5 rounded-full font-bold text-[14px] shadow-md shadow-[#FF705A]/30 hover:shadow-lg active:scale-95 transition-all flex items-center gap-2"
                >
                  <span>SHOP NOW</span>
                  <ArrowRight size={16} />
                </Link>

                <Link
                  href="/shop?category=wooden-toys"
                  className="bg-white hover:bg-slate-50 text-slate-800 px-6 py-3.5 rounded-full font-bold text-[14px] shadow-xs border border-slate-200 hover:border-slate-300 transition-all"
                >
                  Explore Montessori
                </Link>
              </div>

              {/* Trust Tag */}
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 pt-2">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-[#4EBA87]" /> 100% Non-Toxic & Child-Safe
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Truck size={16} className="text-[#0FB5BA]" /> Fast Express Delivery
                </span>
              </div>
            </div>

            {/* Right Hero Video Frame (16:9 Aspect Ratio) */}
            <div className="col-span-6 relative h-full flex items-center justify-end p-6 lg:p-8">
              <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-md border-2 border-white/70 bg-slate-900 group">
                <video
                  ref={videoRef}
                  src={heroVideo}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  poster={heroPoster}
                  className="w-full h-full object-cover"
                />

                {/* 30% OFF Circle Sticker */}
                <div className="absolute top-4 right-4 lg:top-6 lg:right-6 w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-[#FF705A] text-white flex flex-col items-center justify-center font-black shadow-lg border-4 border-white rotate-12 animate-pulse pointer-events-none z-10">
                  <span className="text-[16px] lg:text-[20px] leading-none">30%</span>
                  <span className="text-[9px] lg:text-[10px] uppercase font-bold tracking-wider">OFF!</span>
                </div>

                {/* Audio Toggle (Mute / Unmute) Button */}
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="absolute bottom-3 left-3 z-10 px-2.5 py-1.5 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-xs transition-all shadow-md flex items-center gap-1.5 text-[11px] font-semibold cursor-pointer"
                  title={isMuted ? "Unmute audio" : "Mute audio"}
                >
                  {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  <span className="hidden sm:inline">{isMuted ? "Sound Off" : "Sound On"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Hero Card (Matching "PlayPalace" Mobile Mockup 1:1) */}
        <div className="md:hidden relative rounded-3xl overflow-hidden shadow-sm border border-cyan-100 bg-gradient-to-b from-[#DCF2FE] to-[#C7E9FE] p-6 text-center space-y-4">
          
          {/* Cute Floating Stars Decor */}
          <div className="absolute top-3 left-4 text-amber-400 text-lg">✨</div>
          <div className="absolute top-3 right-4 text-sky-400 text-lg">☁️</div>

          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF705A] bg-white/80 px-3 py-1 rounded-full shadow-xs">
              ★ PLAYPALACE MAGIC ★
            </span>
            <h1 className="text-[26px] font-black text-slate-900 tracking-tight leading-tight pt-1">
              DISCOVER THE JOY OF PLAY!
            </h1>
            <p className="text-[13px] text-slate-600 font-medium px-2">
              Explore our Magical World of Soft Plushies, Wooden Toys & Games for Every Child.
            </p>
          </div>

          {/* Shop Now Pill Button */}
          <div>
            <Link
              href="/shop"
              className="inline-block bg-[#FF705A] active:bg-[#F05D46] text-white px-7 py-2.5 rounded-full font-bold text-[13px] shadow-md shadow-[#FF705A]/30 transition-transform active:scale-95"
            >
              SHOP NOW
            </Link>
          </div>

          {/* Toddler and Toys Video Frame (16:9 Aspect Ratio) */}
          <div className="relative rounded-2xl overflow-hidden shadow-sm mt-2 aspect-[16/9] bg-slate-900 border border-white/60">
            <video
              src={heroVideo}
              autoPlay
              loop
              muted
              playsInline
              poster={heroPoster}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── 2. EXPLORE BY CATEGORY (Circular Pastel Bubbles) ── */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-12 sm:pt-16">
        <div className="text-center space-y-2 mb-8">
          <div className="flex items-center justify-center gap-1.5 text-amber-500 font-bold text-xs uppercase tracking-wider">
            <span>✨</span>
            <span>FAVORITE PICKS</span>
            <span>✨</span>
          </div>
          <h2 className="text-[24px] sm:text-[32px] font-black text-slate-900 tracking-tight">
            SHOP BY CATEGORY
          </h2>
        </div>

        {/* Categories Grid / Carousel */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-6">
          {categoriesList.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop?category=${cat.slug}`}
              className="flex flex-col items-center group cursor-pointer"
            >
              {/* Circle Icon Container */}
              <div
                className={`w-20 h-20 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center border-2 transition-all duration-300 shadow-xs group-hover:scale-110 group-hover:shadow-md ${cat.color}`}
              >
                <span className="text-[30px] sm:text-[40px] drop-shadow-xs transition-transform group-hover:rotate-6">
                  {cat.icon}
                </span>
              </div>

              {/* Title & Badge */}
              <span className="mt-2.5 text-[12px] sm:text-[14px] font-extrabold text-slate-800 text-center uppercase tracking-wider group-hover:text-[#FF705A] transition-colors">
                {cat.name}
              </span>
              <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                {cat.badge}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 3. POPULAR FAVORITES / BESTSELLERS SECTION ── */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-16 sm:pt-20">
        <div className="flex items-end justify-between mb-8 pb-3 border-b border-slate-100">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#FF705A] block mb-1">
              TOP RATED BY PARENTS
            </span>
            <h2 className="text-[24px] sm:text-[34px] font-black text-slate-900 tracking-tight">
              POPULAR FAVORITES
            </h2>
          </div>

          <Link
            href="/shop"
            className="hidden sm:inline-flex items-center gap-1.5 text-[13px] font-bold text-[#FF705A] hover:text-[#F05D46] transition-colors"
          >
            <span>View All Toys</span>
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Mobile View All Button */}
        <div className="sm:hidden text-center pt-6">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-800 px-6 py-2.5 rounded-full text-[13px] font-bold shadow-xs active:bg-slate-50"
          >
            <span>Explore All Toys</span>
            <ChevronRight size={15} />
          </Link>
        </div>
      </section>

      {/* ── 4. MID-PAGE PROMOTIONAL TOY SPOTLIGHT ── */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-16">
        <div className="rounded-3xl bg-gradient-to-r from-[#FF705A] via-[#FF8E7D] to-[#FF9F8E] text-white p-8 sm:p-12 shadow-lg relative overflow-hidden">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="bg-white/20 backdrop-blur-xs text-white text-[11px] font-extrabold uppercase px-3 py-1 rounded-full">
              LIMITED TIME SPECIAL
            </span>
            <h2 className="text-[30px] sm:text-[44px] font-black leading-tight tracking-tight">
              Build, Create & Learn With Eco-Friendly Toys!
            </h2>
            <p className="text-[14px] sm:text-[16px] text-white/90 leading-relaxed font-medium">
              Made from 100% FSC certified organic natural wood and baby-safe water paints. Designed to spark creativity that lasts a lifetime.
            </p>
            <div className="pt-2">
              <Link
                href="/shop?category=wooden-toys"
                className="inline-flex items-center gap-2 bg-white text-[#FF705A] hover:bg-slate-50 px-8 py-3.5 rounded-full font-bold text-[14px] shadow-md transition-all active:scale-95"
              >
                <span>SHOP WOODEN COLLECTION</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Playful Floating Emojis */}
          <div className="hidden lg:block absolute -right-6 -bottom-6 text-[160px] opacity-25 select-none pointer-events-none">
            🚂
          </div>
        </div>
      </section>

      {/* ── 5. NEW ARRIVALS & RECENT RELEASES ── */}
      {newArrivals && newArrivals.length > 0 && (
        <section className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-16 sm:pt-20">
          <div className="flex items-end justify-between mb-8 pb-3 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#0FB5BA] block mb-1">
                JUST ARRIVED
              </span>
              <h2 className="text-[24px] sm:text-[34px] font-black text-slate-900 tracking-tight">
                NEW ARRIVALS
              </h2>
            </div>

            <Link
              href="/shop?collection=new-arrivals"
              className="text-[13px] font-bold text-[#0FB5BA] hover:underline"
            >
              See What's New →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* ── 6. CUSTOMER REVIEWS & PARENT TESTIMONIALS ── */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-16 sm:pt-20">
        <div className="text-center space-y-2 mb-10">
          <div className="flex items-center justify-center gap-1 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
            ))}
          </div>
          <h2 className="text-[24px] sm:text-[32px] font-black text-slate-900 tracking-tight">
            WHAT PARENTS ARE SAYING
          </h2>
          <p className="text-[13px] sm:text-[14px] text-slate-500 font-medium">
            Over 10,000+ Happy Kids & Delighted Parents
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {customerReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(rev.stars)].map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-[14px] text-slate-700 leading-relaxed font-normal italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
                <div>
                  <h4 className="text-[13px] font-extrabold text-slate-900">{rev.name}</h4>
                  <span className="text-[11px] text-slate-400">{rev.role}</span>
                </div>
                <span className="text-[10px] font-bold text-[#FF705A] bg-orange-50 px-2.5 py-1 rounded-full">
                  {rev.product}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 7. WHY CHOOSE US / TRUST BADGES ── */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-16">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-sm grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#4EBA87] flex items-center justify-center">
              <ShieldCheck size={26} />
            </div>
            <h4 className="font-extrabold text-[14px] text-slate-900">100% Non-Toxic</h4>
            <p className="text-[12px] text-slate-500">Certified BPA, lead, and phthalate free for peace of mind.</p>
          </div>

          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#0FB5BA] flex items-center justify-center">
              <Truck size={26} />
            </div>
            <h4 className="font-extrabold text-[14px] text-slate-900">Fast Express Shipping</h4>
            <p className="text-[12px] text-slate-500">Free shipping on all orders over $35 delivered safely to your door.</p>
          </div>

          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#FF705A] flex items-center justify-center">
              <HeartHandshake size={26} />
            </div>
            <h4 className="font-extrabold text-[14px] text-slate-900">30-Day Smiles Guarantee</h4>
            <p className="text-[12px] text-slate-500">Love your new toys or return them hassle-free within 30 days.</p>
          </div>

          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
              <Sparkles size={26} />
            </div>
            <h4 className="font-extrabold text-[14px] text-slate-900">Kid-Approved Fun</h4>
            <p className="text-[12px] text-slate-500">Designed to inspire lifelong learning, curiosity, and play.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
