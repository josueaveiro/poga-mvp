<template>
  <section class="bg-light">
    <div class="columns is-gapless">
      <div class="bg-white column is-7">
        <form class="p-3 p-md-5">
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
                  label=""
                  :clickable="true"
                >
                  <h3 class="title mb-5 is-4">
                    Finaliza un contrato de renta
                  </h3>
                  <h4 class="subtitle is-5">
                    Texto descriptivo
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
                  label=""
                  :clickable="true"
                >
                  <h6 class="title is-6">
                    PASO 2
                  </h6>
                  <h4 class="subtitle is-4">
                    Registro de estado del inmueble
                  </h4>

                  <div
                    v-for="categoria in groupBy(allEstadosInmueble, 'enum_categoria')"
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
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item, index) in categoria">
                          <td>{{ item.nombre }}</td>
                          <td>
                            <b-input
                              v-model="form.estados_inmueble[getEstadosInmuebleIndex(item)].cantidad"
                              type="number"
                            />
                          </td>
                          <td>
                            <b-checkbox
                              v-model="form.estados_inmueble[getEstadosInmuebleIndex(item)].reparar"
                              :true-value="1"
                              :native-value="1"
                              :value="1"
                            /> {{ form.estados_inmueble[getEstadosInmuebleIndex(item)].reparar ? 'Sí' : 'No' }}
                          </td>
                          <td>
                            <b-field grouped>
                              <b-upload
                                :id="'estado-inmueble-img-' + item.id"
                                v-model="form.estados_inmueble[getEstadosInmuebleIndex(item)].foto"
                                @input="handleFileInputChange($event, item.id)"
                              >
                                <a class="button is-light">
                                  {{ form.estados_inmueble[getEstadosInmuebleIndex(item)].foto ? 'Cambiar' : 'Agregar' }}
                                </a>
                              </b-upload>

                              <b-button
                                :disabled="!form.estados_inmueble[getEstadosInmuebleIndex(item)].foto !== ''"
                                type="is-light"
                                @click="isImageModalActive = 1"
                              >
                                Previsualizar
                              </b-button>

                              <b-modal
                                :disabled="!form.estados_inmueble[getEstadosInmuebleIndex(item)].foto !== ''"
                                :active.sync="isImageModalActive"
                              >
                                <p class="image is-4by3">
                                  <img :src="'/storage/' + form.estados_inmueble[getEstadosInmuebleIndex(item)].foto">
                                </p>
                              </b-modal>
                            </b-field>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </b-step-item>

                <b-step-item>
                  <h3 class="title mb-5 is-3">
                    {{ user.id_persona.nombre }}, estás a punto de finalizar el contrato.
                  </h3>
                  <h5 class="subtitle mb-5 is-4">
                    Antes de finalizar el contrato podés hacer una revisión o editarlo posteriormente.
                  </h5>
                  <b-button
                    :disabled="submitted"
                    size="is-large"
                    type="is-link"
                    native-type="button"
                    @click="activeStep = 0"
                  >
                    Revisar
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
                        :disabled="previous.disabled||submitted"
                        icon-pack="fas"
                        icon-left="chevron-left"
                        type="is-second"
                        @click.prevent="handlePreviousStep(previous)"
                      >
                        Anterior
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
  </section>
</template>

<script>
import { authComputed } from "@/store/helpers"
import { alertErrorMessage, alertSuccessMessage } from "@/utilities/helpers"
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
    observacion: "",
}

export default {
    data() {
        return {
            activeStep: 0,
            boletas: [],
            fecha_finalizacion_contrato: new Date(),
            form: new Form(fields),
            isImageModalActive: false,
            oFiles: [],
            prepared: false,
            submitted: false,
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
            return this.form.estados_inmueble.findIndex(i => i.id === item.id)
        },

        groupBy,

        handleFileInputChange(evt, id) {
            this.oFiles[id] = new FileReader()
            this.oFiles[id].readAsDataURL(document.getElementById("estado-inmueble-img-" + id).files[0])
            this.oFiles[id].onload = (e) => this.readSuccess(e, id)

            this.activeOFile = id
        },

        handleNextStep(next) {
            switch (this.activeStep) {
            case 0:
                return this.validateAll(["fecha_finalizacion_contrato", "monto_descontado_garantia_finalizacion_contrato", "motivo_descuento_garantia", "observacion"], next)
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
                .then(response => {
                    alertSuccessMessage("Finalizá un contrato de renta", "El contrato fue finalizado.")
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
                estados_inmueble: this.allEstadosInmueble.map(estadoInmueble => {
                    var attached = data.estados_inmueble.find(item => item.id === estadoInmueble.id)

                    if (attached) {
                        return { id: attached.id, cantidad: attached.pivot.cantidad, reparar: attached.pivot.reparar, foto: attached.pivot.foto }
                    } else {
                        return { id: estadoInmueble.id, cantidad: 0, reparar: 0, foto: "" }
                    }
                }),
                fecha_finalizacion_contrato: new Date(),
                monto_descontado_garantia_finalizacion_contrato: 0,
                motivo_descuento_garanta: data.motivo_descuento_garantia,
                observacion: data.observacion,
            }
        },

        parseDate(date) {
            return moment(date)
        },

        prepare() {
            var renta = this.fetchOneRenta(this.$route.params.id)
            var estadosInmueble = this.fetchAllEstadosInmueble()

            return Promise.all([renta, estadosInmueble])
                .then(values => {
                    if (values[0] && values[1]) {
                        //this.estadosInmueble = values[1].forEach(estadoInmueble => {
                        //if (values[0].id == estadoInmueble.pivot.id) {
                        ////this.estadosInmu
                        //}
                        //})

                        this.form = new Form(this.mapFormData(values[0]))
                    }

                    return values
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
