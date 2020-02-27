<template>
  <main class="bg-light main">
    <b-loading
      :is-full-page="true"
      :active.sync="oneRentaPending"
      :can-cancel="false"
    />
    <div
      v-if="!oneRentaPending"
      class="columns is-gapless"
    >
      <div class="bg-white column is-7">
        <form>
          <div class="columns">
            <div class="bg-white column">
              <b-steps
                v-model="activeStep"
                class="p-md-5"
                :animated="true"
                :custom-navigation="true"
                :has-navigation="true"
              >
                <b-step-item
                  label="Datos"
                  :clickable="false"
                >
                  <h3 class="title is-3">
                    {{ title }}
                  </h3>
                  <h4 class="subtitle mb-4 is-4">
                    Completa los datos de finalización del contrato y uso de depósito de garantía.
                  </h4>

                  <b-field
                    label="Fecha de finalización *"
                    :message="getErrorMessage(['fecha_finalizacion_contrato', 'fecha_finalizacion_contrato'])"
                    :type="setFieldType(['fecha_finalizacion_contrato', 'fecha_finalizacion_contrato'])"
                  >
                    <b-datepicker
                      v-model="fecha_finalizacion_contrato"
                      v-validate.disable="'required'"
                      :date-formatter="formatDate"
                      :date-parser="parseDate"
                      :disabled="submitted"
                      data-vv-as="Fecha de finalización"
                      name="fecha_finalizacion_contrato"
                      placeholder="Selecciona una fecha de finalización"
                      icon="calendar"
                      editable
                    />
                  </b-field>

                  <b-field
                    label="Monto descontado del fondo de garantía *"
                    :message="getErrorMessage(['monto_descontado_garantia_finalizacion_contrato', 'monto_descontado_garantia_finalizacion_contrato'])"
                    :type="setFieldType(['monto_descontado_garantia_finalizacion_contrato', 'monto_descontado_garantia_finalizacion_contrato'])"
                  >
                    <b-input
                      ref="montoDescontadoGarantiaFinalizacionContrato"
                      v-model="form.monto_descontado_garantia_finalizacion_contrato"
                      v-validate.disable="'required|numeric'"
                      :disabled="submitted"
                      placeholder="Monto descontado del fondo de garantía *"
                      name="monto_descontado_garantia_finalizacion_contrato"
                      data-vv-as="Monto descontado del fondo de garantía"
                      min="0"
                      type="numeric"
                    />
                  </b-field>

                  <b-field
                    label="Motivo de descuento *"
                    :message="getErrorMessage(['motivo_descuento_garantia', 'motivo_descuento_garantia'])"
                    :type="setFieldType(['motivo_descuento_garantia', 'motivo_descuento_garantia'])"
                  >
                    <b-input
                      v-model="form.motivo_descuento_garantia"
                      v-validate.disable="'required'"
                      data-vv-as="Motivo de descuento"
                      name="motivo_descuento_garantia"
                      type="textarea"
                      placeholder="Motivo de descuento"
                      :disabled="submitted"
                    />
                  </b-field>
                </b-step-item>

                <b-step-item
                  label="Registro de Estado del Inmueble"
                  :clickable="false"
                >
                  <h3 class="title is-3">
                    Registro de Estado del Inmueble
                  </h3>
                  <h4 class="subtitle mb-4 is-4">
                    Registrá el estado de las instalaciones del inmueble en este momento.
                  </h4>

                  <div
                    v-for="(categoria, index) in groupBy(allEstadosInmueble, 'enum_categoria')"
                    :key="index"
                    class="table-container"
                  >
                    <h5 class="title is-5">
                      {{ categoria[0]['enum_categoria'] }}
                    </h5>
                    <table class="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
                      <thead>
                        <tr>
                          <th>Nombre</th>
                          <th>Cantidad</th>
                          <th>Reemplazar / Reparar</th>
                          <th>Foto</th>
                          <th class="d-none" />
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="item in categoria"
                          :key="'estado-inmueble-' + item.id"
                        >
                          <td>{{ item.nombre }}</td>
                          <td>
                            <b-input
                              v-if="estadosInmueble[getEstadosInmuebleIndex(item)]"
                              v-model="estadosInmueble[getEstadosInmuebleIndex(item)].cantidad"
                              min="0"
                              type="number"
                            />
                          </td>
                          <td>
                            <b-checkbox
                              v-if="estadosInmueble[getEstadosInmuebleIndex(item)]"
                              v-model="estadosInmueble[getEstadosInmuebleIndex(item)].reparar"
                              :true-value="1"
                            /> {{ estadosInmueble[getEstadosInmuebleIndex(item)].reparar ? 'Sí' : 'No' }}
                          </td>
                          <td>
                            <b-field grouped>
                              <b-upload
                                v-if="estadosInmueble[getEstadosInmuebleIndex(item)]"
                                :id="'estado-inmueble-img-' + item.id"
                                v-model="estadosInmueble[getEstadosInmuebleIndex(item)].foto"
                                @input="handleFileInputChange($event, item.id)"
                              >
                                <a class="button is-light">
                                  {{ estadosInmueble[getEstadosInmuebleIndex(item)].foto ? 'Cambiar' : 'Agregar' }}
                                </a>
                              </b-upload>
                              <b-button
                                v-if="estadosInmueble[getEstadosInmuebleIndex(item)]"
                                :disabled="!estadosInmueble[getEstadosInmuebleIndex(item)].foto"
                                type="is-light"
                                @click="handleFotoModal(estadosInmueble[getEstadosInmuebleIndex(item)])"
                              >
                                Previsualizar
                              </b-button>
                            </b-field>
                          </td>
                          <td class="d-none"><input type="hidden" v-model="estadosInmueble[getEstadosInmuebleIndex(item)].finalizado" value="1" /></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div class="is-divider" />

                  <b-field
                    label="Observaciones"
                    :message="getErrorMessage(['observacion', 'observacion'])"
                    :type="setFieldType(['observacion', 'observacion'])"
                  >
                    <b-input
                      v-model="form.observacion"
                      type="textarea"
                      placeholder="Observaciones"
                      :disabled="submitted"
                    />
                  </b-field>
                </b-step-item>

                <b-step-item
                  label="Finalización"
                  :clickable="false"
                >
                  <h3 class="title is-3">
                    {{ user.id_persona.nombre }}, estás a punto de finalizar el contrato.
                  </h3>
                  <h4 class="subtitle mb-4 is-4">
                    Antes de finalizar el contrato podés hacer una revisión o editarlo posteriormente.
                  </h4>
                  <b-button
                    :disabled="submitted"
                    size="is-large"
                    type="is-link"
                    native-type="button"
                    @click="activeStep = 0"
                  >
                    Revisar desde el comienzo
                  </b-button>

                  <div
                    class="is-divider"
                    data-content="O"
                  />

                  <b-button
                    :disabled="submitted"
                    native-type="button"
                    size="is-large"
                    :type="[{ 'is-primary': true }, { 'is-loading': submitted }]"
                    @click="handleSubmitForm"
                  >
                    Finalizar contrato
                  </b-button>
                </b-step-item>

                <template
                  slot="navigation"
                  slot-scope="{previous, next}"
                >
                  <div class="level">
                    <div class="level-left">
                      <b-button
                        v-if="activeStep > 0"
                        :disabled="previous.disabled||submitted"
                        icon-pack="fas"
                        icon-left="chevron-left"
                        type="is-second"
                        @click.prevent="handlePreviousStep(previous)"
                      >
                        Anterior
                      </b-button>
                      <b-button
                        v-else
                        icon-pack="fas"
                        icon-left="chevron-left"
                        type="is-second"
                        @click.prevent="$router.push({ name: 'Mis Rentas' })"
                      >
                        Volver a "Mis Contratos"
                      </b-button>
                    </div>
                    <div class="level-right">
                      <b-button
                        :disabled="next.disabled||submitted"
                        icon-pack="fas"
                        icon-right="chevron-right"
                        type="is-primary"
                        @click.prevent="handleNextStep(next)"
                      >
                        Siguiente
                      </b-button>
                    </div>
                  </div>
                </template>
              </b-steps>
            </div>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<script>
