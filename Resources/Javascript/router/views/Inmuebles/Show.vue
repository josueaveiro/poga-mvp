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
  <div class="bg-light">
    <form>
      <b-input
        v-model="form.id_direccion.latitud"
        :disabled="true"
        name="id_direccion.latitud"
        type="hidden"
      />
      <b-input
        v-model="form.id_direccion.longitud"
        :disabled="true"
        name="id_direccion.longitud"
        type="hidden"
      />
      <b-input
        v-model="form.id_propietario_referente"
        :disabled="true"
        type="hidden"
        name="id_propietario_referente"
      />

      <div class="columns is-gapless">
        <div class="bg-white column is-7">
          <b-steps
            v-model="activeStep"
            :disabled="true"
            class="p-md-5"
            :animated="true"
            :custom-navigation="true"
            :has-navigation="true"
          >
            <b-step-item
              label=""
              :clickable="true"
            >
              <h3 class="title mb-5 is-3">
                Donde se encuentra ubicado el inmueble
              </h3>

              <b-field grouped>
                <b-field
                  label="Calle principal"
                >
                  <b-input
                    v-model="form.id_direccion.calle_principal"
                    v-validate="'required'"
                    :disabled="true"
                    name="calle_principal"
                    size="is-medium"
                  />
                </b-field>

                <b-field label="Numeración">
                  <b-input
                    v-model="form.id_direccion.numeracion"
                    :disabled="true"
                    size="is-medium"
                  />
                </b-field>
              </b-field>

              <b-field label="Calle secundaria"> 
                <b-input
                  v-model="form.id_direccion.calle_secundaria"
                  :disabled="true"
                  size="is-medium"
                />
              </b-field>

              <b-field label="Ciudad">
                <b-input
                  v-model="form.id_direccion.ciudad"
                  :disabled="true"
                  size="is-medium"
                />
              </b-field>

              <b-field label="Departamento">
                <b-input
                  v-model="form.id_direccion.departamento"
                  :disabled="true"
                  size="is-medium"
                />
              </b-field>

              <div class="is-divider" />

              <h5 class="subtitle is-5">
                Mapa
              </h5>

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
                label="Nombre del Inmueble"
              >
                <b-input
                  v-model="form.nombre"
                  :disabled="true"
                  name="nombre"
                  size="is-medium"
                  type="text"
                  placeholder="Un nombre para el inmueble"
                />
              </b-field>

              <b-field
                label="Edificio para"
              >
                <b-input
                  :disabled="true"
                  name="formatos"
                  size="is-medium"
                  type="text"
                  placeholder="Edificio para"
                  :value="form.formatos.map(item => { return item.formato }).join(',')"
                />
              </b-field>

              <b-field
                label="Cantidad de pisos"
              >
                <b-input
                  v-model="form.cant_pisos"
                  :disabled="true"
                />
              </b-field>

              <div class="is-divider" />

              <b-field label="Reglamento de propiedad">
                <div
                  v-if="oneInmueble.id_inmueble.documentos"
                  class="content"
                >
                  <article
                    v-for="documento in oneInmueble.id_inmueble.documentos"
                    :key="documento.id"
                    class="media"
                  >
                    <figure class="media-left">
                      <p class="image is-64x64">
                        <img :src="documento.thumbnail">
                      </p>
                    </figure>
                    <div class="media-content">
                      <div class="content">
                        <p>
                          <a
                            :href="documento.url"
                            target="_blanck"
                          ><strong>{{ documento.name }} </strong></a> <small>Subido el</small> <small>{{ moment(documento.created_at).format("DD/MM/YYYY") }}</small>
                          <br>
                          Documento en formato PDF.
                        </p>
                      </div>
                    </div>
                  </article>
                </div>
  
                <div
                  v-else
                  class="content has-text-grey"
                >
                  <p>No hay documentos para descargar.</p>
                </div>
              </b-field>
            </b-step-item>

            <b-step-item
              label=""
              :visible="isEdificio"
            >
              <h3 class="subtitle is-3">
                Amenities del Edificio
              </h3>

              <div
                v-for="item in caracteristicasAmenities"
                :key="item.id"
              >
                <div
                  v-if="form.id_inmueble.caracteristicas[getCaracteristicasIndex(item.id_caracteristica.id)]"
                  class="field"
                >
                  <b-switch
                    :name="'id_inmueble.caracteristicas[' + item.id_caracteristica.id + ']'"
                    :value="true"
                    :disabled="true"
                  >
                    {{ item.id_caracteristica.nombre }}
                  </b-switch>
                </div>
              </div>
            </b-step-item>

            <b-step-item
              label=""
              :clickable="true"
              :visible="!isEdificio"
            >
              <h3 class="title mb-5 is-3">
                Comodidades ofrecidas
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
                      v-if="form.id_inmueble.caracteristicas[getCaracteristicasIndex(item.id_caracteristica.id)]"
                      :key="item.id"
                      class="field"
                    >
                      <b-switch
                        :value="true"
                        :name="'id_inmueble.caracteristicas[' + item.id_caracteristica.id + ']'"
                        :disabled="true"
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
                      v-if="form.id_inmueble.caracteristicas[getCaracteristicasIndex(item.id_caracteristica.id)]"
                      :key="item.id"
                      class="field"
                    >
                      <b-switch
                        :name="'id_inmueble.caracteristicas[' + item.id_caracteristica.id + ']'"
                        :value="true"
                        :disabled="true"
                      >
                        {{ item.id_caracteristica.nombre }}
                      </b-switch>
                    </div>
                  </b-field>
                </div>

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
                    v-if="form.id_inmueble.caracteristicas[getCaracteristicasIndex(item.id_caracteristica.id)]"
                    :key="item.id"
                    class="b-field"
                  >
                    <b-switch
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
                Descripción del Inmueble (opcional)
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

            <template
              slot="navigation"
              slot-scope="{previous, next}"
            >
              <div class="level">
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
                    :disabled="previous.disabled"
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
                    v-if="activeStep !== 3"
                    icon-pack="fas"
                    icon-right="chevron-right"
                    type="is-primary"
                    @click.prevent="handleNextStep(next)"
                  >
                    Siguiente
                  </b-button>
                  <b-button
                    v-if="activeStep === 3"
                    icon-pack="fas"
                    icon-right="chevron-right"
                    type="is-primary"
                    @click.prevent="$router.push({ name: 'Mis Inmuebles' })"
                  >
                    Volver a "Mis Inmuebles"
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
import { alertErrorMessage, deepClone } from "@/utilities/helpers"
import { authComputed } from "@/store/helpers"
import { caracteristicasTipoInmuebleComputed, caracteristicasTipoInmuebleMethods, formatosComputed, formatosMethods, inmueblesComputed, inmueblesMethods } from "@mvp/store/helpers"
import { gmaps } from "@/utilities/mixins/gmaps"
import { documentsMethods, photosMethods } from "@/store/helpers"
import { mapCaracteristicasTipoInmuebleList } from "@mvp/store/modules/caracteristicasTipoInmueble/actions"

