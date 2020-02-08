<style lang="scss">
.map {
  height: 20rem;
  width: 100%;
}

.step-content {
  min-height: 75vh;
}
</style>

<template>
  <div class="bg-light">
    <form>
      <b-input
        v-model="form.divisible_en_unidades"
        :disabled="submitted"
        name="divisible_en_unidades"
        type="hidden"
      />
      <b-input
        v-model="form.id_direccion.latitud"
        :disabled="submitted"
        name="id_direccion.latitud"
        type="hidden"
      />
      <b-input
        v-model="form.id_direccion.longitud"
        :disabled="submitted"
        name="id_direccion.longitud"
        type="hidden"
      />
      <b-input
        v-model="form.id_propietario_referente"
        :disabled="submitted"
        type="hidden"
        name="id_propietario_referente"
      />

      <div class="columns is-gapless">
        <div class="bg-white column is-7">
          <b-steps
            v-model="activeStep"
            :disabled="submitted"
            class="p-md-5"
            :animated="true"
            :custom-navigation="true"
            :has-navigation="true"
          >
            <!--<b-step-item
              label=""
              :clickable="true"
            >
              <h3 class="title mb-5 is-3">
                Actualiza la publicación de tu Inmueble
              </h3>
              <h6 class="title is-6">
                PASO 1
              </h6>
              <h5 class="subtitle is-4">
                ¿Qué tipo de inmueble tenés?
              </h5>

              <b-field>
                <b-radio-button
                  v-model="form.id_inmueble.id_tipo_inmueble"
                  :disabled="submitted"
                  native-value="2"
                >
                  <span>Casa</span>
                </b-radio-button>

                <b-radio-button
                  v-model="form.id_inmueble.id_tipo_inmueble"
                  :disabled="submitted"
                  native-value="1"
                >
                  <span>Departamento</span>
                </b-radio-button>
              </b-field>

              <b-field v-show="form.id_inmueble.id_tipo_inmueble == 1">
                <b-radio-button
                  v-model="form.modalidad_propiedad"
                  :disabled="submitted"
                  native-value="EN_CONDOMINIO"
                >
                  <span>En condominio</span>
                </b-radio-button>

                <b-radio-button
                  v-model="form.modalidad_propiedad"
                  :disabled="submitted"
                  native-value="UNICO_PROPIETARIO"
                >
                  <span>Único propietario</span>
                </b-radio-button>
              </b-field>
            </b-step-item>-->

            <b-step-item
              label=""
              :clickable="true"
            >
              <h3 class="title mb-5 is-3">
                ¿Dónde se encuentra ubicado el inmueble?
              </h3>

              <b-field>
                <b-button
                  icon="location"
                  size="is-medium"
                  :disabled="geolocating||submitted"
                  :type="[{ 'is-primary': true }, { 'is-loading': geolocating }]"
                  outlined
                  @click="handleReverseGeocoding()"
                >
                  Usá la ubicación actual
                </b-button>
              </b-field>

              <b-field label="Introduce una ubicación para autocompletar los campos">
                <b-input
                  id="autocomplete"
                  v-model="autocompleteSearch"
                  :disabled="submitted"
                  size="is-medium"
                  type="text"
                  @input="geolocate"
                />
              </b-field>

              <b-field grouped>
                <b-field
                  label="Calle principal *"
                  :message="getErrorMessage(['id_direccion.calle_principal', 'calle_principal'])"
                  :type="setFieldType(['id_direccion.calle_principal', 'calle_principal'])"
                >
                  <b-input
                    v-model="form.id_direccion.calle_principal"
                    v-validate="'required'"
                    :disabled="submitted"
                    data-vv-as="Calle principal"
                    name="calle_principal"
                    size="is-medium"
                  />
                </b-field>

                <b-field label="Numeración">
                  <b-input
                    v-model="form.id_direccion.numeracion"
                    :disabled="submitted"
                    size="is-medium"
                  />
                </b-field>
              </b-field>

              <b-field label="Calle secundaria"> 
                <b-input
                  v-model="form.id_direccion.calle_secundaria"
                  :disabled="submitted"
                  size="is-medium"
                />
              </b-field>

              <b-field label="Ciudad">
                <b-input
                  v-model="form.id_direccion.ciudad"
                  :disabled="submitted"
                  size="is-medium"
                />
              </b-field>

              <b-field label="Departamento">
                <b-input
                  v-model="form.id_direccion.departamento"
                  :disabled="submitted"
                  size="is-medium"
                />
              </b-field>
            </b-step-item>

            <b-step-item
              label=""
              :clickable="true"
            >
              <h3 class="subtitle is-3">
                ¿Está el marcador en el lugar correcto?
              </h3>
              <h4 class="subtitle is-4">
                Si es necesario, podés arrastrar el marcador hasta la ubicación correcta.
              </h4>

              <p class="mb-3">
                {{ autocompleteSearch }}
              </p>
              <div
                id="map"
                class="map mb-5"
              />
            </b-step-item>

            <b-step-item
              label=""
              :clickable="true"
            >
              <h3 class="title mb-5 is-3">
                Características generales {{ form.id_inmueble.id_tipo_inmueble == "1" ? "del Edificio" : "de la Casa" }}
              </h3>

              <b-field
                label="Nombre del edificio"
                :message="getErrorMessage(['nombre', 'nombre'])"
                :type="setFieldType(['nombre', 'nombre'])"
              >
                <b-input
                  v-model="form.nombre"
                  :disabled="submitted"
                  name="nombre"
                  type="text"
                  placeholder="Un nombre para el inmueble"
                />
              </b-field>

              <b-field
                label="Edificio para *"
                :message="getErrorMessage(['formatos', 'formatos'])"
                :type="setFieldType(['formatos', 'formatos'])"
              >
                <b-select
                  v-model="form.formatos"
                  v-validate="'required'"
                  :disabled="submitted"
                  data-vv-as="Formatos"
                  name="formatos"
                  expanded
                  multiple
                  placeholder="Seleccioná uno o más formatos"
                >
                  <option
                    v-for="item in allFormatos"
                    :key="item.id"
                    :value="item.id"
                  >
                    {{ item.formato }}
                  </option>
                </b-select>
              </b-field>

              <b-field
                label="Cantidad de pisos"
                :message="getErrorMessage(['cant_pisos', 'cant_pisos'])"
                :type="setFieldType(['cant_pisos', 'cant_pisos'])"
              >
                <b-numberinput
                  v-model="form.cant_pisos"
                  v-validate="'required'"
                  :disabled="submitted"
                  icon-pack="fas"
                  max="50"
                  min="1"
                  controls-rounded
                  required
                />
              </b-field>

              <div
                v-for="item in filteredCaracteristicas.filter(c => c.id_grupo_caracteristica == 3)"
                v-if="form.id_inmueble.id_tipo_inmueble == 2"
                :key="item.id"
                class="field"
              >
                <b-field :label="item.id_caracteristica.nombre">
                  <b-numberinput
                    v-model="caracteristicas[item.id]"
                    :disabled="submitted"
                    min="0"
                    icon-pack="fas"
                  />
                </b-field>
              </div>

              <div class="is-divider" />

              <b-field label="Reglamento de propiedad">
                <vue-dropzone
                  id="dzDocuments"
                  ref="dzDocuments"
                  :options="dzDocumentsOptions"
                  @vdropzone-error="dzDocumentsError"
                  @vdropzone-removed-file="dzDocumentsRemovedFile"
                  @vdropzone-processing="dzDocumentsProcessing"
                  @vdropzone-success-multiple="dzDocumentsSuccess"
                  @vdropzone-upload-progress="dzDocumentsUploadProgress"
                />
              </b-field>
            </b-step-item>

            <b-step-item
              label=""
              :visible="isEdificio"
            >
              <h3 class="subtitle is-3">
                Amenities del Edificio
              </h3>

              <b-field
                v-for="item in filteredCaracteristicas"
                :key="item.id"
                class="field"
              >
                <b-switch
                  v-model="caracteristicas[item.id]"
                  :name="'id_inmueble.caracteristicas[' + item.id + ']'"
                  :value="true"
                  :disabled="submitted"
                >
                  {{ item.id_caracteristica.nombre }}
                </b-switch>
              </b-field>
            </b-step-item>

            <b-step-item
              label=""
              :clickable="true"
              :visible="!isEdificio"
            >
              <h3 class="title mb-5 is-3">
                ¿Qué comodidades ofrecés?
              </h3>

              <div class="content">
                <div>
                  <h6 class="title is-6">
                    Electrodomésticos
                  </h6>
                  <b-field
                    grouped
                    group-multiline
                    class="mb-4"
                  >
                    <div
                      v-for="item in filteredCaracteristicas.filter(c => c.id_grupo_caracteristica == 1)"
                      :key="item.id"
                      class="field"
                    >
                      <b-switch
                        v-model="caracteristicas[item.id]"
                        :value="true"
                        :name="'id_inmueble.caracteristicas[' + item.id + ']'"
                        :disabled="submitted"
                      >
                        {{ item.id_caracteristica.nombre }}
                      </b-switch>
                    </div>
                  </b-field>
                </div>

                <div>
                  <h6 class="title is-6">
                    Amoblamiento
                  </h6>
                  <b-field
                    grouped
                    group-multiline
                    class="mb-4"
                  >
                    <div
                      v-for="item in filteredCaracteristicas.filter(c => c.id_grupo_caracteristica == 2)"
                      :key="item.id"
                      class="field"
                    >
                      <b-switch
                        v-model="caracteristicas[item.id]"
                        :name="'id_inmueble.caracteristicas[' + item.id + ']'"
                        :value="true"
                        :disabled="submitted"
                      >
                        {{ item.id_caracteristica.nombre }}
                      </b-switch>
                    </div>
                  </b-field>

                  <h6 class="title is-6">
                    Otros
                  </h6>
                  <b-field
                    grouped
                    group-multiline
                    class="mb-4"
                  >
                    <div
                      v-for="item in filteredCaracteristicas.filter(c => c.id_grupo_caracteristica == null)"
                      :key="item.id"
                      class="field"
                    >
                      <b-switch
                        v-model="caracteristicas[item.id]"
                        :name="'id_inmueble.caracteristicas[' + item.id + ']'"
                        :disabled="submitted"
                        :value="true"
                      >
                        {{ item.id_caracteristica.nombre }}
                      </b-switch>
                    </div>
                  </b-field>
                </div>
              </div>
            </b-step-item>

            <b-step-item
              label=""
              :clickable="true"
            >
              <h3 class="title mb-5 is-3">
                Descripción del Inmueble (opcional)
              </h3>

              <b-field
                label="Descripción"
              >
                <b-input
                  v-model="form.id_inmueble.descripcion"
                  :disabled="submitted"
                  type="textarea"
                />
              </b-field>
            </b-step-item>

            <b-step-item
              label=""
              :clickable="true"
            >
              <h3 class="title mb-5 is-3">
                ¡Lo estás haciendo genial, {{ user.id_persona.nombre }}!
              </h3>
              <h4 class="subtitle is-4">
                Antes de finalizar la actualización de tu inmueble podés hacer una revisión o editarlo posteriormente.
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
                Actualiza el Inmueble
              </b-button>
            </b-step-item>

            <template
              slot="navigation"
              slot-scope="{previous, next}"
            >
              <div class="level is-responsive">
                <div class="level-left">
                  <b-button
                    v-if="activeStep > 0"
                    :disabled="previous.disabled"
                    icon-pack="fas"
                    icon-left="chevron-left"
                    type="is-text"
                    @click.prevent="handlePreviousStep(previous)"
                  >
                    Anterior
                  </b-button>
                  <b-button
                    v-if="activeStep === 0"
                    icon-pack="fas"
                    icon-left="chevron-left"
                    type="is-text"
                    @click.prevent="$router.push({ name: 'Mis Inmuebles' })"
                  >
                    Volver a "Mis Inmuebles"
                  </b-button>
                </div>
                <div class="level-right">
                  <b-button
                    :disabled="next.disabled"
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
</template>

