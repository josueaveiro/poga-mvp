<style lang="scss" scoped>
.map {
  height: 20rem;
  width: 100%;
}

.VueCarousel-slide img {
  min-height: 20rem;
}
</style>

<template>
  <section class="bg-light">
    <carousel
      :scroll-per-page="true"
      :per-page-custom="[[375, 1], [768, 3]]"
    >
      <slide v-if="oneInmueble.id_inmueble.featured_photo">
        <img :src="oneInmueble.id_inmueble.featured_photo.url">
      </slide>
      <slide
        v-for="photo in oneInmueble.id_inmueble.unfeatured_photos"
        :key="photo.id"
      >
        <img :src="photo.url">
      </slide>
    </carousel>
    <div class="container py-5">
      <div class="columns box">
        <div class="column is-7">
          <p class="has-text-primary mb-3">
            {{ oneInmueble.id_inmueble.direccion }}
          </p>
          <h2 class="title is-2">
            {{ oneInmueble.nombre }}
          </h2>
          <h4 class="subtitle is-4">
            {{ oneInmueble.id_inmueble.tipo }}
          </h4>
          <div
            v-if="!isEdificio"
            class="mb-3"
          >
            <div class="level">
              <div class="level-left">
                <div class="level-item">
                  Estacionamientos: {{ oneInmueble.id_inmueble.caracteristicas[getCaracteristicasIndex(56)] ? oneInmueble.id_inmueble.caracteristicas[getCaracteristicasIndex(56)].pivot.cantidad : '0' }}
                </div>
                <div class="level-item">
                  Habitaciones: {{ oneInmueble.id_inmueble.caracteristicas[getCaracteristicasIndex(54)] ? oneInmueble.id_inmueble.caracteristicas[getCaracteristicasIndex(54)].pivot.cantidad : '0' }}
                </div>
                <div class="level-item">
                  Baños: {{ oneInmueble.id_inmueble.caracteristicas[getCaracteristicasIndex(59)] ? oneInmueble.id_inmueble.caracteristicas[getCaracteristicasIndex(59)].pivot.cantidad : '0' }}
                </div>
                <div class="level-item">
                  Área cubierta: {{ oneInmueble.id_inmueble.area }} {{ oneInmueble.id_inmueble.id_medida.tipo }}
                </div>
              </div>
            </div>
          </div>
    
          <hr>
          <h4 class="title is-4">
            Descripción
          </h4>
          <p v-if="oneInmueble.id_inmueble.descripcion">
            {{ oneInmueble.id_inmueble.descripcion }}
          </p>
          <div
            v-else
            class="has-text-grey"
          >
            <p>No hay una descripción para mostrar.</p>
          </div>

          <hr>

          <div v-if="isEdificio">
            <h4 class="title is-4">
              Amenities
            </h4>
            <b-taglist
              v-if="caracteristicasComodidades.filter(c => c.id_grupo_caracteristica == null).length > 0"
              class="mb-4"
            >
              <b-tag
                v-for="item in caracteristicasComodidades.filter(c => c.id_grupo_caracteristica == null)"
                :key="item.id"
                class="is-primary"
              >
                {{ item.id_caracteristica.nombre }}
              </b-tag>
            </b-taglist>

            <div
              v-else
              class="has-text-grey"
            >
              <p>No hay caracteristicas para mostrar.</p>
            </div>
          </div>

          <h4 class="title is-4">
            Comodidades
          </h4>
          <div v-if="!isEdificio">
            <h6 class="title is-6">
              Electrodomésticos
            </h6>
            <b-taglist
              v-if="caracteristicasComodidades.filter(c => c.id_grupo_caracteristica == 1).length > 0"
              class="mb-4"
            >
              <b-tag
                v-for="item in caracteristicasComodidades.filter(c => c.id_grupo_caracteristica == 1)"
                :key="item.id"
                class="is-primary"
              >
                {{ item.id_caracteristica.nombre }}
              </b-tag>
            </b-taglist>

            <div
              v-else
              class="has-text-grey"
            >
              <p>No hay caracteristicas para mostrar.</p>
            </div>
          </div>

          <div v-if="!isEdificio">
            <h6 class="title is-6">
              Amoblamiento
            </h6>
            <b-taglist
              v-if="caracteristicasComodidades.filter(c => c.id_grupo_caracteristica == 2).length > 0"
              class="mb-4"
            >
              <b-tag
                v-for="item in caracteristicasComodidades.filter(c => c.id_grupo_caracteristica == 2)"
                :key="item.id"
                class="is-primary"
              >
                {{ item.id_caracteristica.nombre }}
              </b-tag>
            </b-taglist>
    
            <div
              v-else
              class="has-text-grey"
            >
              <p>No hay caracteristicas para mostrar.</p>
            </div>
          </div>

          <h6 class="title is-6">
            Otros
          </h6>
          <b-taglist
            v-if="caracteristicasComodidades.filter(c => c.id_grupo_caracteristica == null).length > 0"
            class="mb-4"
          >
            <b-tag
              v-for="item in caracteristicasComodidades.filter(c => c.id_grupo_caracteristica == null)"
              :key="item.id"
              class="is-primary"
            >
              {{ item.id_caracteristica.nombre }}
            </b-tag>
          </b-taglist>
          <div
            v-else
            class="has-text-grey"
          >
            <p>No hay caracteristicas para mostrar.</p>
          </div>

          <hr>
          <h3 class="title is-3">
            Ubicación en el mapa
          </h3>
          <div
            id="map"
            class="map"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { alertErrorMessage } from "@/utilities/helpers"
import { authComputed } from "@/store/helpers"
import { caracteristicasTipoInmuebleComputed, caracteristicasTipoInmuebleMethods, formatosComputed, formatosMethods, inmueblesComputed, inmueblesMethods } from "@mvp/store/helpers"
import { deepClone } from "@/utilities/helpers"
import { gmaps } from "@/utilities/mixins/gmaps"
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

        caracteristicasComodidades() {
            var caracteristicas = this.allCaracteristicasTipoInmueble.filter(c => c.id_tipo_caracteristica == 2)

            return caracteristicas
        },

        formatosInmueble() {
            return this.allFormatos.map(item => { return { id: item.id, formato: item.formato }})
                .filter(i => this.form.formatos.includes(i.id))
        },

        isEdificio() {
            return this.oneInmueble.id_inmueble.id_tipo_inmueble.id == 1
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
        ...formatosMethods,
        ...inmueblesMethods,

        getCaracteristicasIndex(index) {
            return this.oneInmueble.id_inmueble.caracteristicas.findIndex(item => item.id === index)
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
                    caracteristicas: mapCaracteristicasTipoInmuebleList(this.allCaracteristicasTipoInmueble.filter(item => item.id_tipo_inmueble == data.id_inmueble.id_tipo_inmueble.id), data.id_inmueble.caracteristicas),
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
                        this.fetchAllCaracteristicasTipoInmueble({ id_tipo_inmueble: values[0].id_inmueble.id_tipo_inmueble.id })
                    }

                    return values[0]
                })
                .then(inmueble => {
                    this.form = new Form(this.mapFormData(inmueble))

                    window.$(()=> {
                        this.initMap("map", { center: { lat: inmueble.id_direccion.latitud, lng: inmueble.id_direccion.longitud }, zoom: 14 })
                    })

                    return inmueble
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
