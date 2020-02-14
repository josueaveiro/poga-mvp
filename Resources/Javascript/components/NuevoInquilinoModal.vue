<template>
  <b-modal
    :active.sync="isActive"
    :on-cancel="handleOnCancel"
    has-modal-card
    trap-focus
    aria-role="dialog"
    aria-modal
  >
    <form
      :aria-label="title"
      @keydown="form.errors.clear($event.target.name)"
      @submit.prevent="handleSubmitForm"
    >
      <b-input
        v-model="form.invitar"
        type="hidden"
      />

      <div class="modal-card">
        <div class="modal-card-head">
          <div class="modal-card-title">
            {{ title }}
          </div>
        </div>
        <div class="modal-card-body">
          <b-field
            label="Tipo de persona *"
            :message="getErrorMessage(['enum_tipo_persona', 'enum_tipo_persona'])"
            :type="setFieldType(['enum_tipo_persona', 'enum_tipo_persona'])"
          >
            <b-select
              v-model="form.enum_tipo_persona"
              :disabled="submitted"
              name="enum_tipo_persona"
              expanded
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
              :message="getErrorMessage(['nombre', 'nombre'])"
              :type="setFieldType(['nombre', 'nombre'])"
            >
              <b-input
                v-model="form.nombre"
                :disabled="submitted"
                name="nombre"
                placeholder="Nombre"
                type="text"
              />
            </b-field>
            <b-field
              v-if="form.enum_tipo_persona === 'FISICA'"
              label="Apellido *"
              :message="getErrorMessage(['apellido', 'apellido'])"
              :type="setFieldType(['apellido', 'apellido'])"
            >
              <b-input
                v-model="form.apellido"
                :disabled="submitted"
                name="apellido"
                placeholder="Apellido"
                type="text"
              />
            </b-field>
          </b-field>

          <b-field
            label="Email"
            :message="getErrorMessage(['mail', 'mail'])"
            :type="setFieldType(['mail', 'mail'])"
          >
            <b-input
              v-model="form.mail"
              :disabled="submitted"
              name="mail"
              placeholder="Email"
              type="email"
            />
          </b-field>

          <b-field
            label="Teléfono"
            :type="setFieldType('telefono')"
            :message="getErrorMessage('telefono')"
          >
            <b-input
              v-model="form.telefono"
              placeholder="Teléfono"
              :size="is-medium"
              type="number"
            />
          </b-field>

          <b-field
            label="Teléfono celular *"
            :type="setFieldType('telefono_celular')"
            :message="getErrorMessage('telefono_celular')"
          >
            <b-input
              v-model="form.telefono_celular"
              placeholder="Teléfono celular"
              :size="is-medium"
              type="number"
            />
          </b-field>

          <b-field grouped>
            <b-field
              label="RUC"
              :message="getErrorMessage(['ruc', 'ruc'])"
              :type="setFieldType(['ruc', 'ruc'])"
            >
              <b-input
                v-model="form.ruc"
                :disabled="submitted"
                name="ruc"
                placeholder="RUC"
                type="text"
              />
            </b-field>

            <b-field
              v-if="form.enum_tipo_persona === 'FISICA'"
              label="CI *"
              :message="getErrorMessage(['ci', 'ci'])"
              :type="setFieldType(['ci', 'ci'])"
            >
              <b-input
                v-model="form.ci"
                :disabled="submitted"
                name="ci"
                placeholder="CI"
                type="text"
              />
            </b-field>
          </b-field>

          <b-field
            v-if="form.enum_tipo_persona === 'FISICA'"
            label="Fecha de Nacimiento"
            :addons="false"
            :message="getErrorMessage(['fecha_nacimiento', 'fecha_nacimiento'])"
            :type="setFieldType(['fecha_nacimiento', 'fecha_nacimiento'])"
          >
            <p class="mb-3">
              Debés tener al menos 18 años para registrarte. Los demás usuarios en POGA no van a ver tu fecha de nacimiento.
            </p>
            <b-datepicker
              v-model="form.fecha_nacimiento"
              :disabled="submitted"
              :years-range="[-100, 50]"
              icon="calendar"
              placeholder="Fecha de Nacimiento"
              extended
            />
          </b-field>

          <div class="is-divider" />

          <b-field
            label="Dirección"
            :message="getErrorMessage(['direccion', 'direccion'])"
            :type="setFieldType(['direccion', 'direccion'])"
          >
            <b-input
              v-model="form.direccion"
              :disabled="submitted"
              name="direccion"
              placeholder="Dirección"
              type="text"
            />
          </b-field>
          <b-field
            label="País *"
            :message="getErrorMessage(['id_pais', 'id_pais'])"
            :type="setFieldType(['id_pais', 'id_pais'])"
          >
            <b-select
              v-model="form.id_pais"
              :disabled="submitted"
              name="id_pais"
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

          <div class="is-divider" />

          <h5 class="title is-5">
            Datos de facturación
          </h5>

          <b-field
            label="Razón social"
            :type="setFieldType(['razon_social', 'razon_social'])"
            :message="getErrorMessage(['razon_social', 'razon_social'])"
          >
            <b-input
              v-model="form.razon_social"
              :disabled="submitted"
              type="text"
              name="razon_social"
              placeholder="Razón social"
            />
          </b-field>

          <b-field
            label="RUC"
            :type="setFieldType(['ruc_facturacion', 'ruc_facturacion'])"
            :message="getErrorMessage(['ruc_facturacion', 'ruc_facturacion'])"
            expanded
          >
            <b-input
              v-model="form.ruc_facturacion"
              :disabled="submitted"
              type="text"
              name="ruc_facturacion"
              placeholder="RUC"
            />
          </b-field>

          <b-field
            label="Dirección de facturación"
            :type="setFieldType(['direccion_facturacion', 'direccion_facturacion'])"
            :message="getErrorMessage(['direccion_facturacion', 'direccion_facturacion'])"
          >
            <b-input
              v-model="form.direccion_facturacion"
              :disabled="submitted"
              type="text"
              name="direccion_facturacion"
              placeholder="Dirección de facturación"
            />
          </b-field>

          <div class="is-divider" />

          <b-field>
            <b-button
              :disabled="submitted"
              :loading="submitted"
              expanded
              native-type="submit"
              size="is-medium"
              type="is-primary"
            >
              Agregar Inquilino
            </b-button>
          </b-field>
        </div>
      </div>
    </form>
  </b-modal>
