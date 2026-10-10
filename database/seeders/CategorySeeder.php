<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clean up legacy perfume categories if present
        Category::whereIn('slug', [
            'men-perfumes', 'women-perfumes', 'unisex-rare-oud', 'gifts-sets', 'iconic-editions',
            'men-eau-de-parfum', 'men-parfum-extraits', 'woody-leather', 'fresh-citrus',
            'floral-rose', 'amber-vanilla', 'women-parfum-extraits', 'gourmand-musk',
            'rare-oud', 'incense-resins', 'private-reserve', 'discovery-quads', 'gift-coffrets',
            'pocket-atomizers', 'alchemy-series', 'night-flacons',
        ])->delete();

        $categoriesStructure = [
            [
                'name' => 'Soft Toys',
                'slug' => 'soft-toys',
                'description' => 'Cuddly plush teddy bears, animal friends, and plush baby dolls.',
                'image_url' => '/images/toys/mr_cuddles_bear.jpg',
                'sort_order' => 1,
                'subcategories' => [
                    ['name' => 'Teddy Bears', 'slug' => 'teddy-bears', 'description' => 'Soft huggable plush bears.'],
                    ['name' => 'Plush Animals', 'slug' => 'plush-animals', 'description' => 'Adorable woodland and jungle plush friends.'],
                    ['name' => 'Baby Comforters', 'slug' => 'baby-comforters', 'description' => 'Ultra-soft security blankets and cuddle cloths.'],
                ],
            ],
            [
                'name' => 'Wooden Toys',
                'slug' => 'wooden-toys',
                'description' => 'Natural organic beech wood stacking rings, puzzles, and sensory blocks.',
                'image_url' => '/images/toys/rainbow_stacking_ring.jpg',
                'sort_order' => 2,
                'subcategories' => [
                    ['name' => 'Stacking Rings', 'slug' => 'stacking-rings', 'description' => 'Rainbow stacking towers and ring pyramids.'],
                    ['name' => 'Wooden Puzzles', 'slug' => 'wooden-puzzles', 'description' => 'Peg puzzles and shape matching boards.'],
                    ['name' => 'Activity Cubes', 'slug' => 'activity-cubes', 'description' => 'Multi-sided sensory and maze cubes.'],
                ],
            ],
            [
                'name' => 'Building Blocks',
                'slug' => 'build-blocks',
                'description' => 'Stacking cubes, magnetic tiles, and creative construction sets.',
                'image_url' => '/images/toys/stacking_blocks.jpg',
                'sort_order' => 3,
                'subcategories' => [
                    ['name' => 'Stacking Cubes', 'slug' => 'stacking-cubes', 'description' => 'Geometric wooden stacking cubes and balance blocks.'],
                    ['name' => 'Magnetic Tiles', 'slug' => 'magnetic-tiles', 'description' => 'Translucent 3D magnetic building shapes.'],
                ],
            ],
            [
                'name' => 'Dolls & Dollhouses',
                'slug' => 'dolls',
                'description' => 'Miniature dollhouses, baby dolls, and accessories.',
                'image_url' => '/images/toys/wooden_dollhouse.jpg',
                'sort_order' => 4,
                'subcategories' => [
                    ['name' => 'Dollhouses', 'slug' => 'dollhouses', 'description' => 'Multi-story wooden dollhouses with furnishings.'],
                    ['name' => 'Baby Dolls', 'slug' => 'baby-dolls', 'description' => 'Soft body baby dolls and stroller sets.'],
                ],
            ],
            [
                'name' => 'Outdoor & Play',
                'slug' => 'outdoor',
                'description' => 'Friction-powered vehicles, play cars, and garden fun.',
                'image_url' => '/images/toys/toy_car.jpg',
                'sort_order' => 5,
                'subcategories' => [
                    ['name' => 'Toy Vehicles', 'slug' => 'toy-vehicles', 'description' => 'Friction cars, trains, and rescue vehicles.'],
                    ['name' => 'Water Tables', 'slug' => 'water-tables', 'description' => 'Sensory water tables and outdoor splash toys.'],
                    ['name' => 'Bicycles & Trikes', 'slug' => 'bicycles-trikes', 'description' => 'Balance bikes, trikes, and scooters.'],
                ],
            ],
            [
                'name' => 'Learning & STEM',
                'slug' => 'learn-stem',
                'description' => 'Brain teasers, science sets, and prehistoric dinosaur figures.',
                'image_url' => '/images/toys/dinosaur_playset.jpg',
                'sort_order' => 6,
                'subcategories' => [
                    ['name' => 'Dinosaur Playsets', 'slug' => 'dinosaur-playsets', 'description' => 'Prehistoric action figures and playmats.'],
                    ['name' => 'Math & Counting', 'slug' => 'math-counting', 'description' => 'Abacus, number cards, and balance scales.'],
                ],
            ],
        ];

        foreach ($categoriesStructure as $catData) {
            $subcategories = $catData['subcategories'] ?? [];
            unset($catData['subcategories']);

            $parent = Category::updateOrCreate(
                ['slug' => $catData['slug']],
                [
                    'parent_id' => null,
                    'name' => $catData['name'],
                    'description' => $catData['description'],
                    'image_url' => $catData['image_url'],
                    'sort_order' => $catData['sort_order'],
                    'is_active' => true,
                ]
            );

            foreach ($subcategories as $index => $subData) {
                Category::updateOrCreate(
                    ['slug' => $subData['slug']],
                    [
                        'parent_id' => $parent->id,
                        'name' => $subData['name'],
                        'description' => $subData['description'] ?? null,
                        'sort_order' => $index + 1,
                        'is_active' => true,
                    ]
                );
            }
        }
    }
}
