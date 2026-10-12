<?php

namespace App\Services;

use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use PDO;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use SplFileInfo;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use ZipArchive;

class BackupService
{
    protected string $backupPath;

    public function __construct()
    {
        $this->backupPath = storage_path('app/backups');
        if (! File::exists($this->backupPath)) {
            File::makeDirectory($this->backupPath, 0755, true);
        }
    }

    /**
     * Get list of existing backups with metadata.
     *
     * @return array<int, array<string, mixed>>
     */
    public function getBackups(): array
    {
        $files = File::files($this->backupPath);
        $backups = [];

        foreach ($files as $file) {
            /** @var SplFileInfo $file */
            $extension = strtolower($file->getExtension());
            if (! in_array($extension, ['zip', 'sql'])) {
                continue;
            }

            $name = $file->getFilename();
            $type = 'unknown';

            if (str_starts_with($name, 'backup_db_')) {
                $type = 'database';
            } elseif (str_starts_with($name, 'backup_media_')) {
                $type = 'media';
            } elseif (str_starts_with($name, 'backup_full_')) {
                $type = 'full';
            }

            $sizeBytes = $file->getSize();

            $backups[] = [
                'name' => $name,
                'type' => $type,
                'size_bytes' => $sizeBytes,
                'size_formatted' => $this->formatBytes($sizeBytes),
                'created_at' => date('Y-m-d H:i:s', $file->getMTime()),
                'timestamp' => $file->getMTime(),
            ];
        }

        usort($backups, fn ($a, $b) => $b['timestamp'] <=> $a['timestamp']);

        return $backups;
    }

