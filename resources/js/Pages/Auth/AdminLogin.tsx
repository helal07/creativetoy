import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Lock, Mail, Eye, EyeOff, ArrowRight, Store, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

interface AdminLoginProps {
    siteSettings?: Record<string, any>;
}

export default function AdminLogin({ siteSettings: directSettings }: AdminLoginProps) {
    const pageProps: any = usePage().props;
    const settings = directSettings || pageProps.siteSettings || pageProps.apiSettings || {};
    const siteName = settings.siteName || settings.site_name || 'Creative Toy';
    const logoUrl = settings.logo_url || settings.site_logo;
    const tagline = settings.tagline || 'Joy of Play & Imagination';

    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/login');
    };

    const fillDemoCredentials = () => {
        setData({
            ...data,
            email: 'admin@rexxobd.com',
            password: 'password123',
        });
    };

    return (
        <div className="min-h-screen flex flex-col justify-between relative overflow-x-hidden bg-slate-50 text-slate-800 selection:bg-[#0055BF] selection:text-white font-sans">
            <Head title={`Admin Login | ${siteName}`} />

            {/* Subtle Lego Baseplate Stud Background Pattern */}
            <div 
                className="absolute inset-0 pointer-events-none z-0 opacity-40"
                style={{
                    backgroundImage: 'radial-gradient(circle, #94a3b8 1.75px, transparent 1.75px)',
                    backgroundSize: '28px 28px',
                }}
            />

            {/* Soft Ambient Colorful Toy Glows */}
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-red-400/10 rounded-full blur-3xl pointer-events-none z-0" />
            <div className="absolute top-1/4 -right-32 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none z-0" />
            <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none z-0" />

            {/* Top Classic Header */}
            <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    {/* Dynamic Logo or Lego Brick Badge */}
                    {logoUrl ? (
                        <img 
                            src={logoUrl} 
                            alt={siteName} 
                            className="h-9 w-auto max-w-[160px] object-contain drop-shadow-sm" 
                            onError={(e) => {
                                (e.currentTarget as HTMLElement).style.display = 'none';
                            }}
                        />
                    ) : (
                        <div className="flex items-center gap-1.5 p-2 bg-white rounded-xl shadow-sm border border-slate-200">
                            <span className="w-3.5 h-3.5 rounded-full bg-[#E52521] shadow-xs" />
                            <span className="w-3.5 h-3.5 rounded-full bg-[#FDB813] shadow-xs" />
                            <span className="w-3.5 h-3.5 rounded-full bg-[#0055BF] shadow-xs" />
                            <span className="w-3.5 h-3.5 rounded-full bg-[#00853D] shadow-xs" />
                        </div>
                    )}

                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-base tracking-tight">{siteName}</span>
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#0055BF] border border-blue-200 uppercase tracking-wider">
                                Admin Portal
                            </span>
                        </div>
                        <span className="text-xs text-slate-500 hidden sm:block">{tagline}</span>
                    </div>
                </div>

                <a 
                    href="/" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 rounded-xl text-xs font-semibold shadow-xs transition-all duration-150"
                >
                    <Store className="w-4 h-4 text-[#0055BF]" />
                    <span>View Storefront</span>
                </a>
            </header>

            {/* Main Center Login Card */}
            <main className="relative z-10 max-w-md mx-auto w-full px-4 my-8">
                <div className="bg-white border border-slate-200/90 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.08)] rounded-3xl overflow-hidden">
                    
                    {/* Iconic Lego 4-Stud Accent Bar */}
                    <div className="bg-slate-900 px-6 py-2.5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-slate-300 tracking-wider uppercase">Creative Toy Studio</span>
                        </div>
                        
                        {/* 4 Tactile Lego Studs: Red, Yellow, Blue, Green */}
                        <div className="flex items-center gap-2">
                            <div title="Lego Red" className="w-4 h-4 rounded-full bg-[#E52521] shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_1px_2px_rgba(0,0,0,0.3)] border border-red-700/40 relative">
                                <div className="absolute inset-0.5 rounded-full border border-white/40" />
                            </div>
                            <div title="Lego Yellow" className="w-4 h-4 rounded-full bg-[#FDB813] shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_1px_2px_rgba(0,0,0,0.3)] border border-amber-600/40 relative">
                                <div className="absolute inset-0.5 rounded-full border border-white/40" />
                            </div>
                            <div title="Lego Blue" className="w-4 h-4 rounded-full bg-[#0055BF] shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_1px_2px_rgba(0,0,0,0.3)] border border-blue-800/40 relative">
                                <div className="absolute inset-0.5 rounded-full border border-white/40" />
                            </div>
                            <div title="Lego Green" className="w-4 h-4 rounded-full bg-[#00853D] shadow-[inset_0_1px_2px_rgba(255,255,255,0.6),0_1px_2px_rgba(0,0,0,0.3)] border border-emerald-800/40 relative">
                                <div className="absolute inset-0.5 rounded-full border border-white/40" />
                            </div>
                        </div>
                    </div>

                    <div className="p-8 sm:p-9">
                        {/* Logo & Card Header */}
                        <div className="text-center mb-7">
                            {logoUrl ? (
                                <div className="mb-4 flex justify-center">
                                    <img 
                                        src={logoUrl} 
                                        alt={siteName} 
                                        className="h-14 max-w-[220px] object-contain drop-shadow-sm transition-transform hover:scale-105 duration-200" 
                                    />
                                </div>
                            ) : (
                                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-[#0055BF] text-white flex items-center justify-center font-bold text-2xl shadow-md shadow-blue-500/20">
                                    {siteName.charAt(0)}
                                </div>
                            )}

                            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                                {siteName} Admin
                            </h1>
                            <p className="text-xs text-slate-500 mt-1">
                                Welcome back! Please sign in to manage your store.
                            </p>
                        </div>

                        {/* Error Alert */}
                        {errors.email && (
                            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2.5">
                                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                                <span className="font-medium">{errors.email}</span>
                            </div>
                        )}

                        {/* Login Form */}
                        <form onSubmit={submit} className="space-y-4">
                            
                            {/* Email Field */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Email Address
                                </label>
                                <div className="flex items-center bg-slate-50 hover:bg-slate-100/70 border border-slate-300 rounded-xl px-3.5 py-3 focus-within:bg-white focus-within:border-[#0055BF] focus-within:ring-2 focus-within:ring-[#0055BF]/20 transition-all">
                                    <Mail className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                                    <input 
                                        type="email" 
                                        name="email" 
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="admin@example.com"
                                        required 
                                        autoComplete="username"
                                        className="w-full bg-transparent text-sm text-slate-900 border-none ring-0 outline-none focus:ring-0 focus:outline-none placeholder:text-slate-400 font-medium" 
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Password
                                </label>
                                <div className="flex items-center bg-slate-50 hover:bg-slate-100/70 border border-slate-300 rounded-xl px-3.5 py-3 focus-within:bg-white focus-within:border-[#0055BF] focus-within:ring-2 focus-within:ring-[#0055BF]/20 transition-all">
                                    <Lock className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
                                    <input 
                                        type={showPassword ? 'text' : 'password'} 
                                        name="password" 
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="••••••••"
                                        required 
                                        autoComplete="current-password"
                                        className="w-full bg-transparent text-sm text-slate-900 border-none ring-0 outline-none focus:ring-0 focus:outline-none placeholder:text-slate-400 font-medium" 
                                    />
                                    <button 
                                        type="button" 
                                        onClick={() => setShowPassword(!showPassword)} 
                                        className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                                        title={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Remember & Demo Credentials Helpers */}
                            <div className="flex items-center justify-between pt-1 text-xs">
                                <label className="flex items-center gap-2 cursor-pointer text-slate-600 hover:text-slate-800">
                                    <input 
                                        type="checkbox" 
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="rounded border-slate-300 text-[#0055BF] focus:ring-[#0055BF]/20 w-4 h-4 cursor-pointer"
                                    />
                                    <span>Remember me</span>
                                </label>

                                <button 
                                    type="button" 
                                    onClick={fillDemoCredentials}
                                    className="inline-flex items-center gap-1 text-[#0055BF] hover:text-blue-800 font-semibold cursor-pointer transition-colors"
                                    title="Auto-fill default credentials"
                                >
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>Demo Credentials</span>
                                </button>
                            </div>

                            {/* Submit Button */}
                            <button 
                                type="submit" 
                                disabled={processing}
                                className="w-full mt-3 bg-gradient-to-r from-[#0055BF] via-[#0284c7] to-[#0055BF] hover:from-[#00449E] hover:to-[#0275b1] text-white py-3.5 px-6 text-sm font-bold tracking-wide rounded-xl shadow-md hover:shadow-lg hover:shadow-blue-500/20 active:translate-y-0.5 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {processing ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Signing in...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Sign In to Admin</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Clean Footer Bar within Card */}
                    <div className="bg-slate-50 border-t border-slate-100 px-8 py-3.5 flex items-center justify-center text-xs text-slate-500">
                        <span className="flex items-center gap-1.5 font-medium">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            Secure Store Management Console
                        </span>
                    </div>
                </div>
            </main>

            {/* Clean, Classic Footer */}
            <footer className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500 border-t border-slate-200/70">
                <div>
                    © {new Date().getFullYear()} <span className="font-semibold text-slate-700">{siteName}</span>. All rights reserved.
                </div>
                <div className="flex items-center gap-4">
                    <a href="/" target="_blank" rel="noreferrer" className="hover:text-slate-800 transition-colors">
                        Storefront
                    </a>
                    <span>•</span>
                    <span className="text-slate-400">Powered by Creative Toy</span>
                </div>
            </footer>
        </div>
    );
}

AdminLogin.layout = (page: React.ReactNode) => <>{page}</>;
