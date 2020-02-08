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
              v-if="filteredCaracteristicas.filter(c => c.id_grupo_caracteristica == null)"
              class="mb-4"
            >
              <div
                v-for="item in filteredCaracteristicas.filter(c => c.id_grupo_caracteristica == null)"
                :key="item.id"
              >
                <b-tag
                  v-if="oneInmueble.id_inmueble.caracteristicas[getCaracteristicasIndex(item.id)]"
                  class="is-primary mr-2"
                >
                  {{ item.id_caracteristica.nombre }}
                </b-tag>
              </div>
            </b-taglist>

            <div
              v-else
              class="has-text-grey"
            >
              <p>No hay caracteristicas para mostrar.</p>
            </div>
          </div>

          <div v-if="!isEdificio">
            <h4 class="title is-4">
              Comodidades
            </h4>
            <h6 class="title is-6">
              Electrodomésticos
            </h6>
            <b-taglist
              v-if="filteredCaracteristicas.filter(c => c.id_grupo_caracteristica == 1)"
              class="mb-4"
            >
              <div
                v-for="item in filteredCaracteristicas.filter(c => c.id_grupo_caracteristica == 1)"
                :key="item.id"
              >
                <b-tag
                  v-if="oneInmueble.id_inmueble.caracteristicas[getCaracteristicasIndex(item.id_caracteristica.id)]"
                  class="is-primary mr-2"
                >
                  {{ item.id_caracteristica.nombre }}
                </b-tag>
              </div>
            </b-taglist>

            <div
              v-else
              class="has-text-grey"
            >
              <p>No hay caracteristicas para mostrar.</p>
            </div>

            <h6 class="title is-6">
              Amoblamiento
            </h6>
            <b-taglist
              v-if="filteredCaracteristicas.filter(c => c.id_grupo_caracteristica == 2)"
              class="mb-4"
            >
              <div
                v-for="item in filteredCaracteristicas.filter(c => c.id_grupo_caracteristica == 2)"
                :key="item.id"
              >
                <b-tag
                  v-if="oneInmueble.id_inmueble.caracteristicas[getCaracteristicasIndex(item.id_caracteristica.id)]"
                  class="is-primary mr-2"
                >
                  {{ item.id_caracteristica.nombre }}
                </b-tag>
              </div>
            </b-taglist>
    
            <div
              v-else
              class="has-text-grey"
            >
              <p>No hay caracteristicas para mostrar.</p>
            </div>

            <h6 class="title is-6">
              Otros
            </h6>
            <b-taglist
              v-if="filteredCaracteristicas.filter(c => c.id_grupo_caracteristica == null)"
              class="mb-4"
            >
              <div
                v-for="item in filteredCaracteristicas.filter(c => c.id_grupo_caracteristica == null)"
                :key="item.id"
              >
                <b-tag
                  v-if="oneInmueble.id_inmueble.caracteristicas[getCaracteristicasIndex(item.id_caracteristica.id)]"
                  class="is-primary mr-2"
                >
                  {{ item.id_caracteristica.nombre }}
                </b-tag>
              </div>
            </b-taglist>
            <div
              v-else
              class="has-text-grey"
            >
              <p>No hay caracteristicas para mostrar.</p>
            </div>
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
import { gmaps } from "@/utilities/mixins/gmaps"

import moment from "moment"

export default {
    mixins: [gmaps],

    data() {
        return {
            prepared: false,
            title: "Perfil Público"
        }
    },

    computed: {
        ...authComputed,
        ...caracteristicasTipoInmuebleComputed,
        ...formatosComputed,
        ...inmueblesComputed,

        filteredCaracteristicas() {
            return this.allCaracteristicasTipoInmueble.filter(c => c.id_tipo_caracteristica == 2)
        },

        filteredFormatos() {
            return this.allFormatos.map(item => { return { id: item.id, formato: item.formato }})
                .filter(i => this.form.formatos.includes(i.id))
        },

        isEdificio() {
            return this.oneInmueble.id_inmueble.id_tipo_inmueble.id == 1
        }
    },

    watch: {
        "$route" (value) {
            if (value.name === "Perfil Publico Inmueble") {
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
        ...inmueblesMethods,

        getCaracteristicasIndex(id) {
            return this.oneInmueble.id_inmueble.caracteristicas.findIndex(item => item.id === id)
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
            var inmueble = this.fetchOneInmueble(this.$route.params.id)
            var formatos = this.fetchAllFormatos()

            return Promise.all([inmueble, formatos])
                .then(values => {
                    if (values[0]) {
                        inmueble = values[0]

                        window.$(()=> {
                            this.initMap("map", { center: { lat: inmueble.id_direccion.latitud, lng: inmueble.id_direccion.longitud }, zoom: 14 })
                        })

                        return this.fetchAllCaracteristicasTipoInmueble({ id_tipo_inmueble: inmueble.id_inmueble.id_tipo_inmueble.id })
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
