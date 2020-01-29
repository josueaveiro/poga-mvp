<style lang="scss" scoped>
.is-divider {
  margin-bottom: 1rem;
}
</style>

<template>
  <div class="columns">
    <div class="column is-8">
      <h3 class="title is-4">
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
            :disabled="submitted"
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
              :disabled="submitted"
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
              :disabled="submitted"
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
            :disabled="submitted"
            icon="envelope"
            size="is-medium"
            type="email"
            placeholder="Email"
          />
        </b-field>

        <b-field grouped>
          <b-field
            label="Teléfono"
            :type="setFieldType('id_persona.telefono')"
            :message="getErrorMessage('id_persona.telefono')"
          >
            <b-input
              v-model="form.id_persona.telefono"
              :disabled="submitted"
              size="is-medium"
              type="text"
              placeholder="Teléfono"
            />
          </b-field>
          <b-field
            label="Teléfono celular *"
            :type="setFieldType('id_persona.telefono_celular')"
            :message="getErrorMessage('id_persona.telefono_celular')"
          >
            <b-input
              v-model="form.id_persona.telefono_celular"
              :disabled="submitted"
              size="is-medium"
              type="text"
              placeholder="Teléfono celular *"
            />
          </b-field>
        </b-field>

        <b-field grouped>
          <b-field
            label="RUC"
            :type="setFieldType('id_persona.ruc')"
            :message="getErrorMessage('id_persona.ruc')"
            expanded
          >
            <b-input
              v-model="form.id_persona.ruc"
              :disabled="submitted"
              size="is-medium"
              type="text"
              placeholder="RUC"
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
              :disabled="submitted"
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
            :disabled="submitted"
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
            :disabled="submitted"
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
            :disabled="submitted"
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
              :disabled="submitted"
              size="is-medium"
              type="text"
              placeholder="Razón social"
            />
          </b-field>

          <b-field
            label="RUC *"
            :type="setFieldType('id_persona.ruc_facturacion')"
            :message="getErrorMessage('id_persona.ruc_facturacion')"
            expanded
          >
            <b-input
              v-model="form.id_persona.ruc_facturacion"
              :disabled="submitted"
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
              :disabled="submitted"
              size="is-medium"
              type="text"
              placeholder="Dirección de facturación"
            />
          </b-field>

          <div class="is-divider" />
          <h5 class="title is-5">
            Cuenta bancaria
          </h5>

          <b-field
            label="Titular de cuenta *"
            :type="setFieldType('id_persona.titular_cuenta')"
            :message="getErrorMessage('id_persona.titular_cuenta')"
          >
            <b-input
              v-model="form.id_persona.titular_cuenta"
              :disabled="submitted"
              size="is-medium"
              type="text"
              placeholder="Titular de cuenta"
            />
          </b-field>

          <b-field
            label="Banco"
            :type="setFieldType('id_persona.id_banco')"
            :message="getErrorMessage('id_persona.id_banco')"
          >
            <b-select
              v-model="form.id_persona.id_banco"
              :disabled="submitted"
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
              :disabled="submitted"
              size="is-medium"
              type="text"
              placeholder="Cuenta bancaria"
            />
          </b-field>
        </div>

        <b-field class="mb-3">
          <b-button
            :disabled="submitted"
            expanded
            native-type="submit"
            size="is-medium"
            type="is-primary"
          >
            Actualizá tus datos
          </b-button>
        </b-field>
      </form>
    </div>
  </div>
</template>

<script>
import { alertErrorMessage, deepClone } from "@/utilities/helpers"
import { authComputed, authMethods } from "@/store/helpers"
import { bancosComputed, bancosMethods, paisesComputed, paisesMethods } from "@mvp/store/helpers"

import app from "@/app"
import store from "@/store"
import Form from "@/utilities/Form"

var fields = deepClone(store.state.auth.user)
fields.id_persona.fecha_nacimiento = new Date(fields.id_persona.fecha_nacimiento)

export default {
    data() {
        return {
            action: app.apiUrl + "/cuenta",
            form: new Form(fields),
            prepared: false,
            submitted: false,
            title: "Datos personales",
        }
    },

    computed: {
        ...authComputed,
        ...bancosComputed,
        ...paisesComputed
    },

    created() {
        return this.prepare().then(this.prepared = true)
    },

    methods: {
        ...authMethods,
        ...bancosMethods,
        ...paisesMethods,

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

            return this.form.post(this.action)
                .then(()=> {
                    this.validate()

                    this.$buefy.toast.open({
                        message: "Tus datos fueron actualizados.",
                        type: "is-success"
                    })

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
            if (this.form.errors.has(field)) {
                list = "is-danger"
            }

            return list
        }
    }
}
</script>
