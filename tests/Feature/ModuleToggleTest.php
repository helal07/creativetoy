<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ModuleToggleTest extends TestCase
{
    use RefreshDatabase;

    public function test_disabled_module_redirects_admin_with_error_flash(): void
    {
        config(['modules.courier' => false]);

        $admin = User::factory()->create([
            'is_admin' => true,
        ]);

        $response = $this->actingAs($admin)->get('/admin/courier');

        $response->assertRedirect('/admin/dashboard');
        $response->assertSessionHas('error');
    }

    public function test_disabled_module_returns_forbidden_json_for_api_requests(): void
    {
        config(['modules.api_gateway' => false]);

        $admin = User::factory()->create([
            'is_admin' => true,
        ]);

        $response = $this->actingAs($admin)->getJson('/admin/api-settings/payment');

        $response->assertStatus(403);
        $response->assertJsonFragment([
            'status' => 'development_mode',
        ]);
    }

    public function test_enabled_module_is_accessible(): void
    {
        config(['modules.seo' => true]);

        $admin = User::factory()->create([
            'is_admin' => true,
        ]);

        $response = $this->actingAs($admin)->get('/admin/seo/meta');

        // Should not be redirected to dashboard by module.enabled middleware
        $this->assertNotEquals(302, $response->getStatusCode());
    }

    public function test_disabled_purchases_module_redirects_to_dashboard(): void
    {
        config(['modules.purchases' => false]);

        $admin = User::factory()->create([
            'is_admin' => true,
        ]);

        $response = $this->actingAs($admin)->get('/admin/purchases');

        $response->assertRedirect('/admin/dashboard');
        $response->assertSessionHas('error');
    }

    public function test_disabled_campaigns_module_redirects_to_dashboard(): void
    {
        config(['modules.campaigns' => false]);

        $admin = User::factory()->create([
            'is_admin' => true,
        ]);

        $response = $this->actingAs($admin)->get('/admin/campaigns');

        $response->assertRedirect('/admin/dashboard');
        $response->assertSessionHas('error');
    }
}
