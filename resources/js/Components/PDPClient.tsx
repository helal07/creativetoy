import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { Product } from '@/lib/api';
import { useCart } from '@/Contexts/CartContext';
import { usePage } from '@inertiajs/react';
import {
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Truck,
  HeartHandshake,
  ShoppingCart,
  Zap,
  Check,
  Star,
  Sparkles,
  MessageCircle,
  Heart
} from 'lucide-react';

interface PDPClientProps {
  product: Product | any;
}

export default function PDPClient({ product }: PDPClientProps) {
  const { addItem } = useCart();

  // Safely parse sizes whether it is an Array, JSON string, or comma-separated string
  const availableSizes: string[] = React.useMemo(() => {
    if (Array.isArray(product.sizes)) {
      return product.sizes;
    }
    if (typeof product.sizes === 'string') {
      try {
        const parsed = JSON.parse(product.sizes);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        const split = product.sizes.split(',').map((s: string) => s.trim()).filter(Boolean);
        if (split.length > 0) return split;
      }
      return product.sizes.trim() ? [product.sizes.trim()] : [];
    }
    return [];
  }, [product?.sizes]);

  const hasVariants = product.variants && product.variants.length > 0;
  const initialVariant = hasVariants ? product.variants[0] : null;

  const [selectedVariant, setSelectedVariant] = useState<any>(initialVariant);
  const [selectedSize, setSelectedSize] = useState(
    initialVariant ? initialVariant.name : (availableSizes[0] || 'Standard')
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeImage, setActiveImage] = useState(product.primary_image_url);
  const [activeAccordion, setActiveAccordion] = useState<string | null>('specs');

  useEffect(() => {
    if (selectedVariant) {
      setSelectedSize(selectedVariant.name);
    }
  }, [selectedVariant]);

  const allImages = [
    product.primary_image_url,
    ...(product.secondary_image_url ? [product.secondary_image_url] : []),
    ...(product.images?.map((i: any) => i.image_url) || [])
  ].filter(Boolean);

  const toggleAccordion = (section: string) => {
    setActiveAccordion(prev => (prev === section ? null : section));
  };

  const currentPrice = selectedVariant
    ? Number(selectedVariant.pivot?.price || selectedVariant.price)
    : Number(product.price);

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: currentPrice || 0,
        size: selectedSize,
        image: product.primary_image_url,
        concentration: product.concentration || 'Toy',
      },
      quantity,
      true
    );

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2200);
  };

  const handleBuyNow = () => {
    setIsBuyingNow(true);
    addItem(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: currentPrice || 0,
        size: selectedSize,
        image: product.primary_image_url,
        concentration: product.concentration || 'Toy',
      },
      quantity,
      false
    );
    router.visit('/checkout');
  };

  const { siteSettings, apiSettings }: any = usePage().props;
  const settings = siteSettings || apiSettings || {};
  const currencySymbol = settings.currency || 'USD ($)';
  const symbolMatch = currencySymbol.match(/\((.*?)\)/);
  const symbol = symbolMatch ? symbolMatch[1] : (currencySymbol.split(' ')[0] || '$');

  const formattedUnitPrice = currentPrice ? `${symbol}${currentPrice.toFixed(2)}` : `${symbol}0.00`;
  const totalPrice = currentPrice ? `${symbol}${(currentPrice * quantity).toFixed(2)}` : `${symbol}0.00`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
      
      {/* Left: Sticky Image Gallery */}
      <div className="lg:col-span-7 space-y-4 lg:sticky lg:top-28">
        <div className="w-full aspect-[4/3] sm:aspect-square bg-white rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden flex items-center justify-center p-6 sm:p-10">
          <img
            src={activeImage}
            alt={product.name}
            className="w-full h-full object-contain transition-transform duration-500 hover:scale-105"
          />

          {/* 30% OFF sticker */}
          <div className="absolute top-4 left-4 bg-[#FF705A] text-white text-xs font-black px-3 py-1 rounded-full shadow-xs">
            POPULAR PICK
          </div>
        </div>

        {/* Thumbnail Selector */}
        {allImages.length > 1 && (
          <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-none">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`w-20 h-20 rounded-2xl relative bg-white border-2 transition-all shrink-0 cursor-pointer overflow-hidden p-2 ${
                  activeImage === img
                    ? 'border-[#FF705A] shadow-xs'
                    : 'border-slate-200 opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`${product.name} view ${idx + 1}`}
                  className="w-full h-full object-contain"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right: Toy Details & Actions */}
      <div className="lg:col-span-5 space-y-6">
        
        <div className="space-y-3 pb-5 border-b border-slate-200">
          
          <div className="flex items-center justify-between">
            <span className="text-[12px] uppercase tracking-wider font-extrabold text-[#FF705A] bg-orange-50 px-3 py-1 rounded-full">
              {product.concentration || 'Premium Toy'} · {product.scent_family || 'Ages 1+'}
            </span>

            <span className="inline-flex items-center gap-1.5 text-[11px] uppercase font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              IN STOCK
            </span>
          </div>

          <h1 className="text-[28px] sm:text-[36px] font-black text-slate-900 leading-tight tracking-tight">
            {product.name}
          </h1>

          {/* Star Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-[13px] font-bold text-slate-700">5.0</span>
            <span className="text-[12px] text-slate-400 font-medium">(148 verified parent reviews)</span>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-3 pt-1">
            <span className="text-[26px] font-black text-slate-900">
              {formattedUnitPrice}
            </span>
            <span className="text-[16px] text-slate-400 line-through">
              {symbol}{(currentPrice * 1.3).toFixed(2)}
            </span>
            <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
              SAVE 30%
            </span>
          </div>

          <p className="text-[14px] text-slate-600 leading-relaxed pt-1">
            {product.description || product.short_description}
          </p>
        </div>

        {/* Option / Size Selector */}
        {(hasVariants || availableSizes.length > 0) && (
          <div className="space-y-2.5">
            <div className="flex justify-between items-center text-[12px] font-bold text-slate-700">
              <span>SELECT SIZE / EDITION:</span>
              <span className="text-[#FF705A]">{selectedSize}</span>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {hasVariants ? (
                product.variants.map((v: any) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariant(v)}
                    className={`px-4 py-2 rounded-xl text-[12px] font-bold transition-all cursor-pointer border ${
                      selectedVariant?.id === v.id
                        ? 'bg-[#FF705A] text-white border-[#FF705A] shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {v.name}
                  </button>
                ))
              ) : (
                availableSizes.map((sz: string) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`px-4 py-2 rounded-xl text-[12px] font-bold transition-all cursor-pointer border ${
                      selectedSize === sz
                        ? 'bg-[#FF705A] text-white border-[#FF705A] shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {sz}
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* Quantity & Actions */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-3">
            
            {/* Quantity Stepper */}
            <div className="flex items-center border border-slate-200 rounded-full bg-white px-2 py-1 shrink-0 shadow-xs">
              <button
                type="button"
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                disabled={quantity <= 1}
                className="w-8 h-9 flex items-center justify-center text-slate-700 hover:text-black disabled:opacity-30 cursor-pointer font-bold"
              >
                −
              </button>
              <span className="w-8 text-center text-[14px] font-extrabold text-slate-800">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(prev => Math.min(10, prev + 1))}
                disabled={quantity >= 10}
                className="w-8 h-9 flex items-center justify-center text-slate-700 hover:text-black disabled:opacity-30 cursor-pointer font-bold"
              >
                +
              </button>
            </div>

            {/* Add to Cart Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              className={`flex-1 h-12 px-6 rounded-full text-[13px] uppercase font-bold tracking-wide transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95 ${
                isAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#FF705A] hover:bg-[#F05D46] text-white shadow-[#FF705A]/30'
              }`}
            >
              {isAdded ? (
                <>
                  <Check size={18} className="stroke-[3]" />
                  <span>ADDED TO CART!</span>
                </>
              ) : (
                <>
                  <ShoppingCart size={18} />
                  <span>ADD TO CART · {totalPrice}</span>
                </>
              )}
            </button>

            {/* Wishlist toggle */}
            <button
              type="button"
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                isWishlisted
                  ? 'bg-rose-50 text-rose-500 border-rose-200'
                  : 'bg-white text-slate-400 border-slate-200 hover:text-rose-500'
              }`}
            >
              <Heart size={20} className={isWishlisted ? 'fill-rose-500 text-rose-500' : ''} />
            </button>
          </div>

          {/* Express Buy Now Button */}
          <button
            type="button"
            onClick={handleBuyNow}
            disabled={isBuyingNow}
            className="w-full h-12 rounded-full bg-gradient-to-r from-[#0FB5BA] to-[#0284C7] hover:from-[#0C9A9E] hover:to-[#0369A1] text-white text-[13px] uppercase font-bold tracking-wider transition-all shadow-md shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Zap size={17} className="fill-current" />
            <span>{isBuyingNow ? 'PROCEEDING...' : 'BUY NOW · INSTANT CHECKOUT'}</span>
          </button>
        </div>

        {/* Safety Guarantees */}
        <div className="grid grid-cols-3 gap-2 bg-slate-50 rounded-2xl p-4 text-center text-[11px] text-slate-600 font-bold">
          <div className="flex flex-col items-center gap-1">
            <ShieldCheck size={20} className="text-emerald-500" />
            <span>100% Non-Toxic</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Truck size={20} className="text-[#0FB5BA]" />
            <span>Express Delivery</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <HeartHandshake size={20} className="text-[#FF705A]" />
            <span>30-Day Guarantee</span>
          </div>
        </div>

        {/* Accordions for Details & Safety */}
        <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
          
          {/* Specs Accordion */}
          <div className="py-3.5">
            <button
              onClick={() => toggleAccordion('specs')}
              className="w-full flex justify-between items-center text-left text-[13px] font-bold text-slate-800"
            >
              <span>TOY SPECIFICATIONS & SAFETY</span>
              {activeAccordion === 'specs' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {activeAccordion === 'specs' && (
              <div className="pt-3 text-[13px] text-slate-600 space-y-2 animate-fade-in font-medium">
                <p>• {product.notes_top || 'Material: Premium safe child materials'}</p>
                <p>• {product.notes_heart || 'Safety: ASTM & CE Certified'}</p>
                <p>• {product.notes_base || 'Recommended: Tested for toddler durability'}</p>
              </div>
            )}
          </div>

          {/* Care Accordion */}
          <div className="py-3.5">
            <button
              onClick={() => toggleAccordion('care')}
              className="w-full flex justify-between items-center text-left text-[13px] font-bold text-slate-800"
            >
              <span>CLEANING & CARE INSTRUCTIONS</span>
              {activeAccordion === 'care' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {activeAccordion === 'care' && (
              <div className="pt-3 text-[13px] text-slate-600 leading-relaxed animate-fade-in">
                Wipe clean with a damp cloth and mild soap. For plush toys, machine wash on delicate cycle inside a laundry bag and air dry thoroughly.
              </div>
            )}
          </div>

          {/* Shipping Accordion */}
          <div className="py-3.5">
            <button
              onClick={() => toggleAccordion('shipping')}
              className="w-full flex justify-between items-center text-left text-[13px] font-bold text-slate-800"
            >
              <span>GIFT PACKAGING & DELIVERY</span>
              {activeAccordion === 'shipping' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {activeAccordion === 'shipping' && (
              <div className="pt-3 text-[13px] text-slate-600 leading-relaxed animate-fade-in">
                All toys are shipped in colorful kid-friendly protective packaging. Free gift wrapping and birthday cards available at checkout!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
