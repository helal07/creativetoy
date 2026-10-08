<?php

namespace Tests\Feature;

use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AdminLoginTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_login_page_renders_with_dynamic_settings(): void
    {
        Setting::updateOrCreate(['key' => 'siteName'], ['value' => 'Creative Toy']);
        Setting::updateOrCreate(['key' => 'logo_url'], ['value' => '/uploads/cms/creative_toy_logo.webp']);

        $response = $this->get('/admin/login');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Auth/AdminLogin')
            ->has('siteSettings')
            ->where('siteSettings.siteName', 'Creative Toy')
        );
    }

    public function test_admin_can_login_and_redirect_to_dashboard(): void
    {
        $admin = User::factory()->create([
            'email' => 'admin@creativetoy.com',
            'password' => bcrypt('password123'),
            'is_admin' => true,
        ]);

        $response = $this->post('/admin/login', [
            'email' => 'admin@creativetoy.com',
            'password' => 'password123',
        ]);

        $response->assertRedirect('/admin/dashboard');
        $this->assertAuthenticatedAs($admin);
    }

    public function test_invalid_credentials_are_rejected(): void
    {
        $response = $this->post('/admin/login', [
            'email' => 'wrong@email.com',
            'password' => 'wrongpass',
        ]);

        $response->assertSessionHasErrors('email');
        $this->assertGuest();
    }
}
