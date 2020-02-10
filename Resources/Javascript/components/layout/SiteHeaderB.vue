<style lang="scss" scoped>
.hero.is-primary {
  background-image: url(https://poga.com.py/wp-content/uploads/2019/12/bg-1-1.jpg);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;

  .navbar-dropdown .navbar-item {
    color: #3d4b51;
  }
}

.background-overlay {
  background: rgba(252, 119, 50, 0.9);
  background: linear-gradient(to bottom, rgba(252, 119, 50, 0.9) 0%, rgba(236, 68, 86, 0.9) 100%);
  height: 100%;
  position: absolute;
  width: 100%
}

.navbar-brand {
  padding: 0;
  width: 100%;

  img {
    width: 6rem;
    height: 100%;
    max-height: 100%;
  }
}
</style>

<template>
  <section class="hero is-primary mb-3 mb-md-5">
    <div class="background-overlay" />
    <div class="hero-head">
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
        <template slot="start">
          <b-navbar-item
            v-if="isAuthenticated"
            tag="router-link"
            :to="{ name: 'Datos Personales' }"
          >
            Cuenta
          </b-navbar-item>
          <b-navbar-dropdown
            v-if="showRentasMenu"
            label="Rentas"
          >
            <b-navbar-item
              tag="router-link"
              :to="{ name: 'Crear Renta' }"
            >
              Crear
            </b-navbar-item>
          </b-navbar-dropdown>
          <b-navbar-dropdown
            v-if="showInmueblesMenu"
            label="Inmuebles"
          >
            <b-navbar-item
              tag="router-link"
              :to="{ name: 'Crear Inmueble' }"
            >
              Publicar
            </b-navbar-item>
          </b-navbar-dropdown>
        </template>

        <template slot="end">
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
    </div>

    <!-- Hero content: will be in the middle -->
    <div class="hero-body">
      <div
        v-if="$route.fullPath.indexOf('cuenta') > -1"
        class="container has-text-centered"
      >
        <h1 class="title">
          {{ $route.name }}
        </h1>
        <h2 class="subtitle">
          Cuenta
        </h2>
      </div>
    </div>
  </section>
</template>

<script>
import { authComputed } from "@/store/helpers"
import { inmueblesComputed } from "@mvp/store/helpers"

export default {
    computed: {
        ...authComputed,
        ...inmueblesComputed,

        showInmueblesMenu() {
            if (this.isAuthenticated) {
                if (this.user.role_id == 4) {
                    return true
                }
            }

            return false
        },

        showRentasMenu() {
            if (this.isAuthenticated) {
                if (this.user.role_id == 4) {
                    return true
                }
            }

            return false
        }
    }
}
</script>
