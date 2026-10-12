<?php

return [
    /*
    |--------------------------------------------------------------------------
    | MVP Feature Flags / Module Toggles
    |--------------------------------------------------------------------------
    |
    | These flags determine which modules are actively enabled or displayed
    | in "Development Mode" (faded and disabled) for client MVP deliveries.
    |
    */

    'courier' => filter_var(env('MODULE_COURIER_ENABLED', false), FILTER_VALIDATE_BOOLEAN),
    'api_gateway' => filter_var(env('MODULE_API_GATEWAY_ENABLED', false), FILTER_VALIDATE_BOOLEAN),
    'seo' => filter_var(env('MODULE_SEO_ENABLED', false), FILTER_VALIDATE_BOOLEAN),
    'purchases' => filter_var(env('MODULE_PURCHASES_ENABLED', true), FILTER_VALIDATE_BOOLEAN),
    'landing_pages' => filter_var(env('MODULE_LANDING_PAGES_ENABLED', true), FILTER_VALIDATE_BOOLEAN),
    'campaigns' => filter_var(env('MODULE_CAMPAIGNS_ENABLED', true), FILTER_VALIDATE_BOOLEAN),
];
