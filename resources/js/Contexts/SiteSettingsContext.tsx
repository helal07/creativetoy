'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem, FALLBACK_MENU } from '@/lib/api';

export interface SiteSettings {
  siteName: string;
  tagline: string;
  logo_url?: string;
  favicon_url?: string;
  site_logo?: string;
  site_favicon?: string;
  hero_video_url?: string;
  hero_video?: string;
  hero_poster_url?: string;
  hero_subtitle?: string;
  hero_title?: string;
  hero_link_1_text?: string;
  hero_link_1_url?: string;
  hero_link_2_text?: string;
  hero_link_2_url?: string;
  phone: string;
  whatsapp: string;
  email: string;
  currency: string;
  announcement: string;
  footerText: string;
  [key: string]: any;
}

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'Creative Toy',
  tagline: 'Kids Toy Wonderland',
  logo_url: '/uploads/cms/global_logo_url_1791219340.webp',
  favicon_url: '/uploads/cms/global_favicon_url_1791219343.jpeg',
  site_favicon: '/uploads/cms/global_favicon_url_1791219343.jpeg',
  hero_video_url: '',
  hero_video: '',
  hero_poster_url: '/images/toys/hero_banner.jpg',
  hero_subtitle: 'SUMMER FUN SALE 2026',
  hero_title: 'Discover Joyful Play',
  hero_link_1_text: 'EXPLORE TOYS',
  hero_link_1_url: '/shop',
  hero_link_2_text: 'BESTSELLERS',
  hero_link_2_url: '/shop?collection=bestsellers',
  phone: '+1 (800) 555-TOYS',
  whatsapp: '18005558697',
  email: 'creativetoyltd@gmail.com',
  currency: 'USD ($)',
  announcement: '🎉 SUMMER FUN SALE! 30% OFF ALL TOYS · FREE SHIPPING OVER $35! 🧸',
  footerText: 'Creative Toy Ltd. All Rights Reserved.',
};

interface SiteSettingsContextType {
  settings: SiteSettings;
  menuItems: MenuItem[];
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  updateMenuItems: (newItems: MenuItem[]) => void;
  resetSettings: () => void;
}

const SiteSettingsContext = createContext<SiteSettingsContextType | undefined>(undefined);

export function SiteSettingsProvider({ children, initialSettings = {} }: { children: React.ReactNode, initialSettings?: Partial<SiteSettings> }) {
  const [settings, setSettings] = useState<SiteSettings>(() => {
    return { ...DEFAULT_SETTINGS, ...initialSettings };
  });
  const [menuItems, setMenuItems] = useState<MenuItem[]>(FALLBACK_MENU);

  useEffect(() => {
    if (initialSettings && Object.keys(initialSettings).length > 0) {
      setSettings(prev => ({ ...prev, ...initialSettings }));
    }
  }, [initialSettings]);

  useEffect(() => {
    // Dynamically update document favicon and title if settings change
    const faviconHref = settings.favicon_url || settings.site_favicon;
    if (faviconHref) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = faviconHref;
    }
  }, [settings.favicon_url, settings.site_favicon]);

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('rexxo_site_settings', JSON.stringify(updated));
        window.dispatchEvent(new Event('storage'));
      } catch (e) {
        console.error('Failed to save site settings', e);
      }
      return updated;
    });
  };

  const updateMenuItems = (newItems: MenuItem[]) => {
    setMenuItems(newItems);
    try {
      localStorage.setItem('rexxo_menu_items', JSON.stringify(newItems));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error('Failed to save menu items', e);
    }
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    setMenuItems(FALLBACK_MENU);
    try {
      localStorage.removeItem('rexxo_site_settings');
      localStorage.removeItem('rexxo_menu_items');
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error('Failed to reset site settings', e);
    }
  };

  return (
    <SiteSettingsContext.Provider value={{ settings, menuItems, updateSettings, updateMenuItems, resetSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
  }
  return context;
}
