<?php

namespace App\Modules\Mvp\Models\Traits;

trait PersonaTrait
{
    public function getNombreYApellidosAttribute()
    {
        return $this->nombre.' '.$this->apellido;
    }
}
