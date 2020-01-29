<?php

namespace App\Modules\Mvp\Http\Controllers\Auth;

use App\Modules\Mvp\Models\{ Persona, User };
use App\Http\Controllers\Auth\RegisterController as Controller;
use App\Traits\FormatsValidJsonResponses;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RegisterController extends Controller
{
    use FormatsValidJsonResponses;

    /**
     * Handle a registration request for the application.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function register(Request $request)
    {
        $this->validator($request->all())->validate();

        $user = $this->create($request->all());
        $user->loadMissing('roles');

        //$user->notify(new UsuarioRegistrado($user));

        return $user;

    }

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        return Validator::make(
            $data, [
	    'accepted' => 'required|accepted',	    
            'email' => 'required|email|unique:users,email',
            'id_persona.enum_tipo_persona' => 'sometimes|required|in:FISICA,JURIDICA',
            'id_persona.apellido' => 'required_if:id_persona.enum_tipo_persona,FISICA',
            'id_persona.fecha_nacimiento' => 'required|date',
            'id_persona.nombre' => 'required',
            'password' => 'required|confirmed',
            ]
        );
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array $data
     * @return User
     */
    protected function create(array $data)
    {
        $persona = Persona::create(array_merge(['enum_estado' => 'ACTIVO', 'mail' => $data['email']], $data['id_persona']));

        $user = User::create(
            [
            'email' => $data['email'],
            'first_name' => $data['id_persona']['nombre'],
            'id_persona' => $persona->id,
            'last_name' => $data['id_persona']['apellido'],
            'password' => $data['password'],
            ]
        );

        $role = $data['role_id'];
        $user->roles()->attach($role);

        return $user;
    }
}