    /**
     * Generate database backup archive.
     */
    public function createDatabaseBackup(): string
    {
        $this->prepareExecutionLimits();

        $timestamp = date('Y-m-d_H-i-s');
        $zipFilename = "backup_db_{$timestamp}.zip";
        $zipFullPath = $this->backupPath.DIRECTORY_SEPARATOR.$zipFilename;
        $tempSqlPath = $this->backupPath.DIRECTORY_SEPARATOR."db_dump_{$timestamp}.sql";

        $this->dumpDatabaseToSqlFile($tempSqlPath);

        $zip = new ZipArchive;
        if ($zip->open($zipFullPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            if (File::exists($tempSqlPath)) {
                File::delete($tempSqlPath);
            }
            throw new Exception('Could not create backup zip archive.');
        }

        $zip->addFile($tempSqlPath, 'database.sql');
        $zip->close();

        if (File::exists($tempSqlPath)) {
            File::delete($tempSqlPath);
        }

        return $zipFilename;
    }

    /**
     * Generate media files backup archive.
     */
    public function createMediaBackup(): string
    {
        $this->prepareExecutionLimits();

        $timestamp = date('Y-m-d_H-i-s');
        $zipFilename = "backup_media_{$timestamp}.zip";
        $zipFullPath = $this->backupPath.DIRECTORY_SEPARATOR.$zipFilename;

        $zip = new ZipArchive;
        if ($zip->open($zipFullPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            throw new Exception('Could not create media backup zip archive.');
        }

        $mediaDirectories = [
            'uploads' => public_path('uploads'),
            'landing-pages' => public_path('landing-pages'),
        ];

        $filesAdded = 0;
        foreach ($mediaDirectories as $prefix => $directory) {
            if (File::isDirectory($directory)) {
                $filesAdded += $this->addDirectoryToZip($zip, $directory, $prefix);
            }
        }

        // If no media was found, add a placeholder readme so zip is valid
        if ($filesAdded === 0) {
            $zip->addFromString('README.txt', 'No media files were found in public uploads at the time of backup.');
        }

        $zip->close();

        return $zipFilename;
    }

    /**
     * Generate full backup archive containing database dump and media files.
     */
    public function createFullBackup(): string
    {
        $this->prepareExecutionLimits();

        $timestamp = date('Y-m-d_H-i-s');
        $zipFilename = "backup_full_{$timestamp}.zip";
        $zipFullPath = $this->backupPath.DIRECTORY_SEPARATOR.$zipFilename;
        $tempSqlPath = $this->backupPath.DIRECTORY_SEPARATOR."full_db_{$timestamp}.sql";

        $this->dumpDatabaseToSqlFile($tempSqlPath);

        $zip = new ZipArchive;
        if ($zip->open($zipFullPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            if (File::exists($tempSqlPath)) {
                File::delete($tempSqlPath);
            }
            throw new Exception('Could not create full backup zip archive.');
        }

        // Add SQL dump
        $zip->addFile($tempSqlPath, 'database.sql');

        // Add media directories
        $mediaDirectories = [
            'media/uploads' => public_path('uploads'),
            'media/landing-pages' => public_path('landing-pages'),
        ];

        foreach ($mediaDirectories as $prefix => $directory) {
            if (File::isDirectory($directory)) {
                $this->addDirectoryToZip($zip, $directory, $prefix);
            }
        }

        $zip->close();

        if (File::exists($tempSqlPath)) {
            File::delete($tempSqlPath);
        }

        return $zipFilename;
    }

    /**
     * Download backup file securely.
     */
    public function downloadBackup(string $filename): BinaryFileResponse
    {
        $cleanName = basename($filename);
        $fullPath = $this->backupPath.DIRECTORY_SEPARATOR.$cleanName;

        if (! File::exists($fullPath)) {
            abort(404, 'Backup file not found.');
        }

        return response()->download($fullPath, $cleanName, [
            'Content-Type' => 'application/zip',
        ]);
    }

    /**
     * Delete backup file securely.
     */
    public function deleteBackup(string $filename): bool
    {
        $cleanName = basename($filename);
        $fullPath = $this->backupPath.DIRECTORY_SEPARATOR.$cleanName;

        if (File::exists($fullPath)) {
            return File::delete($fullPath);
        }

        return false;
    }

    /**
     * Dump database tables and rows to a .sql file via PDO.
     */
    protected function dumpDatabaseToSqlFile(string $filePath): void
    {
        $handle = fopen($filePath, 'w');
        if (! $handle) {
            throw new Exception("Unable to open output file for writing: {$filePath}");
        }

        $connection = DB::connection();
        $pdo = $connection->getPdo();
        $databaseName = $connection->getDatabaseName();

        fwrite($handle, "-- --------------------------------------------------------\n");
        fwrite($handle, "-- Creative Toy - Automated Database Backup\n");
        fwrite($handle, '-- Date: '.date('Y-m-d H:i:s')."\n");
        fwrite($handle, "-- Database: {$databaseName}\n");
        fwrite($handle, "-- --------------------------------------------------------\n\n");
        fwrite($handle, "SET FOREIGN_KEY_CHECKS = 0;\n");
        fwrite($handle, "SET SQL_MODE = \"NO_AUTO_VALUE_ON_ZERO\";\n");
        fwrite($handle, "SET time_zone = \"+00:00\";\n\n");

        $driver = $connection->getDriverName();

        if ($driver === 'mysql') {
            $tables = $connection->select('SHOW FULL TABLES WHERE Table_type = "BASE TABLE"');
            $tableKey = 'Tables_in_'.$databaseName;

            foreach ($tables as $tableObj) {
                $tableArray = (array) $tableObj;
                $tableName = $tableArray[$tableKey] ?? reset($tableArray);

                $this->dumpMySqlTable($handle, $pdo, (string) $tableName);
            }
        } elseif ($driver === 'sqlite') {
            $tables = $connection->select("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'");
            foreach ($tables as $table) {
                $tableName = $table->name;
                $createResult = $connection->selectOne("SELECT sql FROM sqlite_master WHERE type='table' AND name = ?", [$tableName]);
                if ($createResult && ! empty($createResult->sql)) {
                    fwrite($handle, "DROP TABLE IF EXISTS \"{$tableName}\";\n");
                    fwrite($handle, $createResult->sql.";\n\n");

                    $rows = $connection->table($tableName)->get();
                    foreach ($rows as $row) {
                        $rowArray = (array) $row;
                        $cols = array_map(fn ($col) => "\"{$col}\"", array_keys($rowArray));
                        $vals = array_map(function ($val) use ($pdo) {
                            if ($val === null) {
                                return 'NULL';
                            }
                            if (is_numeric($val) && ! is_string($val)) {
                                return $val;
                            }

                            return $pdo->quote($val);
                        }, array_values($rowArray));

                        fwrite($handle, "INSERT INTO \"{$tableName}\" (".implode(', ', $cols).') VALUES ('.implode(', ', $vals).");\n");
                    }
                    fwrite($handle, "\n");
                }
            }
        } else {
            throw new Exception("Unsupported database driver for backup: {$driver}");
        }

        fwrite($handle, "SET FOREIGN_KEY_CHECKS = 1;\n");
        fclose($handle);
    }

    /**
     * Dump a single MySQL table schema and data.
     */
    protected function dumpMySqlTable($handle, PDO $pdo, string $tableName): void
    {
        fwrite($handle, "-- --------------------------------------------------------\n");
        fwrite($handle, "-- Structure for table `{$tableName}`\n");
        fwrite($handle, "-- --------------------------------------------------------\n\n");
        fwrite($handle, "DROP TABLE IF EXISTS `{$tableName}`;\n");

        $createTableStmt = $pdo->query("SHOW CREATE TABLE `{$tableName}`");
        $createTableRow = $createTableStmt ? $createTableStmt->fetch(PDO::FETCH_ASSOC) : null;
        if (! $createTableRow || empty($createTableRow['Create Table'])) {
            return;
        }

        fwrite($handle, $createTableRow['Create Table'].";\n\n");

        fwrite($handle, "-- --------------------------------------------------------\n");
        fwrite($handle, "-- Dumping data for table `{$tableName}`\n");
        fwrite($handle, "-- --------------------------------------------------------\n\n");

        $selectStmt = $pdo->query("SELECT * FROM `{$tableName}`");
        if (! $selectStmt) {
            return;
        }

        $batchCount = 0;
        $batchRows = [];

        while ($row = $selectStmt->fetch(PDO::FETCH_ASSOC)) {
            $formattedValues = [];
            foreach ($row as $val) {
                if ($val === null) {
                    $formattedValues[] = 'NULL';
                } elseif (is_numeric($val) && ! is_string($val)) {
                    $formattedValues[] = $val;
                } else {
                    $formattedValues[] = $pdo->quote($val);
                }
            }

            $batchRows[] = '('.implode(', ', $formattedValues).')';
            $batchCount++;

            if ($batchCount >= 200) {
                fwrite($handle, "INSERT INTO `{$tableName}` VALUES \n".implode(",\n", $batchRows).";\n");
                $batchRows = [];
                $batchCount = 0;
            }
        }

        if (! empty($batchRows)) {
            fwrite($handle, "INSERT INTO `{$tableName}` VALUES \n".implode(",\n", $batchRows).";\n");
        }

        fwrite($handle, "\n\n");
    }

    /**
     * Recursively add a directory's contents to a ZipArchive.
     */
    protected function addDirectoryToZip(ZipArchive $zip, string $dirPath, string $zipPrefix = ''): int
    {
        $count = 0;
        $files = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($dirPath, RecursiveDirectoryIterator::SKIP_DOTS),
            RecursiveIteratorIterator::LEAVES_ONLY
        );

        foreach ($files as $file) {
            /** @var SplFileInfo $file */
            if (! $file->isFile()) {
                continue;
            }

            $realPath = $file->getRealPath();
            $relativePath = substr($realPath, strlen(realpath($dirPath)) + 1);
            $normalizedRelative = str_replace('\\', '/', $relativePath);
            $archivePath = $zipPrefix !== '' ? trim($zipPrefix, '/').'/'.$normalizedRelative : $normalizedRelative;

            $zip->addFile($realPath, $archivePath);
            $count++;
        }

        return $count;
    }

    /**
     * Format bytes into human readable string.
     */
    protected function formatBytes(int $bytes, int $precision = 2): string
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);

        $bytes /= (1 << (10 * $pow));

        return round($bytes, $precision).' '.$units[$pow];
    }

    /**
     * Increase resource limits for intensive backup jobs.
     */
    protected function prepareExecutionLimits(): void
    {
        @ini_set('memory_limit', '512M');
        @set_time_limit(600);
    }
}
