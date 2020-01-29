<style lang="scss" scoped>
.map {
  height: 20rem;
  width: 100%;
}

.VueCarousel-slide img {
  height: 20rem;
  width: 100%;
  object-fit: cover;
}
</style>

<template>
  <section class="bg-light">
    <carousel
      :scroll-per-page="true"
      :per-page-custom="[[375, 1], [768, 3]]"
    >
      <slide v-if="oneUnidad.id_inmueble.featured_photo">
        <img :src="oneUnidad.id_inmueble.featured_photo.url">
      </slide>
      <slide v-for="photo in oneUnidad.id_inmueble.unfeatured_photos">
        <img :src="photo.url">
      </slide>
    </carousel>
    <div class="container py-5">
      <div class="columns box">
        <div class="column is-7">
          <p class="has-text-primary mb-3">
            {{ oneUnidad.id_inmueble.direccion }}
          </p>
          <h2 class="title is-2">
            {{ oneUnidad.id_inmueble_padre.nombre }}
          </h2>
          <h4 class="subtitle is-4">
            {{ oneUnidad.id_inmueble.tipo }}
          </h4>
          <div class="mb-3">
            <div class="level">
              <div class="level-left">
                <div class="level-item">
                  Estacionamientos: {{ oneUnidad.id_inmueble.caracteristicas[getCaracteristicasIndex(53)] ? oneUnidad.id_inmueble.caracteristicas[getCaracteristicasIndex(53)].pivot.cantidad : '0' }}
                </div>
                <div class="level-item">
                  Habitaciones: {{ oneUnidad.id_inmueble.caracteristicas[getCaracteristicasIndex(54)] ? oneUnidad.id_inmueble.caracteristicas[getCaracteristicasIndex(54)].pivot.cantidad : '0' }}
                </div>
                <div class="level-item">
                  Baños: {{ oneUnidad.id_inmueble.caracteristicas[getCaracteristicasIndex(59)] ? oneUnidad.id_inmueble.caracteristicas[getCaracteristicasIndex(59)].pivot.cantidad : '0' }}
                </div>
                <div class="level-item">
                  Área cubierta: {{ oneUnidad.area }} {{ oneUnidad.id_medida.tipo }}
                </div>
              </div>
            </div>
          </div>
    
          <hr>
          <h4 class="title is-4">
            Descripción
          </h4>
          <p v-if="oneUnidad.id_inmueble.descripcion">
            {{ oneUnidad.id_inmueble.descripcion }}
          </p>
          <div
            v-else
            class="has-text-grey"
          >
            <p>No hay una descripción para mostrar.</p>
          </div>

          <hr>

          <div>
            <h4 class="title is-4">
              Amenities del Edificio
            </h4>
            <b-taglist
              v-if="oneUnidad.id_inmueble_padre.id_inmueble.caracteristicas.filter(c => c.id_grupo_caracteristica == null).length > 0"
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

          <hr>
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
import { authComputed } from "@/store/helpers"
import { caracteristicasTipoInmuebleComputed, caracteristicasTipoInmuebleMethods, formatosComputed, formatosMethods, unidadesComputed, unidadesMethods } from "@mvp/store/helpers"
import { deepClone } from "@/utilities/helpers"
import { gmaps } from "@/utilities/mixins/gmaps"
import { mapCaracteristicasTipoInmuebleList } from "@mvp/store/modules/caracteristicasTipoInmueble/actions"

import app from "@/app"
import moment from "moment"
import store from "@/store"

var fields = deepClone(store.state.unidades.initialState.one)

export default {
    mixins: [gmaps],

    data() {
        return {
            prepared: false,
            url: app.apiUrl + "/inmuebles"
        }
    },

    computed: {
        ...authComputed,
        ...caracteristicasTipoInmuebleComputed,
        ...formatosComputed,
        ...unidadesComputed,

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
            return this.oneUnidad.id_inmueble.id_tipo_inmueble.id == 1
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
        ...unidadesMethods,

        getCaracteristicasIndex(index) {
            return this.oneUnidad.id_inmueble.caracteristicas.findIndex(item => item.id === index)
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

        moment,

        prepare() {
            var unidad = this.fetchOneUnidad(this.$route.params.id)

            return Promise.all([unidad])
                .then(values => {
                    if (values[0]) {
                        this.fetchAllCaracteristicasTipoInmueble({ id_tipo_inmueble: values[0].id_inmueble.id_tipo_inmueble.id })
                    }

                    return unidad
                })
                .then(unidad => {
                    window.$(()=> {
                        this.initMap("map", { center: { lat: unidad.id_inmueble_padre.id_direccion.latitud, lng: unidad.id_inmueble_padre.id_direccion.longitud }, zoom: 14 })

                        return
                    })
                })
        }
    }
}
</script>
