<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of the routes that are handled
| by your module. Just tell Laravel the URIs it should respond
| to using a Closure or controller method. Build something great!
|
 */

Route::get('/auth/{provider}', 'Auth\SocialController@redirectToProvider');

Route::post('/auth/{provider}/callback', 'Auth\SocialController@handleProviderCallback');
Route::post('/login', 'Auth\LoginController@login');
Route::post('pagos/retorno', function(Request $request) {
        \Log::info($request->all());

        return response()->json("OK");
});
