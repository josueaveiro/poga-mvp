<style lang="scss" scoped>
.is-divider {
  margin-bottom: 1rem;
}
</style>

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
      <b-field
        label="Tipo de persona"
        :type="setFieldType('id_persona.enum_tipo_persona')"
        :message="getErrorMessage('id_persona.enum_tipo_persona')"
      >
        <b-select
          v-model="form.id_persona.enum_tipo_persona"
          size="is-medium"
          placeholder="Tipo de persona"
        >
          <option value="FISICA">
            Física
          </option>
          <option value="JURIDICA">
            Jurídica
          </option>
        </b-select>
      </b-field>

      <b-field grouped>
        <b-field
          label="Nombre *" 
          :type="setFieldType('id_persona.nombre')"
          :message="getErrorMessage('id_persona.nombre')"
          expanded
        >
          <b-input
            v-model="form.id_persona.nombre"
            size="is-medium"
            type="text"
            placeholder="Nombre"
          />
        </b-field>
   
        <b-field
          v-if="form.id_persona.enum_tipo_persona === 'FISICA'"
          label="Apellido"
          :type="setFieldType('id_persona.apellido')"
          :message="getErrorMessage('id_persona.apellido')"
          expanded
        >
          <b-input
            v-model="form.id_persona.apellido"
            size="is-medium"
            type="text"
            placeholder="Apellido"
          />
        </b-field>
      </b-field>

      <b-field
        label="Email *"
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
        label="Teléfono"
        :type="setFieldType('id_persona.telefono')"
        :message="getErrorMessage('id_persona.telefono')"
      >
        <the-mask
          v-model="form.id_persona.telefono"
          class="input is-medium"
          placeholder="Teléfono"
          :mask="['+(###) ###-########']"
        />
      </b-field>

      <b-field
        label="Teléfono celular *"
        :type="setFieldType('id_persona.telefono_celular')"
        :message="getErrorMessage('id_persona.telefono_celular')"
      >
        <the-mask
          v-model="form.id_persona.telefono_celular"
          class="input is-medium"
          placeholder="Teléfono celular"
          :mask="['+(###) ###-########']"
        />
      </b-field>

      <b-field grouped>
        <b-field
          :label="form.id_persona.enum_tipo_persona === 'FISICA' ? 'RUC' : 'RUC *'"
          :type="setFieldType('id_persona.ruc')"
          :message="getErrorMessage('id_persona.ruc')"
          expanded
        >
          <b-input
            v-model="form.id_persona.ruc"
            size="is-medium"
            type="text"
            placeholder="RUC"
            :required="form.id_persona.enum_tipo_persona === 'JURIDICA'"
          />
        </b-field> 

        <b-field
          v-if="form.id_persona.enum_tipo_persona === 'FISICA'"
          label="CI *"
          :type="setFieldType('id_persona.ci')"
          :message="getErrorMessage('id_persona.ci')"
          expanded
        >
          <b-input
            v-model="form.id_persona.ci"
            size="is-medium"
            type="text"
            placeholder="CI"
          />
        </b-field>
      </b-field>

      <b-field
        v-if="form.id_persona.enum_tipo_persona === 'FISICA'"
        label="Fecha de Nacimiento"
        :addons="false"
        :type="setFieldType('id_persona.fecha_nacimiento')"
        :message="getErrorMessage('id_persona.fecha_nacimiento')"
      >
        <p class="mb-3">
          Debés tener al menos 18 años para registrarte. Los demás usuarios en POGA no van a ver tu fecha de nacimiento.
        </p>
        <b-datepicker
          v-model="form.id_persona.fecha_nacimiento"
          :years-range="[-100, 50]"
          size="is-medium"
          icon="calendar"
          placeholder="Fecha de Nacimiento"
          extended
        />
      </b-field>

      <div class="is-divider" />

      <b-field
        label="Dirección *"
        :type="setFieldType('id_persona.direccion')"
        :message="getErrorMessage('id_persona.direccion')"
      >
        <b-input
          v-model="form.id_persona.direccion"
          size="is-medium"
          type="text"
          placeholder="Dirección"
        />
      </b-field>
      <b-field
        label="País *"
        :type="setFieldType('id_persona.id_pais')"
        :message="getErrorMessage('id_persona.id_pais')"
      >
        <b-select
          v-model="form.id_persona.id_pais"
          size="is-medium"
          placeholder="País"
        >
          <option
            v-for="item in allPaises"
            :key="item.id"
            :value="item.id"
          >
            {{ item.nombre }}
          </option>
        </b-select>
      </b-field>

      <div v-if="user.role_id == 4">
        <div class="is-divider" />
        <h5 class="title is-5">
          Datos de facturación
        </h5>

        <b-field
          label="Razón social *"
          :type="setFieldType('id_persona.razon_social')"
          :message="getErrorMessage('id_persona.razon_social')"
        >
          <b-input
            v-model="form.id_persona.razon_social"
            size="is-medium"
            type="text"
            placeholder="Razón social"
          />
        </b-field>

        <b-field
          label="RUC de facturación *"
          :type="setFieldType('id_persona.ruc_facturacion')"
          :message="getErrorMessage('id_persona.ruc_facturacion')"
          expanded
        >
          <b-input
            v-model="form.id_persona.ruc_facturacion"
            size="is-medium"
            type="text"
            placeholder="RUC *"
          />
        </b-field>

        <b-field
          label="Dirección de facturación *"
          :type="setFieldType('id_persona.direccion_facturacion')"
          :message="getErrorMessage('id_persona.direccion_facturacion')"
        >
          <b-input
            v-model="form.id_persona.direccion_facturacion"
            size="is-medium"
            type="text"
            placeholder="Dirección de facturación"
          />
        </b-field>
      </div>

      <div class="is-divider" />

      <div v-if="user.role_id == 4">
        <h5 class="title is-5">
          Cuenta bancaria
        </h5>
        <h5 class="subtitle is-5">
          Estos datos serán utilizados para el depósito de los pagos acreditados.
        </h5>

        <b-field
          label="Titular de cuenta *"
          :type="setFieldType('id_persona.titular_cuenta')"
          :message="getErrorMessage('id_persona.titular_cuenta')"
        >
          <b-input
            v-model="form.id_persona.titular_cuenta"
            size="is-medium"
            type="text"
            placeholder="Titular de cuenta"
          />
        </b-field>

        <b-field
          label="Banco *"
          :type="setFieldType('id_persona.id_banco')"
          :message="getErrorMessage('id_persona.id_banco')"
        >
          <b-select
            v-model="form.id_persona.id_banco"
            size="is-medium"
            placeholder="Banco"
            expanded
          >
            <option
              v-for="item in allBancos"
              :key="item.id"
              :value="item.id"
            >
              {{ item.nombre }}
            </option>
          </b-select>
        </b-field>

        <b-field
          label="Cuenta bancaria *"
          :type="setFieldType('id_persona.cuenta_bancaria')"
          :message="getErrorMessage('id_persona.cuenta_bancaria')"
        >
          <b-input
            v-model="form.id_persona.cuenta_bancaria"
            size="is-medium"
            type="text"
            placeholder="Cuenta bancaria"
          />
        </b-field>
      </div>

      <b-field>
        <b-button
          expanded
          :disabled="submitted"
          native-type="submit"
          size="is-medium"
          type="is-primary"
        >
          Completar registro
        </b-button>
      </b-field>
    </form>
  </section>
