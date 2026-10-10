<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admins = [
            'email2itsolution@gmail.com',
            'creativetoyltd@gmail.com',
            'admin@creativetoy.store',
            'admin@admin.com',
        ];

        foreach ($admins as $email) {
            User::updateOrCreate(
                ['email' => $email],
                [
                    'name' => 'Admin',
                    'password' => Hash::make('password123'),
                    'is_admin' => true,
                ]
            );
        }
    }
}
