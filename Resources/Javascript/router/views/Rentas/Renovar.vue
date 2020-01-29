<template>
  <section class="bg-light">
    <div class="columns is-gapless">
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
                  label=""
                  :clickable="true"
                >
                  <h3 class="title mb-5 is-4">
                    Renová tu contrato de renta
                  </h3>
                  <h4 class="subtitle is-5">
                    Completa los campos con las mismas cláusulas del contrato firmado.
                  </h4>

                  <b-field>
                    <b-radio
                      v-model="form.renovacion"
                      native-value="NO_RENOVAR"
                    >
                      No deseo renovar el contrato.
                    </b-radio>
                  </b-field>
                  <b-field>
                    <b-radio
                      v-model="form.renovacion"
                      native-value="AUTOMATICA"
                    >
                      Renovar por 1 año con las mismas condiciones.
                    </b-radio>
                  </b-field>

                  <b-field>
                    <b-radio
                      v-model="form.renovacion"
                      native-value="MANUAL"
                    >
                      Renovación personalizada.
                    </b-radio>
                  </b-field>

                  <div class="is-divider" />

                  <div
                    v-if="form.renovacion !== 'NO_RENOVAR'"
                    class="columns"
                  >
                    <div class="column is-6">
                      <b-field
                        label="Fecha de inicio *"
                        :message="getErrorMessage(['fecha_inicio', 'fecha_inicio'])"
                        :type="setFieldType(['fecha_inicio', 'fecha_inicio'])"
                      >
                        <b-datepicker
                          v-model="form.fecha_inicio"
                          v-validate.disable="'required'"
                          :date-formatter="formatDate"
                          :max-date="form.fecha_inicio"
                          :min-date="form.fecha_inicio"
                          :disabled="disabled"
                          data-vv-as="Fecha de inicio"
                          name="fecha_inicio"
                          placeholder="Selecciona una fecha de inicio"
                          icon="calendar"
                          editable
                        />
                      </b-field>
                    </div>

                    <div class="column is-6">
                      <b-field
                        label="Fecha de finalización *"
                        :message="getErrorMessage(['fecha_fin', 'fecha_fin'])"
                        :type="setFieldType(['fecha_fin', 'fecha_fin'])"
                      >
                        <b-datepicker
                          v-model="form.fecha_fin"
                          v-validate.disable="'required'"
                          :date-formatter="formatDate"
                          :disabled="disabled"
                          data-vv-as="Fecha de finalización"
                          name="fecha_fin"
                          placeholder="Selecciona una fecha de finalización"
                          icon="calendar"
                          editable
                        />
                      </b-field>
                    </div>
                  </div>

                  <div
                    v-if="form.renovacion !== 'NO_RENOVAR'"
                    class="columns"
                  >
                    <div class="column is-6">
                      <b-field
                        v-if="inmueble.id_inmueble_padre"
                        label="El inmueble *"
                        expanded
                        :message="getErrorMessage(['id_inmueble', 'id_inmueble'])"
                        :type="setFieldType(['id_inmueble', 'id_inmueble'])"
                      >
                        <b-select
                          v-model="form.id_inmueble"
                          v-validate.disable="'required'"
                          :disabled="disabled"
                          name="id_inmueble"
                          data-vv-as="El inmueble"
                          placeholder="El inmueble"
                          expanded
                        >
                          <optgroup
                            v-if="inmueble.id_inmueble_padre.modalidad_propiedad === 'EN_CONDOMINIO'"
                            :label="inmueble.id_imueble_padre.nombre"
                          >
                            <option
                              :value="inmueble.id"
                              :selected="true"
                            >
                              Piso {{ inmueble.id_unidad.piso }} - Número {{ inmueble.id_unidad.numero }}
                            </option>
                          </optgroup>
                          <option
                            v-else
                            :value="inmueble.id"
                            :selected="true"
                          >
                            {{ inmueble.id_inmueble_padre.nombre }}
                          </option>
                        </b-select>
                      </b-field>
                    </div>

                    <div class="column is-6">
                      <b-field
                        label="El inquilino *"
                        expanded
                        :message="getErrorMessage(['id_inquilino', 'id_inquilino'])"
                        :type="setFieldType(['id_inquilino', 'id_inquilino'])"
                      >
                        <b-select
                          v-model="form.id_inquilino"
                          v-validate.disable="'required'"
                          :disabled="disabled"
                          name="id_inmueble"
                          data-vv-as="El inquilino"
                          placeholder="El inquilino"
                          expanded
                        >
                          <option
                            :value="inquilino.id"
                            :selected="true"
                          >
                            {{ inquilino.nombre + " " + inquilino.apellido }}
                          </option>
                        </b-select>
                      </b-field>
                    </div>
                  </div>

                  <div
                    v-if="form.renovacion !== 'NO_RENOVAR'"
                    class="columns"
                  >
                    <div class="column is-6">
                      <b-field
                        label="Moneda *"
                        :message="getErrorMessage(['id_moneda', 'id_moneda'])"
                        :type="setFieldType(['id_moneda', 'id_moneda'])"
                      >
                        <b-select
                          v-model="form.id_moneda"
                          v-validate.disable="'required'"
                          :disabled="disabled"
                          name="id_moneda"
                          data-vv-as="Moneda"
                          placeholdel="Moneda"
                          expanded
                        >
                          <option
                            value="1"
                          >
                            Guaraní
                          </option>
                        </b-select>
                      </b-field>
                    </div>
 
                    <div class="column is-6">
                      <b-field
                        label="Monto mensual de la renta *"
                        :message="getErrorMessage(['monto', 'monto'])"
                        :type="setFieldType(['monto', 'monto'])"
                      >
                        <b-input
                          v-model="form.monto"
                          v-validate.disable="'required|numeric'"
                          :disabled="disabled"
                          placeholder="Monto mensual de la renta"
                          name="monto"
                          data-vv-as="Monto mensual de la renta"
                          min="0"
                          type="numeric"
                        />
                      </b-field>
                    </div>
                  </div>

                  <div
                    v-if="form.renovacion !== 'NO_RENOVAR'"
                    class="columns"
                  >
                    <div class="column is-6">
                      <b-field
                        label="Notificación de renovación (días) *"
                        :message="getErrorMessage(['dias_notificacion_previa_renovacion', 'dias_notificacion_previa_renovacion'])"
                        :type="setFieldType(['dias_notificacion_previa_renovacion', 'dias_notificacion_previa_renovacion'])"
                      >
                        <b-input
                          v-model="form.dias_notificacion_previa_renovacion"
                          v-validate.disable="'required|numeric'"
                          :disabled="disabled"
                          placeholder="Notificación de renovación (días)"
                          name="dias_notificacion_previa_renovacion"
                          data-vv-as="Notificación de renovación"
                          min="0"
                          type="numeric"
                        />
                      </b-field>
                    </div>

                    <div class="column is-6">
                      <b-field
                        label="Día de pago mensual *"
                        :message="getErrorMessage(['dia_mes_pago', 'dia_mes_pago'])"
                        :type="setFieldType(['dia_mes_pago', 'dia_mes_pago'])"
                      >
                        <b-input
                          v-model="form.dia_mes_pago"
                          v-validate.disable="'required|numeric|max_value:31'"
                          :disabled="disabled"
                          data-vv-as="Día de pago mensual"
                          name="dia_mes_pago"
                          placeholder="Día de pago mensual"
                          type="number"
                          min="1"
                          max="31"
                        />
                      </b-field>
                    </div>
                  </div>

                  <div
                    v-if="form.renovacion !== 'NO_RENOVAR'"
                    class="columns"
                  >
                    <div class="column is-6">
                      <b-field
                        label="¿Incluye cláusula de multa?"
                      >
                        <b-checkbox
                          ref="multa"
                          v-model="form.multa"
                          name="multa"
                          :disabled="disabled"
                        >
                          Multa
                        </b-checkbox>
                      </b-field>

                      <b-field
                        v-if="form.multa"
                        label="Monto de multa por día de atraso"
                        :message="getErrorMessage(['monto_multa_dia', 'monto_multa_dia'])"
                        :type="setFieldType(['monto_multa_dia', 'monto_multa_dia'])"
                      >
                        <b-input
                          v-model="form.monto_multa_dia"
                          v-validate.disable="'required_if:multa,true'"
                          :disabled="disabled"
                          name="monto_multa_dia"
                          data-vv-as="Monto por cada día de multa"
                          type="number"
                          placeholder="Monto por cada día de multa"
                        />
                      </b-field>

                      <b-field
                        v-if="form.multa"
                        label="Días de gracia para pago"
                        :message="getErrorMessage(['dias_multa', 'dias_multa'])"
                        :type="setFieldType(['dias_multa', 'dias_multa'])"
                      >
                        <b-input
                          v-model="form.dias_multa"
                          v-validate.disable="'required|numeric'"
                          :disabled="disabled"
                          name="dias_multa"
                          data-vv-as="Días de gracia"
                          type="number"
                          placeholder="Días de gracia"
                        />
                      </b-field>

                      <small>Ejemplo: Día de pago: 1(1/dic/19) - Días de gracia para pago: 4. Fecha de vencimiento para pago sin multa 5/dic/19</small>
                    </div>
                  </div>
                </b-step-item>

                <b-step-item
                  label=""
                  :clickable="true"
                  :visible="form.renovacion === 'MANUAL'"
                >
                  <h6 class="title is-6">
                    PASO 2
                  </h6>
                  <h4 class="subtitle is-4">
                    Adjunta tu contrato firmado en PDF
                  </h4>

                  <VueDropzone
                    id="dzDocuments"
                    ref="dzDocuments"
                    :options="dzDocumentsOptions"
                    @vdropzone-error="dzDocumentsError"
                    @vdropzone-removed-file="dzDocumentsRemovedFile"
                    @vdropzone-processing="dzDocumentsProcessing"
                    @vdropzone-success-multiple="dzDocumentsSuccess"
                    @vdropzone-upload-progress="dzDocumentsUploadProgress"
                  />
                </b-step-item>

                <b-step-item>
                  <h3 class="title mb-5 is-3">
                    ¡Ya estás a punto de tener tu contrato renovado, {{ user.id_persona.nombre }}!
                  </h3>
                  <h5 class="subtitle mb-5 is-4">
                    Antes de renovar el contrato podés hacer una revisión o editarlo posteriormente.
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
                    Renovar contrato
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
import { alertErrorMessage, alertSuccessMessage, deepClone, getSavedState } from "@/utilities/helpers"
import { authComputed } from "@/store/helpers"
import { dz } from "@/utilities/mixins/dz"
import { rentasComputed, rentasMethods } from "@mvp/store/helpers"

