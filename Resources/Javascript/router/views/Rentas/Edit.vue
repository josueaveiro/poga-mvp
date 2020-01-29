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
                  <h4 class="subtitle is-4">
                    Modifica tu contrato firmado en PDF
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
                    ¡Ya estás a punto de tener tu contrato actualizado, {{ user.id_persona.nombre }}!
                  </h3>
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
                    Actualizar Contrato
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
import { estadosInmuebleComputed, estadosInmuebleMethods, rentasMethods } from "@mvp/store/helpers"
import { groupBy } from "lodash"
import { mapEstadosInmuebleList } from "@mvp/store/modules/estadosInmueble/actions"

import app from "@/app"
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
            form: new Form(fields),
            oFiles: [],
            prepared: false,
            submitted: false,
            title: "Modifica un Contrato de Renta",
            url: app.apiUrl + "/rentas",
            value: "",
        }
    },

    computed: {
        ...authComputed,
        ...estadosInmuebleComputed,
    },

    watch: {
        "$route" (value) {
            if (value.name === "Editar Renta") {
                this.prepare()
            }
        }
    },

    created() {
        return this.prepare().then(this.prepared = true)
    },

    methods: {
        ...estadosInmuebleMethods,
        ...rentasMethods,

        dzDocumentsSuccess() {
            alertSuccessMessage(this.title, "El contrato fue modificado.")

            this.$router.push({ name: "Mis Rentas" })

            return this.submitted = false
        },

        getErrorMessage(fields) {
            if (this.form.errors.has(fields[0])||this.$validator.errors.has(fields[1])) {
                return this.form.errors.get(fields[0])||this.$validator.errors.first(fields[1])
            }
        },

        getEstadosInmuebleIndex(item) {
            return this.estadosInmueble.findIndex(estadoInmueble => estadoInmueble.id == item.id)
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
            return next.action()
        },

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

        handlePreviousStep(previous) {
            return previous.action()
        },

        handleSubmitForm() {
            this.submitted = true

            this.form.documentos = []
            this.handleEstadosInmueble()

            var url = app.apiUrl + "/rentas/" + this.$route.params.id
            return this.form.put(url)
                .then(()=> {
                    this.url = url

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

        mapEstadosInmuebleList,

        mapFormData(data) {
            return {
                documentos: [],
                estados_inmueble: [],
                observacion: data.observacion,
            }
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
    }
}
</script>