import app from "@/app"
import moment from "moment"
import store from "@/store"

import Form from "@/utilities/Form"

var fields = deepClone(store.state.inmuebles.initialState.one)
fields.unidades.push(deepClone(store.state.unidades.initialState.one))

export default {
    mixins: [gmaps],

    data() {
        return {
            test: 0,
            fotos: [],
            activeStep: 0,
            form: new Form(fields),
            prepared: false,
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

        caracteristicasAmenities() {
            var caracteristicas = this.allCaracteristicasTipoInmueble.filter(c => c.id_tipo_inmueble == this.form.id_inmueble.id_tipo_inmueble && c.id_tipo_caracteristica == 2)

            return caracteristicas
        },

        filteredCaracteristicas() {
            var caracteristicas = this.allCaracteristicasTipoInmueble.filter(c => c.id_tipo_caracteristica == 2 && c.id_tipo_inmueble == this.oneInmueble.id_inmueble.id_tipo_inmueble.id)

            return caracteristicas
        },

        caracteristicasReglamentoPropiedad() {
            var caracteristicas = this.allCaracteristicasTipoInmueble.filter(c => c.id_tipo_inmueble == 1 && c.id_tipo_caracteristica == 5)

            return caracteristicas
        },

        formatosInmueble() {
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

        getCaracteristicasIndex(id) {
            return this.oneInmueble.id_inmueble.caracteristicas.findIndex(item => item.id === id)
        },

        handleNextStep(next) {
            return next.action()
        },

        handlePreviousStep(previous) {
            return previous.action()
        },

        initMap(el, options) {
            this.map = this.makeMap(el, options)

            var markerOptions = {
                draggable: false,
                map: this.map,
                position: options.center
            }

            this.marker = this.makeMarker(markerOptions)

            return Promise.resolve(this.map)
        },

        mapCaracteristicasTipoInmuebleList,

        mapFormData(data) {
            return {
                cant_pisos: data.cant_pisos,
                comision_administrador: data.comision_administrador,
                descripcion: data.descripcion,
                divisible_en_unidades: data.divisible_en_unidades,
                formatos: data.id_inmueble.formatos,
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
                    caracteristicas: data.id_inmueble.caracteristicas,
                    descripcion: data.id_inmueble.descripcion,
                    id_tipo_inmueble: data.id_inmueble.id_tipo_inmueble.id.toString(),
                    solicitud_directa_inquilinos: data.id_inmueble.solicitud_directa_inquilinos,
                    unfeatured_photo: data.id_inmueble.unfeatured_photos,
                },
                modalidad_propiedad: data.modalidad_propiedad,
                nombre: data.nombre,
            }
        },

        moment,

        prepare() {
            this.action = app.apiUrl + "/inmuebles/" + this.$route.params.id
            this.url = this.action

            var inmueble = this.fetchOneInmueble(this.$route.params.id)
            var formatos = this.fetchAllFormatos()

            return Promise.all([inmueble, formatos])
                .then(values => {
                    if (values[0]) {
                        inmueble = values[0]
                    }

                    return this.fetchAllCaracteristicasTipoInmueble()
                })
                .then(caracteristicasTipoInmueble => {
                    if (caracteristicasTipoInmueble) {
                        this.form = new Form(this.mapFormData(inmueble))

                        window.$(()=> {
                            this.initMap("map", { center: { lat: inmueble.id_direccion.latitud, lng: inmueble.id_direccion.longitud }, zoom: 14 })
                        })
                    }

                    return caracteristicasTipoInmueble
                })
                .catch(error => {
                    var message = error.data.message||error.message||error
                    if (error.status !== 422) {
                        alertErrorMessage("Perfil Público", message)
                    }

                    return  error
                })
        }
    }
}
</script>
