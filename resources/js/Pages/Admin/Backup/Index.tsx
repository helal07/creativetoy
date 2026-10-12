import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Database,
    Archive,
    FolderArchive,
    HardDriveDownload,
    Download,
    Trash2,
    RefreshCw,
    Clock,
    CheckCircle2,
    AlertCircle,
    Layers,
    FileText,
    Image as ImageIcon,
    ShieldAlert
} from 'lucide-react';

interface BackupItem {
    name: string;
    type: 'database' | 'media' | 'full' | string;
    size_bytes: number;
    size_formatted: string;
    created_at: string;
    timestamp: number;
}

interface BackupStats {
    total_count: number;
    total_size: string;
    database_count: number;
    media_count: number;
    full_count: number;
    latest_backup: string | null;
}

interface BackupPageProps {
    backups: BackupItem[];
    stats: BackupStats;
}

export default function BackupIndex({ backups = [], stats }: BackupPageProps) {
    const { flash } = usePage<{ flash?: { success?: string | null; error?: string | null } }>().props;
    const [generatingType, setGeneratingType] = useState<string | null>(null);
    const [deletingFile, setDeletingFile] = useState<string | null>(null);

    const handleGenerate = (type: 'database' | 'media' | 'full') => {
        setGeneratingType(type);
        router.post('/admin/backups/generate', { type }, {
            preserveScroll: true,
            onFinish: () => setGeneratingType(null),
        });
    };

    const handleDelete = (filename: string) => {
        if (!confirm(`Are you sure you want to delete the backup file "${filename}"? This action cannot be undone.`)) {
            return;
        }

        setDeletingFile(filename);
        router.delete(`/admin/backups/${encodeURIComponent(filename)}`, {
            preserveScroll: true,
            onFinish: () => setDeletingFile(null),
        });
    };

    const getTypeBadge = (type: string) => {
        switch (type) {
            case 'database':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <Database className="w-3.5 h-3.5" />
                        Database
                    </span>
                );
            case 'media':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <ImageIcon className="w-3.5 h-3.5" />
                        Media Assets
                    </span>
                );
            case 'full':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                        <Archive className="w-3.5 h-3.5" />
                        Full Backup
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        <FileText className="w-3.5 h-3.5" />
                        Archive
                    </span>
                );
        }
    };

    return (
        <AdminLayout
            activePage="backups"
            pageTitle="System Backup & Recovery"
            pageSubtitle="Generate, manage, and download full database and media archives"
        >
            <Head title="System Backups - Admin" />

            <div className="space-y-6">
                {/* Flash Messages */}
                {flash?.success && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium shadow-2xs animate-fade-in">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span>{flash.success}</span>
                    </div>
                )}

                {flash?.error && (
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-medium shadow-2xs animate-fade-in">
                        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                        <span>{flash.error}</span>
                    </div>
                )}

                {/* Top Backup Generation Action Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {/* 1. Database Backup */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-500/5 rounded-bl-full pointer-events-none group-hover:bg-emerald-500/10 transition-colors" />
                        <div className="space-y-3">
                            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                                <Database className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Database Backup</h3>
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                    Export all MySQL database tables, schemas, and records into a compressed SQL archive.
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 pt-4 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => handleGenerate('database')}
                                disabled={generatingType !== null}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                            >
                                <RefreshCw className={`w-4 h-4 ${generatingType === 'database' ? 'animate-spin' : ''}`} />
                                <span>{generatingType === 'database' ? 'Generating SQL...' : 'Generate DB Backup'}</span>
                            </button>
                        </div>
                    </div>

                    {/* 2. Media Backup */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-28 h-28 bg-amber-500/5 rounded-bl-full pointer-events-none group-hover:bg-amber-500/10 transition-colors" />
                        <div className="space-y-3">
                            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                                <FolderArchive className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Media Files Backup</h3>
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                    Compress all user uploaded products, categories, CMS banners, and media into a zip archive.
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 pt-4 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => handleGenerate('media')}
                                disabled={generatingType !== null}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-amber-600 hover:bg-amber-700 active:scale-[0.98] text-white transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                            >
                                <RefreshCw className={`w-4 h-4 ${generatingType === 'media' ? 'animate-spin' : ''}`} />
                                <span>{generatingType === 'media' ? 'Zipping Media...' : 'Generate Media Backup'}</span>
                            </button>
                        </div>
                    </div>

                    {/* 3. Full Backup */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-28 h-28 bg-purple-500/5 rounded-bl-full pointer-events-none group-hover:bg-purple-500/10 transition-colors" />
                        <div className="space-y-3">
                            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                                <HardDriveDownload className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900">Full System Backup</h3>
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                    Complete backup package containing both the full MySQL database and all media assets.
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 pt-4 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => handleGenerate('full')}
                                disabled={generatingType !== null}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-purple-600 hover:bg-purple-700 active:scale-[0.98] text-white transition-all shadow-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                            >
                                <RefreshCw className={`w-4 h-4 ${generatingType === 'full' ? 'animate-spin' : ''}`} />
                                <span>{generatingType === 'full' ? 'Packaging Full...' : 'Generate Full Backup'}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Storage & Stat Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
                        <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                            <span>Total Backups</span>
                            <Layers className="w-4 h-4 text-sky-500" />
                        </div>
                        <p className="text-2xl font-black text-slate-900 mt-2">{stats.total_count}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Stored archives</p>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
                        <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                            <span>Storage Used</span>
                            <Archive className="w-4 h-4 text-purple-500" />
                        </div>
                        <p className="text-2xl font-black text-slate-900 mt-2">{stats.total_size}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">In local storage</p>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
                        <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                            <span>Breakdown</span>
                            <Database className="w-4 h-4 text-emerald-500" />
                        </div>
                        <p className="text-sm font-bold text-slate-800 mt-2">
                            {stats.database_count} DB / {stats.media_count} Media / {stats.full_count} Full
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">By category</p>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
                        <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                            <span>Latest Backup</span>
                            <Clock className="w-4 h-4 text-amber-500" />
                        </div>
                        <p className="text-sm font-bold text-slate-800 mt-2 truncate">
                            {stats.latest_backup || 'Never'}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Most recent run</p>
                    </div>
                </div>

                {/* Security & Information Notice */}
                <div className="bg-sky-50/70 border border-sky-200 rounded-xl p-4 flex items-start gap-3">
                    <ShieldAlert className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                    <div className="text-xs text-sky-900 space-y-1">
                        <p className="font-bold">Security & Storage Notice</p>
                        <p className="text-sky-700 leading-relaxed">
                            Backup files are securely saved in <code className="bg-white px-1.5 py-0.5 rounded text-sky-900 font-mono text-[11px] border border-sky-200">storage/app/backups/</code> which is protected from direct public access. Only logged-in administrators can download or delete these files. Regularly download important backups to your offline local storage.
                        </p>
                    </div>
                </div>

                {/* Backups Table */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                        <div>
                            <h2 className="text-base font-bold text-slate-900">Backup Archives History</h2>
                            <p className="text-xs text-slate-500 mt-0.5">List of generated backups available for local download</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => router.reload({ preserveScroll: true })}
                            className="p-2 rounded-xl text-slate-500 hover:text-sky-600 hover:bg-slate-50 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                            title="Refresh table"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Refresh</span>
                        </button>
                    </div>

                    {backups.length === 0 ? (
                        <div className="p-12 text-center space-y-3">
                            <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                                <Archive className="w-7 h-7" />
                            </div>
                            <h4 className="text-sm font-bold text-slate-800">No Backup Files Found</h4>
                            <p className="text-xs text-slate-500 max-w-sm mx-auto">
                                You haven&apos;t generated any system backups yet. Click on one of the generate buttons above to create your first backup.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                        <th className="py-3.5 px-4">File Name</th>
                                        <th className="py-3.5 px-4">Type</th>
                                        <th className="py-3.5 px-4">Size</th>
                                        <th className="py-3.5 px-4">Created Date</th>
                                        <th className="py-3.5 px-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-xs">
                                    {backups.map((backup) => (
                                        <tr key={backup.name} className="hover:bg-slate-50/70 transition-colors">
                                            <td className="py-3.5 px-4 font-mono font-medium text-slate-800">
                                                <div className="flex items-center gap-2">
                                                    <Archive className="w-4 h-4 text-slate-400 shrink-0" />
                                                    <span className="truncate max-w-xs md:max-w-md">{backup.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4 whitespace-nowrap">
                                                {getTypeBadge(backup.type)}
                                            </td>
                                            <td className="py-3.5 px-4 font-semibold text-slate-700 whitespace-nowrap">
                                                {backup.size_formatted}
                                            </td>
                                            <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                                                {backup.created_at}
                                            </td>
                                            <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                                <div className="inline-flex items-center gap-1.5">
                                                    {/* Download link */}
                                                    <a
                                                        href={`/admin/backups/download/${encodeURIComponent(backup.name)}`}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-50 text-sky-700 hover:bg-sky-600 hover:text-white border border-sky-200 transition-all shadow-2xs"
                                                    >
                                                        <Download className="w-3.5 h-3.5" />
                                                        <span>Download</span>
                                                    </a>

                                                    {/* Delete button */}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(backup.name)}
                                                        disabled={deletingFile === backup.name}
                                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors disabled:opacity-50 cursor-pointer"
                                                        title="Delete backup"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                        <span className="sr-only">Delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