</template>

<script>
import { alertErrorMessage, alertSuccessMessage } from "@/utilities/helpers"
import { bancosComputed, bancosMethods, paisesComputed, paisesMethods, personasComputed, personasMethods } from "@mvp/store/helpers"

import app from "@/app"
import store from "@/store"
import Form from "@/utilities/Form"

var fields = store.state.personas.initialState.one

export default {

    props: {
        isActive: Boolean
    },

    data() {
        return {
            action: app.apiUrl + "/personas",
            form: new Form(fields),
            method: "post",
            prepared: false,
            submitted: false,
            title: "Nuevo Inquilino",
        }
    },

    computed: {
        ...bancosComputed,
        ...paisesComputed,
        ...personasComputed,
 
    },

    watch: {
        isActive (value) {
            if (value) {
                this.prepare()
            }
        }
    },

    created() {
        return this.prepare().then(this.prepared = true)
    },

    methods: {
        ...bancosMethods,
        ...paisesMethods,
        ...personasMethods,

        getErrorMessage(fields) {
            if (this.form.errors.has(fields[0])||this.$validator.errors.has(fields[1])) {
                return this.form.errors.get(fields[0])||this.$validator.errors.first(fields[1])
            }
        },

        handleOnCancel() {
            return this.$parent.isNuevoInquilinoModalActive = false
        },

        handleSubmitForm() {
            this.submitted = true

            var inquilino
            return this.form[this.method](this.action)
                .then(response => {
                    this.form.reset()

                    return response.data
                })
                .then(value => {
                    inquilino = value
                    return this.$parent.prepare()
                })
                .then(values => {
                    if (values[2]) {
                        this.$parent.form.id_inquilino = inquilino.id
                        this.$parent.busquedaInquilino = this.$parent.mapInquilino(inquilino)
                        this.$parent.inquilinoSeleccionado = this.$parent.mapInquilino(inquilino)
                    }

                    alertSuccessMessage(this.title, "El inquilino fue registrado")

                    this.handleOnCancel()

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

            this.form = new Form(fields)

            return Promise.all([bancos, paises])
        },

        setFieldType(fields) {
            if (this.form.errors.has(fields[0])||this.$validator.errors.has(fields[1])) {
                return "is-danger"
            }
        }
    }
}
</script>
