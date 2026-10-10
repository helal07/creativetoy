<?php

namespace Database\Seeders;

use App\Models\MenuItem;
use Illuminate\Database\Seeder;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clean up legacy perfume menu items
        MenuItem::where('url', 'like', '%perfumes%')
            ->orWhereIn('label', ['Men Perfumes', 'Women Perfumes', 'Unisex & Rare Oud', 'Gifts & Sets', 'Iconic Editions', 'All Fragrances'])
            ->delete();

        // 1. SHOP ALL
        $shopAll = MenuItem::updateOrCreate(
            ['label' => 'SHOP ALL'],
            ['url' => '/shop', 'sort_order' => 1, 'is_active' => true]
        );
        MenuItem::updateOrCreate(['parent_id' => $shopAll->id, 'label' => 'All Toys & Games'], ['url' => '/shop', 'sort_order' => 1, 'is_active' => true]);
        MenuItem::updateOrCreate(['parent_id' => $shopAll->id, 'label' => 'New Arrivals'], ['url' => '/shop?collection=new-arrivals', 'sort_order' => 2, 'is_active' => true]);
        MenuItem::updateOrCreate(['parent_id' => $shopAll->id, 'label' => 'Bestsellers'], ['url' => '/shop?collection=bestsellers', 'sort_order' => 3, 'is_active' => true]);
        MenuItem::updateOrCreate(['parent_id' => $shopAll->id, 'label' => 'Sale & Deals'], ['url' => '/shop?collection=sale', 'sort_order' => 4, 'is_active' => true]);

        // 2. SOFT TOYS
        $softToys = MenuItem::updateOrCreate(
            ['label' => 'SOFT TOYS'],
            ['url' => '/shop?category=soft-toys', 'sort_order' => 2, 'is_active' => true]
        );
        MenuItem::updateOrCreate(['parent_id' => $softToys->id, 'label' => 'Teddy Bears & Plushies'], ['url' => '/shop?category=soft-toys', 'sort_order' => 1, 'is_active' => true]);
        MenuItem::updateOrCreate(['parent_id' => $softToys->id, 'label' => 'Baby Cuddle Toys'], ['url' => '/shop?category=soft-toys', 'sort_order' => 2, 'is_active' => true]);
        MenuItem::updateOrCreate(['parent_id' => $softToys->id, 'label' => 'Animal Pals'], ['url' => '/shop?category=soft-toys', 'sort_order' => 3, 'is_active' => true]);

        // 3. WOODEN TOYS
        $woodenToys = MenuItem::updateOrCreate(
            ['label' => 'WOODEN TOYS'],
            ['url' => '/shop?category=wooden-toys', 'sort_order' => 3, 'is_active' => true]
        );
        MenuItem::updateOrCreate(['parent_id' => $woodenToys->id, 'label' => 'Rainbow Stacking Rings'], ['url' => '/shop?category=wooden-toys', 'sort_order' => 1, 'is_active' => true]);
        MenuItem::updateOrCreate(['parent_id' => $woodenToys->id, 'label' => 'Classic Dollhouses'], ['url' => '/shop?category=wooden-toys', 'sort_order' => 2, 'is_active' => true]);
        MenuItem::updateOrCreate(['parent_id' => $woodenToys->id, 'label' => 'Montessori Educational'], ['url' => '/shop?category=wooden-toys', 'sort_order' => 3, 'is_active' => true]);

        // 4. BUILDING BLOCKS
        $blocks = MenuItem::updateOrCreate(
            ['label' => 'BUILDING BLOCKS'],
            ['url' => '/shop?category=build-blocks', 'sort_order' => 4, 'is_active' => true]
        );
        MenuItem::updateOrCreate(['parent_id' => $blocks->id, 'label' => 'Stacking Wood Blocks'], ['url' => '/shop?category=build-blocks', 'sort_order' => 1, 'is_active' => true]);
        MenuItem::updateOrCreate(['parent_id' => $blocks->id, 'label' => 'Construction Sets'], ['url' => '/shop?category=build-blocks', 'sort_order' => 2, 'is_active' => true]);
        MenuItem::updateOrCreate(['parent_id' => $blocks->id, 'label' => 'STEM Puzzles'], ['url' => '/shop?category=build-blocks', 'sort_order' => 3, 'is_active' => true]);

        // 5. DOLLS & OUTDOOR
        $dolls = MenuItem::updateOrCreate(
            ['label' => 'DOLLS & OUTDOOR'],
            ['url' => '/shop?category=dolls', 'sort_order' => 5, 'is_active' => true]
        );
        MenuItem::updateOrCreate(['parent_id' => $dolls->id, 'label' => 'Toy Cars & Vehicles'], ['url' => '/shop?category=dolls', 'sort_order' => 1, 'is_active' => true]);
        MenuItem::updateOrCreate(['parent_id' => $dolls->id, 'label' => 'Dinosaur Playsets'], ['url' => '/shop?category=dolls', 'sort_order' => 2, 'is_active' => true]);
        MenuItem::updateOrCreate(['parent_id' => $dolls->id, 'label' => 'Outdoor & Play'], ['url' => '/shop?category=dolls', 'sort_order' => 3, 'is_active' => true]);

        // 6. NEW ARRIVALS
        MenuItem::updateOrCreate(
            ['label' => 'NEW ARRIVALS'],
            ['url' => '/shop?collection=new-arrivals', 'sort_order' => 6, 'is_active' => true]
        );

        // 7. BESTSELLERS
        MenuItem::updateOrCreate(
            ['label' => 'BESTSELLERS'],
            ['url' => '/shop?collection=bestsellers', 'sort_order' => 7, 'is_active' => true]
        );

        // 8. SALE 30% OFF
        MenuItem::updateOrCreate(
            ['label' => 'SALE 30% OFF'],
            ['url' => '/shop?collection=sale', 'sort_order' => 8, 'is_active' => true]
        );
    }
}
