<?php

namespace App\Modules\Mvp\Mail;

use App\Modules\Mvp\Models\{ Banco, Pais, User };

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class UsuarioCreadoParaAdminPoga extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * The User model.
     *
     * @var User
     */
    protected $user;

    /**
     * Create a new notification instance.
     *
     * @param User  $user  The User model.
     *
     * @return void
     */
    public function __construct(User $user)
    {
	$this->user = $user;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        $bancos = Banco::get()->pluck('nombre', 'id')->toArray();
        $paises = Pais::get()->pluck('nombre', 'id')->toArray();
        $roles = ['1' => 'Administrador', '2' => 'Conserje', '3' => 'Inquilino', '4' => 'Propietario', '5' => 'Proveedor'];

        return $this->markdown('mvp::mail.usuario-creado-para-admin-poga', ['bancos' => $bancos, 'paises' => $paises, 'user' => $this->user]);
    }
}
