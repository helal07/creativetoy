export interface Category {
  id: number;
  parent_id: number | null;
  name: string;
  slug: string;
  description?: string | null;
  image_url?: string | null;
  sort_order: number;
  is_active: boolean;
  products_count?: number;
  children?: Category[];
  parent?: Category | null;
}

export interface MenuItem {
  id: number;
  parent_id: number | null;
  label: string;
  url: string | null;
  column_group?: 'left' | 'highlights' | null;
  image_url?: string | null;
  sort_order: number;
  is_active: boolean;
  children?: MenuItem[];
  parent?: MenuItem | null;
}

export interface ProductImage {
  id: number;
  image_url: string;
  sort_order: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  category_id?: number | null;
  scent_family: string;
  concentration: string;
  sizes: string[];
  price: number;
  short_description: string;
  description: string;
  notes_top: string;
  notes_heart: string;
  notes_base: string;
  primary_image_url: string;
  secondary_image_url?: string;
  gender: 'women' | 'men' | 'unisex';
  is_featured: boolean;
  is_new_arrival: boolean;
  stock: number;
  images?: ProductImage[];
  category?: Category;
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

// Fallback hierarchical categories and subcategories
export const FALLBACK_CATEGORIES: Category[] = [
  {
    id: 1,
    parent_id: null,
    name: "Soft Toys",
    slug: "soft-toys",
    description: "Cuddly plush teddy bears, animal friends, and plush dolls.",
    sort_order: 1,
    is_active: true,
    children: [
      { id: 11, parent_id: 1, name: "Teddy Bears", slug: "teddy-bears", sort_order: 1, is_active: true },
      { id: 12, parent_id: 1, name: "Plush Animals", slug: "plush-animals", sort_order: 2, is_active: true },
      { id: 13, parent_id: 1, name: "Baby Comforters", slug: "baby-comforters", sort_order: 3, is_active: true },
    ]
  },
  {
    id: 2,
    parent_id: null,
    name: "Wooden Toys",
    slug: "wooden-toys",
    description: "Natural organic beech wood stacking rings, puzzles, and sensory blocks.",
    sort_order: 2,
    is_active: true,
    children: [
      { id: 21, parent_id: 2, name: "Stacking Rings", slug: "stacking-rings", sort_order: 1, is_active: true },
      { id: 22, parent_id: 2, name: "Wooden Puzzles", slug: "wooden-puzzles", sort_order: 2, is_active: true },
      { id: 23, parent_id: 2, name: "Activity Cubes", slug: "activity-cubes", sort_order: 3, is_active: true },
    ]
  },
  {
    id: 3,
    parent_id: null,
    name: "Building Blocks",
    slug: "build-blocks",
    description: "Stacking cubes, magnetic tiles, and construction sets.",
    sort_order: 3,
    is_active: true,
    children: [
      { id: 31, parent_id: 3, name: "Stacking Cubes", slug: "stacking-cubes", sort_order: 1, is_active: true },
      { id: 32, parent_id: 3, name: "Magnetic Tiles", slug: "magnetic-tiles", sort_order: 2, is_active: true },
    ]
  },
  {
    id: 4,
    parent_id: null,
    name: "Dolls & Dollhouses",
    slug: "dolls",
    description: "Miniature dollhouses, baby dolls, and accessories.",
    sort_order: 4,
    is_active: true,
    children: [
      { id: 41, parent_id: 4, name: "Dollhouses", slug: "dollhouses", sort_order: 1, is_active: true },
      { id: 42, parent_id: 4, name: "Baby Dolls", slug: "baby-dolls", sort_order: 2, is_active: true },
    ]
  },
  {
    id: 5,
    parent_id: null,
    name: "Outdoor & Play",
    slug: "outdoor",
    description: "Water tables, garden games, and outdoor fun.",
    sort_order: 5,
    is_active: true,
    children: [
      { id: 51, parent_id: 5, name: "Water Tables", slug: "water-tables", sort_order: 1, is_active: true },
      { id: 52, parent_id: 5, name: "Bicycles & Trikes", slug: "bicycles-trikes", sort_order: 2, is_active: true },
    ]
  },
  {
    id: 6,
    parent_id: null,
    name: "Learning & STEM",
    slug: "learn-stem",
    description: "Brain teasers, science sets, and alphabet discovery.",
    sort_order: 6,
    is_active: true,
  }
];

// Fallback data for menu items with sub-items
export const FALLBACK_MENU: MenuItem[] = [
  {
    id: 1,
    parent_id: null,
    label: "SHOP ALL",
    url: "/shop",
    sort_order: 1,
    is_active: true,
    children: [
      { id: 101, parent_id: 1, label: "All Toys & Games", url: "/shop", sort_order: 1, is_active: true },
      { id: 102, parent_id: 1, label: "New Arrivals", url: "/shop?collection=new-arrivals", sort_order: 2, is_active: true },
      { id: 103, parent_id: 1, label: "Bestsellers", url: "/shop?collection=bestsellers", sort_order: 3, is_active: true },
      { id: 104, parent_id: 1, label: "Sale & Deals", url: "/shop?collection=sale", sort_order: 4, is_active: true },
    ]
  },
  {
    id: 2,
    parent_id: null,
    label: "SOFT TOYS",
    url: "/shop?category=soft-toys",
    sort_order: 2,
    is_active: true,
    children: [
      { id: 201, parent_id: 2, label: "Teddy Bears & Plushies", url: "/shop?category=soft-toys", sort_order: 1, is_active: true },
      { id: 202, parent_id: 2, label: "Baby Cuddle Toys", url: "/shop?category=soft-toys", sort_order: 2, is_active: true },
      { id: 203, parent_id: 2, label: "Animal Pals", url: "/shop?category=soft-toys", sort_order: 3, is_active: true },
    ]
  },
  {
    id: 3,
    parent_id: null,
    label: "WOODEN TOYS",
    url: "/shop?category=wooden-toys",
    sort_order: 3,
    is_active: true,
    children: [
      { id: 301, parent_id: 3, label: "Rainbow Stacking Rings", url: "/shop?category=wooden-toys", sort_order: 1, is_active: true },
      { id: 302, parent_id: 3, label: "Classic Dollhouses", url: "/shop?category=wooden-toys", sort_order: 2, is_active: true },
      { id: 303, parent_id: 3, label: "Montessori Educational", url: "/shop?category=wooden-toys", sort_order: 3, is_active: true },
    ]
  },
  {
    id: 4,
    parent_id: null,
    label: "BUILDING BLOCKS",
    url: "/shop?category=build-blocks",
    sort_order: 4,
    is_active: true,
    children: [
      { id: 401, parent_id: 4, label: "Stacking Wood Blocks", url: "/shop?category=build-blocks", sort_order: 1, is_active: true },
      { id: 402, parent_id: 4, label: "Construction Sets", url: "/shop?category=build-blocks", sort_order: 2, is_active: true },
      { id: 403, parent_id: 4, label: "STEM Puzzles", url: "/shop?category=build-blocks", sort_order: 3, is_active: true },
    ]
  },
  {
    id: 5,
    parent_id: null,
    label: "DOLLS & OUTDOOR",
    url: "/shop?category=dolls",
    sort_order: 5,
    is_active: true,
    children: [
      { id: 501, parent_id: 5, label: "Toy Cars & Vehicles", url: "/shop?category=dolls", sort_order: 1, is_active: true },
      { id: 502, parent_id: 5, label: "Dinosaur Playsets", url: "/shop?category=dolls", sort_order: 2, is_active: true },
      { id: 503, parent_id: 5, label: "Outdoor & Play", url: "/shop?category=dolls", sort_order: 3, is_active: true },
    ]
  },
  {
    id: 6,
    parent_id: null,
    label: "NEW ARRIVALS",
    url: "/shop?collection=new-arrivals",
    sort_order: 6,
    is_active: true,
  },
  {
    id: 7,
    parent_id: null,
    label: "BESTSELLERS",
    url: "/shop?collection=bestsellers",
    sort_order: 7,
    is_active: true,
  },
  {
    id: 8,
    parent_id: null,
    label: "SALE 30% OFF",
    url: "/shop?collection=sale",
    sort_order: 8,
    is_active: true,
  }
];

export const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Mr. Cuddles Bear",
    slug: "mr-cuddles-bear",
    scent_family: "Soft Plush · Ages 0+",
    concentration: "Plush Soft Toy",
    sizes: ["Small (25cm)", "Classic (40cm)", "Jumbo (60cm)"],
    price: 24.99,
    short_description: "Extra-huggable plush teddy bear with hand-stitched bow tie and ultra-soft fur.",
    description: "Meet Mr. Cuddles Bear, the ultimate companion for bedtime cuddles and imaginative adventures. Crafted with baby-safe hypoallergenic plush fabric and securely stitched eyes.",
    notes_top: "Material: 100% Hypoallergenic Soft Velvet Fleece",
    notes_heart: "Safety: Certified Child-Safe (ASTM & CE Approved)",
    notes_base: "Care: Machine Washable gentle cycle",
    primary_image_url: "/images/toys/mr_cuddles_bear.jpg",
    secondary_image_url: "/images/toys/mobile_hero.jpg",
    gender: "unisex",
    is_featured: true,
    is_new_arrival: true,
    stock: 50
  },
  {
    id: 2,
    name: "Rainbow Stacking Ring",
    slug: "rainbow-stacking-ring",
    scent_family: "Natural Wood · Ages 1+",
    concentration: "Montessori Wooden Toy",
    sizes: ["Standard 7-Ring", "Deluxe 10-Ring"],
    price: 29.99,
    short_description: "Classic Scandinavian style wooden rainbow ring pyramid with smooth organic finish.",
    description: "Spark early motor development, hand-eye coordination, and color recognition with this beautiful wooden stacking ring tower. Made from sustainably sourced beech wood and water-based non-toxic pastel paints.",
    notes_top: "Material: 100% Natural Sustainable Beech Wood",
    notes_heart: "Paint: Water-based, Non-toxic eco-friendly pigment",
    notes_base: "Skills: Fine motor skills, color sequencing, sensory",
    primary_image_url: "/images/toys/rainbow_stacking_ring.jpg",
    secondary_image_url: "/images/toys/stacking_blocks.jpg",
    gender: "unisex",
    is_featured: true,
    is_new_arrival: false,
    stock: 45
  },
  {
    id: 3,
    name: "Colorful Stacking Blocks",
    slug: "colorful-stacking-blocks",
    scent_family: "Building & STEM · Ages 2+",
    concentration: "Wooden Building Toy",
    sizes: ["50 Piece Set", "100 Piece Set"],
    price: 13.90,
    short_description: "Vibrant geometric wooden building blocks pyramid for endless towers and castles.",
    description: "Unleash your child's inner architect with vibrant wooden building blocks. Inspires spatial awareness, creative engineering, and balance experimentation.",
    notes_top: "Includes: Cubes, cylinders, arches, and triangles",
    notes_heart: "Material: Solid wood with splinter-free bevelled edges",
    notes_base: "Bonus: Canvas storage bag included for tidy cleanup",
    primary_image_url: "/images/toys/stacking_blocks.jpg",
    secondary_image_url: "/images/toys/rainbow_stacking_ring.jpg",
    gender: "unisex",
    is_featured: true,
    is_new_arrival: true,
    stock: 60
  },
  {
    id: 4,
    name: "Dinosaur Playset (4-Pack)",
    slug: "dinosaur-playset",
    scent_family: "Prehistoric Fun · Ages 2+",
    concentration: "Playset Figurines",
    sizes: ["4 Figures Set", "8 Figures Mega Set"],
    price: 14.90,
    short_description: "Friendly cartoon dinosaur figures featuring T-Rex, Triceratops, and Brachiosaurus.",
    description: "Embark on prehistoric adventures! These chunky, friendly dinosaur figures are specially molded for little toddler hands with soft rounded edges and bright colors.",
    notes_top: "Figures: T-Rex, Stegosaurus, Triceratops, Brachiosaurus",
    notes_heart: "Material: Flexible BPA-free soft vinyl",
    notes_base: "Safety: 100% Phthalate and lead free",
    primary_image_url: "/images/toys/dinosaur_playset.jpg",
    secondary_image_url: "/images/toys/mobile_hero.jpg",
    gender: "unisex",
    is_featured: true,
    is_new_arrival: false,
    stock: 40
  },
  {
    id: 5,
    name: "Little Zoomer Toy Car GoGo 5",
    slug: "toy-car-gogo-5",
    scent_family: "Vehicles · Ages 1.5+",
    concentration: "Friction Powered Vehicle",
    sizes: ["Single Car", "Set of 3 Racers"],
    price: 18.00,
    short_description: "Chunky yellow racer with oversized grip wheels and friendly smiling face.",
    description: "Vroom vroom! The Little Zoomer friction-powered vehicle zooms across floors with just a gentle push. Sturdy shockproof construction withstands drops and rough play.",
    notes_top: "Mechanism: Push-and-go friction motor (No batteries needed)",
    notes_heart: "Wheels: Soft rubber traction tires, floor-safe",
    notes_base: "Durability: Impact-resistant ABS plastic",
    primary_image_url: "/images/toys/toy_car.jpg",
    secondary_image_url: "/images/toys/hero_banner.jpg",
    gender: "unisex",
    is_featured: true,
    is_new_arrival: true,
    stock: 55
  },
  {
    id: 6,
    name: "Classic Wooden Dollhouse",
    slug: "classic-wooden-dollhouse",
    scent_family: "Pretend Play · Ages 3+",
    concentration: "Architectural Dollhouse",
    sizes: ["2-Story Compact", "3-Story Deluxe"],
    price: 19.90,
    short_description: "Charming 3-story wooden dollhouse with opening front doors and red shingle roof.",
    description: "A timeless heirloom toy! This 3-story wooden dollhouse features authentic architectural details, working front door, flower window boxes, and open back for easy storytelling access.",
    notes_top: "Rooms: Living room, kitchen, bedroom, attic playroom",
    notes_heart: "Material: FSC certified solid wood and plywood",
    notes_base: "Assembly: Easy slot-and-screw assembly with guide",
    primary_image_url: "/images/toys/wooden_dollhouse.jpg",
    secondary_image_url: "/images/toys/stacking_blocks.jpg",
    gender: "unisex",
    is_featured: true,
    is_new_arrival: false,
    stock: 30
  }
];

