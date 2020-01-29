<style lang="scss">
.map {
  height: 20rem;
  width: 100%;
}

.step-content {
  min-height: 75vh;
}

.b-radio.radio.button[disabled],
.switch[disabled] {
  opacity: 1;
}

[disabled].radio {
  color: unset;
}
</style>

<template>
  <section class="bg-light">
    <form>
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
            <b-step-item
              label=""
            >
              <h5 class="subtitle is-4">
                Características generales del Departamento
              </h5>

              <b-field
                grouped
                group-multiline
              >
                <b-field
                  label="Piso"
                  :message="getErrorMessage(['piso', 'piso'])"
                  :type="setFieldType(['piso', 'piso'])"
                >
                  <b-input
                    v-model="form.piso"
                    v-validate="'required|numeric'"
                    data-vv-as="Piso"
                    name="piso"
                    :disabled="true"
                    :max="form.cant_pisos"
                    min="0"
                    type="number"
                  />
                </b-field>

                <b-field
                  label="Número"
                  :message="getErrorMessage(['numero', 'numero'])"
                  :type="setFieldType(['numero', 'numero'])"
                >
                  <b-input
                    v-model="form.numero"
                    v-validate="'required'"
                    :disabled="true"
                    name="numero"
                    data-vv-as="Numero"
                    type="text"
                  />
                </b-field>
              </b-field>

              <b-field
                label="Metros cuadrados"
                :message="getErrorMessage(['area', 'area'])"
                :type="setFieldType(['area', 'area'])"
              >
                <b-input
                  v-model="form.area"
                  v-validate="'required|min_value:15'"
                  :disabled="true"
                  name="area"
                  data-vv-as="Metros cuadrados"
                  min="15"
                  type="number"
                />
              </b-field>

              <b-field
                label="Formato *"
                :message="getErrorMessage(['id_formato_inmueble', 'id_formato_inmueble'])"
                :type="setFieldType(['id_formato_inmueble', 'id_formato_inmueble'])"
              >
                <b-select
                  v-model="form.id_formato_inmueble"
                  v-validate="'required'"
                  :disabled="true"
                  data-vv-as="Formato"
                  name="id_formato_inmueble"
                  expanded
                  placeholder="Seleccioná un formato"
                >
                  <option
                    v-for="item in filteredFormatos"
                    :key="item.id"
                    :value="item.id"
                  >
                    {{ item.formato }}
                  </option>
                </b-select>
              </b-field>

              <div
                v-for="item in filteredCaracteristicas.filter(c => c.id_grupo_caracteristica == 3)"
                :key="item.id"
                class="field"
              >
                <b-field :label="item.id_caracteristica.nombre">
                  <b-numberinput
                    v-model="form.id_inmueble.caracteristicas[item.id_caracteristica.id]"
                    :name="'id_inmueble.caracteristicas[' + item.id_caracteristica.id + ']'"
                    :disabled="true"
                    min="0"
                    icon-pack="fas"
                  />
                </b-field>
              </div>
            </b-step-item>

            <b-step-item
              label=""
              :clickable="true"
            >
              <h3 class="title mb-5 is-3">
                Comodidades ofrecidas
              </h3>

              <div class="content">
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
                      v-if="caracteristicas[item.id_caracteristica.id]"
                      v-model="caracteristicas[item.id_caracteristica.id]"
                      :name="'id_inmueble.caracteristicas[' + item.id_caracteristica.id + ']'"
                      :value="true"
                      :disabled="true"
                    >
                      {{ item.id_caracteristica.nombre }}
                    </b-switch>
                  </div>
                </b-field>

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
                      v-if="caracteristicas[item.id_caracteristica.id]"
                      v-model="caracteristicas[item.id_caracteristica.id]"
                      :name="'id_inmueble.caracteristicas[' + item.id_caracteristica.id + ']'"
                      :value="true"
                      :disabled="true"
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
                      v-if="caracteristicas[item.id_caracteristica.id]"
                      v-model="caracteristicas[item.id_caracteristica.id]"
                      :name="'id_inmueble.caracteristicas[' + item.id_caracteristica.id + ']'"
                      :value="true"
                      :disabled="true"
                    >
                      {{ item.id_caracteristica.nombre }}
                    </b-switch>
                  </div>
                </b-field>
              </div>
            </b-step-item>

            <b-step-item
              label=""
              :clickable="true"
            >
              <h3 class="title mb-5 is-3">
                Descripción
              </h3>
              <b-field
                label="Descripción"
              >
                <b-input
                  v-model="form.id_inmueble.descripcion"
                  :disabled="true"
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
              <h5 class="subtitle mb-5 is-4">
                Texto descriptivo...
              </h5>

              <b-button
                size="is-large"
                type="is-link"
                native-type="button"
                @click="activeStep = 0"
              >
                Revisar desde el principio
              </b-button>

              <div
                class="is-divider"
                data-content="O"
              />

              <b-button
                native-type="button"
                size="is-large"
                type="is-primary"
                @click="$router.push({ name: 'Mis Inmuebles' })"
              >
                Volver a "Mis Inmuebles"
              </b-button>
            </b-step-item>

            <template
              slot="navigation"
              slot-scope="{previous, next}"
            >
              <div class="level">
                <div class="level-left">
                  <b-button
                    :disabled="previous.disabled"
                    icon-pack="fas"
                    icon-left="chevron-left"
                    type="is-text"
                    @click.prevent="handlePreviousStep(previous)"
                  >
                    Anterior
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
  </section>
