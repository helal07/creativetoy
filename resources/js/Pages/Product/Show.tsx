import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import ProductCard from '@/Components/ProductCard';
import PDPClient from '@/Components/PDPClient';

export default function ProductDetailPage({ product, related }: any) {
  const { siteSettings, apiSettings }: any = usePage().props;
  const settings = siteSettings || apiSettings || {};
  const brandName = settings.siteName || 'PlayJoy Toys';
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : (settings.app_url || '');

  if (!product) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-24 text-center">
        <Head title={`Toy Not Found — ${brandName}`} />
        <h1 className="text-[28px] font-black text-slate-800 mb-4">Toy not found.</h1>
        <a href="/perfumes" className="text-[13px] uppercase font-bold text-[#FF705A] underline">
          RETURN TO CATALOG →
        </a>
      </div>
    );
  }

  // Compute dynamic Per-Product SEO values with fallbacks
  const metaTitle = product.meta_title?.trim()
    ? product.meta_title
    : `${product.name} — Kids Toy | ${brandName}`;

  const metaDescription = product.meta_description?.trim()
    ? product.meta_description
    : (product.short_description?.trim()
        ? `${product.short_description} Order authentic ${product.name} by ${brandName} with fast delivery.`
        : `Discover ${product.name} by ${brandName}. Made with safe, non-toxic materials for endless childhood fun.`);

  const ogImage = product.og_image_url || product.primary_image_url || settings.logo_url || '';
  const productUrl = `${siteUrl}/product/${product.slug}`;

  return (
    <>
      <Head>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={productUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="product" />
        <meta property="og:site_name" content={brandName} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={productUrl} />
        {ogImage && <meta property="og:image" content={ogImage} />}

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metaTitle} />
        <meta name="twitter:description" content={metaDescription} />
        {ogImage && <meta name="twitter:image" content={ogImage} />}
      </Head>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-16 space-y-16">
        <PDPClient product={product} />

        {/* You May Also Like Section */}
        {related && related.length > 0 && (
          <section className="border-t border-slate-200 pt-12">
            <div className="mb-8 space-y-1">
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-[#FF705A] block">
                MORE TO EXPLORE
              </span>
              <h3 className="text-[26px] font-black text-slate-900 tracking-tight">
                You May Also Love
              </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {related.map((p: any) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
