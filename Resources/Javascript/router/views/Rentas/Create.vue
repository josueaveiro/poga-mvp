<template>
  <section class="bg-light">
    <div class="columns is-gapless">
      <div class="bg-white column is-7">
        <form enctype="multipart/form-data">
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
                    {{ title }}
                  </h3>
                  <h4 class="subtitle is-5">
                    Completa los campos con las mismas cláusulas del contrato firmado.
                  </h4>

                  <div class="columns">
                    <div class="column is-6">
                      <b-field
                        label="Fecha de inicio *"
                        :message="getErrorMessage(['fecha_inicio', 'fecha_inicio'])"
                        :type="setFieldType(['fecha_inicio', 'fecha_inicio'])"
                      >
                        <b-datepicker
                          ref="fechaInicio"
                          v-model="form.fecha_inicio"
                          v-validate="'required'"
                          :date-formatter="formatDate"
                          :disabled="submitted"
                          icon-next="chevron-right"
                          icon-prev="chevron-left"
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
                          v-validate="'required|after:fechaInicio'"
                          :date-formatter="formatDate"
                          :disabled="submitted"
                          icon-next="chevron-right"
                          icon-prev="chevron-left"
                          data-vv-as="Fecha de finalización"
                          name="fecha_fin"
                          placeholder="Selecciona una fecha de finalización"
                          icon="calendar"
                          editable
                        />
                      </b-field>
                    </div>
                  </div>

                  <div class="columns">
                    <div class="column is-6">
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
                        >
                          <optgroup
                            v-for="item in allInmuebles.filter(item => item.id_inmueble.id_tipo_inmueble.id == 1)"
                            :key="'edificio-' + item.id"
                            :label="item.nombre"
                          >
                            <option
                              v-for="unidad in item.unidades"
                              :key="'unidad-' + unidad.id"
                              :value="unidad.id_inmueble.id"
                            >
                              Piso {{ unidad.piso }} - Número {{ unidad.numero }}
                            </option>
                          </optgroup>
                          <option
                            v-for="item in allInmuebles.filter(item => item.id_inmueble.id_tipo_inmueble.id == 2)"
                            :key="'casa-' + item.id"
                            :value="item.id_inmueble.id"
                          >
                            {{ item.nombre }}
                          </option>
                        </b-select>
                      </b-field>
                    </div>

                    <div class="column is-6">
                      <b-field
                        label="Inquilino *"
                        expanded
                        :message="getErrorMessage(['id_inquilino', 'id_inquilino'])"
                        :type="setFieldType(['id_inquilino', 'id_inquilino'])"
                      >
                        <b-field>
                          <b-autocomplete
                            v-model="busquedaInquilino"
                            v-validate="'required'"
                            :data="filteredInquilinos"
                            :disabled="submitted"
                            :loading="allPersonasPending"
                            name="id_inquilino"
                            placeholder="Buscá por CI/RUC o agregá un inquilino"
                            data-vv-as="Inquilino"
                            label="Selecciona un inquilino"
                            expanded
                            @select="option => inquilinoSeleccionado = option"
                          >
                            <template slot="empty">
                              No se encontraron resultados.
                            </template>
                          </b-autocomplete>
                          <p class="control">
                            <b-button
                              class="button is-primary"
                              native-type="button"
                              @click="handleNuevoInquilinoModal"
                            >
                              Nuevo
                            </b-button>
                          </p>
                        </b-field>
                      </b-field>
                      <p>El inquilino dado de alta recibirá una invitación de registro en tu nombre.</p>
                    </div>
                  </div>

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
                          v-validate="'required|numeric'"
                          :disabled="submitted"
                          placeholder="Monto mensual de la renta"
                          name="monto"
                          data-vv-as="Monto mensual de la renta"
                          min="0"
                          type="numeric"
                        />
                      </b-field>
                    </div>
                  </div>

                  <div class="columns">
                    <div class="column is-6">
                      <b-field
                        label="Notificación de renovación (días) *"
                        :message="getErrorMessage(['dias_notificacion_previa_renovacion', 'dias_notificacion_previa_renovacion'])"
                        :type="setFieldType(['dias_notificacion_previa_renovacion', 'dias_notificacion_previa_renovacion'])"
                      >
                        <b-input
                          v-model="form.dias_notificacion_previa_renovacion"
                          v-validate="'required|numeric'"
                          :disabled="submitted"
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
                          v-validate="'required|numeric|max_value:31'"
                          :disabled="submitted"
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

                  <div class="columns">
                    <div class="column is-6">
                      <b-field label="¿Es un contrato vigente?">
                        <b-checkbox
                          v-model="form.vigente"
                          :disabled="submitted"
                        >
                          Contrato vigente
                        </b-checkbox>
                      </b-field>

                      <b-field
                        label="Depósito de garantía"
                        :message="getErrorMessage(['garantia', 'garantia'])"
                        :type="setFieldType(['garantia', 'garantia'])"
                      >
                        <b-input
                          v-model="form.garantia"
                          v-validate="'required'"
                          :disabled="submitted"
                          data-vv-as="Depósito de garantía"
                          name="garantia"
                          placeholder="Depósito de garantia"
                          type="number"
                          min="0"
                        />
                      </b-field>

                      <b-notification
                        v-if="form.vigente"
                        type="is-info"
                        has-icon
                        icon-pack="fas"
                        aria-close-label="Cerrar notificación"
                      >
                        Este dato es solo para registro informativo. No se generará ningún pago pendiente para el inquilino por este concepto.
                      </b-notification>

                      <b-field
                        v-if="!form.vigente"
                        label="Monto de la comisión inmobiliaria"
                        :message="getErrorMessage(['comision_inmobiliaria', 'comision_inmobiliaria'])"
                        :type="setFieldType(['comision_inmobiliaria', 'comision_inmobiliaria'])"
                      >
                        <b-input
                          v-model="form.comision_inmobiliaria"
                          :disabled="submitted"
                          name="comision_inmobiliaria"
                          placeholder="Monto de la comisión inmobiliaria"
                          type="number"
                          min="0"
                        />
                      </b-field>
                    </div>

                    <div class="column is-6">
                      <b-field
                        label="¿Incluye cláusula de multa?"
                      >
                        <b-checkbox
                          ref="multa"
                          v-model="form.multa"
                          name="multa"
                          :disabled="submitted"
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
                          v-validate="'required_if:multa,true'"
                          :disabled="submitted"
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
                          v-validate="'required|numeric'"
                          :disabled="submitted"
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

                <b-step-item
                  label=""
                  :clickable="true"
                >
                  <h6 class="title is-6">
                    PASO 3
                  </h6>
                  <h4 class="subtitle is-4">
                    Registro de estado del inmueble
                  </h4>
                  <h5 class="subtitle mb-5 is-4">
                    Registrá el estado de las instalaciones del inmueble en este momento.
                  </h5>
             
                  <div
                    v-for="categoria in groupBy(allEstadosInmueble, 'enum_categoria')"
                    :key="'categoria-' + categoria.id"
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
                        <tr
                          v-for="item in categoria"
                          :key="'estado-inmueble-' + item.id"
                        >
                          <td>{{ item.nombre }}</td>
                          <td>
                            <b-input
                              v-if="estadosInmueble[getEstadosInmuebleIndex(item)]"
                              v-model="estadosInmueble[getEstadosInmuebleIndex(item)].cantidad"
                              type="number"
                            />
                          </td>
                          <td>
                            <b-checkbox
                              v-if="estadosInmueble[getEstadosInmuebleIndex(item)]"
                              v-model="estadosInmueble[getEstadosInmuebleIndex(item)].reparar"
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
                                :disabled="!oFiles[item.id]"
                                type="is-light"
                                @click="handlePreviewImage(item.id)"
                              >
                                Previsualizar
                              </b-button>
                            </b-field>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

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

                <b-step-item>
                  <h3 class="title mb-5 is-3">
                    ¡Ya estás a punto de tener tu contrato creado, {{ user.id_persona.nombre }}!
                  </h3>
                  <h5 class="subtitle mb-5 is-4">
                    Antes de finalizar la creación del contrato podés hacer una revisión o editarlo posteriormente.
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
                    Crear Contrato
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

    <PreviewImageModal :is-active="isPreviewImageModalActive" />
    <NuevoInquilinoModal :is-active="isNuevoInquilinoModalActive" />
  </section>
