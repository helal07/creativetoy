<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clean up legacy perfume products if present
        Product::whereIn('slug', [
            'l-ombre-d-ambre', 'cuir-noir', 'velours-de-rose', 'vapour-d-oud', 'cedre-brut', 'the-discovery-quad',
        ])->delete();

        $catSoft = Category::where('slug', 'soft-toys')->first() ?? Category::first();
        $catWooden = Category::where('slug', 'wooden-toys')->first() ?? Category::first();
        $catBlocks = Category::where('slug', 'build-blocks')->first() ?? Category::first();
        $catDolls = Category::where('slug', 'dolls')->first() ?? Category::first();
        $catOutdoor = Category::where('slug', 'outdoor')->first() ?? Category::first();

        $productsData = [
            [
                'name' => 'Mr. Cuddles Bear',
                'slug' => 'mr-cuddles-bear',
                'category_id' => $catSoft ? $catSoft->id : null,
                'scent_family' => 'Soft Plush · Ages 0+',
                'concentration' => 'Plush Soft Toy',
                'sizes' => ['Small (25cm)', 'Classic (40cm)', 'Jumbo (60cm)'],
                'price' => 24.99,
                'short_description' => 'Extra-huggable plush teddy bear with hand-stitched bow tie and ultra-soft fur.',
                'description' => 'Meet Mr. Cuddles Bear, the ultimate companion for bedtime cuddles and imaginative adventures. Crafted with baby-safe hypoallergenic plush fabric and securely stitched eyes.',
                'notes_top' => 'Material: 100% Hypoallergenic Soft Velvet Fleece',
                'notes_heart' => 'Safety: Certified Child-Safe (ASTM & CE Approved)',
                'notes_base' => 'Care: Machine Washable gentle cycle',
                'primary_image_url' => '/images/toys/mr_cuddles_bear.jpg',
                'secondary_image_url' => '/images/toys/mobile_hero.jpg',
                'gender' => 'unisex',
                'is_featured' => true,
                'is_new_arrival' => true,
                'stock' => 50,
                'gallery' => [
                    '/images/toys/mr_cuddles_bear.jpg',
                    '/images/toys/mobile_hero.jpg',
                ],
            ],
            [
                'name' => 'Rainbow Stacking Ring',
                'slug' => 'rainbow-stacking-ring',
                'category_id' => $catWooden ? $catWooden->id : null,
                'scent_family' => 'Natural Wood · Ages 1+',
                'concentration' => 'Montessori Wooden Toy',
                'sizes' => ['Standard 7-Ring', 'Deluxe 10-Ring'],
                'price' => 29.99,
                'short_description' => 'Classic Scandinavian style wooden rainbow ring pyramid with smooth organic finish.',
                'description' => 'Spark early motor development, hand-eye coordination, and color recognition with this beautiful wooden stacking ring tower. Made from sustainably sourced beech wood and water-based non-toxic pastel paints.',
                'notes_top' => 'Material: 100% Natural Sustainable Beech Wood',
                'notes_heart' => 'Paint: Water-based, Non-toxic eco-friendly pigment',
                'notes_base' => 'Skills: Fine motor skills, color sequencing, sensory',
                'primary_image_url' => '/images/toys/rainbow_stacking_ring.jpg',
                'secondary_image_url' => '/images/toys/stacking_blocks.jpg',
                'gender' => 'unisex',
                'is_featured' => true,
                'is_new_arrival' => false,
                'stock' => 45,
                'gallery' => [
                    '/images/toys/rainbow_stacking_ring.jpg',
                    '/images/toys/stacking_blocks.jpg',
                ],
            ],
            [
                'name' => 'Colorful Stacking Blocks',
                'slug' => 'colorful-stacking-blocks',
                'category_id' => $catBlocks ? $catBlocks->id : null,
                'scent_family' => 'Building & STEM · Ages 2+',
                'concentration' => 'Wooden Building Toy',
                'sizes' => ['50 Piece Set', '100 Piece Set'],
                'price' => 13.90,
                'short_description' => 'Vibrant geometric wooden building blocks pyramid for endless towers and castles.',
                'description' => 'Unleash your child\'s inner architect with vibrant wooden building blocks. Inspires spatial awareness, creative engineering, and balance experimentation.',
                'notes_top' => 'Includes: Cubes, cylinders, arches, and triangles',
                'notes_heart' => 'Material: Solid wood with splinter-free bevelled edges',
                'notes_base' => 'Bonus: Canvas storage bag included for tidy cleanup',
                'primary_image_url' => '/images/toys/stacking_blocks.jpg',
                'secondary_image_url' => '/images/toys/rainbow_stacking_ring.jpg',
                'gender' => 'unisex',
                'is_featured' => true,
                'is_new_arrival' => true,
                'stock' => 60,
                'gallery' => [
                    '/images/toys/stacking_blocks.jpg',
                    '/images/toys/rainbow_stacking_ring.jpg',
                ],
            ],
            [
                'name' => 'Dinosaur Playset (4-Pack)',
                'slug' => 'dinosaur-playset',
                'category_id' => $catDolls ? $catDolls->id : null,
                'scent_family' => 'Prehistoric Fun · Ages 2+',
                'concentration' => 'Playset Figurines',
                'sizes' => ['4 Figures Set', '8 Figures Mega Set'],
                'price' => 14.90,
                'short_description' => 'Friendly cartoon dinosaur figures featuring T-Rex, Triceratops, and Brachiosaurus.',
                'description' => 'Embark on prehistoric adventures! These chunky, friendly dinosaur figures are specially molded for little toddler hands with soft rounded edges and bright colors.',
                'notes_top' => 'Figures: T-Rex, Stegosaurus, Triceratops, Brachiosaurus',
                'notes_heart' => 'Material: Flexible BPA-free soft vinyl',
                'notes_base' => 'Safety: 100% Phthalate and lead free',
                'primary_image_url' => '/images/toys/dinosaur_playset.jpg',
                'secondary_image_url' => '/images/toys/mobile_hero.jpg',
                'gender' => 'unisex',
                'is_featured' => true,
                'is_new_arrival' => false,
                'stock' => 40,
                'gallery' => [
                    '/images/toys/dinosaur_playset.jpg',
                    '/images/toys/mobile_hero.jpg',
                ],
            ],
            [
                'name' => 'Little Zoomer Toy Car GoGo 5',
                'slug' => 'toy-car-gogo-5',
                'category_id' => $catOutdoor ? $catOutdoor->id : null,
                'scent_family' => 'Vehicles · Ages 1.5+',
                'concentration' => 'Friction Powered Vehicle',
                'sizes' => ['Single Car', 'Set of 3 Racers'],
                'price' => 18.00,
                'short_description' => 'Chunky yellow racer with oversized grip wheels and friendly smiling face.',
                'description' => 'Vroom vroom! The Little Zoomer friction-powered vehicle zooms across floors with just a gentle push. Sturdy shockproof construction withstands drops and rough play.',
                'notes_top' => 'Mechanism: Push-and-go friction motor (No batteries needed)',
                'notes_heart' => 'Wheels: Soft rubber traction tires, floor-safe',
                'notes_base' => 'Durability: Impact-resistant ABS plastic',
                'primary_image_url' => '/images/toys/toy_car.jpg',
                'secondary_image_url' => '/images/toys/hero_banner.jpg',
                'gender' => 'unisex',
                'is_featured' => true,
                'is_new_arrival' => true,
                'stock' => 55,
                'gallery' => [
                    '/images/toys/toy_car.jpg',
                    '/images/toys/hero_banner.jpg',
                ],
            ],
            [
                'name' => 'Classic Wooden Dollhouse',
                'slug' => 'classic-wooden-dollhouse',
                'category_id' => $catDolls ? $catDolls->id : null,
                'scent_family' => 'Pretend Play · Ages 3+',
                'concentration' => 'Architectural Dollhouse',
                'sizes' => ['2-Story Compact', '3-Story Deluxe'],
                'price' => 19.90,
                'short_description' => 'Charming 3-story wooden dollhouse with opening front doors and red shingle roof.',
                'description' => 'A timeless heirloom toy! This 3-story wooden dollhouse features authentic architectural details, working front door, flower window boxes, and open back for easy storytelling access.',
                'notes_top' => 'Rooms: Living room, kitchen, bedroom, attic playroom',
                'notes_heart' => 'Material: FSC certified solid wood and plywood',
                'notes_base' => 'Assembly: Easy slot-and-screw assembly with guide',
                'primary_image_url' => '/images/toys/wooden_dollhouse.jpg',
                'secondary_image_url' => '/images/toys/stacking_blocks.jpg',
                'gender' => 'unisex',
                'is_featured' => true,
                'is_new_arrival' => false,
                'stock' => 30,
                'gallery' => [
                    '/images/toys/wooden_dollhouse.jpg',
                    '/images/toys/stacking_blocks.jpg',
                ],
            ],
        ];

        foreach ($productsData as $pData) {
            $gallery = $pData['gallery'] ?? [];
            unset($pData['gallery']);

            $product = Product::updateOrCreate(['slug' => $pData['slug']], $pData);

            if (! empty($gallery)) {
                $product->images()->delete();
                foreach ($gallery as $idx => $img) {
                    ProductImage::create([
                        'product_id' => $product->id,
                        'image_url' => $img,
                        'sort_order' => $idx,
                    ]);
                }
            }
        }
    }
}