</template>

<script>
import { alertSuccessMessage, alertErrorMessage, deepClone } from "@/utilities/helpers"
import { authComputed, authMethods } from "@/store/helpers"
import { bancosComputed, bancosMethods, paisesComputed, paisesMethods } from "@mvp/store/helpers"

import app from "@/app"
import store from "@/store"
import Form from "@/utilities/Form"

var fields = deepClone(store.state.auth.user)

if (fields.id_persona.fecha_nacimiento) {
    fields.id_persona.fecha_nacimiento = new Date(fields.id_persona.fecha_nacimiento)
}

export default {
    data() {
        return {
            action: app.apiUrl + "/completa-tu-registro",
            form: new Form(fields),
            prepared: false,
            submitted: false,
            title: "Completá tu Registro",
        }
    },

    computed: {
        ...authComputed,
        ...bancosComputed,
        ...paisesComputed
    },

    watch: {
        "form.id_persona.enum_tipo_persona" (value) {
            if (value === "JURIDICA") {
                this.form.id_persona.ci = ""
            } else {
                this.form.id_persona.ruc = ""
            }
        }
    },

    created() {
        return this.prepare().then(this.prepared = true)
    },

    methods: {
        ...authMethods,
        ...bancosMethods,
        ...paisesMethods,

        formatDate(date) {
            return new Date(date)
        },

        getErrorMessage(field) {
            if (this.form.errors.has(field)) {
                return this.form.errors.get(field)
            }
        },

        handleSubmitForm() {
            this.submitted = true

            return this.form.post(this.action)
                .then(()=> {
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

            return Promise.all([bancos, paises])
        },

        setFieldType(field) {
            var list
            if (this.form.errors.has(field)){
                list = "is-danger"
            }

            return list
        }
    }
}
</script>
