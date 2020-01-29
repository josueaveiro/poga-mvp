<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your module. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('account', Account\AccountController::class);
Route::get('validate', Account\AccountController::class);

Route::post('/register', 'Auth\RegisterController@register');

Route::post('/pagos/notificacion', function(Request $request) {
        $data = $request->all();
        \Log::info($data);

        \DB::table('pagares')->where('id', $data['doc_id'])->update(['enum_estado' => 'PAGADO']);
        $pagare = \DB::table('pagares')->find($data['doc_id']);

        $items = $data['items'];
        foreach ($items as $item) {
            \DB::table('pagares')->where('id', $item['doc_id'])->update(['enum_estado' => 'PAGADO']);
	}

	$b64UrlModel = $request->request->get('doc_model');
        $jsonModel =  base64_decode(str_replace(['-','_'], ['+','/'], $b64UrlModel));
	$docModel = json_decode( $jsonModel, true );

	\Log::info($docModel);

        //$acreedor = \App\Models\User::find($pagare->id_persona_acreedora);
        //$deudor = \App\Models\User::find($pagare->id_persona_deudora);

        $user = \App\Models\User::find(1);
        $user->notify(new BoletaPagada($data));
        //$deudor->notify(new BoletaPagada($data));

        return response()->json("OK");
});