</template>

<script>
import { alertErrorMessage, alertSuccessMessage, deepClone, getSavedState } from "@/utilities/helpers"
import { authComputed } from "@/store/helpers"
import { dz } from "@/utilities/mixins/dz"
import { estadosInmuebleComputed, estadosInmuebleMethods, inmueblesComputed, inmueblesMethods, personasComputed, personasMethods } from "@mvp/store/helpers"
import { groupBy } from "lodash"

import app from "@/app"
import moment from "moment"
import vue2Dropzone from "vue2-dropzone"
import store from "@/store"
import Form from "@/utilities/Form"

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
            activeOFile: null,
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
                maxFiles: 8,
                maxFilesize: 20,
                method: "put",
                parallelUploads: 8,
                paramName: "documentos",
                uploadMultiple: true,
                url: app.apiUrl + "/rentas"
            },
            estadosInmueble: [],
            inmuebles: [],
            isPreviewImageModalActive: false,
            busquedaInquilino: "",
            inquilinoSeleccionado: "",
            isNuevoInquilinoModalActive: false,
            form: new Form(fields),
            oFiles: [],
            personasMap: [],
            prepared: false,
            submitted: false,
            title: "Crea un Contrato de Renta",
            url: app.apiUrl + "/rentas",
            value: "",
        }
    },

    computed: {
        ...authComputed,
        ...estadosInmuebleComputed,
        ...inmueblesComputed,
        ...personasComputed,

        filteredInquilinos() {
            if (this.busquedaInquilino.length > 4) {
                return this.personasMap.filter(item => {
                    return item.toString().toLowerCase().indexOf(this.busquedaInquilino) > -1
                })
            }

            return ""
        }
    },

    watch: {
        inquilinoSeleccionado (value) {
            var tipoDocumento = value.split(":")[0]
            var documento = value.split(":")[1].replace(/\(/g, "").replace(/\)/g, "").split(" ")[0]
        
            var result = this.allPersonas.find(item => { return item[tipoDocumento.toLowerCase()] === documento })
            if (!result) {
                this.form.id_inquilino = null
            } else {
                this.form.id_inquilino = result.id
            }
        }
    },

    created() {
        return this.prepare().then(this.prepared = true)
    },

    methods: {
        ...estadosInmuebleMethods,
        ...inmueblesMethods,
        ...personasMethods,

        dzDocumentsSuccess() {
            if (this.boletas.renta) {
                var message = "<p>Tu contrato fue creado.<br></p>Comparte el siguiente link con el inquilino para la realización de los pagos:<ul>"
                message = message + "<li><a href='/realiza-un-pago/" + this.boletas.renta.debt.docId + "' target='_blank'>Link para el pago</a></li>"
                message = message + "</ul>"

                alertSuccessMessage(this.title, message)
            } else {
                alertSuccessMessage(this.title, "El contrato fue creado.")
            }

            this.$router.push({ name: "Mis Rentas" })

            return this.submitted = false
        },

        formatDate(date) {
            return moment(date).format("DD/MM/YYYY")
        },

        getErrorMessage(fields) {
            if (this.form.errors.has(fields[0])||this.$validator.errors.has(fields[1])) {
                return this.form.errors.get(fields[0])||this.$validator.errors.first(fields[1])
            }
        },

        getEstadosInmuebleIndex(item) {
            return this.estadosInmueble.findIndex(estadoInmueble => estadoInmueble.id === item.id)
        },

        groupBy,

        handleEstadosInmueble() {
            this.form.estados_inmueble = this.estadosInmueble.filter(estadoInmueble => Number(estadoInmueble.cantidad) > 0 || estadoInmueble.reparar || estadoInmueble.foto)
            this.form.estados_inmueble.map(estadoInmueble => { 
                if (this.oFiles[estadoInmueble.id]) {
                    estadoInmueble.foto = this.oFiles[estadoInmueble.id].result
                    return estadoInmueble
                }
            })
        },

        handleNextStep(next) {
            switch (this.activeStep) {
            case 0:
                return this.validateAll(["fecha_inicio", "fecha_fin", "id_inmueble", "id_inquilino", "id_moneda", "monto", "garantia", "dia_mes_pago", "dias_notificacion_previa_renovacion"], next)
            case 1:
                return next.action()
            case 2:
                return next.action()
            default:
                return false
            }
        },

        handleNuevoInquilinoModal() {
            this.isNuevoInquilinoModalActive = true
        },

        handleFileInputChange(evt, id) {
            this.oFiles[id] = new FileReader()
            this.oFiles[id].readAsDataURL(document.getElementById("estado-inmueble-img-" + id).files[0])
            //this.oFiles[id].onload = (e) => this.readSuccess(e, id)

            this.activeOFile = id
        },

        handlePreviewImage() {
            this.isPreviewImageModalActive = true
        },

        handlePreviousStep(previous) {
            return previous.action()
        },

        handleSubmitForm() {
            this.submitted = true

            this.handleEstadosInmueble()
            this.form.fecha_fin = moment(this.form.fecha_fin).format("YYYY-MM-DD")
            this.form.fecha_inicio = moment(this.form.fecha_inicio).format("YYYY-MM-DD")

            var id
            return this.form.post(app.apiUrl + "/rentas")
                .then(response => {
                    id = response.data.renta.id
                    this.boletas = response.data.boletas
                    this.url = app.apiUrl + "/rentas/" + id

                    return this.dzDocumentsProcessQueue()
                })
                .catch(error => {
                    var message = error.status.message||error.message||error
                    if (error.status > 422) {
                        alertErrorMessage("Creá un contrato de Renta", message)
                    }

                    return this.submitted = false
                })
        },

        mapInquilino(inquilino) {
            return inquilino.enum_tipo_persona === "FISICA" ? "CI:" + inquilino.ci + " (" + inquilino.nombre + " " + inquilino.apellido + ")" : "RUC:" + inquilino.ruc + " (" + inquilino.nombre + ")"
        },

        moment,

        prepare() {
            var estadosInmueble = this.fetchAllEstadosInmueble()
            var inmuebles = this.fetchAllInmuebles({ tipoListado: "MisInmuebles", excluir: "con_renta" })
            var personas = this.fetchAllPersonas()

            estadosInmueble.then(value => {
                if (value) {
                    value.forEach(item => {
                        this.estadosInmueble.push({ id: item.id, cantidad: 0, reparar: 0, foto: "" })
                    })
                }

                return value
            })
                .catch(error => {
                    alertErrorMessage(this.title, error.status.message||error.message||error)
                })

            personas.then(value => {
                if (value) {
                    this.personasMap = value.map(item => {
                        return this.mapInquilino(item)
                    })
                }

                return value
            })
                .catch(error => {
                    alertErrorMessage(this.title, error.status.message||error.message||error)
                })

            return Promise.all([estadosInmueble, inmuebles, personas])
        },

        readSuccess(e, id) {
            console.log(e)
            console.log(id)
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
