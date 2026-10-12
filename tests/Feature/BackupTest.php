<?php

namespace Tests\Feature;

use App\Models\User;
use App\Services\BackupService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\File;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class BackupTest extends TestCase
{
    use RefreshDatabase;

    protected function tearDown(): void
    {
        // Clean up test backup files in storage/app/backups
        $backupDir = storage_path('app/backups');
        if (File::exists($backupDir)) {
            $files = File::files($backupDir);
            foreach ($files as $file) {
                if (str_starts_with($file->getFilename(), 'backup_')) {
                    @unlink($file->getRealPath());
                }
            }
        }

        parent::tearDown();
    }

    public function test_guest_cannot_access_backups_page(): void
    {
        $response = $this->get('/admin/backups');
        $response->assertRedirect(route('login'));
    }

    public function test_admin_can_view_backups_page(): void
    {
        $admin = User::factory()->create([
            'is_admin' => true,
        ]);

        $response = $this->actingAs($admin)->get('/admin/backups');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Backup/Index')
            ->has('backups')
            ->has('stats')
        );
    }

    public function test_admin_can_generate_database_backup(): void
    {
        $admin = User::factory()->create([
            'is_admin' => true,
        ]);

        $response = $this->actingAs($admin)->post('/admin/backups/generate', [
            'type' => 'database',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $service = app(BackupService::class);
        $backups = $service->getBackups();

        $this->assertNotEmpty($backups);
        $this->assertEquals('database', $backups[0]['type']);
        $this->assertFileExists(storage_path('app/backups/'.$backups[0]['name']));
    }

    public function test_admin_can_download_and_delete_backup(): void
    {
        $admin = User::factory()->create([
            'is_admin' => true,
        ]);

        $service = app(BackupService::class);
        $filename = $service->createDatabaseBackup();

        // Download
        $downloadResponse = $this->actingAs($admin)->get("/admin/backups/download/{$filename}");
        $downloadResponse->assertStatus(200);

        // Delete
        $deleteResponse = $this->actingAs($admin)->delete("/admin/backups/{$filename}");
        $deleteResponse->assertRedirect();
        $deleteResponse->assertSessionHas('success');

        $this->assertFileDoesNotExist(storage_path('app/backups/'.$filename));
    }
}
