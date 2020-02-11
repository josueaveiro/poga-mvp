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
              label="Características"
            >
              <h3 class="title is-3">
                Características generales del Departamento
              </h3>

              <b-field
                grouped
                group-multiline
              >
                <b-field
                  label="Piso"
                >
                  <b-input
                    v-model="form.piso"
                    name="piso"
                    :disabled="true"
                    :max="form.cant_pisos"
                    min="0"
                    type="number"
                  />
                </b-field>

                <b-field
                  label="Número"
                >
                  <b-input
                    v-model="form.numero"
                    :disabled="true"
                    name="numero"
                    type="text"
                  />
                </b-field>
              </b-field>

              <b-field
                label="Metros cuadrados construidos"
              >
                <b-input
                  v-model="form.area"
                  :disabled="true"
                  name="area"
                  min="15"
                  type="number"
                />
              </b-field>

              <b-field
                label="Departamento para"
              >
                <b-select
                  v-model="form.id_formato_inmueble"
                  :disabled="true"
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
                  <b-input
                    v-model="form.id_inmueble.caracteristicas[item.id]"
                    :name="'id_inmueble.caracteristicas[' + item.id + ']'"
                    :disabled="true"
                    type="number"
                    icon-pack="fas"
                  />
                </b-field>
              </div>
            </b-step-item>

            <b-step-item
              label="Comodidades"
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
                    v-if="form.id_inmueble.caracteristicas[item.id]"
                    :key="item.id"
                    class="field"
                  >
                    <b-switch
                      :value="true"
                      :name="'id_inmueble.caracteristicas[' + item.id + ']'"
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
                    v-if="form.id_inmueble.caracteristicas[item.id]"
                    :key="item.id"
                    class="field"
                  >
                    <b-switch
                      :name="'id_inmueble.caracteristicas[' + item.id + ']'"
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
                    v-if="form.id_inmueble.caracteristicas[item.id]"
                    :key="item.id"
                    class="field"
                  >
                    <b-switch
                      :name="'id_inmueble.caracteristicas[' + item.id + ']'"
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
              label="Descripción"
              :clickable="true"
            >
              <h3 class="title mb-5 is-3">
                Descripción del Departamento
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
                    @click.prevent="$router.push({ name: 'Mis Inmuebles '})"
                  >
                    Volver a "Mis Inmuebles"
                  </b-button>
                </div>
                <div class="level-right">
                  <b-button
                    v-if="activeStep !== 2"
                    :disabled="next.disabled"
                    icon-pack="fas"
                    icon-right="chevron-right"
                    type="is-primary"
                    @click.prevent="handleNextStep(next)"
                  >
                    Siguiente
                  </b-button>
                  <b-button
                    v-if="activeStep === 2"
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
  </section>
</template>

<script>
import { alertErrorMessage, deepClone } from "@/utilities/helpers"
import { authComputed } from "@/store/helpers"
import { caracteristicasTipoInmuebleComputed, caracteristicasTipoInmuebleMethods, formatosComputed, formatosMethods, unidadesComputed, unidadesMethods } from "@mvp/store/helpers"
import { mapCaracteristicasTipoInmuebleList } from "@mvp/store/modules/caracteristicasTipoInmueble/actions"
import { mapFormatosList } from "@mvp/store/modules/formatos/actions"

import store from "@/store"
import Form from "@/utilities/Form"

var fields = deepClone(store.state.unidades.initialState.one)
fields.id_inmueble_padre = {
    id_inmueble: {
        formatos: []
    }
}

export default {
    data() {
        return {
            activeStep: 0,
            caracteristicas: [],
            form: new Form(fields),
            prepared: false,
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
                .filter(item => this.form.id_inmueble_padre.id_inmueble.formatos.map(i => { return i.pivot.id_formato }).includes(item.id))
        }
    },

    watch: {
        "$route" (value) {
            if (value.name === "Editar Inmueble" && this.prepared) {
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

        handleNextStep(next) {
            return next.action()
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
                id_inmueble_padre: {
                    id_inmueble: {
                        formatos: data.id_inmueble_padre.id_inmueble.formatos
                    }
                },
                id_medida: data.id_medida.id,
                numero: data.numero,
                piso: data.piso
            }

            return map
        },

        prepare() {
            var unidad = this.fetchOneUnidad(this.$route.params.id)
            var formatos = this.fetchAllFormatos()

            return Promise.all([unidad, formatos])
                .then(values => {
                    if (values[0]) {
                        unidad = values[0]
                    }

                    return this.fetchAllCaracteristicasTipoInmueble()
                })
                .then(caracteristicasTipoInmueble => {
                    if (caracteristicasTipoInmueble) {
                        this.form = new Form(this.mapFormData(unidad))
                    }

                    return caracteristicasTipoInmueble
                })
        }
    }
}
</script>
