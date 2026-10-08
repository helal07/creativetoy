'use client';

import React, { useState } from 'react';
import { Product } from '@/lib/api';
import { useCart } from '@/Contexts/CartContext';
import { usePage, Link } from '@inertiajs/react';
import { ShoppingCart, Check, Heart, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  variant?: 'playful' | 'compact';
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  
  const { siteSettings, apiSettings }: any = usePage().props;
  const settings = siteSettings || apiSettings || {};
  const currencySymbol = settings.currency || 'USD ($)';
  const symbolMatch = currencySymbol.match(/\((.*?)\)/);
  const symbol = symbolMatch ? symbolMatch[1] : (currencySymbol.split(' ')[0] || '$');

  const priceFormatted = product.price ? `${symbol}${Number(product.price).toFixed(2)}` : '';
  const oldPriceFormatted = product.price ? `${symbol}${(Number(product.price) * 1.3).toFixed(2)}` : '';

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const defaultSize = Array.isArray(product.sizes)
      ? (product.sizes[0] || 'Standard')
      : (typeof product.sizes === 'string'
          ? (() => {
              try {
                const parsed = JSON.parse(product.sizes);
                return Array.isArray(parsed) ? (parsed[0] || 'Standard') : product.sizes;
              } catch {
                return product.sizes.split(',')[0]?.trim() || 'Standard';
              }
            })()
          : 'Standard');

    addItem(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: Number(product.price) || 0,
        size: defaultSize,
        image: product.primary_image_url,
        concentration: product.concentration || 'Toy',
      },
      1,
      true
    );

    setIsAdding(true);
    setTimeout(() => setIsAdding(false), 2000);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  // Determine friendly category label
  const categoryLabel = product.category?.name || product.scent_family?.split('·')[0]?.trim() || 'Fun Toy';

  return (
    <div
      className="group relative flex flex-col justify-between bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-100 shadow-[0_2px_10px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_24px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.slug}`} className="block">
        {/* Product Image Container */}
        <div className="relative aspect-square w-full bg-[#F8FAFC] rounded-xl overflow-hidden flex items-center justify-center p-3 mb-3">
          {/* Discount / Status Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-20">
            {product.is_new_arrival && (
              <span className="bg-[#4EBA87] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs tracking-wide">
                NEW
              </span>
            )}
            {product.is_featured && (
              <span className="bg-[#FF705A] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs tracking-wide">
                30% OFF
              </span>
            )}
          </div>

          {/* Wishlist Button on Top Right */}
          <button
            type="button"
            onClick={handleToggleWishlist}
            className={`absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-xs cursor-pointer ${
              isWishlisted
                ? 'bg-rose-50 text-rose-500 border border-rose-200'
                : 'bg-white/90 hover:bg-white text-slate-400 hover:text-rose-500 border border-slate-100'
            }`}
            aria-label="Save to Wishlist"
          >
            <Heart size={15} className={isWishlisted ? 'fill-rose-500 text-rose-500' : ''} />
          </button>

          {/* Product Primary Image */}
          <img
            src={product.primary_image_url}
            alt={product.name}
            className={`w-full h-full object-contain transition-all duration-500 group-hover:scale-105 ${
              isHovered && product.secondary_image_url ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}
            loading="lazy"
          />

          {/* Secondary Hover Image */}
          {product.secondary_image_url && (
            <img
              src={product.secondary_image_url}
              alt={`${product.name} alternate`}
              className={`absolute inset-0 w-full h-full object-contain p-3 transition-all duration-500 group-hover:scale-105 ${
                isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
              loading="lazy"
            />
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-medium text-slate-400 truncate">{categoryLabel}</span>
            {/* 5-Star Rating */}
            <div className="flex items-center gap-0.5 text-amber-400 shrink-0">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={11} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
          </div>

          <h3 className="text-[14px] sm:text-[15px] font-bold text-slate-800 line-clamp-1 group-hover:text-[#FF705A] transition-colors">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-2 pt-0.5">
            <span className="text-[15px] sm:text-[16px] font-extrabold text-slate-900">
              {priceFormatted}
            </span>
            <span className="text-[12px] text-slate-400 line-through">
              {oldPriceFormatted}
            </span>
          </div>
        </div>
      </Link>

      {/* Action Button Row */}
      <div className="pt-3 mt-1 flex items-center gap-2">
        <button
          type="button"
          onClick={handleQuickAdd}
          className={`flex-1 py-2 sm:py-2.5 px-3 rounded-full text-[11px] sm:text-[12px] font-bold shadow-xs flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
            isAdding
              ? 'bg-[#4EBA87] text-white shadow-emerald-200'
              : 'bg-[#FF705A] hover:bg-[#F05D46] text-white shadow-[#FF705A]/25 hover:shadow-md active:scale-95'
          }`}
        >
          {isAdding ? (
            <>
              <Check size={14} className="stroke-[3]" />
              <span>ADDED!</span>
            </>
          ) : (
            <>
              <ShoppingCart size={14} className="stroke-[2.5]" />
              <span>ADD TO CART</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleToggleWishlist}
          className={`sm:hidden w-8 h-8 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
            isWishlisted
              ? 'bg-rose-50 text-rose-500 border-rose-200'
              : 'bg-slate-50 text-slate-400 border-slate-200'
          }`}
          aria-label="Wishlist"
        >
          <Heart size={14} className={isWishlisted ? 'fill-rose-500 text-rose-500' : ''} />
        </button>
      </div>
    </div>
  );
}
