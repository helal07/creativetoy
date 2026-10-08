<?php

namespace Database\Seeders;

use App\Models\MenuItem;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Cache;

class ToyMenuSeeder extends Seeder
{
    public function run(): void
    {
        MenuItem::truncate();

        $shopAll = MenuItem::create([
            'label' => 'SHOP ALL',
            'url' => '/shop',
            'sort_order' => 1,
            'is_active' => true,
        ]);
        MenuItem::create(['parent_id' => $shopAll->id, 'label' => 'All Toys & Games', 'url' => '/shop', 'sort_order' => 1, 'is_active' => true]);
        MenuItem::create(['parent_id' => $shopAll->id, 'label' => 'New Arrivals', 'url' => '/shop?collection=new-arrivals', 'sort_order' => 2, 'is_active' => true]);
        MenuItem::create(['parent_id' => $shopAll->id, 'label' => 'Bestsellers', 'url' => '/shop?collection=bestsellers', 'sort_order' => 3, 'is_active' => true]);
        MenuItem::create(['parent_id' => $shopAll->id, 'label' => 'Sale & Clearance', 'url' => '/shop?collection=sale', 'sort_order' => 4, 'is_active' => true]);

        $softToys = MenuItem::create([
            'label' => 'SOFT TOYS',
            'url' => '/shop?category=soft-toys',
            'sort_order' => 2,
            'is_active' => true,
        ]);
        MenuItem::create(['parent_id' => $softToys->id, 'label' => 'Teddy Bears & Plushies', 'url' => '/shop?category=soft-toys', 'sort_order' => 1, 'is_active' => true]);
        MenuItem::create(['parent_id' => $softToys->id, 'label' => 'Baby Cuddle Toys', 'url' => '/shop?category=soft-toys', 'sort_order' => 2, 'is_active' => true]);
        MenuItem::create(['parent_id' => $softToys->id, 'label' => 'Animal Pals', 'url' => '/shop?category=soft-toys', 'sort_order' => 3, 'is_active' => true]);

        $woodenToys = MenuItem::create([
            'label' => 'WOODEN TOYS',
            'url' => '/shop?category=wooden-toys',
            'sort_order' => 3,
            'is_active' => true,
        ]);
        MenuItem::create(['parent_id' => $woodenToys->id, 'label' => 'Rainbow Stacking Rings', 'url' => '/shop?category=wooden-toys', 'sort_order' => 1, 'is_active' => true]);
        MenuItem::create(['parent_id' => $woodenToys->id, 'label' => 'Classic Dollhouses', 'url' => '/shop?category=wooden-toys', 'sort_order' => 2, 'is_active' => true]);
        MenuItem::create(['parent_id' => $woodenToys->id, 'label' => 'Montessori Toys', 'url' => '/shop?category=wooden-toys', 'sort_order' => 3, 'is_active' => true]);

        $blocks = MenuItem::create([
            'label' => 'BUILDING BLOCKS',
            'url' => '/shop?category=build-blocks',
            'sort_order' => 4,
            'is_active' => true,
        ]);
        MenuItem::create(['parent_id' => $blocks->id, 'label' => 'Stacking Wood Blocks', 'url' => '/shop?category=build-blocks', 'sort_order' => 1, 'is_active' => true]);
        MenuItem::create(['parent_id' => $blocks->id, 'label' => 'Construction Sets', 'url' => '/shop?category=build-blocks', 'sort_order' => 2, 'is_active' => true]);
        MenuItem::create(['parent_id' => $blocks->id, 'label' => 'STEM Puzzles', 'url' => '/shop?category=build-blocks', 'sort_order' => 3, 'is_active' => true]);

        $dolls = MenuItem::create([
            'label' => 'DOLLS & OUTDOOR',
            'url' => '/shop?category=dolls',
            'sort_order' => 5,
            'is_active' => true,
        ]);
        MenuItem::create(['parent_id' => $dolls->id, 'label' => 'Toy Cars & Vehicles', 'url' => '/shop?category=dolls', 'sort_order' => 1, 'is_active' => true]);
        MenuItem::create(['parent_id' => $dolls->id, 'label' => 'Dinosaur Playsets', 'url' => '/shop?category=dolls', 'sort_order' => 2, 'is_active' => true]);
        MenuItem::create(['parent_id' => $dolls->id, 'label' => 'Outdoor & Play', 'url' => '/shop?category=dolls', 'sort_order' => 3, 'is_active' => true]);

        MenuItem::create([
            'label' => 'NEW ARRIVALS',
            'url' => '/shop?collection=new-arrivals',
            'sort_order' => 6,
            'is_active' => true,
        ]);

        MenuItem::create([
            'label' => 'BESTSELLERS',
            'url' => '/shop?collection=bestsellers',
            'sort_order' => 7,
            'is_active' => true,
        ]);

        MenuItem::create([
            'label' => 'SALE 30% OFF',
            'url' => '/shop?collection=sale',
            'sort_order' => 8,
            'is_active' => true,
        ]);

        Cache::flush();
    }
}
