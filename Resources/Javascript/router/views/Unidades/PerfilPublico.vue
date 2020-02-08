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

          <h4 class="title is-4">
            Amenities
          </h4>
          <b-taglist
            v-if="oneUnidad.id_inmueble_padre.id_inmueble.caracteristicas.filter(c => c.id_tipo_caracteristica == 2 && c.id_grupo_caracteristica == null)"
            class="mb-4"
          >
            <div
              v-for="item in oneUnidad.id_inmueble_padre.id_inmueble.caracteristicas.filter(c => c.id_tipo_caracteristica == 2 && c.id_grupo_caracteristica == null)"
              :key="item.id"
            >
              <b-tag
                class="is-primary mr-2"
              >
                {{ item.nombre }}
              </b-tag>
            </div>
          </b-taglist>

          <div
            v-else
            class="has-text-grey"
          >
            <p>No hay amenities para mostrar.</p>
          </div>

          <hr>
          <h4 class="title is-4">
            Comodidades
          </h4>
          <div>
            <h6 class="title is-6">
              Electrodomésticos
            </h6>
            <b-taglist
              v-if="filteredCaracteristicas.filter(c => c.id_grupo_caracteristica == 1)"
              class="mb-4"
            >
              <b-tag
                v-for="item in filteredCaracteristicas.filter(c => c.id_grupo_caracteristica == 1)"
                :key="item.id"
                v-if="oneUnidad.id_inmueble.caracteristicas[getCaracteristicasIndex(item.id_caracteristica.id)]"
                class="is-primary mr-2"
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

          <div>
            <h6 class="title is-6">
              Amoblamiento
            </h6>
            <b-taglist
              v-if="filteredCaracteristicas.filter(c => c.id_grupo_caracteristica == 2)"
              class="mb-4"
            >
              <b-tag
                v-for="item in filteredCaracteristicas.filter(c => c.id_grupo_caracteristica == 2)"
                v-if="oneUnidad.id_inmueble.caracteristicas[getCaracteristicasIndex(item.id_caracteristica.id)]"
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
            v-if="filteredCaracteristicas.filter(c => c.id_grupo_caracteristica == null)"
            class="mb-4"
          >
            <b-tag
              v-if="oneUnidad.id_inmueble.caracteristicas[getCaracteristicasIndex(item.id_caracteristica.id)]"
              v-for="item in filteredCaracteristicas.filter(c => c.id_grupo_caracteristica == null)"
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
import { gmaps } from "@/utilities/mixins/gmaps"

import moment from "moment"

export default {
    mixins: [gmaps],

    data() {
        return {
            prepared: false,
            title: "Perfil Público",
        }
    },

    computed: {
        ...authComputed,
        ...caracteristicasTipoInmuebleComputed,
        ...formatosComputed,
        ...unidadesComputed,

        filteredCaracteristicas() {
            return this.allCaracteristicasTipoInmueble.filter(c => c.id_tipo_caracteristica == 2)
        },

        formatosInmueble() {
            return this.allFormatos.map(item => { return { id: item.id, formato: item.formato }})
                .filter(i => this.form.formatos.includes(i.id))
        }
    },

    watch: {
        "$route" (value) {
            if (value.name === "Perfil Publico Unidad") {
                this.prepare()
            }
        }
    },

    created() {
        return this.prepare().then(this.prepared = true)
    },

    methods: {
        ...caracteristicasTipoInmuebleMethods,
        ...formatosMethods,
        ...unidadesMethods,

        getCaracteristicasIndex(id) {
            return this.oneUnidad.id_inmueble.caracteristicas.findIndex(item => item.id === id)
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

        moment,

        prepare() {
            var unidad = this.fetchOneUnidad(this.$route.params.id)
            var formatos = this.fetchAllFormatos()

            return Promise.all([unidad, formatos])
                .then(values => {
                    if (values[0]) {
                        unidad = values[0]

                        window.$(()=> {
                            this.initMap("map", { center: { lat: unidad.id_inmueble_padre.id_direccion.latitud, lng: unidad.id_inmueble_padre.id_direccion.longitud }, zoom: 14 })
                        })

                        return this.fetchAllCaracteristicasTipoInmueble({ id_tipo_inmueble: unidad.id_inmueble.id_tipo_inmueble.id })
                    }

                    return values
                })
                .catch(error => {
                    var message = error.data.message||error.message||error
                    alertErrorMessage(this.title, message)

                    return  error
                })
        }
    }
}
</script>
