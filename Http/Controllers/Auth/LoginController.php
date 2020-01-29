<?php

namespace App\Modules\Mvp\Http\Controllers\Auth;

use App\Http\Controllers\Auth\LoginController as Controller;
use App\Traits\FormatsValidJsonResponses;

use Illuminate\Http\Request;

class LoginController extends Controller
{
    use FormatsValidJsonResponses;

    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = '/cuenta/mis-inmuebles';

    /**
     * Send the response after the user was authenticated.
     *
     * @param Request $request
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function sendLoginResponse(Request $request)
    {
        try {
            $user = $this->guard()->user();
            $user->load('permissions', 'roles');

	    $roleId = $request->role_id;
	    if ($roleId) {
              $user->update(['role_id' => $roleId]);
	    }

            $token = $user->createToken(env('APP_NAME'));
            $accessToken = $token->accessToken;
        } catch (\Exception $e) {
            return $this->validInternalServerErrorJsonResponse($e, $e->getMessage());
        }

        $data = [
            'token' => $accessToken,
            'user' => $user
        ];

        return $this->validSuccessJsonResponse('Success', $data, $this->redirectPath());
    }
}
