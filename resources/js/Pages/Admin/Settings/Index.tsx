import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Settings as SettingsIcon, Save, Megaphone, Sun, Sparkles, Eye, CheckCircle2 } from 'lucide-react';

interface SettingsProps {
    siteSettings?: Record<string, any>;
}

export default function SettingsPage({ siteSettings: propSettings = {} }: SettingsProps) {
    const pageProps = usePage().props as any;
    const settings = {
        ...(pageProps.siteSettings || {}),
        ...(pageProps.apiSettings || {}),
        ...propSettings,
    };

    const initialAnnouncementEnabled = settings.announcement_enabled !== undefined
        ? (settings.announcement_enabled === '1' || settings.announcement_enabled === 1 || settings.announcement_enabled === true || settings.announcement_enabled === 'true')
        : true;

    const { data, setData, post, processing, recentlySuccessful } = useForm({
        siteName: settings.siteName || settings.site_name || 'Creative Toy',
        tagline: settings.tagline || 'Kids Toy Wonderland',
        email: settings.email || settings.contactEmail || 'creativetoyltd@gmail.com',
        phone: settings.phone || settings.contactPhone || '+1 (800) 555-TOYS',
        whatsapp: settings.whatsapp || '18005558697',
        address: settings.address || '',
        currency: settings.currency || 'USD ($)',
        logo_url: settings.logo_url || '',
        favicon_url: settings.favicon_url || '',
        announcement_enabled: initialAnnouncementEnabled ? '1' : '0',
        announcement: settings.announcement || '🎉 SUMMER FUN SALE! 30% OFF ALL TOYS · FREE SHIPPING OVER $35! 🧸',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/settings', {
            preserveScroll: true,
        });
    };

    const isEnabled = data.announcement_enabled === '1';

    return (
        <AdminLayout
            activePage="settings"
            pageTitle="General System Settings"
            pageSubtitle="Configure site title, top announcement badge, contact info, and branding."
        >
            <Head title="System Settings — Admin" />

            <form onSubmit={handleSubmit} className="space-y-6 max-w-5xl">
                {/* ── 1. Top Announcement Bar Controls (Requested Badge) ── */}
                <div className="bg-white/95 backdrop-blur-xl border border-orange-200/60 p-7 rounded-2xl shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4 flex-wrap gap-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-orange-100 text-orange-600 rounded-xl">
                                <Megaphone className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2">
                                    Top Announcement Bar / Header Badge
                                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                                        isEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                        {isEnabled ? '● Active' : '○ Disabled'}
                                    </span>
                                </h3>
                                <p className="text-[12px] text-slate-500">
                                    Control the promotional bar appearing at the very top of the website
                                </p>
                            </div>
                        </div>

                        {/* On/Off Switch Button */}
                        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-1.5 rounded-xl">
                            <span className="text-[12px] font-bold text-slate-600 pl-2">Display Bar:</span>
                            <button
                                type="button"
                                onClick={() => setData('announcement_enabled', isEnabled ? '0' : '1')}
                                className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors cursor-pointer ${
                                    isEnabled ? 'bg-orange-500' : 'bg-slate-300'
                                }`}
                                aria-label="Toggle Announcement Bar"
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        isEnabled ? 'translate-x-7' : 'translate-x-1'
                                    }`}
                                />
                            </button>
                            <span className={`text-[12px] font-bold pr-1 ${isEnabled ? 'text-orange-600' : 'text-slate-400'}`}>
                                {isEnabled ? 'ON' : 'OFF'}
                            </span>
                        </div>
                    </div>

                    {/* Announcement Text Input */}
                    <div>
                        <label className="text-[11px] uppercase font-bold text-slate-700 tracking-wider block mb-2">
                            Announcement Message / Promotional Offer Text
                        </label>
                        <input
                            type="text"
                            value={data.announcement}
                            onChange={e => setData('announcement', e.target.value)}
                            placeholder="e.g. 🎉 SUMMER FUN SALE! 30% OFF ALL TOYS · FREE SHIPPING OVER $35! 🧸"
                            className="w-full border border-slate-300 px-4 py-3 rounded-xl text-[14px] font-medium outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 bg-white shadow-xs"
                        />
                        <p className="text-[11px] text-slate-500 mt-1.5">
                            Tip: You can use emojis (🎉, 🧸, 🚚) to make the banner more playful and attractive.
                        </p>
                    </div>

                    {/* Live Preview of the Badge */}
                    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                        <div className="flex items-center gap-2 mb-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                            <Eye className="w-3.5 h-3.5" /> Live Storefront Preview
                        </div>

                        {isEnabled && data.announcement.trim() ? (
                            <div className="rounded-lg bg-gradient-to-r from-[#FF705A] via-[#FFB703] to-[#0FB5BA] text-white py-2 px-4 text-center text-[12px] font-bold tracking-wide shadow-xs flex items-center justify-center gap-2">
                                <Sun size={14} className="text-yellow-100 hidden sm:inline" />
                                <span>{data.announcement}</span>
                                <Sparkles size={13} className="text-yellow-100 hidden sm:inline" />
                            </div>
                        ) : (
                            <div className="text-center py-2.5 text-slate-400 text-[12px] italic bg-white border border-dashed border-slate-200 rounded-lg">
                                {isEnabled ? 'No message entered — banner will stay hidden until text is provided.' : 'Announcement bar is currently turned OFF (hidden on storefront).'}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── 2. Branding & Business Details ── */}
                <div className="bg-white/95 backdrop-blur-xl border border-slate-200 p-7 rounded-2xl space-y-6 shadow-sm">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                        <div className="p-2.5 bg-sky-100 text-sky-600 rounded-xl">
                            <SettingsIcon className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-800 uppercase tracking-wide">
                                Branding & Store Details
                            </h3>
                            <p className="text-[11px] text-slate-500">Update storefront identity and contact information</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="text-[11px] uppercase font-bold text-slate-700 tracking-wider block mb-1.5">
                                Site Name / Brand Title *
                            </label>
                            <input
                                type="text"
                                value={data.siteName}
                                onChange={e => setData('siteName', e.target.value)}
                                required
                                className="w-full border border-slate-300 px-4 py-2.5 rounded-xl text-[13px] font-bold outline-none focus:border-sky-500 bg-white shadow-2xs"
                            />
                        </div>

                        <div>
                            <label className="text-[11px] uppercase font-bold text-slate-700 tracking-wider block mb-1.5">
                                Tagline / Subtitle
                            </label>
                            <input
                                type="text"
                                value={data.tagline}
                                onChange={e => setData('tagline', e.target.value)}
                                className="w-full border border-slate-300 px-4 py-2.5 rounded-xl text-[13px] font-medium outline-none focus:border-sky-500 bg-white shadow-2xs"
                            />
                        </div>

                        <div>
                            <label className="text-[11px] uppercase font-bold text-slate-700 tracking-wider block mb-1.5">
                                Store Currency Symbol
                            </label>
                            <input
                                type="text"
                                value={data.currency}
                                onChange={e => setData('currency', e.target.value)}
                                placeholder="e.g. USD ($) or BDT (৳)"
                                className="w-full border border-slate-300 px-4 py-2.5 rounded-xl text-[13px] font-bold outline-none focus:border-sky-500 bg-white shadow-2xs"
                            />
                        </div>

                        <div>
                            <label className="text-[11px] uppercase font-bold text-slate-700 tracking-wider block mb-1.5">
                                Contact Email
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                className="w-full border border-slate-300 px-4 py-2.5 rounded-xl text-[13px] font-medium outline-none focus:border-sky-500 bg-white shadow-2xs"
                            />
                        </div>

                        <div>
                            <label className="text-[11px] uppercase font-bold text-slate-700 tracking-wider block mb-1.5">
                                Support Phone Number
                            </label>
                            <input
                                type="text"
                                value={data.phone}
                                onChange={e => setData('phone', e.target.value)}
                                className="w-full border border-slate-300 px-4 py-2.5 rounded-xl text-[13px] font-mono outline-none focus:border-sky-500 bg-white shadow-2xs"
                            />
                        </div>

                        <div>
                            <label className="text-[11px] uppercase font-bold text-slate-700 tracking-wider block mb-1.5">
                                WhatsApp Customer Support (Numbers Only)
                            </label>
                            <input
                                type="text"
                                value={data.whatsapp}
                                onChange={e => setData('whatsapp', e.target.value)}
                                placeholder="e.g. 18005558697"
                                className="w-full border border-slate-300 px-4 py-2.5 rounded-xl text-[13px] font-mono outline-none focus:border-emerald-500 bg-white shadow-2xs"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="text-[11px] uppercase font-bold text-slate-700 tracking-wider block mb-1.5">
                                Physical Store / Warehouse Address
                            </label>
                            <input
                                type="text"
                                value={data.address}
                                onChange={e => setData('address', e.target.value)}
                                className="w-full border border-slate-300 px-4 py-2.5 rounded-xl text-[13px] font-medium outline-none focus:border-sky-500 bg-white shadow-2xs"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                        {recentlySuccessful ? (
                            <div className="flex items-center gap-2 text-emerald-600 text-[13px] font-bold">
                                <CheckCircle2 className="w-4 h-4" /> Settings Saved Successfully!
                            </div>
                        ) : <div />}

                        <button
                            type="submit"
                            disabled={processing}
                            className="px-8 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-[13px] font-bold uppercase tracking-wider shadow-md shadow-sky-600/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" /> Save System Settings
                        </button>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
