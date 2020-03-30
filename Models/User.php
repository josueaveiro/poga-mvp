<?php

namespace App\Modules\Mvp\Models;

use App\Models\User as Model;

use Caffeinated\Shinobi\Models\Role;

class User extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'bloqueado',
        'codigo_validacion',
        'email',
        'first_name',
        'id_persona',
        'last_name',
	'password',
	'provider',
	'provider_id',
        'role_id',    
    ];

    /**
     * The relationships that should always be loaded.
     *
     * @var array
     */
    protected $with = ['idPersona', 'idRol'];

    /**
     * Get the persona record associated with the user.
     */
    public function idPersona()
    {
        return $this->belongsTo(Persona::class, 'id_persona');
    }

    /**
     * Get the rol record associated with the user.
     */
    public function idRol()
    {
        return $this->belongsTo(Role::class, 'role_id');
    }
}
