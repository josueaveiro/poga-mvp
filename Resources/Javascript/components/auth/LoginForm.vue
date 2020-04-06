<style lang="scss" scoped>
.is-divider {
  margin-bottom: 1rem;
  margin-top: 1rem;
}

.is-divider[data-content="O"] {
  margin-bottom: 1rem;
  margin-top: 2rem;
}

.is-facebook {
  background-color: rgb(80,103,174);
  color: rgb(2555,255,255);
  text-decoration: none;
}

.is-google {
  background-color: rgb(255,255,255);
  border-color: #363636;
  color: #363636;
  text-decoration: none;
}
</style>

<template>
  <form
    aria-label="Iniciar sesión"
    @keydown="form.errors.clear($event.target.name)"
    @submit.prevent="handleLogin"
  >
    <label>Selecciona tu rol</label>
    <b-field>
      <b-radio-button
        v-model="form.role_id"
        :disabled="submitted"
        native-value="4"
        size="is-medium"
        type="is-primary"
      >
        Propietario
      </b-radio-button>

      <b-radio-button
        v-model="form.role_id"
        :disabled="submitted"
        native-value="3"
        size="is-medium"
        type="is-primary"
      >
        Inquilino
      </b-radio-button>
    </b-field>

    <b-field
      label="Email"
      :type="setFieldType('email')"
      :message="getErrorMessage('email')"
    >
      <b-input
        v-model="form.email"
        :disabled="submitted"
        icon="envelope"
        size="is-medium"
        type="email"
        placeholder="Email"
      />
    </b-field>

    <b-field
      label="Contraseña"
      :type="setFieldType('password')"
      :message="getErrorMessage('password')"
    >
      <b-input
        v-model="form.password"
        :disabled="submitted"
        size="is-medium"
        type="password"
        placeholder="Contraseña"
        password-reveal
      />
    </b-field>

    <b-field>
      <b-checkbox
        v-model="form.remember"
        :disabled="submitted"
      >
        Recordame
      </b-checkbox>
    </b-field>

    <b-field class="has-text-centered">
      <b-button
        :disabled="submitted"
        :loading="submitted"
        expanded
        native-type="submit"
        size="is-medium"
        type="is-primary"
      >
        Iniciar sesión
      </b-button>
    </b-field>

    <div
      v-if="form.role_id === '4'"
      class="is-divider"
      data-content="O"
    />

    <b-field v-if="form.role_id === '4'">
      <b-button
        :disabled="submitted"
        :loading="submitted"
        tag="a"
        href="/auth/facebook"
        icon-left="facebook-f"
        size="is-medium"
        type="is-facebook"
        expanded
      >
        Iniciar sesión con Facebook
      </b-button>
    </b-field>
    <b-field v-if="form.role_id === '4'">
      <b-button
        :disabled="submitted"
        :loading="submitted"
        tag="a"
        href="/auth/google"
        icon-left="google"
        size="is-medium"
        type="is-google"
        outlined
        expanded
      >
        Iniciar sesión con Google
      </b-button>
    </b-field>

    <b-field class="has-text-centered">
      <RouterLink :to="{ name: 'PasswordRequest' }">
        ¿Olvidaste tu contraseña?
      </RouterLink>
    </b-field>

    <div class="is-divider" />
    <p v-if="form.role_id === '4'">
      ¿No tenés una cuenta? <RouterLink :to="{ name: 'Register'}">
        Registrate
      </RouterLink>
    </p>

    <div v-else>
      <p class="mb-3">
        Si aún no te registraste y no recibiste la invitación, puedes generarla nuevamente.
      </p>

      <b-button
        expanded
        size="is-medium"
        type="is-primary"
        @click="$router.push({ name: 'Reenviar Invitacion Registro' })"
      >
        Generar invitación
      </b-button>
    </div>
  </form>
</template>

<script>
import { authMethods } from "@/store/helpers"
import { alertErrorMessage } from "@/utilities/helpers"
import { usersComputed, usersMethods } from "@mvp/store/helpers"

import Form from "@/utilities/Form"

var fields = {
    email: "",
    password: "",
    remember: "",
    role_id: "4",
}

export default {
    data() {
        return {
            action: "/login",
            form: new Form(fields),
            submitted: false,
        }
    },

    computed: {
        ...usersMethods
    },

    methods: {
        ...authMethods,
        ...usersMethods,

        getErrorMessage(field) {
            if (this.form.errors.has(field)) {
                return this.form.errors.get(field)
            }
        },

        handleLogin() {
            this.submitted = true

            var intended
            return this.form.post(this.action)
                .then(response => {
                    intended = this.$route.query.intended||response.redirect
                    return this.login(response)
                })
                .then(()=> {
                    this.$router.go(intended)

                    return this.submitted = false
                })
                .catch(error => {
                    if (error.status > 422) {
                        alertErrorMessage("Login", error.data.message || error.message)
                    }

                    return this.submitted = false
                })
        },

        setFieldType(field) {
            if (this.form.errors.has(field)) {
                return "is-danger"
            }
        }
    }
}
</script>
