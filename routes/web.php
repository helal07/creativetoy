<?php

use App\Http\Controllers\Admin\BackupController;
use App\Http\Controllers\Admin\CampaignController;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\PurchaseController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\SaleController;
use App\Http\Controllers\Admin\SupplierController;
use App\Http\Controllers\Admin\VariantController;
use App\Http\Controllers\AdminCourierController;
use App\Http\Controllers\AdminLandingPageController;
use App\Http\Controllers\AdminProfileController;
use App\Http\Controllers\AdminWebController;
use App\Http\Controllers\Auth\AdminLoginController;
use App\Http\Controllers\CourierChargeController;
use App\Http\Controllers\FrontendCmsController;
use App\Http\Controllers\LandingPageController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\SeoController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\SmsController;
use App\Http\Middleware\HandleInertiaRequests;
use App\Models\Campaign;
use App\Models\Category;
use App\Models\Product;
use App\Models\Setting;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Http\Request;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Schema;
use Illuminate\View\Middleware\ShareErrorsFromSession;
use Inertia\Inertia;

// Public Frontend Routes (Inertia)
Route::get('/', function () {
    $categories = Category::with(['products' => function ($query) {
        $query->with('images')->take(8);
    }])->whereHas('products')->take(4)->get();

    return Inertia::render('Home', [
        'featuredProducts' => Product::with('images')->where('is_featured', true)->take(8)->get(),
        'newArrivals' => Product::with('images')->where('is_new_arrival', true)->take(8)->get(),
        'categoriesWithProducts' => $categories,
        'activeCampaigns' => Campaign::with(['products' => function ($query) {
            $query->with('images')->take(4);
        }])->where('is_active', true)->orderBy('created_at', 'desc')->get(),
    ]);
});
Route::get('/about', function () {
    return Inertia::render('About');
});
Route::get('/contact', function () {
    return Inertia::render('Contact');
});
Route::get('/checkout', function () {
    return Inertia::render('Checkout');
});
Route::get('/pages/{slug}', [PageController::class, 'show'])->name('page.show');

Route::get('/shop', function (Request $request) {
    $query = Product::with(['images', 'category.parent']);
    $isFallback = false;

    if ($request->has('search')) {
        $search = $request->input('search');
        $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
                ->orWhere('scent_family', 'like', "%{$search}%")
                ->orWhere('notes_top', 'like', "%{$search}%")
                ->orWhere('notes_heart', 'like', "%{$search}%")
                ->orWhere('notes_base', 'like', "%{$search}%")
                ->orWhere('short_description', 'like', "%{$search}%");
        });
    }

    if ($request->has('category') && ! empty($request->input('category'))) {
        $catSlug = $request->input('category');
        $query->where(function ($q) use ($catSlug) {
            $hasParent = Schema::hasColumn('categories', 'parent_id');
            $q->whereHas('category', function ($sub) use ($catSlug, $hasParent) {
                $sub->where('slug', $catSlug);
                if ($hasParent) {
                    $sub->orWhereHas('parent', function ($p) use ($catSlug) {
                        $p->where('slug', $catSlug);
                    });
                }
            });

            if (in_array($catSlug, ['men', 'men-perfumes', 'men-fragrances'])) {
                $q->orWhereIn('gender', ['men', 'unisex']);
            } elseif (in_array($catSlug, ['women', 'women-perfumes', 'women-fragrances'])) {
                $q->orWhereIn('gender', ['women', 'unisex']);
            } elseif (in_array($catSlug, ['kids', 'kids-perfume'])) {
                $q->orWhere('gender', 'kids');
            }
        });
    }

    if ($request->has('gender') && $request->input('gender') !== 'all') {
        $query->whereIn('gender', [$request->input('gender'), 'unisex']);
    }

    if ($request->has('collection')) {
        $col = $request->input('collection');
        if ($col === 'new-arrivals') {
            $query->where('is_new_arrival', true);
        } elseif ($col === 'bestsellers' || $col === 'sale') {
            $query->where('is_featured', true);
        }
    }

    $products = $query->get();

    // If specific filter/search yields no result, provide fallback recommendations
    if (($request->has('search') || $request->has('category') || $request->has('collection')) && $products->isEmpty()) {
        $products = Product::with(['images', 'category'])->where('is_featured', true)->take(6)->get();
        $isFallback = true;
    }

    return Inertia::render('Shop', [
        'products' => $products,
        'filters' => $request->all(),
        'isFallback' => $isFallback,
    ]);
})->name('shop');

