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
        aria-label="Solicita un Pago Adicional"
        @keydown="form.errors.clear($event.target.name)"
        @submit.prevent="handleSubmitForm"
      >
        <b-input
          v-model="form.enum_clasificacion_pagare"
          type="hidden"
        />
        <b-input
          v-model="form.fecha_pagare"
          type="hidden"
        />

        <b-input
          v-model="form.id_persona_acreedora"
          type="hidden"
        />

        <div class="modal-card">
          <div class="modal-card-head">
            <div class="modal-card-title">
              Solicitar Pago
            </div>
          </div>
          <div class="modal-card-body">
            <div class="columns">
              <div class="column is-6">
                <b-field
                  label="Fecha de vencimiento *"
                  :message="getErrorMessage(['fecha_vencimiento', 'fecha_vencimiento'])"
                  :type="setFieldType(['fecha_vencimiento', 'fecha_vencimiento'])"
                >
                  <b-datepicker
                    v-model="form.fecha_vencimiento"
                    v-validate="'required'"
                    :date-formatter="formatDate"
                    :date-parser="parseDate"
                    :disabled="submitted"
                    data-vv-as="Fecha de finalización"
                    name="fecha_vencimiento"
                    placeholder="Selecciona una fecha de vencimiento"
                    icon="calendar"
                    editable
                  />
                </b-field>
              </div>
            </div>

            <b-field
              label="Selecciona uno de tus inmuebles *"
              expanded
              :message="getErrorMessage(['id_inmueble', 'id_inmueble'])"
              :type="setFieldType(['id_inmueble', 'id_inmueble'])"
            >
              <b-select
                v-model="form.id_inmueble"
                v-validate="'required'"
                :disabled="submitted"
                :loading="allInmueblesPending"
                name="id_inmueble"
                data-vv-as="Inmueble"
                placeholder="Selecciona uno de tus inmuebles"
                expanded
                @input="fetchAllPersonas({ enum_rol: 'INQUILINO', excluir: 'sin_renta', id_inmueble: $event })"
              >
                <optgroup
                  v-for="item in allInmuebles.filter(item => item.id_inmueble.id_tipo_inmueble.id == 1)"
                  :key="item.id"
                  :label="item.nombre"
                >
                  <option
                    v-for="unidad in item.unidades"
                    :key="unidad.id"
                    :value="unidad.id_inmueble.id"
                  >
                    Piso {{ unidad.piso }} - Número {{ unidad.numero }}
                  </option>
                </optgroup>
                <option
                  v-for="item in allInmuebles.filter(item => item.id_inmueble.id_tipo_inmueble.id == 2)"
                  :value="item.id_inmueble.id"
                >
                  {{ item.nombre }}
                </option>
              </b-select>
            </b-field>

            <b-field
              label="Inquilino *"
              expanded
              :message="getErrorMessage(['id_persona_deudora', 'id_persona_deudora'])"
              :type="setFieldType(['id_persona_deudora', 'id_persona_deudora'])"
            >
              <b-select
                v-model="form.id_persona_deudora"
                v-validate="'required'"
                :disabled="submitted"
                :loading="allPersonasPending"
                name="id_persona_adeudora"
                placeholder="Inquilino"
                data-vv-as="Inquilino referente"
                expanded
              >
                <option
                  v-for="inquilino in allPersonas"
                  :key="inquilino.id"
                  :value="inquilino.id"
                >
                  {{ mapInquilino(inquilino) }}
                </option>
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
                    :disabled="submitted"
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
                    :disabled="submitted"
                    name="monto"
                    placeholder="Monto"
                    step="0.01"
                    type="number"
                  />
                </b-field>
              </div>
            </div>

            <b-field
              label="Descripción *"
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
                Crear pago
              </b-button>
            </b-field>
          </div>
        </div>
      </form>
    </b-modal>
    <NuevoInquilinoModal :is-active="isNuevoInquilinoModalActive" />
  </div>
</template>

<script>
import { authComputed } from "@/store/helpers"
import { alertErrorMessage, alertSuccessMessage } from "@/utilities/helpers"
import { inmueblesComputed, inmueblesMethods, monedasComputed, monedasMethods, pagaresComputed, pagaresMethods, personasComputed, personasMethods } from "@mvp/store/helpers"

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
        ...inmueblesComputed,
        ...monedasComputed,
        ...pagaresComputed,
        ...personasComputed,
    },

    watch: {
        inquilinoSeleccionado (value) {
            var tipoDocumento = value.split(":")[0]
            var documento = value.split(":")[1].replace(/\(/g, "").replace(/\)/g, "").split(" ")[0]

            var result = this.allPersonas.find(item => { return item[tipoDocumento.toLowerCase()] === documento })
            if (!result) {
                this.form.id_persona_deudora = null
            } else {
                this.form.id_persona_deudora = result.id
            }
        },

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
        ...inmueblesMethods,
        ...monedasMethods,
        ...pagaresMethods,
        ...personasMethods,

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

            this.form.fecha_pagare = moment(this.form.fecha_pagare).format("YYYY-MM-DD")
            this.form.fecha_vencimiento = moment(this.form.fecha_vencimiento).format("YYYY-MM-DD")

            return this.form.post(app.apiUrl + "/pagares")
                .then(response => {
                    this.form.reset()

                    this.boleta = response.data.boleta

                    var message = "<p>El pago fue creado.</p><p>Se generó una boleta de pago, que puede visualizarse en el link a continuación:<ul>"
                    message = message + "<li><a href='/realiza-un-pago/" + this.boleta.debt.docId + "' target='_blank'>Realiza un Pago</a></li>"
                    message = message + "</ul>"
        
                    alertSuccessMessage("Solicitá un Pago Adicional", message)

                    this.handleOnCancel()

                    return this.submitted = false
                })
                .catch(error => {
                    var message = error.status.message||error.message||error
                    if (error.status > 422) {
                        alertErrorMessage("Solicitá un Pago Adicional", message)
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
            this.form.enum_clasificacion_pagare = "OTRO"
            this.form.fecha_pagare = moment()
            this.form.fecha_vencimiento = new Date(moment().add(1, "years"))
            this.form.id_persona_acreedora = this.user.id_persona.id

            var inmuebles = this.fetchAllInmuebles({ tipoListado: "MisInmuebles", excluir: "sin_renta" })
            var monedas = this.fetchAllMonedas()

            return Promise.all([inmuebles, monedas])
        },

        setFieldType(fields) {
            if (this.form.errors.has(fields[0])||this.$validator.errors.has(fields[1])) {
                return "is-danger"
            }
        }
    },
}
</script>
