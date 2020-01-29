<?php

namespace App\Modules\Mvp\Http\Controllers\Auth;

use App\Http\Controllers\Auth\SocialController as Controller;
use App\Modules\Mvp\Mail\UsuarioRegistradoParaAdminPoga;
use App\Modules\Mvp\Models\{ Persona, User };
use App\Modules\Mvp\Notifications\UsuarioRegistrado;

use Illuminate\Support\Facades\Mail;

class SocialController extends Controller
{
    /**
     * Where to redirect users after login.
     *
     * @var string
     */
    protected $redirectTo = '/cuenta/mis-inmuebles';

    /**
     * Update or create the Eloquent User model.
     *
     * @param \Laravel\Socialite\Contracts\User $socialUser The User instance for the authenticated user.
     * @param string                            $provider   The provider.
     *
     * @return \Illuminate\Database\Eloquent\Model
     */
    protected function updateOrCreateUser($socialUser, $provider)
    {
        $persona = Persona::updateOrCreate(['mail' => $socialUser->getEmail()], ['mail' => $socialUser->getEmail(), 'nombre' => $socialUser->getName()]);

        $user = User::updateOrCreate(
            ['email' => $socialUser->getEmail()],
            [
            'nickname' => $socialUser->getNickname(),
	    'first_name' => $socialUser->getName(),
	    'id_persona' => $persona->id,
            'provider' => $provider,
	    'provider_id' => $socialUser->id,
	    'role_id' => '4',
            ]
        );

        $user->roles()->syncWithoutDetaching(4);

        $this->updateOrCreateAvatar($user, $socialUser);

        if ($user->wasRecentlyCreated) {
	    $user->notify(new UsuarioRegistrado($user));
	
            Mail::to(env('MAIL_ADMIN_ADDRESS'))->send(new UsuarioRegistradoParaAdminPoga($user));
	}
    
        return $user;
    }
}