</template>

<script>
import app from "@/app"
import { alertErrorMessage, alertSuccessMessage, deepClone, getSavedState, deleteSavedState, saveState } from "@/utilities/helpers"
import { authComputed } from "@/store/helpers"
import { caracteristicasTipoInmuebleComputed, caracteristicasTipoInmuebleMethods, formatosComputed, formatosMethods, unidadesComputed, unidadesMethods } from "@mvp/store/helpers"
import { dz } from "@/utilities/mixins/dz"
import { documentsMethods, photosMethods } from "@/store/helpers"
import { mapCaracteristicasTipoInmuebleList } from "@mvp/store/modules/caracteristicasTipoInmueble/actions"
import { mapFormatosList } from "@mvp/store/modules/formatos/actions"

import store from "@/store"

import vue2Dropzone from "vue2-dropzone"
import "vue2-dropzone/dist/vue2Dropzone.min.css"

import Form from "@/utilities/Form"

var csrfToken = document.head.querySelector("meta[name=\"csrf-token\"]").content

var fields = deepClone(store.state.unidades.initialState.one)
fields.id_inmueble_padre = {
    id_inmueble: {
        formatos: []
    }
}

var token = getSavedState("auth.token")

export default {
    components: {
        VueDropzone: vue2Dropzone
    },

    mixins: [dz],

    data() {
        return {
            action: app.apiUrl + "/unidades",
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
                url: app.apiUrl + "/unidades"
            },
            dzUnfeaturedPhotosOptions: {
                addRemoveLinks: true,
                autoProcessQueue: false,
                dictDefaultMessage: "<i class='fa fa-cloud-upload'></i><br/>Hacé click o arrastrá una o más fotos hacía acá",
                headers: {
                    "X-CSRF-TOKEN": csrfToken,
                    "Authorization": "Bearer " + token
                },
                maxFiles: 8,
                maxFilesize: 1,
                method: "put",
                parallelUploads: 8,
                paramName: "unfeatured_photos",
                uploadMultiple: true,
                url: app.apiUrl + "/unidades"
            },
            form: new Form(fields),
            formatos: [],
            isDestroying: false,
            method: "put",
            prepared: false,
            submitted: false,
            url: app.apiUrl + "/unidades"
        }
    },

    computed: {
        ...authComputed,
        ...caracteristicasTipoInmuebleComputed,
        ...formatosComputed,
        ...unidadesComputed,

        filteredCaracteristicas() {
            return this.allCaracteristicasTipoInmueble.filter(c => c.id_tipo_inmueble == this.form.id_inmueble.id_tipo_inmueble && c.id_tipo_caracteristica == 2)
        },

        filteredFormatos() {
            return mapFormatosList(this.allFormatos)
                .filter(item => this.formatos.map(i => { return i.pivot.id_formato }).includes(item.id))
        }
    },

    watch: {
        "$route" (value) {
            if (value.name === "Editar Inmueble" && this.prepared) {
                this.prepare()
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
        ...photosMethods,
        ...unidadesMethods,

        dzUnfeaturedPhotosSuccess() {
            alertSuccessMessage("Actualiza un Inmueble", "Tu " + this.oneUnidad.id_inmueble.id_tipo_inmueble.tipo + " fue actualizado.")

            this.$router.push({ name: "Mis Inmuebles" })

            return this.submitted = false
        },

        formatDireccion() {
            this.direccion = this.form.id_direccion.calle_principal + "," + this.form.id_direccion.numeracion + "," + this.form.id_direccion.calle_secundaria
        },

        getErrorMessage(fields) {
            if (this.form.errors.has(fields[0])||this.$validator.errors.has(fields[1])) {
                return this.form.errors.get(fields[0])||this.$validator.errors.first(fields[1])
            }
        },

        handleCaracteristicas() {
            var caracteristica, nonEmptyCaracteristicas = []

            Object.entries(this.caracteristicas).forEach(item => {
                caracteristica = this.allCaracteristicasTipoInmueble.find(c => c.id_caracteristica.id == item[0])
                console.log(caracteristica)

                if (caracteristica.enum_tipo_campo === "number") {
                    caracteristica.id_caracteristica.cantidad = item[1]
                    nonEmptyCaracteristicas.push(caracteristica)
                } else {
                    caracteristica.id_caracteristica.cantidad = null
                    nonEmptyCaracteristicas.push(caracteristica)
                }
            })

            this.form.caracteristicas = nonEmptyCaracteristicas
        },

        handleNextStep(next) {
            switch (this.activeStep) {
            case 0:
                return next.action()
            case 1:
                return this.validateAll(["calle_principal"], next)
            case 2:
                return next.action()
            case 3:
                return this.validateAll(["nombre", "formatos", "cant_pisos"], next)
            case 4:
                return next.action()
            case 5:
                return this.validateAll(["piso", "numero", "area", "id_formato_inmueble"], next)
            case 6:
                return next.action()
            case 7:
                return next.action()
            default:
                return false
            }
        },

        handlePreviousStep(previous) {
            return previous.action()
        },

        mapCaracteristicasTipoInmuebleList,

        mapFormData(data) {
            var map = {
                area: data.area,
                area_estacionamiento: data.area_estacionamiento,
                id_formato_inmueble: data.id_formato_inmueble.id_formato.id,
                id_inmueble: {
                    caracteristicas: mapCaracteristicasTipoInmuebleList(this.allCaracteristicasTipoInmueble.filter(item => item.id_tipo_inmueble == data.id_inmueble.id_tipo_inmueble.id), data.id_inmueble.caracteristicas),
                    descripcion: data.id_inmueble.descripcion,
                    unfeatured_photos: data.id_inmueble.unfeatured_photos,
                    id_tipo_inmueble: data.id_inmueble.id_tipo_inmueble.id,
                    solicitud_directa_inquilinos: data.id_inmueble.solicitud_directa_inquilinos
                },
                id_medida: data.id_medida.id,
                numero: data.numero,
                piso: data.piso
            }

            return map
        },

        prepare() {
            var unidad = this.fetchOneUnidad(this.$route.params.id)
            var caracteristicasTipoInmueble = this.fetchAllCaracteristicasTipoInmueble()
            var formatos = this.fetchAllFormatos()

            return Promise.all([unidad, caracteristicasTipoInmueble, formatos])
                .then(values => {
                    if (values[0] && values[1]) {
                        this.caracteristicas = mapCaracteristicasTipoInmuebleList(values[1].filter(item => item.id_tipo_inmueble == values[0].id_inmueble.id_tipo_inmueble.id), values[0].id_inmueble.caracteristicas)
                        this.formatos = values[0].id_inmueble_padre.id_inmueble.formatos
                        this.form = new Form(this.mapFormData(values[0]))

                        if (values[0].id_inmueble.unfeatured_photos) {
                            this.dzUnfeaturedPhotosMounted(values[0].id_inmueble.unfeatured_photos)
                        }
                    }

                    return values
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
