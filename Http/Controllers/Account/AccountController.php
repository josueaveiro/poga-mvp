<?php

namespace App\Modules\Mvp\Http\Controllers\Account;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;
use App\Traits\FormatsValidJsonResponses;

class AccountController extends Controller
{
    use FormatsValidJsonResponses;

    /**
     * Create a new AccountController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    /**
     * Get the account for the authenticated user.
     *
     * @param Request $request The request object.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function __invoke(Request $request)
    {
        $user = $request->user('api');

        abort_if(!$user, 401);

        $user->loadMissing('idPersona', 'permissions', 'roles');

        return $this->validSuccessJsonResponse('Success', ['user' => $user]);
    }
}