export async function getCategoriesTree(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) return FALLBACK_CATEGORIES;
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data : FALLBACK_CATEGORIES;
  } catch (err) {
    return FALLBACK_CATEGORIES;
  }
}

export async function getMenuTree(): Promise<MenuItem[]> {
  try {
    const res = await fetch(`${API_BASE}/menu`, {
      cache: 'no-store'
    });
    if (!res.ok) return FALLBACK_MENU;
    const data = await res.json();
    return Array.isArray(data) && data.length > 0 ? data : FALLBACK_MENU;
  } catch (err) {
    return FALLBACK_MENU;
  }
}

export async function getSiteSettings(): Promise<Record<string, string>> {
  try {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) return {};
    return await res.json();
  } catch (err) {
    return {};
  }
}

export async function getProducts(params?: Record<string, string>): Promise<{ data: Product[]; total: number; isFallback?: boolean }> {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/products${query ? `?${query}` : ''}`);
    if (!res.ok) throw new Error('API offline');
    const json = await res.json();
    let resultList: Product[] = json.data || json || FALLBACK_PRODUCTS;

    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      resultList = resultList.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.scent_family.toLowerCase().includes(q) ||
        p.concentration.toLowerCase().includes(q) ||
        (p.notes_top && p.notes_top.toLowerCase().includes(q)) ||
        (p.notes_heart && p.notes_heart.toLowerCase().includes(q)) ||
        (p.notes_base && p.notes_base.toLowerCase().includes(q)) ||
        (p.short_description && p.short_description.toLowerCase().includes(q))
      );

      if (resultList.length === 0) {
        return { data: FALLBACK_PRODUCTS, total: FALLBACK_PRODUCTS.length, isFallback: true };
      }
    }

    return {
      data: resultList,
      total: resultList.length
    };
  } catch (err) {
    let filtered = [...FALLBACK_PRODUCTS];
    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      const matched = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.scent_family.toLowerCase().includes(q) ||
        p.concentration.toLowerCase().includes(q) ||
        (p.notes_top && p.notes_top.toLowerCase().includes(q)) ||
        (p.notes_heart && p.notes_heart.toLowerCase().includes(q)) ||
        (p.notes_base && p.notes_base.toLowerCase().includes(q)) ||
        (p.short_description && p.short_description.toLowerCase().includes(q))
      );
      if (matched.length > 0) {
        return { data: matched, total: matched.length };
      } else {
        return { data: FALLBACK_PRODUCTS, total: FALLBACK_PRODUCTS.length, isFallback: true };
      }
    }

    if (params?.gender && params.gender !== 'all') {
      filtered = filtered.filter(p => p.gender === params.gender || p.gender === 'unisex');
    }
    if (params?.scent_family) {
      filtered = filtered.filter(p => p.scent_family.toLowerCase().includes(params.scent_family.toLowerCase()));
    }
    return { data: filtered, total: filtered.length };
  }
}

export async function getProductBySlug(slug: string): Promise<{ product: Product; related: Product[] } | null> {
  try {
    const res = await fetch(`${API_BASE}/products/${slug}`, {
      next: { revalidate: 60, tags: [`product-${slug}`] }
    });
    if (!res.ok) throw new Error('Not found');
    return await res.json();
  } catch (err) {
    const found = FALLBACK_PRODUCTS.find(p => p.slug === slug || String(p.id) === slug);
    if (!found) return { product: FALLBACK_PRODUCTS[0], related: FALLBACK_PRODUCTS.slice(1) };
    const related = FALLBACK_PRODUCTS.filter(p => p.id !== found.id);
    return { product: found, related };
  }
}