import { authComputed } from "@/store/helpers"
import { alertErrorMessage, alertSuccessMessage } from "@/utilities/helpers"
import { dz } from "@/utilities/mixins/dz"
import { estadosInmuebleComputed, estadosInmuebleMethods, rentasComputed, rentasMethods } from "@mvp/store/helpers"
import { groupBy } from "lodash"
import { mapEstadosInmuebleList } from "@mvp/store/modules/estadosInmueble/actions"
import { Validator } from "vee-validate"

import app from "@/app"
import moment from "moment"
import Form from "@/utilities/Form"

Validator.extend("greaterThanZero", (value, [otherValue]) => {
    console.log(value)
    console.log(otherValue)
    return {
        valid: otherValue === 0,
        data: {
            required: true // or false
        }
    }, {
        computesRequired: true,
        hasTarget: true,
    }
})

var fields = {
    documents: [],
    estados_inmueble: [],
    fecha_finalizacion_contrato: new Date(),
    monto_descontado_garantia_finalizacion_contrato: 0,
    motivo_descuento_garantia: "",
    observacion: "",
}

export default {
    mixins: [dz],

    data() {
        return {
            activeStep: 0,
            boletas: [],
            estadosInmueble: [],
            fecha_finalizacion_contrato: new Date(),
            form: new Form(fields),
            oFiles: [],
            prepared: false,
            submitted: false,
            title: "Finalizá un contrato de renta"
        }
    },

    computed: {
        ...authComputed,
        ...estadosInmuebleComputed,
        ...rentasComputed,
    },

    created() {
        return this.prepare().then(this.prepared = true)
    },

    formatDate(date) {
        return moment(date).format("DD/MM/YYYY")
    },

    methods: {
        ...estadosInmuebleMethods,
        ...rentasMethods,

        getErrorMessage(fields) {
            if (this.form.errors.has(fields[0])||this.$validator.errors.has(fields[1])) {
                return this.form.errors.get(fields[0])||this.$validator.errors.first(fields[1])
            }
        },

        getEstadosInmuebleIndex(item) {
            return this.estadosInmueble.findIndex(estadoInmueble => estadoInmueble.id == item.id)
        },

        groupBy,

        handleFileInputChange(evt, id) {
            this.oFiles[id] = new FileReader()
            this.oFiles[id].readAsDataURL(document.getElementById("estado-inmueble-img-" + id).files[0])

            this.activeOFile = id
        },

        handleFotoModal(estadoInmueble) {
            var foto
            if (this.oFiles[estadoInmueble.id]) {
                foto = this.oFiles[estadoInmueble.id].result

                this.$buefy.modal.open(
                    `<p class="image is-4by3">
                        <img src="` + foto + `" />
                    </p>`
                )

            } else {
                foto = estadoInmueble.foto

                this.$buefy.modal.open(
                    `<p class="image is-4by3">
                        <img src="` + app.storagePath + "/" + foto + `" />
                    </p>`
                )
            }
        },

        handleNextStep(next) {
            switch (this.activeStep) {
            case 0:
                return this.validateAll(["fecha_finalizacion_contrato", "monto_descontado_garantia_finalizacion_contrato", "motivo_descuento_garantia"], next)
            case 1:
                return next.action()
            default:
                return false
            }
        },

        handlePreviousStep(previous) {
            return previous.action()
        },

        handleSubmitForm() {
            this.submitted = true

            this.form.fecha_finalizacion_contrato = moment(this.fecha_finalizacion_contrato).format("YYYY-MM-DD").toString()

            return this.form.put(app.apiUrl + "/rentas/" + this.$route.params.id + "/finalizarContrato")
                .then(()=> {
                    alertSuccessMessage(this.title, "El contrato fue finalizado.")
                    this.$router.push({ name: "Home" })
                    return this.submitted = false
                })
                .catch(error => {
                    var message = error.status.message||error.message||error
                    if (error.status > 422) {
                        alertErrorMessage("Creá un contrato de Renta", message)
                    }

                    return this.submitted = false
                })
        },

        mapEstadosInmuebleList,

        mapFormData(data) {
            return {
                documentos: data.documentos,
                estados_inmueble: [],
                fecha_finalizacion_contrato: new Date(),
                monto_descontado_garantia_finalizacion_contrato: 0,
                motivo_descuento_garantia: data.motivo_descuento_garantia,
                observacion: data.observacion,
            }
        },

        parseDate(date) {
            return moment(date)
        },

        prepare() {
            var estadosInmueble = this.fetchAllEstadosInmueble()
            var renta = this.fetchOneRenta(this.$route.params.id)

            return Promise.all([estadosInmueble, renta])
                .then(values => {
                    if (values[0] && values[1]) {
                        this.estadosInmueble = mapEstadosInmuebleList(values[0], values[1].estados_inmueble)

                        this.form = new Form(this.mapFormData(values[1]))

                        window.$(()=> {
                            this.dzDocumentsMounted(values[1].documentos)
                        })

                    }

                    return values
                })
                .catch(error => {
                    var message = error.data.message||error.message||message
                    if (error.status !== 422) {
                        alertErrorMessage(this.title, message)
                    }

                    return error
                })
        },

        setFieldType(fields) {
            if (this.form.errors.has(fields[0])||this.$validator.errors.has(fields[1])) {
                return "is-danger"
            }
        },

        validateAll(fields, next) {
            return this.$validator.validateAll(fields)
                .then(result => {
                    if (result) {
                        return next.action()
                    }

                    return false
                })
                .catch(false)
        }
    }
}
</script>
