<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\BackupService;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class BackupController extends Controller
{
    public function __construct(
        protected BackupService $backupService
    ) {}

    /**
     * Display a listing of system backups.
     */
    public function index(): Response
    {
        $backups = $this->backupService->getBackups();

        $totalBytes = array_sum(array_column($backups, 'size_bytes'));
        $stats = [
            'total_count' => count($backups),
            'total_size' => $this->formatBytes($totalBytes),
            'database_count' => count(array_filter($backups, fn ($b) => $b['type'] === 'database')),
            'media_count' => count(array_filter($backups, fn ($b) => $b['type'] === 'media')),
            'full_count' => count(array_filter($backups, fn ($b) => $b['type'] === 'full')),
            'latest_backup' => $backups[0]['created_at'] ?? null,
        ];

        return Inertia::render('Admin/Backup/Index', [
            'backups' => $backups,
            'stats' => $stats,
        ]);
    }

    /**
     * Generate a new backup archive.
     */
    public function generate(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'type' => 'required|in:database,media,full',
        ]);

        try {
            $filename = match ($validated['type']) {
                'database' => $this->backupService->createDatabaseBackup(),
                'media' => $this->backupService->createMediaBackup(),
                'full' => $this->backupService->createFullBackup(),
            };

            return back()->with('success', "Backup ({$validated['type']}) generated successfully: {$filename}");
        } catch (Exception $e) {
            return back()->with('error', 'Failed to generate backup: '.$e->getMessage());
        }
    }

    /**
     * Download an existing backup file.
     */
    public function download(string $filename): BinaryFileResponse
    {
        return $this->backupService->downloadBackup($filename);
    }

    /**
     * Delete an existing backup file.
     */
    public function destroy(string $filename): RedirectResponse
    {
        $deleted = $this->backupService->deleteBackup($filename);

        if ($deleted) {
            return back()->with('success', "Backup file '{$filename}' deleted successfully.");
        }

        return back()->with('error', "Could not delete backup file '{$filename}'.");
    }

    /**
     * Helper to format total bytes into human readable string.
     */
    protected function formatBytes(int $bytes): string
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);

        $bytes /= (1 << (10 * $pow));

        return round($bytes, 2).' '.$units[$pow];
    }
}
