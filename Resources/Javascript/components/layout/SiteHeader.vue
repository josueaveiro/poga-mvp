<style lang="scss">
.navbar-brand {
  padding: 0;

  img {
    width: 6rem;
    height: 100%;
    max-height: 100%;
  }
}
</style>

<template>
  <b-navbar class="is-primary">
    <template slot="brand">
      <b-navbar-item
        tag="router-link"
        :to="{ path: '/' }"
      >
        <img
          src="/img/logoblanco.svg"
          alt="POGA"
        >
      </b-navbar-item>
    </template>
    <template
      v-if="$route.name !== 'Realiza un Pago'"
      slot="start"
    >
      <b-navbar-item
        v-if="isAuthenticated"
        tag="router-link"
        :to="{ name: 'Datos Personales' }"
      >
        Cuenta
      </b-navbar-item>
      <b-navbar-dropdown v-if="showRentasMenu" label="Rentas">
        <b-navbar-item
          tag="router-link"
          :to="{ name: 'Crear Renta' }"
        >
          Crear
        </b-navbar-item>
      </b-navbar-dropdown>
      <b-navbar-dropdown v-if="showInmueblesMenu" label="Inmuebles">
        <b-navbar-item
          tag="router-link"
          :to="{ name: 'Crear Inmueble' }"
        >
          Publicar
        </b-navbar-item>
      </b-navbar-dropdown>
    </template>

    <template
      v-if="$route.name !== 'Realiza un Pago'"
      slot="end"
    >
      <b-navbar-item tag="div">
        <div class="buttons">
          <RouterLink
            v-if="!isAuthenticated"
            :to="{ name: 'Register' }"
            class="button is-primary"
          >
            <strong>Registrate como Propietario</strong>
          </RouterLink>
          <RouterLink
            v-if="!isAuthenticated"
            :to="{ name: 'Login' }"
            class="button is-light"
          >
            Iniciar sesión
          </RouterLink>
          <RouterLink
            v-if="isAuthenticated"
            :to="{ name: 'Logout' }"
            class="button is-light"
          >
            Cerrar sesión
          </RouterLink>
        </div>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script>
import { authComputed } from "@/store/helpers"

export default {
    computed: {
        ...authComputed,

        showInmueblesMenu() {
            if (this.user) {
                if (this.user.role_id == 4) {
                    return true
                }
            }

            return false
        },

        showRentasMenu() {
            if (this.user) {
                if (this.user.role_id == 4) {
                    return true
                }
            }

            return false
        }
    }
}
</script>
