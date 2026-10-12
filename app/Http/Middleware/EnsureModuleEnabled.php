<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureModuleEnabled
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string $module): Response
    {
        $enabled = config("modules.{$module}", true);

        if (! $enabled) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => "The '{$module}' module is currently in development mode for MVP release.",
                    'module' => $module,
                    'status' => 'development_mode',
                ], 403);
            }

            $moduleLabel = ucwords(str_replace('_', ' ', $module));

            return redirect('/admin/dashboard')->with('error', "The {$moduleLabel} module is currently in Development Mode for this MVP release.");
        }

        return $next($request);
    }
}
