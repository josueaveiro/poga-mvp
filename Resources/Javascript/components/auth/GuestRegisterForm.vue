<template>
  <section>
    <h3 class="title mb-5 is-3">
      {{ title }}
    </h3>
    <form
      :aria-label="title"
      @keydown="form.errors.clear($event.target.name)"
      @submit.prevent="handleSubmitForm"
    >
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
          :disabled="submitted"
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
          :disabled="submitted"
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

      <b-field
        label="Confirmación de Contraseña"
        :type="setFieldType('password_confirmation')"
        :message="getErrorMessage('password_confirmation')"
      >
        <b-input
          v-model="form.password_confirmation"
          :disabled="submitted"
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
          :disabled="submitted"
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
          :disabled="submitted"
          class="is-medium"
        >
          Al registrarme declaro que acepto los <RouterLink :to="{ name: 'TermsAndConditions' }">
            Términos y Condiciones de Uso
          </RouterLink>.
        </b-checkbox>
      </b-field>
    </form>
  </section>
</template>

<script>
import { alertSuccessMessage, alertErrorMessage, deepClone } from "@/utilities/helpers"
import { authMethods } from "@/store/helpers"
import { bancosComputed, bancosMethods, paisesComputed, paisesMethods, usersComputed, usersMethods } from "@mvp/store/helpers"

import app from "@/app"
import store from "@/store"
import Form from "@/utilities/Form"

var fields = deepClone(store.state.users.initialState.one)

if (fields.id_persona.fecha_nacimiento) {
    fields.id_persona.fecha_nacimiento = new Date(fields.id_persona.fecha_nacimiento)
}

export default {
    data() {
        return {
            action: app.apiUrl + "/registro-invitado/",
            form: new Form(fields),
            prepared: false,
            submitted: false,
            title: "Regístrate como Inquilino",
        }
    },

    computed: {
        ...bancosComputed,
        ...paisesComputed,
        ...usersComputed
    },

    created() {
        return this.prepare().then(this.prepared = true)
    },

    methods: {
        ...authMethods,
        ...bancosMethods,
        ...paisesMethods,
        ...usersMethods,

        formatDate(date) {
            return new Date(date).toISOString()
        },

        getErrorMessage(field) {
            if (this.form.errors.has(field)) {
                return this.form.errors.get(field)
            }
        },

        handleSubmitForm() {
            this.submitted = true

            return this.form.put(this.action + this.$route.params.codigoValidacion)
                .then(response => {
                    var intended = this.$route.query.intended||"/"

                    this.validate()

                    alertSuccessMessage(this.title, "Tu registro fue completado.")
                    this.$router.push(intended)
                    return this.submitted = false
                }).catch(error => {
                    var message = error.data.message||error.message||error

                    if (error.status > 422) {
                        alertErrorMessage(this.title, message)
                    }

                    return this.submitted = false
                })
        },

        prepare() {
            var bancos = this.fetchAllBancos()
            var paises = this.fetchAllPaises()
            var user = this.fetchOneGuest(this.$route.params.codigoValidacion)
                .then(value => {
                    if (value) {
                        this.form = new Form({ accepted: 0, password: "", password_confirmation: "", role_id: "3", ...value })
                    }
                })

            return Promise.all([bancos, paises, user])
        },

        setFieldType(field) {
            var list
            if (this.form.errors.has(field)) {
                list = "is-danger"
            }

            return list
        }
    }
}
</script>
