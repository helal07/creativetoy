import React from 'react';
import ProductCard from '@/Components/ProductCard';
import { Link, Head, usePage } from '@inertiajs/react';
import { Sparkles, Filter, Store } from 'lucide-react';

interface PageProps {
  products: any[];
  filters?: {
    gender?: string;
    category?: string;
    collection?: string;
    scent_family?: string;
    concentration?: string;
    sort?: string;
    search?: string;
  };
  isFallback?: boolean;
}

export default function PLPPage({ products = [], filters: params = {}, isFallback = false }: PageProps) {
  const { siteSettings, apiSettings }: any = usePage().props;
  const settings = siteSettings || apiSettings || {};
  const brandName = settings.siteName || 'PlayJoy Toys';

  // Human-readable titles mapping
  const categoryTitles: Record<string, string> = {
    'soft-toys': 'SOFT TOYS & PLUSHIES',
    'teddy-bears': 'TEDDY BEARS',
    'plush-animals': 'PLUSH ANIMALS',
    'baby-comforters': 'BABY COMFORTERS',
    'wooden-toys': 'MONTESSORI WOODEN TOYS',
    'stacking-rings': 'STACKING RINGS & PYRAMIDS',
    'wooden-puzzles': 'WOODEN PUZZLES',
    'activity-cubes': 'ACTIVITY CUBES',
    'build-blocks': 'BUILDING BLOCKS & TILES',
    'stacking-cubes': 'STACKING CUBES',
    'magnetic-tiles': 'MAGNETIC TILES',
    'mega-construction': 'CONSTRUCTION SETS',
    'dolls': 'DOLLS & DOLLHOUSES',
    'dollhouses': 'WOODEN DOLLHOUSES',
    'baby-dolls': 'BABY DOLLS',
    'outdoor': 'OUTDOOR & ACTIVE PLAY',
    'water-tables': 'WATER PLAY TABLES',
    'bicycles-trikes': 'BICYCLES & TRIKES',
    'learn-stem': 'LEARNING & STEM TOYS',
    'alphabet-numbers': 'ALPHABET & MATH',
    'arts-crafts': 'ARTS & CRAFTS SETS',
    'vehicles': 'CARS & SPEED RACERS',
  };

  // Dynamic Title based on selected category or search query
  let pageTitle = 'ALL TOYS & GAMES';
  if (params.category && categoryTitles[params.category]) {
    pageTitle = categoryTitles[params.category];
  } else if (params.category) {
    pageTitle = params.category.replace(/-/g, ' ').toUpperCase();
  } else if (params.collection === 'sale') {
    pageTitle = 'SUMMER FUN SALE · 30% OFF';
  } else if (params.collection === 'new-arrivals') {
    pageTitle = 'NEW ARRIVALS';
  } else if (params.collection === 'bestsellers') {
    pageTitle = 'BESTSELLING TOYS';
  } else if (params.search) {
    pageTitle = isFallback ? `SEARCH: "${params.search}"` : `RESULTS FOR "${params.search}"`;
  }

  // Related Category Quick Tabs
  const quickFilters = [
    { label: 'All Toys', url: '/perfumes' },
    { label: 'Soft Toys', url: '/perfumes?category=soft-toys' },
    { label: 'Wooden Toys', url: '/perfumes?category=wooden-toys' },
    { label: 'Building Blocks', url: '/perfumes?category=build-blocks' },
    { label: 'Dolls & Houses', url: '/perfumes?category=dolls' },
    { label: 'Outdoor Play', url: '/perfumes?category=outdoor' },
    { label: 'Learning & STEM', url: '/perfumes?category=learn-stem' },
    { label: 'Cars & Vehicles', url: '/perfumes?category=vehicles' },
    { label: 'Sale 🔥', url: '/perfumes?collection=sale' },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-6 pb-16 space-y-8 animate-fade-in">
      <Head>
        <title>{`${pageTitle} — Kids Toys | ${brandName}`}</title>
        <meta
          name="description"
          content={`Shop the best ${pageTitle.toLowerCase()} collection at ${brandName}. Eco-friendly wooden toys, cuddly plush animals, and educational games for happy kids.`}
        />
      </Head>

      {/* Category Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-slate-200 pb-6 gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-[0.2em] font-extrabold text-[#FF705A] block mb-1">
            {brandName} · KIDS WONDERLAND
          </span>
          <h1 className="text-[28px] md:text-[38px] text-slate-900 uppercase font-black tracking-tight">
            {pageTitle}
          </h1>
        </div>

        {/* Counter */}
        <div className="text-[12px] text-slate-500 uppercase tracking-wider font-bold">
          SHOWING <strong className="text-slate-900 font-extrabold">{products.length}</strong> TOYS
        </div>
      </div>

      {/* Quick Category & Subcategory Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {quickFilters.map((tab) => {
          const isActive =
            (tab.url === '/perfumes' && !params.category && !params.collection && !params.search) ||
            (params.category && tab.url.includes(params.category)) ||
            (params.collection && tab.url.includes(params.collection));

          return (
            <Link
              key={tab.label}
              href={tab.url}
              className={`px-4 py-2 text-[12px] uppercase font-bold tracking-wider rounded-full transition-all whitespace-nowrap cursor-pointer shadow-xs ${
                isActive
                  ? 'bg-[#FF705A] text-white shadow-[#FF705A]/25'
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-[#FF705A] hover:text-[#FF705A]'
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Fallback Recommendation Banner */}
      {isFallback && (params.search || params.category) && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold text-amber-700 uppercase tracking-widest block">
              RECOMMENDED PICKS
            </span>
            <p className="text-[13px] text-slate-800 font-medium">
              We couldn't find exact matches, so here are our most popular toys that children love:
            </p>
          </div>
          <Link
            href="/perfumes"
            className="text-[12px] font-bold uppercase tracking-wider underline text-[#FF705A] hover:text-[#F05D46] shrink-0"
          >
            SEE ALL TOYS →
          </Link>
        </div>
      )}

      {/* Product Cards Grid */}
      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 space-y-4 shadow-xs">
          <div className="text-[48px]">🧸</div>
          <h3 className="text-[22px] font-bold text-slate-900">No toys found in this category.</h3>
          <p className="text-[14px] text-slate-500 max-w-md mx-auto">
            Discover our full catalog of soft plushies, wooden Montessori sets, and creative building blocks!
          </p>
          <div className="pt-2">
            <Link
              href="/perfumes"
              className="inline-block bg-[#FF705A] hover:bg-[#F05D46] text-white px-8 py-3 rounded-full text-[13px] uppercase font-bold tracking-wider shadow-md"
            >
              EXPLORE ALL TOYS
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
