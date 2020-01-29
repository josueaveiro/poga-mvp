<?php

namespace App\Modules\Mvp\Models;

use App\Modules\Mvp\Models\Traits\PersonaTrait;

use Illuminate\Database\Eloquent\Model;

class Persona extends Model
{
    use PersonaTrait;

    /**
     * The accessors to append to the model's array form.
     *
     * @var array
     */
    protected $appends = [
        'nombre_y_apellidos',
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'apellido',
        'ci',
        'cuenta_bancaria',
	'direccion',
	'direccion_facturacion',
        'mail',
        'enum_estado',
        'enum_tipo_persona',
        'enum_sexo',
        'fecha_nacimiento',
	'id',
	'id_banco',
        'id_pais',
        'id_pais_cobertura',
        'id_usuario_creador',
        'mail_solicitudes',
	'nombre',
	'razon_social',
        'ruc',
	'telefono',
	'titular_cuenta'
    ];

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'personas';

    /**
     * Get the usuario that owns the persona.
     */
    public function idUsuarioCreador()
    {
        return $this->belongsTo(User::class, 'id_usuario_creador');
    }

    /**
     * The inmuebles that belong to the persona.
     */
    public function inmuebles()
    {
        return $this->belongsToMany(Inmueble::class, 'inmueble_persona', 'id_persona', 'id_inmueble')
            ->withPivot(['dia_cobro_mensual','enum_estado','enum_rol','fecha_fin_contrato','fecha_inicio_contrato','id_moneda_salario','referente','salario']);
    }

    /**
     * Get the nominaciones for the persona.
     */
    public function nominaciones()
    {
        return $this->hasMany(Nominacion::class, 'id_persona_nominada');
    }

    /**
     * Get the rentas for the persona.
     */
    public function rentas()
    {
        return $this->hasMany(Renta::class, 'id_inquilino');
    }

    /**
     * Get the user record associated with the persona.
     */
    public function user()
    {
        return $this->hasOne(User::class, 'id_persona');
    }
}
