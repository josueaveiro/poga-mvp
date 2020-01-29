<?php

namespace App\Modules\Mvp\Providers;

use Caffeinated\Modules\Support\ServiceProvider;

class ModuleServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap the module services.
     *
     * @return void
     */
    public function boot()
    {
        $this->loadTranslationsFrom(module_path('mvp', 'Resources/Lang', 'app'), 'mvp');
        $this->loadViewsFrom(module_path('mvp', 'Resources/Views', 'app'), 'mvp');
        $this->loadMigrationsFrom(module_path('mvp', 'Database/Migrations', 'app'), 'mvp');
        if(!$this->app->configurationIsCached()) {
            $this->loadConfigsFrom(module_path('mvp', 'Config', 'app'));
        }
        $this->loadFactoriesFrom(module_path('mvp', 'Database/Factories', 'app'));
    }

    /**
     * Register the module services.
     *
     * @return void
     */
    public function register()
    {
	$this->app->register(EventServiceProvider::class);
	$this->app->register(PassportServiceProvider::class);
	$this->app->register(RouteServiceProvider::class);
    }
}
