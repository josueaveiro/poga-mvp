<template>
  <div>
    <b-modal
      :active.sync="isActive"
      :on-cancel="handleOnCancel"
      has-modal-card
      trap-focus
      aria-role="dialog"
      aria-modal
    >
      <form
        aria-label="Registra un pago manual"
        @keydown="form.errors.clear($event.target.name)"
        @submit.prevent="handleSubmitForm"
      >
        <div class="modal-card">
          <div class="modal-card-head">
            <div class="modal-card-title">
              Registra un pago manual
            </div>
          </div>
          <div class="modal-card-body">
            <b-field
              label="Selecciona la opción de pago"
              expanded
              :message="getErrorMessage(['enum_opcion_pago', 'enum_opcion_pago'])"
              :type="setFieldType(['enum_opcion_pago', 'enum_opcion_pago'])"
            >
              <div class="block">
                <b-radio v-model="form.enum_opcion_pago"
                  name="name"
                  native-value="TOTAL">
                  Total
                </b-radio>
                <b-radio v-model="form.enum_opcion_pago"
                  name="MANUAL"
                  :disabled="true"
                  native-value="MANUAL">
                  Manual
                </b-radio>
              </div>
            </b-field>

            <b-field
              label="Selecciona el canal de pago"
              expanded
              :message="getErrorMessage(['pagado_fuera_sistema', 'pagado_fuera_sistema'])"
              :type="setFieldType(['pagado_fuera_sistema', 'pagado_fuera_sistema'])"
            >
              <div class="block">
                <b-radio v-model="form.pagado_fuera_sistema"
                  name="pagado_fuera_sistema"
                  native-value="0">
                  POGA
                </b-radio>
                <b-radio v-model="form.pagado_fuera_sistema"
                  name="pagado_fuera_sistema"
                  native-value="1">
                  Fuera de sistema
                </b-radio>
              </div>
            </b-field>

            <b-field
              label="Selecciona la boleta de pago"
              expanded
              :message="getErrorMessage(['id_pagare', 'id_pagare'])"
              :type="setFieldType(['id_pagare', 'id_pagare'])"
            >
              <b-select
                v-model="form.id_pagare"
                v-validate="'required'"
                :disabled="submitted"
                :loading="allBoletasPending"
                name="id_pagare"
                data-vv-as="Boleta"
                placeholder="Selecciona uno de tus boletas"
                expanded
              >
                <option v-for="pagare in boletasRenta" :value="pagare.id">Para de renta para el inquilino {{pagare.id_persona_deudora.ci}}, mes {{pagare.fecha_pagare}}</option> 
              </b-select>
            </b-field>

            <div class="columns">
              <div class="column is-6">
                <b-field
                  label="Moneda *"
                  :message="getErrorMessage(['id_moneda', 'id_moneda'])"
                  :type="setFieldType(['id_moneda', 'id_moneda'])"
                >
                  <b-select
                    v-model="form.id_moneda"
                    v-validate="'required'"
                    :disabled="true"
                    name="id_moneda"
                    data-vv-as="Moneda"
                    placeholdel="Moneda"
                    expanded
                  >
                    <option
                      v-for="item in allMonedas"
                      :key="item.id"
                      :value="item.id"
                    >
                      {{ item.moneda }}
                    </option>
                  </b-select>
                </b-field>
              </div>
              <div class="column is-6">
                <b-field
                  label="Monto *"
                  :message="getErrorMessage(['monto', 'monto'])"
                  :type="setFieldType(['monto', 'monto'])"
                >
                  <b-input
                    v-model="form.monto"
                    :disabled="submitted||form.enum_opcion_pago !== 'MANUAL'"
                    name="monto"
                    placeholder="Monto"
                    step="0.01"
                    type="number"
                  />
                </b-field>
              </div>
            </div>

            <b-field
              label="Descripción"
              :message="getErrorMessage(['descripcion', 'descripcion'])"
              :type="setFieldType(['descripcion', 'descripcion'])"
            >
              <b-input
                v-model="form.descripcion"
                :disabled="submitted"
                name="descripcion"
                placeholder="Descripción"
                type="textarea"
              />
            </b-field>

            <b-field>
              <b-button
                :disabled="submitted"
                :loading="submitted"
                expanded
                native-type="submit"
                size="is-medium"
                type="is-primary"
              >
                Registrar pago
              </b-button>
            </b-field>
          </div>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
import { authComputed } from "@/store/helpers"
import { alertErrorMessage, alertSuccessMessage } from "@/utilities/helpers"
import { monedasComputed, monedasMethods, pagaresComputed, pagaresMethods } from "@mvp/store/helpers"

import app from "@/app"
import moment from "moment"
import store from "@/store"
import Form from "@/utilities/Form"

window.moment = moment

var fields = store.state.pagares.initialState.one

export default {

    props: [
        "isActive"
    ],

    data() {
        return {
            action: app.apiUrl + "/pagares",
            boleta: {},
            form: new Form(fields),
            prepared: false,
            submitted: false,
        }
    },

    computed: {
        ...authComputed,
        ...monedasComputed,
        ...pagaresComputed,
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
        ...monedasMethods,
        ...pagaresMethods,

        formatDate(date) {
            return moment(date).format("DD/MM/YYYY")
        },

        getErrorMessage(fields) {
            if (this.form.errors.has(fields[0])||this.$validator.errors.has(fields[1])) {
                return this.form.errors.get(fields[0])||this.$validator.errors.first(fields[1])
            }
        },

        handleOnCancel() {
            this.form.reset()

            return this.$parent.isMontoExpensasModalActive = false
        },

        handleSubmitForm() {
            this.submitted = true

            return this.form.post(app.apiUrl + "/finanzas/registrar-pago-manual")
                .then(response => {
                    this.form.reset()

                    alertSuccessMessage("Registrá un pago manual", "El pago fue registrado.")

                    this.handleOnCancel()

                    return this.submitted = false
                })
                .catch(error => {
                    var message = error.status.message||error.message||error
                    if (error.status > 422) {
                        alertErrorMessage("Registrá un pago manual", message)
                    }

                    return this.submitted = false
                })
        },

        mapInquilino(inquilino) {
            return inquilino.enum_tipo_persona === "FISICA" ? "CI:" + inquilino.ci + " (" + inquilino.nombre + " " + inquilino.apellido + ")" : "RUC:" + inquilino.ruc + " (" + inquilino.nombre + ")"
        },

        moment,

        parseDate(date) {
            return moment(date)
        },

        prepare() {
            var monedas = this.fetchAllMonedas()
            var pagares = this.fetchBoletasRenta()

            return Promise.all([monedas, pagares])
        },

        setFieldType(fields) {
            if (this.form.errors.has(fields[0])||this.$validator.errors.has(fields[1])) {
                return "is-danger"
            }
        }
    },
}
</script>