Route::get('/toys', function (Request $request) {
    return redirect('/shop'.($request->getQueryString() ? '?'.$request->getQueryString() : ''));
});

Route::get('/perfumes', function (Request $request) {
    return redirect('/shop'.($request->getQueryString() ? '?'.$request->getQueryString() : ''));
});
Route::get('/product/{slug}', function ($slug) {
    $product = Product::with(['images', 'category.parent', 'variants'])->where('slug', $slug)->firstOrFail();
    $related = Product::with('images')
        ->where('id', '!=', $product->id)
        ->where(function ($q) use ($product) {
            $q->where('scent_family', $product->scent_family)
                ->orWhere('gender', $product->gender);
        })
        ->take(4)
        ->get();

    return Inertia::render('Product/Show', [
        'product' => $product,
        'related' => $related,
    ]);
});
// Admin Authentication Routes
Route::get('/admin/login', [AdminLoginController::class, 'create'])->name('login');
Route::post('/admin/login', [AdminLoginController::class, 'store']);
Route::post('/admin', [AdminLoginController::class, 'store']);
Route::get('/login', function () {
    return redirect('/admin');
});

// Ã¢â€â‚¬Ã¢â€â‚¬ Public SEO routes (must be before auth middleware) Ã¢â€â‚¬Ã¢â€â‚¬
Route::get('/sitemap.xml', [SeoController::class, 'sitemap']);
Route::get('/robots.txt', [SeoController::class, 'robots']);

// Public Landing Page Route & Live Preview
Route::get('/landing-page-preview', [LandingPageController::class, 'preview'])->name('landing-page.preview');
Route::get('/landing-page/{slug}', [LandingPageController::class, 'show'])->name('landing-page.show');

// Admin Root Route: Shows Login if guest, or Dashboard if authenticated admin
Route::get('/admin', function () {
    if (! Auth::check() || ! Auth::user()->is_admin) {
        $siteSettings = Setting::pluck('value', 'key')->toArray();

        return Inertia::render('Auth/AdminLogin', [
            'siteSettings' => $siteSettings,
        ]);
    }

    return app(AdminWebController::class)->dashboard();
});