import app from "@/app"
import moment from "moment"
import store from "@/store"
import Form from "@/utilities/Form"

import vue2Dropzone from "vue2-dropzone"
import "vue2-dropzone/dist/vue2Dropzone.min.css"

var csrfToken = document.head.querySelector("meta[name=\"csrf-token\"]").content
var fields = deepClone(store.state.rentas.initialState.one)
var token = getSavedState("auth.token")

export default {
    components: {
        VueDropzone: vue2Dropzone
    },
    mixins: [dz],
    data() {
        return {
            activeStep: 0,
            boletas: [],
            dzDocumentsOptions: {
                addRemoveLinks: true,
                autoProcessQueue: false,
                dictDefaultMessage: "<i class='fa fa-cloud-upload'></i><br/>Hacé click o arrastrá una o más contratos firmados en PDF.",
                headers: {
                    "X-CSRF-TOKEN": csrfToken,
                    "Authorization": "Bearer " + token
                },
                maxFiles: 4,
                maxFilesize: 20,
                method: "put",
                parallelUploads: 4,
                paramName: "documentos",
                uploadMultiple: true,
                url: app.apiUrl + "/renovarContrato"
            },
            form: new Form(fields),
            inmueble: deepClone(store.state.inmuebles.initialState.one),
            inquilino: deepClone(store.state.personas.initialState.one),
            prepared: false,
            submitted: false,
            url: app.apiUrl + "/renovarContrato"
        }
    },

    computed: {
        ...authComputed,
        ...rentasComputed,

        disabled() {
            return this.submitted ||
            this.form.renovacion !== "MANUAL"
        }
    },

    watch: {
        "$route" (value) {
            if (value.name === "Renovar Renta" && this.prepared) {
                this.prepare()
            }
        }
    },

    created() {
        return this.prepare().then(this.prepared = true)
    },

    methods: {
        ...rentasMethods,

        dzDocumentsSuccess() {
            alertSuccessMessage("Renová un contrato de Renta", "Tu renovación de contrato fue actualizada.")
            this.$router.push({ name: "Mis Rentas" })
            return this.submitted = false
        },

        formatDate(date) {
            return moment(date).format("DD/MM/YYYY")
        },

        parseDate(date) {
            return moment(date)
        },

        getErrorMessage(fields) {
            if (this.form.errors.has(fields[0])||this.$validator.errors.has(fields[1])) {
                return this.form.errors.get(fields[0])||this.$validator.errors.first(fields[1])
            }
        },

        handleNextStep(next) {
            switch (this.activeStep) {
            case 0:
                if (this.form.renovacion === "MANUAL") {
                    return this.validateAll(["fecha_inicio", "fecha_fin", "id_inmueble", "id_inquilino", "id_moneda", "monto", "dia_mes_pago", "dias_notificacion_previa_renovacion"], next)
                }

                return next.action()
            default:
                return next.action()
            }
        },

        handlePreviousStep(previous) {
            return previous.action()
        },

        handleSubmitForm() {
            this.submitted = true

            this.form.fecha_fin = moment(this.form.fecha_fin).format("YYYY-MM-DD")
            this.form.fecha_inicio = moment(this.form.fecha_inicio).format("YYYY-MM-DD")

            var id = this.$route.params.id
            return this.form.put(app.apiUrl + "/rentas/" + id + "/renovarContrato")
                .then(response => {
                    this.url = app.apiUrl + "/rentas/" + response.data.id

                    return this.dzDocumentsProcessQueue()
                })
                .catch(error => {
                    var message = error.data.message||error.message||error
                    if (error.status !== 422) {
                        alertErrorMessage("Renová un contrato de Renta", message)
                    }

                    return this.submitted = false
                })
        },

        prepare() {
            var renta = this.fetchOneRenta(this.$route.params.id)
                .then(value => {
                    if (value) {
                        this.inmueble = value.id_inmueble
                        this.inquilino = value.id_inquilino

                        var fechaInicio = new Date(value.fecha_fin)
                        fechaInicio.setDate(fechaInicio.getDate() + 1)

                        var fechaFin = new Date(value.fecha_fin)
                        fechaFin.setDate(fechaFin.getDate() + 366)

                        this.form = new Form(
                            {
                                id_renta_padre: value.id,
                                id_inmueble: value.id_inmueble.id,
                                id_inquilino: value.id_inquilino.id,
                                id_moneda: value.id_moneda.id,
                                dia_mes_pago: value.dia_mes_pago,
                                dias_notificacion_previa_renovacion: value.dias_notificacion_previa_renovacion,
                                documentos: [],
                                monto: value.monto,
                                fecha_fin: fechaFin,
                                fecha_inicio: fechaInicio,
                                multa: value.multa,
                                expensas: value.expensas,
                                vigente: value.vigente,
                                dias_multa: value.dias_multa,
                                monto_multa_dia: value.monto_multa_dia,
                                enum_estado: "ACTIVO",
                                renovacion: value.renovacion
                            }
                        )

                        if (value.documentos) {
                            this.dzDocumentsMounted(value.documentos)
                        }
                    }

                    return value
                })

            return Promise.all([renta])
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
