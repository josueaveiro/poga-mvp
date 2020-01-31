<?php

namespace App\Modules\Mvp\Models;

use Illuminate\Database\Eloquent\Model;

class Pais extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id',
        'codigo',
        'disponible_cobertura',
        'enum_estado',
        'nombre',
    ];

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'paises';

    /**
     * Get the personas for the pais.
     */
    public function personas()
    {
        return $this->hasMany(Persona::class, 'id_pais');
    }
}
