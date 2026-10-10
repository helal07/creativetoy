<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $defaultSettings = [
            'siteName' => 'Creative Toy',
            'site_name' => 'Creative Toy',
            'tagline' => 'Kids Toy Wonderland & Educational Play',
            'logo_url' => '/uploads/cms/global_logo_url_1791219340.webp',
            'favicon_url' => '/uploads/cms/global_favicon_url_1791219343.jpeg',
            'site_favicon' => '/uploads/cms/global_favicon_url_1791219343.jpeg',
            'phone' => '+1 (800) 555-TOYS',
            'whatsapp' => '18005558697',
            'email' => 'creativetoyltd@gmail.com',
            'currency' => 'USD ($)',
            'currency_symbol' => '$',
            'announcement' => '🎉 SUMMER FUN SALE! 30% OFF ALL TOYS · FREE SHIPPING OVER $35! 🧸',
            'announcement_enabled' => '1',
            'footerText' => 'Creative Toy Ltd. All Rights Reserved.',
            'tax_rate' => '0',
            'facebook_url' => 'https://facebook.com/creativetoy',
            'instagram_url' => 'https://instagram.com/creativetoy',
            'tiktok_url' => 'https://tiktok.com/@creativetoy',
            'hero_video_url' => '',
            'hero_video' => '',
            'hero_poster_url' => '/images/toys/hero_banner.jpg',
            'hero_subtitle' => 'SUMMER FUN SALE 2026',
            'hero_title' => 'Discover Joyful Play',
            'hero_link_1_text' => 'EXPLORE TOYS',
            'hero_link_1_url' => '/shop',
            'hero_link_2_text' => 'BESTSELLERS',
            'hero_link_2_url' => '/shop?collection=bestsellers',
        ];

        foreach ($defaultSettings as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }
    }
}
