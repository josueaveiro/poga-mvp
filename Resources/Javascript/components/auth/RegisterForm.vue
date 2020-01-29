<style lang="scss" scoped>
.is-divider {
  margin-bottom: 1rem;
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
    aria-label="Registrate como Propietario"
    @keydown="form.errors.clear($event.target.name)"
    @submit.prevent="handleRegister"
  >
    <h3 class="title is-4">
      Registrate como Propietario
    </h3>
    <b-field>
      <b-button
        tag="a"
        href="/auth/facebook"
        icon-left="facebook-f"
        size="is-medium"
        type="is-facebook"
        expanded
      >
        Registrate con tu cuenta de Facebook
      </b-button>
    </b-field>
    <b-field>
      <b-button
        tag="a"
        href="/auth/google"
        icon-left="google"
        size="is-medium"
        type="is-google"
        outlined
        expanded
      >
        Registrate con tu cuenta de Google
      </b-button>
    </b-field>

    <div
      class="is-divider"
      data-content="O"
    />

    <p>Completá el siguiente formulario:</p>
    <b-input
      v-model="form.role_id"
      type="hidden"
    />
    <b-input
      v-model="form.id_persona.enum_tipo_persona"
      type="hidden"
    />

    <b-field
      label="Nombre"
      :type="setFieldType('id_persona.nombre')"
      :message="getErrorMessage('id_persona.nombre')"
    >
      <b-input
        v-model="form.id_persona.nombre"
        icon="user"
        size="is-medium"
        type="text"
        placeholder="Nombre"
      />
    </b-field>
    <b-field
      label="Apellido"
      :type="setFieldType('id_persona.apellido')"
      :message="getErrorMessage('id_persona.apellido')"
    >
      <b-input
        v-model="form.id_persona.apellido"
        icon="user"
        size="is-medium"
        type="text"
        placeholder="Apellido"
      />
    </b-field>

    <b-field
      label="Email"
      :type="setFieldType('email')"
      :message="getErrorMessage('email')"
    >
      <b-input
        v-model="form.email"
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
        size="is-medium"
        type="password"
        placeholder="Contraseña"
        password-reveal
      />
    </b-field>

    <b-field
      label="Confirmación de Contraseña"
      :type="setFieldType('password_confirmation')"
      :message="getErrorMessage('password_confirmation')"
    >
      <b-input
        v-model="form.password_confirmation"
        size="is-medium"
        type="password"
        placeholder="Confirmación de Contraseña"
        password-reveal
      />
    </b-field>

    <b-field
      label="Fecha de Nacimiento"
      :addons="false"
    >
      <p class="mb-3">
        Debés tener al menos 18 años para registrarte. Los demás usuarios en POGA no van a ver tu fecha de nacimiento.
      </p>
      <b-datepicker
        v-model="form.id_persona.fecha_nacimiento"
        size="is-medium"
        icon="calendar"
        placeholder="Fecha de Nacimiento"
        extended
      />
    </b-field>

    <b-field>
      <b-button
        expanded
        native-type="submit"
        size="is-medium"
        type="is-primary"
      >
        Registrarse
      </b-button>
    </b-field>

    <b-field 
      :addons="false"
      :type="setFieldType('accepted')"
      :message="getErrorMessage('accepted')"
    >
      <b-checkbox
        v-model="form.accepted"
        class="is-size-7"
      >
        Al registrarme declaro que acepto los <RouterLink :to="{ name: 'Terms and Conditions' }">
          Términos y Condiciones de Uso
        </RouterLink> y la <RouterLink :to="{ name: 'Policy of Privacy' }">
          Política de Privacidad
        </RouterLink>.
      </b-checkbox>
    </b-field>
  </form>
</template>

<script>
import { alertSuccessMessage, alertErrorMessage, deepClone } from "@/utilities/helpers"

import app from "@/app"
import store from "@/store"
import Form from "@/utilities/Form"

var fields = {
    accepted: false,
    email: "",
    id_persona: deepClone(store.state.personas.initialState.one),
    password: "",
    password_confirmation: "",
    role_id: "4",
}

export default {
    data() {
        return {
            action: app.apiUrl + "/register",
            form: new Form(fields)
        }
    },

    methods: {
        getErrorMessage(field) {
            if (this.form.errors.has(field)) {
                return this.form.errors.get(field)
            }
        },

        handleRegister() {
            this.submitted = true

            return this.form.post(this.action)
                .then(response => {
                    var redirect = response.redirect||"/"

                    alertSuccessMessage("Registro", "Ya estás registrado.")

                    this.$router.push(redirect)

                    return this.submitted = false
                }).catch(error => {
                    var message = error.data.message||error.message||error

                    if (error.status !== 422) {
                        alertErrorMessage("Registro", message)
                    } else {
                        var message = "Se encontraron los siguientes errores de validación:<ul>"
                        Object.values(this.form.errors.errors).forEach(error => {
                            message = message + "<li>" + error + "</li>"
                        })
                        message = message + "</ul>"

                        this.$buefy.notification.open({
                            duration: 5000,
                            iconPack: "fas",
                            message: message,
                            position: "is-top",
                            type: "is-danger",
                            hasIcon: true
                        })
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