// All Backend Admin Panel Web Routes (Protected)
Route::middleware('auth')->group(function () {
    Route::get('/admin/dashboard', [AdminWebController::class, 'dashboard']);
    Route::get('/admin/categories', [AdminWebController::class, 'categories']);
    Route::get('/admin/products/list', [AdminWebController::class, 'productList']);
    Route::get('/admin/products/add', [AdminWebController::class, 'productAdd']);
    Route::get('/admin/create-order', [AdminWebController::class, 'createOrder']);
    Route::get('/admin/orders', [AdminWebController::class, 'orders']);
    Route::get('/admin/orders/{id}/invoice', [AdminWebController::class, 'invoiceOrder']);
    Route::get('/admin/orders/{id}/edit', [AdminWebController::class, 'editOrder']);
    Route::put('/admin/orders/{id}', [AdminWebController::class, 'updateOrder']);
    Route::post('/admin/orders/{id}/status', [AdminWebController::class, 'updateOrderStatus']);
    Route::put('/admin/orders/{id}/status', [AdminWebController::class, 'updateOrderStatus']);
    Route::delete('/admin/orders/{id}', [AdminWebController::class, 'destroyOrder']);

    // Newly Extracted Dashboard Sections
    Route::get('/admin/purchases', [AdminWebController::class, 'purchaseList']);
    Route::get('/admin/purchases/list', [AdminWebController::class, 'purchaseList']);
    Route::get('/admin/purchases/add', [AdminWebController::class, 'purchaseAdd']);
    Route::get('/admin/customers', [AdminWebController::class, 'customers']);
    Route::get('/admin/suppliers', [AdminWebController::class, 'suppliers']);
    // Settings & CMS Routes
    Route::get('/admin/settings', [AdminWebController::class, 'settings']);
    Route::get('/admin/backups', [BackupController::class, 'index'])->name('admin.backups.index');
    Route::post('/admin/backups/generate', [BackupController::class, 'generate'])->name('admin.backups.generate');
    Route::get('/admin/backups/download/{filename}', [BackupController::class, 'download'])->name('admin.backups.download');
    Route::delete('/admin/backups/{filename}', [BackupController::class, 'destroy'])->name('admin.backups.destroy');
    Route::get('/admin/cms', [FrontendCmsController::class, 'index']);
    Route::post('/admin/cms', [FrontendCmsController::class, 'update']);

    // Split API Settings
    Route::get('/admin/api-settings/payment', [AdminWebController::class, 'apiPayment']);
    Route::get('/admin/api-settings/sms', [AdminWebController::class, 'apiSms']);
    Route::get('/admin/api-settings/courier', [AdminWebController::class, 'apiCourier']);

    // Split SEO Settings
    Route::get('/admin/seo/meta', [AdminWebController::class, 'seoMeta']);
    Route::get('/admin/seo/marketing', [AdminWebController::class, 'seoMarketing']);
    Route::get('/admin/seo/ping', [AdminWebController::class, 'seoPing']);

    // Courier Hub & Live API Routes
    Route::get('/admin/courier', [AdminCourierController::class, 'index']);
    Route::post('/admin/courier/settings', [AdminCourierController::class, 'saveSettings']);
    Route::post('/admin/courier/save/{key}', [AdminCourierController::class, 'saveSingleCourier']);
    Route::post('/admin/courier/test-connection', [AdminCourierController::class, 'testConnection']);
    Route::post('/admin/courier/dispatch', [AdminCourierController::class, 'dispatchOrder']);
    Route::get('/admin/courier/track/{id}', [AdminCourierController::class, 'trackOrder']);
    Route::get('/admin/run-migrations', [AdminCourierController::class, 'runMigrations']);
    Route::get('/admin/courier/run-migrations', [AdminCourierController::class, 'runMigrations']);

    // Courier Charge Settings Routes
    Route::get('/admin/courier-charges', [CourierChargeController::class, 'index']);
    Route::post('/admin/courier-charges', [CourierChargeController::class, 'store']);
    Route::put('/admin/courier-charges/{id}', [CourierChargeController::class, 'update']);
    Route::delete('/admin/courier-charges/{id}', [CourierChargeController::class, 'destroy']);
    Route::post('/admin/courier-charges/bulk-update', [CourierChargeController::class, 'bulkUpdate']);

    // Menu Builder CRUD Routes
    Route::post('/admin/menus', [AdminWebController::class, 'storeMenu']);
    Route::put('/admin/menus/{id}', [AdminWebController::class, 'updateMenu']);
    Route::delete('/admin/menus/{id}', [AdminWebController::class, 'destroyMenu']);

    // Category & Subcategory CRUD Routes
    Route::post('/admin/categories', [AdminWebController::class, 'storeCategory']);
    Route::put('/admin/categories/{id}', [AdminWebController::class, 'updateCategory']);
    Route::delete('/admin/categories/{id}', [AdminWebController::class, 'destroyCategory']);

    // Custom Pages CRUD Routes
    Route::post('/admin/pages', [PageController::class, 'store']);
    Route::put('/admin/pages/{id}', [PageController::class, 'update']);
    Route::delete('/admin/pages/{id}', [PageController::class, 'destroy']);

    // Product Catalog CRUD Routes
    Route::get('/admin/products', [AdminWebController::class, 'productList']);
    Route::get('/admin/products/{id}/edit', [AdminWebController::class, 'editProduct']);
    Route::post('/admin/products', [AdminWebController::class, 'storeProduct']);
    Route::put('/admin/products/{id}', [AdminWebController::class, 'updateProduct']);
    Route::post('/admin/products/{id}', [AdminWebController::class, 'updateProduct']);
    Route::delete('/admin/products/{id}', [AdminWebController::class, 'destroyProduct']);

    // Logout Routes
    Route::post('/logout', [AdminLoginController::class, 'destroy'])->name('logout');
    Route::get('/admin/logout', [AdminLoginController::class, 'destroy']);
    Route::post('/admin/logout', [AdminLoginController::class, 'destroy']);

    // Settings Route
    Route::post('/admin/settings', [SettingController::class, 'store'])->name('admin.settings.store');

    // Campaigns
    Route::post('/admin/campaigns/{campaign}/toggle', [CampaignController::class, 'toggle'])->name('campaigns.toggle');
    Route::resource('admin/campaigns', CampaignController::class);

    // Variants
    Route::get('/admin/variants', [VariantController::class, 'index']);
    Route::post('/admin/variants', [VariantController::class, 'store']);
    Route::put('/admin/variants/{id}', [VariantController::class, 'update']);
    Route::delete('/admin/variants/{id}', [VariantController::class, 'destroy']);

    // SMS Gateway Routes
    Route::post('/admin/sms/test', [SmsController::class, 'testConnection'])->name('admin.sms.test');

    // SEO — Sitemap & Robots Generator Routes
    Route::get('/admin/seo/status', [SeoController::class, 'status'])->name('admin.seo.status');
    Route::post('/admin/seo/generate-sitemap', [SeoController::class, 'generateSitemap'])->name('admin.seo.sitemap');
    Route::post('/admin/seo/generate-robots', [SeoController::class, 'generateRobots'])->name('admin.seo.robots');
    Route::post('/admin/seo/ping-search-engines', [SeoController::class, 'pingSearchEngines'])->name('admin.seo.ping');

    // User Profile & Staff Management Routes
    Route::get('/admin/profile', [AdminProfileController::class, 'index']);

    Route::get('/admin/users', [AdminProfileController::class, 'users']);
    Route::post('/admin/profile/update', [AdminProfileController::class, 'updateProfile']);
    Route::post('/admin/profile/remove-avatar', [AdminProfileController::class, 'removeAvatar']);
    Route::post('/admin/profile/password', [AdminProfileController::class, 'updatePassword']);
    Route::post('/admin/users', [AdminProfileController::class, 'storeUser']);
    Route::put('/admin/users/{id}', [AdminProfileController::class, 'updateUser']);
    Route::delete('/admin/users/{id}', [AdminProfileController::class, 'deleteUser']);

    // Customer API Routes
    Route::post('/admin/api/customers', [CustomerController::class, 'store']);
    Route::put('/admin/api/customers/{id}', [CustomerController::class, 'update']);
    Route::delete('/admin/api/customers/{id}', [CustomerController::class, 'destroy']);

    // Supplier API Routes
    Route::post('/admin/api/suppliers', [SupplierController::class, 'store']);
    Route::put('/admin/api/suppliers/{id}', [SupplierController::class, 'update']);
    Route::delete('/admin/api/suppliers/{id}', [SupplierController::class, 'destroy']);

    // Purchase API Routes
    Route::post('/admin/api/purchases', [PurchaseController::class, 'store']);
    Route::delete('/admin/api/purchases/{id}', [PurchaseController::class, 'destroy']);

    // Sale API Routes
    Route::post('/admin/api/sales', [SaleController::class, 'store']);
    Route::delete('/admin/api/sales/{id}', [SaleController::class, 'destroy']);

    // Landing Page Routes
    Route::resource('admin/landing-pages', AdminLandingPageController::class)->names('admin.landing-pages');

    // Role & Permission Routes
    Route::get('/admin/roles', [RoleController::class, 'index']);
    Route::post('/admin/roles', [RoleController::class, 'store']);
    Route::post('/admin/roles/{id}/sync-permissions', [RoleController::class, 'syncPermission']);
    Route::post('/admin/api/roles', [RoleController::class, 'store']);
    Route::put('/admin/api/roles/{id}', [RoleController::class, 'update']);
    Route::delete('/admin/api/roles/{id}', [RoleController::class, 'destroy']);
    Route::post('/admin/api/roles/assign', [RoleController::class, 'assignRole']);
});

