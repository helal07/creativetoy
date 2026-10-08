import React, { useState, useRef } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Layers,
    Plus,
    Edit2,
    Trash2,
    Check,
    X,
    FolderPlus,
    Tag,
    UploadCloud,
    Image as ImageIcon,
    Search,
    ChevronRight,
    Package
} from 'lucide-react';

interface Category {
    id: number;
    parent_id?: number | null;
    name: string;
    slug?: string;
    description?: string;
    image_url?: string;
    sort_order?: number;
    is_active?: boolean;
    children?: Category[];
    products?: any[];
}

interface CategoriesProps {
    categories: Category[];
}

export default function Categories({ categories = [] }: CategoriesProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const editFileInputRef = useRef<HTMLInputElement>(null);

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Add Form State
    const { data, setData, post, processing, reset, errors } = useForm<{
        name: string;
        parent_id: string;
        description: string;
        sort_order: string;
        image: File | null;
    }>({
        name: '',
        parent_id: '',
        description: '',
        sort_order: '',
        image: null,
    });

    // Edit Modal/State
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [editData, setEditData] = useState<{
        name: string;
        parent_id: string;
        description: string;
        sort_order: string;
        image: File | null;
        image_url: string;
    }>({
        name: '',
        parent_id: '',
        description: '',
        sort_order: '',
        image: null,
        image_url: '',
    });
    const [editImagePreview, setEditImagePreview] = useState<string | null>(null);

    const rootCategories = categories.filter(c => !c.parent_id);

    // Handle Image Selection for Create
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setData('image', null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Handle Create Category
    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/categories', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                reset();
                removeImage();
            },
        });
    };

    // Handle Start Edit
    const startEditing = (cat: Category) => {
        setEditingCategory(cat);
        setEditData({
            name: cat.name,
            parent_id: cat.parent_id ? String(cat.parent_id) : '',
            description: cat.description || '',
            sort_order: cat.sort_order ? String(cat.sort_order) : '',
            image: null,
            image_url: cat.image_url || '',
        });
        setEditImagePreview(cat.image_url || null);
    };

    const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setEditData(prev => ({ ...prev, image: file }));
            setEditImagePreview(URL.createObjectURL(file));
        }
    };

    const removeEditImage = () => {
        setEditData(prev => ({ ...prev, image: null, image_url: '' }));
        setEditImagePreview(null);
        if (editFileInputRef.current) {
            editFileInputRef.current.value = '';
        }
    };

    // Handle Update Category
    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingCategory) return;

        router.post(`/admin/categories/${editingCategory.id}`, {
            _method: 'put',
            ...editData,
        }, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setEditingCategory(null);
            },
        });
    };

    // Handle Delete Category
    const handleDelete = (id: number, name: string) => {
        if (confirm(`Are you sure you want to delete category "${name}"? Nested products or subcategories may also be affected.`)) {
            router.delete(`/admin/categories/${id}`, {
                preserveScroll: true,
            });
        }
    };

    // Filter categories based on search
    const filteredRootCategories = rootCategories.filter(cat => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        const matchesName = cat.name.toLowerCase().includes(q);
        const subcats = categories.filter(sub => sub.parent_id === cat.id);
        const matchesSubcat = subcats.some(sub => sub.name.toLowerCase().includes(q));
        return matchesName || matchesSubcat;
    });

    return (
        <AdminLayout
            activePage="categories"
            pageTitle="Category Management"
            pageSubtitle="Organize products into main categories, subcategories, and set category banner/cover images."
        >
            <Head title="Categories — Admin" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* LEFT: ADD NEW CATEGORY FORM (4 COLS) */}
                <div className="lg:col-span-4 bg-white/95 backdrop-blur-xl border border-slate-200/90 p-6 sm:p-7 rounded-2xl space-y-6 shadow-sm sticky top-24">
                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                        <div className="p-2.5 bg-blue-50 text-[#0055BF] rounded-xl border border-blue-100">
                            <FolderPlus className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-900 tracking-tight">
                                Add New Category
                            </h3>
                            <p className="text-xs text-slate-500">Create root category or subcategory with image</p>
                        </div>
                    </div>

                    <form onSubmit={handleCreate} className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                                Category Name <span className="text-rose-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                required
                                placeholder="e.g. Soft Toys, Wooden Toys, Building Blocks"
                                className="w-full border border-slate-300 px-3.5 py-2.5 rounded-xl text-sm font-medium outline-none focus:border-[#0055BF] focus:ring-2 focus:ring-blue-500/10 bg-white transition-all shadow-2xs"
                            />
                            {errors.name && <p className="text-rose-600 text-xs mt-1">{errors.name}</p>}
                        </div>

                        {/* Parent Category */}
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                                Parent Category (Optional)
                            </label>
                            <select
                                value={data.parent_id}
                                onChange={e => setData('parent_id', e.target.value)}
                                className="w-full border border-slate-300 px-3.5 py-2.5 rounded-xl text-xs font-medium outline-none focus:border-[#0055BF] bg-white transition-all shadow-2xs appearance-none"
                            >
                                <option value="">-- Main Root Category (No Parent) --</option>
                                {rootCategories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        📁 {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Category Image Upload */}
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                                Category Image (Optional)
                            </label>
                            
                            {imagePreview ? (
                                <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-2 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <img 
                                            src={imagePreview} 
                                            alt="Preview" 
                                            className="w-12 h-12 rounded-lg object-cover shadow-xs border border-slate-200" 
                                        />
                                        <span className="text-xs font-semibold text-slate-700 truncate max-w-[150px]">
                                            {data.image?.name || 'Selected Image'}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors cursor-pointer"
                                        title="Remove image"
                                    >
                                        <X size={15} />
                                    </button>
                                </div>
                            ) : (
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-slate-300 hover:border-[#0055BF] hover:bg-blue-50/30 rounded-xl p-4 text-center cursor-pointer transition-all"
                                >
                                    <UploadCloud className="w-7 h-7 mx-auto text-slate-400 group-hover:text-[#0055BF] mb-1" />
                                    <span className="text-xs font-bold text-slate-700 block">Click to upload category image</span>
                                    <span className="text-[10px] text-slate-400 block mt-0.5">PNG, JPG, WEBP up to 5MB</span>
                                </div>
                            )}

                            <input 
                                ref={fileInputRef}
                                type="file" 
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden" 
                            />
                            {errors.image && <p className="text-rose-600 text-xs mt-1">{errors.image}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                                Description (Optional)
                            </label>
                            <textarea
                                rows={2}
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                placeholder="Brief description of toys in this category..."
                                className="w-full border border-slate-300 px-3.5 py-2 rounded-xl text-xs outline-none focus:border-[#0055BF] bg-white transition-all shadow-2xs"
                            />
                        </div>

                        {/* Sort Order */}
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                                Sort Order (Optional)
                            </label>
                            <input
                                type="number"
                                value={data.sort_order}
                                onChange={e => setData('sort_order', e.target.value)}
                                placeholder="e.g. 1"
                                className="w-full border border-slate-300 px-3.5 py-2 rounded-xl text-xs font-medium outline-none focus:border-[#0055BF] bg-white transition-all shadow-2xs"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-[#0055BF] hover:bg-[#00449E] text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                        >
                            {processing ? (
                                <span>Saving...</span>
                            ) : (
                                <>
                                    <Plus className="w-4 h-4" />
                                    <span>Save Category</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* RIGHT: MASTER CATEGORY TREE TABLE (8 COLS) */}
                <div className="lg:col-span-8 bg-white/95 backdrop-blur-xl border border-slate-200/90 p-6 sm:p-7 rounded-2xl space-y-5 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-blue-50 text-[#0055BF] rounded-xl border border-blue-100">
                                <Layers className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                                    Store Categories ({categories.length})
                                </h3>
                                <p className="text-xs text-slate-500">Root categories, subcategories, and images</p>
                            </div>
                        </div>

                        {/* Search Filter */}
                        <div className="relative w-full sm:w-64">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search categories..."
                                className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#0055BF] bg-slate-50"
                            />
                            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    <X size={12} />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="space-y-3.5">
                        {filteredRootCategories.length > 0 ? (
                            filteredRootCategories.map(cat => {
                                const subcats = categories.filter(sub => sub.parent_id === cat.id);
                                return (
                                    <div key={cat.id} className="border border-slate-200 rounded-2xl p-4 bg-slate-50/70 hover:bg-slate-50 transition-colors space-y-3">
                                        
                                        {/* Main Category Row */}
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                {/* Category Image Thumbnail */}
                                                {cat.image_url ? (
                                                    <img 
                                                        src={cat.image_url} 
                                                        alt={cat.name} 
                                                        className="w-11 h-11 rounded-xl object-cover border border-slate-200 shadow-2xs shrink-0" 
                                                    />
                                                ) : (
                                                    <div className="w-11 h-11 rounded-xl bg-blue-100 text-[#0055BF] flex items-center justify-center font-bold text-sm border border-blue-200 shrink-0">
                                                        {cat.name.charAt(0)}
                                                    </div>
                                                )}

                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-sm text-slate-900">{cat.name}</span>
                                                        <span className="text-[10px] font-bold uppercase bg-blue-100 text-[#0055BF] px-2 py-0.5 rounded-full border border-blue-200">
                                                            Main Category
                                                        </span>
                                                    </div>
                                                    <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                                                        <span>Slug: /{cat.slug}</span>
                                                        {cat.products && (
                                                            <>
                                                                <span>•</span>
                                                                <span className="flex items-center gap-1 text-slate-600 font-medium">
                                                                    <Package size={12} /> {cat.products.length} Products
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-1.5 shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={() => startEditing(cat)}
                                                    className="p-2 text-slate-600 hover:text-[#0055BF] hover:bg-blue-50 rounded-xl transition-colors cursor-pointer border border-slate-200 bg-white"
                                                    title="Edit category"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(cat.id, cat.name)}
                                                    className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer border border-slate-200 bg-white"
                                                    title="Delete category"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Subcategories Container */}
                                        {subcats.length > 0 && (
                                            <div className="pl-6 space-y-2 border-l-2 border-blue-200 pt-1 mt-2">
                                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                                                    Subcategories ({subcats.length})
                                                </span>
                                                {subcats.map(sub => (
                                                    <div key={sub.id} className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                                                        <div className="flex items-center gap-2.5">
                                                            {sub.image_url ? (
                                                                <img 
                                                                    src={sub.image_url} 
                                                                    alt={sub.name} 
                                                                    className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0" 
                                                                />
                                                            ) : (
                                                                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0">
                                                                    ↳
                                                                </div>
                                                            )}
                                                            <div>
                                                                <span className="text-xs font-bold text-slate-800 block">{sub.name}</span>
                                                                <span className="text-[10px] text-slate-400">/{sub.slug}</span>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                type="button"
                                                                onClick={() => startEditing(sub)}
                                                                className="p-1.5 text-slate-500 hover:text-[#0055BF] hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                                                title="Edit subcategory"
                                                            >
                                                                <Edit2 className="w-3 h-3" />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDelete(sub.id, sub.name)}
                                                                className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                                                title="Delete subcategory"
                                                            >
                                                                <Trash2 className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="p-12 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
                                <FolderPlus className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                                <span className="font-bold text-sm block text-slate-600">No categories found</span>
                                <span className="text-xs">Add your first product category using the form on the left.</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* EDIT CATEGORY MODAL */}
            {editingCategory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fade-in">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-5">
                            <div className="flex items-center gap-2">
                                <Edit2 className="w-5 h-5 text-[#0055BF]" />
                                <h3 className="font-bold text-base text-slate-900">
                                    Edit Category: {editingCategory.name}
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setEditingCategory(null)}
                                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                                    Category Name
                                </label>
                                <input
                                    type="text"
                                    value={editData.name}
                                    onChange={e => setEditData(prev => ({ ...prev, name: e.target.value }))}
                                    required
                                    className="w-full border border-slate-300 px-3.5 py-2.5 rounded-xl text-sm font-medium outline-none focus:border-[#0055BF]"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                                    Parent Category
                                </label>
                                <select
                                    value={editData.parent_id}
                                    onChange={e => setEditData(prev => ({ ...prev, parent_id: e.target.value }))}
                                    className="w-full border border-slate-300 px-3.5 py-2.5 rounded-xl text-xs font-medium outline-none focus:border-[#0055BF] bg-white appearance-none"
                                >
                                    <option value="">-- Main Root Category (No Parent) --</option>
                                    {rootCategories.filter(c => c.id !== editingCategory.id).map(cat => (
                                        <option key={cat.id} value={cat.id}>
                                            📁 {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Image in Edit */}
                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                                    Category Image
                                </label>
                                {editImagePreview ? (
                                    <div className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50 p-2 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <img 
                                                src={editImagePreview} 
                                                alt="Preview" 
                                                className="w-12 h-12 rounded-lg object-cover shadow-xs border border-slate-200" 
                                            />
                                            <span className="text-xs font-semibold text-slate-700 truncate max-w-[150px]">
                                                {editData.image?.name || 'Current Image'}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={removeEditImage}
                                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors cursor-pointer"
                                            title="Remove image"
                                        >
                                            <X size={15} />
                                        </button>
                                    </div>
                                ) : (
                                    <div 
                                        onClick={() => editFileInputRef.current?.click()}
                                        className="border-2 border-dashed border-slate-300 hover:border-[#0055BF] hover:bg-blue-50/30 rounded-xl p-4 text-center cursor-pointer transition-all"
                                    >
                                        <UploadCloud className="w-6 h-6 mx-auto text-slate-400 mb-1" />
                                        <span className="text-xs font-bold text-slate-700 block">Click to upload new image</span>
                                    </div>
                                )}
                                <input 
                                    ref={editFileInputRef}
                                    type="file" 
                                    accept="image/*"
                                    onChange={handleEditImageChange}
                                    className="hidden" 
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                                    Description
                                </label>
                                <textarea
                                    rows={2}
                                    value={editData.description}
                                    onChange={e => setEditData(prev => ({ ...prev, description: e.target.value }))}
                                    className="w-full border border-slate-300 px-3.5 py-2 rounded-xl text-xs outline-none focus:border-[#0055BF]"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1.5">
                                    Sort Order
                                </label>
                                <input
                                    type="number"
                                    value={editData.sort_order}
                                    onChange={e => setEditData(prev => ({ ...prev, sort_order: e.target.value }))}
                                    className="w-full border border-slate-300 px-3.5 py-2 rounded-xl text-xs outline-none focus:border-[#0055BF]"
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-3">
                                <button
                                    type="submit"
                                    className="flex-1 bg-[#0055BF] hover:bg-[#00449E] text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md"
                                >
                                    Update Category
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditingCategory(null)}
                                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
