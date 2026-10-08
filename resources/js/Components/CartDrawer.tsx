'use client';

import React from 'react';
import { Link } from '@inertiajs/react';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingCart, ShieldCheck, Lock, Gift, Sparkles } from 'lucide-react';
import { useCart } from '@/Contexts/CartContext';
import { usePage } from '@inertiajs/react';

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, totalCount } = useCart();

  const { siteSettings, apiSettings }: any = usePage().props;
  const settings = siteSettings || apiSettings || {};
  const currencySymbol = settings.currency || 'USD ($)';
  const symbolMatch = currencySymbol.match(/\((.*?)\)/);
  const symbol = symbolMatch ? symbolMatch[1] : (currencySymbol.split(' ')[0] || '$');
  const fullCurrency = currencySymbol;

  const freeShippingThreshold = 35; // Kids toy store threshold
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Dark Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 flex flex-col justify-between shadow-2xl animate-slide-in-right">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-[#FFFDF9]">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-orange-100 text-[#FF705A] flex items-center justify-center">
                  <ShoppingCart size={16} />
                </div>
                <h2 className="font-black text-[18px] text-slate-900 tracking-tight">MY TOY CART</h2>
              </div>
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
                {totalCount} {totalCount === 1 ? 'TOY' : 'TOYS'} SELECTED
              </span>
            </div>
            <button
              onClick={closeCart}
              className="text-slate-400 hover:text-slate-700 p-2 transition-colors cursor-pointer rounded-full hover:bg-slate-100"
              aria-label="Close cart"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="px-5 py-3 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100 text-[12px]">
            <div className="flex justify-between items-center font-bold text-slate-700">
              {subtotal >= freeShippingThreshold ? (
                <span className="text-[#4EBA87] flex items-center gap-1">
                  <Sparkles size={14} className="fill-[#4EBA87]" />
                  <span>FREE SHIPPING UNLOCKED! 🚚</span>
                </span>
              ) : (
                <span>
                  ADD <strong className="text-[#FF705A]">{symbol}{remainingForFreeShipping.toFixed(2)}</strong> FOR FREE SHIPPING
                </span>
              )}
              <span className="text-[11px] text-slate-400 font-mono">{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 mt-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#FF705A] to-[#FFB703] h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-slate-100 space-y-3 divide-y-reverse">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-orange-50 border border-orange-200 flex items-center justify-center text-[28px]">
                  🧸
                </div>
                <div className="space-y-1">
                  <p className="text-[20px] text-slate-900 font-extrabold">Your toy cart is empty</p>
                  <p className="text-[13px] text-slate-500 max-w-xs font-normal">
                    Discover soft plushies, Montessori wooden blocks, and fun toddler playsets!
                  </p>
                </div>
                <Link
                  href="/perfumes"
                  onClick={closeCart}
                  className="bg-[#FF705A] hover:bg-[#F05D46] text-white px-8 py-3 rounded-full text-[13px] font-bold shadow-md shadow-[#FF705A]/30 transition-all cursor-pointer"
                >
                  START SHOPPING
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="pt-3 first:pt-0 flex gap-3.5 items-center">
                  <div className="w-20 h-20 bg-slate-50 rounded-2xl border border-slate-100 shrink-0 flex items-center justify-center p-2 relative overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-[14px] font-bold text-slate-900 leading-snug line-clamp-1">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id, item.size)}
                          className="text-slate-400 hover:text-rose-500 transition-colors p-1 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium block">
                        {item.size}
                      </span>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-slate-200 rounded-full bg-white px-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-black transition-colors cursor-pointer text-xs"
                          aria-label="Decrease"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="w-6 text-center text-[12px] font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                          className="w-6 h-6 flex items-center justify-center text-slate-600 hover:text-black transition-colors cursor-pointer text-xs"
                          aria-label="Increase"
                        >
                          <Plus size={11} />
                        </button>
                      </div>

                      <span className="text-[15px] font-extrabold text-slate-900">
                        {symbol}{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-100 bg-[#FFFDF9] space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-[16px] font-black text-slate-900">
                  <span>SUBTOTAL</span>
                  <span>{symbol}{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[12px] text-slate-500">
                  <span>Shipping</span>
                  <span>{subtotal >= freeShippingThreshold ? 'FREE' : 'Calculated at checkout'}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full bg-[#FF705A] hover:bg-[#F05D46] text-white py-3.5 rounded-full flex items-center justify-center gap-2 text-[14px] font-bold shadow-md shadow-[#FF705A]/30 transition-all cursor-pointer"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight size={17} />
              </Link>

              <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-1 font-semibold">
                <span className="flex items-center gap-1">
                  <Lock size={12} className="text-emerald-500" /> Safe & Secure Checkout
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <ShieldCheck size={12} className="text-[#0FB5BA]" /> 100% Non-Toxic
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