<script>
import { alertErrorMessage, alertSuccessMessage, deepClone, getSavedState, deleteSavedState, saveState } from "@/utilities/helpers"
import { authComputed } from "@/store/helpers"
import { caracteristicasTipoInmuebleComputed, caracteristicasTipoInmuebleMethods, formatosComputed, formatosMethods, inmueblesComputed, inmueblesMethods } from "@mvp/store/helpers"
import { dz } from "@/utilities/mixins/dz"
import { forEach } from "lodash"
import { gmaps } from "@/utilities/mixins/gmaps"
import { documentsMethods, photosMethods } from "@/store/helpers"
import { mapCaracteristicasTipoInmuebleList } from "@mvp/store/modules/caracteristicasTipoInmueble/actions"

import app from "@/app"
import store from "@/store"

import vue2Dropzone from "vue2-dropzone"
import "vue2-dropzone/dist/vue2Dropzone.min.css"

import Form from "@/utilities/Form"

var csrfToken = document.head.querySelector("meta[name=\"csrf-token\"]").content

var fields = deepClone(store.state.inmuebles.initialState.one)
fields.unidades.push(deepClone(store.state.unidades.initialState.one))

var token = getSavedState("auth.token")

export default {
    components: {
        VueDropzone: vue2Dropzone
    },

    mixins: [dz, gmaps],

    data() {
        return {
            action: app.apiUrl + "/inmuebles",
            activeStep: 0,
            caracteristicas: [],
            dzDocumentsOptions: {
                addRemoveLinks: true,
                autoProcessQueue: false,
                dictDefaultMessage: "<i class='fa fa-cloud-upload'></i><br/>Hacé click o arrastrá una o más documentos hacía acá",
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
                url: app.apiUrl + "/inmuebles",
            },
            form: new Form(fields),
            inmueblePadre: null,
            isDestroying: false,
            method: "put",
            prepared: false,
            submitted: false,
            url: app.apiUrl + "/inmuebles"
        }
    },

    computed: {
        ...authComputed,
        ...caracteristicasTipoInmuebleComputed,
        ...formatosComputed,
        ...inmueblesComputed,

        addressForm() {
            return this.form.id_direccion
        },

        filteredCaracteristicas() {
            var caracteristicas = this.allCaracteristicasTipoInmueble.filter(c => c.id_tipo_inmueble == this.form.id_inmueble.id_tipo_inmueble && c.id_tipo_caracteristica == 2)

            return caracteristicas
        },

        filteredFormatos() {
            return this.allFormatos.map(item => { return { id: item.id, formato: item.formato }})
                .filter(i => this.form.formatos.includes(i.id))
        },

        isEdificio() {
            return this.form.id_inmueble.id_tipo_inmueble === "1"
        },

        pickedAddressComponents() {
            return {
                street_number: ["numeracion", "short_name"],
                route: ["calle_principal", "long_name"],
                administrative_area_level_2: ["ciudad", "long_name"],
                administrative_area_level_1: ["departamento", "long_name"],
            }
        }
    },

    watch: {
        "$route" (value) {
            if (value.name === "Editar Inmueble") {
                this.prepare()
            }
        },

        activeStep (value) {
            if (value === 1)  {
                this.initMap("map", { center: this.geolocation, zoom: 14 })
            }
        }
    },

    beforeDestroy() {
        this.isDestroying = true
    },

    created() {
        return this.prepare().then(this.prepared = true)
    },

    methods: {
        ...caracteristicasTipoInmuebleMethods,
        ...documentsMethods,
        ...formatosMethods,
        ...inmueblesMethods,
        ...photosMethods,

        dzDocumentsSuccess() {
            alertSuccessMessage("Actualiza un Inmueble", "El inmueble fue actualizado.")

            this.$router.push({ name: "Mis Inmuebles" })

            return this.submitted = false
        },

        getCaracteristicasIndex(id) {
            return this.oneInmueble.id_inmueble.caracteristicas.findIndex(item => item.id === id)
        },

        getErrorMessage(fields) {
            if (this.form.errors.has(fields[0])||this.$validator.errors.has(fields[1])) {
                return this.form.errors.get(fields[0])||this.$validator.errors.first(fields[1])
            }
        },

        handleCaracteristicas() {
            var caracteristica, nonEmptyCaracteristicas = []

            var entries = Object.entries(this.caracteristicas).filter(entry => entry[1])

            entries.forEach(entry => {
                caracteristica = this.allCaracteristicasTipoInmueble.find(c => c.id == entry[0])
                if (caracteristica) {
                    if (caracteristica.enum_tipo_campo === "number") {
                        caracteristica.id_caracteristica.cantidad = entry[1]
                        nonEmptyCaracteristicas.push(caracteristica)
                    } else {
                        caracteristica.id_caracteristica.cantidad = null
                        nonEmptyCaracteristicas.push(caracteristica)
                    }
                }
            })

            this.form.caracteristicas = nonEmptyCaracteristicas
        },

        handleNextStep(next) {
            switch (this.activeStep) {
            case 0:
                return this.validateAll(["calle_principal"], next)
            case 1:
                return next.action()
            case 2:
                return this.validateAll(["nombre", "formatos", "cant_pisos"], next)
            case 3:
                return next.action()
            case 4:
                return next.action()
            case 5:
                return next.action()
            case 6:
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

            this.form.documentos = []
            this.form.unfeatured_photos = []

            this.handleCaracteristicas()

            return this.form[this.method](this.action)
                .then(response => {
                    this.dzDocumentsProcessQueue()

                    return this.submitted = false
                })
                .catch(error => {
                    var message = error.data.message||error.message||error
                    if (error.status > 422) {
                        alertErrorMessage("Actualiza un Inmueble", message)
                    }

                    return this.submitted = false
                })
        },

        mapCaracteristicasTipoInmuebleList,

        mapFormData(data) {
            return {
                cant_pisos: data.cant_pisos,
                caracteristicas: [],
                comision_administrador: data.comision_administrador,
                descripcion: data.descripcion,
                divisible_en_unidades: data.divisible_en_unidades,
                formatos: data.id_inmueble.formatos.map(item => { return item.id }),
                id_direccion: {
                    calle_principal: data.id_direccion.calle_principal,
                    calle_secundario: data.id_direccion.calle_secundaria,
                    ciudad: data.id_direccion.ciudad,
                    departamento: data.id_direccion.departamento,
                    latitud: data.id_direccion.latitud,
                    longitud: data.id_direccion.longitud,
                    numeracion: data.id_direccion.numeracion
                },
                id_inmueble: {
                    descripcion: data.id_inmueble.descripcion,
                    documentos: [],
                    featured_photo: {},
                    id_tipo_inmueble: data.id_inmueble.id_tipo_inmueble.id.toString(),
                    solicitud_directa_inquilinos: data.id_inmueble.solicitud_directa_inquilinos,
                    unfeatured_photos: []
                },
                modalidad_propiedad: data.modalidad_propiedad,
                nombre: data.nombre,
            }
        },

        updateAddressAndMapFormsCoordinates(coordinates) {
            this.form.id_direccion.latitud = coordinates.lat
            this.form.id_direccion.longitud = coordinates.lng
        },

        prepare() {
            this.action = app.apiUrl + "/inmuebles/" + this.$route.params.id
            this.url = this.action

            this.geolocate()
                .then(window.$(()=> {
                    this.initAutocomplete("autocomplete", { types: ["geocode"] })
                    this.initMap("map", { center: this.geolocation, zoom: 14 })
            
                    return
                }))

            var inmueble = this.fetchOneInmueble(this.$route.params.id)
            var formatos = this.fetchAllFormatos()

            return Promise.all([inmueble, formatos])
                .then(values => {
                    if (values[0] && values[1]) {
                        inmueble = values[0]
                    }

                    return this.fetchAllCaracteristicasTipoInmueble({ id_tipo_inmueble: inmueble.id_inmueble.id_tipo_inmueble.id })
                })
                .then(caracteristicasTipoInmueble => {
                    if (caracteristicasTipoInmueble) {
                        this.caracteristicas = mapCaracteristicasTipoInmuebleList(caracteristicasTipoInmueble, inmueble.id_inmueble.caracteristicas)
                        this.form = new Form(this.mapFormData(inmueble))

                        if (inmueble.id_inmueble.documentos) {
                            this.dzDocumentsMounted(inmueble.id_inmueble.documentos)
                        }
                    }

                    return caracteristicasTipoInmueble
                })
        },

        setFieldType(fields) {
            if (this.form.errors.has(fields[0]) || this.$validator.errors.has(fields[1])) {
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