$runMigrationHandler = function (Request $request) {
    $dbConfig = config('database.connections.'.config('database.default'));
    $dbName = $dbConfig['database'] ?? 'unknown';
    $dbHost = $dbConfig['host'] ?? '127.0.0.1';
    $dbDriver = config('database.default');

    $logs = [];
    $hasError = false;
    $errorMessage = '';

    try {
        // Test database connection first
        DB::connection()->getPdo();
        $logs[] = "[OK] Database connection successful ($dbDriver://$dbHost/$dbName)";

        $isSeedOnlyRoute = in_array($request->path(), ['run-seed', 'db-seed']) || $request->has('seed_only');

        if ($request->has('clear')) {
            Artisan::call('optimize:clear');
            $logs[] = "--- optimize:clear ---\n".trim(Artisan::output());
        } elseif ($request->has('status')) {
            Artisan::call('migrate:status');
            $logs[] = "--- migrate:status ---\n".trim(Artisan::output());
        } elseif ($request->has('cache')) {
            Artisan::call('config:cache');
            $logs[] = "--- config:cache ---\n".trim(Artisan::output());
            Artisan::call('route:cache');
            $logs[] = "--- route:cache ---\n".trim(Artisan::output());
            Artisan::call('view:cache');
            $logs[] = "--- view:cache ---\n".trim(Artisan::output());
        } elseif ($request->has('storage')) {
            Artisan::call('storage:link');
            $logs[] = "--- storage:link ---\n".trim(Artisan::output());
        } elseif ($isSeedOnlyRoute) {
            // Standalone Seeding Flow
            $seedParams = ['--force' => true];
            if ($request->filled('class')) {
                $seedClass = $request->input('class');
                if (! str_contains($seedClass, '\\')) {
                    $seedClass = 'Database\\Seeders\\'.$seedClass;
                }
                $seedParams['--class'] = $seedClass;
                $logs[] = "--- db:seed --class={$seedClass} --force ---";
            } else {
                $logs[] = '--- db:seed --force ---';
            }

            Artisan::call('db:seed', $seedParams);
            $logs[] = trim(Artisan::output()) ?: 'Database seeding completed successfully.';

            Artisan::call('optimize:clear');
            $logs[] = "--- optimize:clear ---\n".trim(Artisan::output());
        } else {
            // Standard migration flow
            Artisan::call('migrate', ['--force' => true]);
            $logs[] = "--- migrate --force ---\n".trim(Artisan::output());

            if ($request->has('seed')) {
                $seedParams = ['--force' => true];
                if ($request->filled('class')) {
                    $seedClass = $request->input('class');
                    if (! str_contains($seedClass, '\\')) {
                        $seedClass = 'Database\\Seeders\\'.$seedClass;
                    }
                    $seedParams['--class'] = $seedClass;
                }
                Artisan::call('db:seed', $seedParams);
                $logs[] = "--- db:seed --force ---\n".trim(Artisan::output());
            }

            Artisan::call('storage:link');
            $logs[] = "--- storage:link ---\n".trim(Artisan::output());

            Artisan::call('optimize:clear');
            $logs[] = "--- optimize:clear ---\n".trim(Artisan::output());
        }
    } catch (Throwable $e) {
        $hasError = true;
        $errorMessage = $e->getMessage();
        $logs[] = '[ERROR] '.$e->getMessage()."\n\nTrace:\n".$e->getTraceAsString();
    }

    $logOutput = htmlspecialchars(implode("\n\n", array_filter($logs)));
    $statusColor = $hasError ? '#ef4444' : '#10b981';
    $statusTitle = $hasError ? 'Database Operation Error' : 'Database Ready & Operational';

    return response('<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Database Migration & Seeding Hub | Creative Toy</title>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0b0f19; color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; min-height: 100vh; padding: 32px 16px; }
        .container { max-width: 900px; margin: 0 auto; }
        .card { background: #131b2e; border: 1px solid #1e293b; border-radius: 12px; padding: 28px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5); }
        .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px solid #1e293b; padding-bottom: 16px; flex-wrap: wrap; gap: 12px; }
        .title { font-size: 20px; font-weight: 700; color: #f8fafc; }
        .badge { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; padding: 6px 12px; border-radius: 9999px; background: '.($hasError ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)').'; color: '.$statusColor.'; border: 1px solid '.$statusColor.'; }
        .status-dot { width: 8px; height: 8px; border-radius: 50%; background: '.$statusColor.'; }
        .meta-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-bottom: 20px; }
        .meta-box { background: #0f172a; border: 1px solid #1e293b; padding: 12px 16px; border-radius: 8px; }
        .meta-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; margin-bottom: 4px; }
        .meta-value { font-size: 14px; font-weight: 600; color: #e2e8f0; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; word-break: break-all; }
        .actions-label { font-size: 13px; font-weight: 600; color: #cbd5e1; margin-bottom: 10px; }
        .btn-group { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
        .btn { display: inline-flex; align-items: center; justify-content: center; padding: 10px 16px; border-radius: 6px; font-size: 13px; font-weight: 600; text-decoration: none; transition: all 0.2s; cursor: pointer; border: 1px solid transparent; }
        .btn-primary { background: #2563eb; color: #fff; }
        .btn-primary:hover { background: #1d4ed8; }
        .btn-success { background: #059669; color: #fff; }
        .btn-success:hover { background: #047857; }
        .btn-purple { background: #7c3aed; color: #fff; }
        .btn-purple:hover { background: #6d28d9; }
        .btn-dark { background: #1e293b; color: #cbd5e1; border-color: #334155; }
        .btn-dark:hover { background: #334155; color: #fff; }
        .btn-secondary { background: #475569; color: #fff; }
        .btn-secondary:hover { background: #334155; }
        .info-callout { background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 8px; padding: 12px 16px; margin-bottom: 20px; font-size: 13px; color: #93c5fd; }
        .terminal-header { display: flex; justify-content: space-between; align-items: center; background: #0f172a; border-top-left-radius: 8px; border-top-right-radius: 8px; padding: 8px 16px; font-size: 12px; color: #94a3b8; font-family: ui-monospace, monospace; border: 1px solid #1e293b; border-bottom: none; }
        pre { background: #030712; color: #4ade80; border: 1px solid #1e293b; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; padding: 16px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 13px; line-height: 1.6; overflow-x: auto; max-height: 480px; }
        .links-bar { margin-top: 24px; display: flex; justify-content: space-between; align-items: center; padding-top: 16px; border-top: 1px solid #1e293b; font-size: 14px; flex-wrap: gap: 12px; }
        .links-bar a { color: #38bdf8; text-decoration: none; font-weight: 500; }
        .links-bar a:hover { text-decoration: underline; }
    </style>
</head>
<body>
<div class="container">
    <div class="card">
        <div class="header">
            <div>
                <h1 class="title">'.$statusTitle.'</h1>
                <p style="font-size: 13px; color: #94a3b8; margin-top: 4px;">cPanel Deployment, Migration & Seeding Utility</p>
            </div>
            <div class="badge">
                <span class="status-dot"></span>
                <span>'.($hasError ? 'ERROR OCCURRED' : 'HEALTHY').'</span>
            </div>
        </div>

        <div class="meta-grid">
            <div class="meta-box">
                <div class="meta-label">Database Connection</div>
                <div class="meta-value">'.$dbDriver.'</div>
            </div>
            <div class="meta-box">
                <div class="meta-label">Host</div>
                <div class="meta-value">'.$dbHost.'</div>
            </div>
            <div class="meta-box">
                <div class="meta-label">Database Name</div>
                <div class="meta-value">'.$dbName.'</div>
            </div>
        </div>

        <div class="info-callout">
            <strong>Default Admin Credentials:</strong> <code>admin@admin.com</code> or <code>admin@rexxobd.com</code> | Password: <code>password123</code>
        </div>

        <div class="actions-label">Database Actions</div>
        <div class="btn-group">
            <a href="/run-migration" class="btn btn-primary">&#9654; Run Migrations</a>
            <a href="/run-seed?class=AdminSeeder" class="btn btn-purple">&#128100; Seed Admin Only</a>
            <a href="/run-seed" class="btn btn-success">&#127793; Seed All (Admin + Data)</a>
            <a href="/run-migration?seed=1" class="btn btn-primary">&#9889; Migrations & Seed All</a>
            <a href="/run-migration?status=1" class="btn btn-dark">&#128202; Migration Status</a>
            <a href="/run-migration?clear=1" class="btn btn-dark">&#129529; Clear Cache (optimize:clear)</a>
            <a href="/run-migration?cache=1" class="btn btn-dark">&#9889; Cache Routes & Config</a>
            <a href="/run-migration?storage=1" class="btn btn-dark">&#128279; Fix Storage Link</a>
        </div>

        <div class="terminal-header">
            <span>TERMINAL OUTPUT</span>
            <span>Artisan CLI</span>
        </div>
        <pre>'.$logOutput.'</pre>

        <div class="links-bar">
            <a href="/">&larr; Return to Website Home</a>
            <a href="/admin">Go to Admin Dashboard &rarr;</a>
        </div>
    </div>
</div>
</body>
</html>', $hasError ? 500 : 200);
};

// Setup & Migration helper routes (Exempt from session and CSRF middleware)
Route::withoutMiddleware([
    StartSession::class,
    ShareErrorsFromSession::class,
    HandleInertiaRequests::class,
    ValidateCsrfToken::class,
])->group(function () use ($runMigrationHandler) {
    Route::match(['get', 'post'], '/run-migration', $runMigrationHandler)->name('run-migration');
    Route::match(['get', 'post'], '/run-migrations', $runMigrationHandler)->name('run-migrations');
    Route::match(['get', 'post'], '/run-seed', $runMigrationHandler)->name('run-seed');
    Route::match(['get', 'post'], '/db-seed', $runMigrationHandler)->name('db-seed');
});
