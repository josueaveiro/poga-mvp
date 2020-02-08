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
              <h3 class="title is-3">
                Características generales del Departamento
              </h3>

              <b-field
                grouped
                group-multiline
              >
                <b-field
                  label="Piso *"
                  :message="getErrorMessage(['piso', 'piso'])"
                  :type="setFieldType(['piso', 'piso'])"
                >
                  <b-input
                    v-model="form.piso"
                    v-validate="'required|numeric'"
                    data-vv-as="Piso"
                    name="piso"
                    :disabled="submitted"
                    :max="form.cant_pisos"
                    min="0"
                    type="number"
                  />
                </b-field>

                <b-field
                  label="Número *"
                  :message="getErrorMessage(['numero', 'numero'])"
                  :type="setFieldType(['numero', 'numero'])"
                >
                  <b-input
                    v-model="form.numero"
                    v-validate="'required'"
                    :disabled="submitted"
                    name="numero"
                    data-vv-as="Numero"
                    type="text"
                  />
                </b-field>
              </b-field>

              <b-field
                label="Metros cuadrados construidos *"
                :message="getErrorMessage(['area', 'area'])"
                :type="setFieldType(['area', 'area'])"
              >
                <b-input
                  v-model="form.area"
                  v-validate="'required|min_value:15'"
                  :disabled="submitted"
                  name="area"
                  data-vv-as="Metros cuadrados"
                  min="15"
                  type="number"
                />
              </b-field>

              <b-field
                label="Departamento para *"
                :message="getErrorMessage(['id_formato_inmueble', 'id_formato_inmueble'])"
                :type="setFieldType(['id_formato_inmueble', 'id_formato_inmueble'])"
              >
                <b-select
                  v-model="form.id_formato_inmueble"
                  v-validate="'required'"
                  :disabled="submitted"
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
                    v-model="caracteristicas[item.id]"
                    :name="'id_inmueble.caracteristicas[' + item.id + ']'"
                    :disabled="submitted"
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
                ¿Qué comodidades ofrecés?
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
                      :value="true"
                      :disabled="submitted"
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
                Descripción del {{ oneUnidad.id_inmueble.id_tipo_inmueble.tipo }} (opcional)
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
                Antes de finalizar la actualización de tu departamento podés hacer una revisión o editarlo posteriormente.
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
                Actualizar el {{ oneUnidad.id_inmueble.id_tipo_inmueble.tipo }}
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
import { alertErrorMessage, alertSuccessMessage, deepClone } from "@/utilities/helpers"
import { authComputed } from "@/store/helpers"
import { caracteristicasTipoInmuebleComputed, caracteristicasTipoInmuebleMethods, formatosComputed, formatosMethods, unidadesComputed, unidadesMethods } from "@mvp/store/helpers"
import { documentsMethods, photosMethods } from "@/store/helpers"
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
            action: app.apiUrl + "/unidades",
            activeStep: 0,
            caracteristicas: [],
            form: new Form(fields),
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
        ...documentsMethods,
        ...formatosMethods,
        ...photosMethods,
        ...unidadesMethods,

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
                return next.action()
            case 1:
                return this.validateAll(["calle_principal"], next)
            case 2:
                return next.action()
            case 3:
                return this.validateAll(["nombre", "id_formato_inmueble", "cant_pisos"], next)
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

        handleSubmitForm() {
            this.submitted = true

            this.form.unfeatured_photos = []

            this.handleCaracteristicas()

            return this.form[this.method](this.action + "/" + this.$route.params.id)
                .then(response => {
                    alertSuccessMessage("Actualiza un Inmueble", "Tu " + this.oneUnidad.id_inmueble.id_tipo_inmueble.tipo + " fue actualizado.")
                    this.$router.push({ name: "Mis Inmuebles" })
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
        mapFormatosList,

        mapFormData(data) {
            var map = {
                area: data.area,
                area_estacionamiento: data.area_estacionamiento,
                caracteristicas: [],
                id_formato_inmueble: data.id_formato_inmueble.id_formato.id,
                id_inmueble: {
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
                    if (values[0] && values[1]) {
                        unidad = values[0]
                    }

                    return this.fetchAllCaracteristicasTipoInmueble({ id_tipo_inmueble: unidad.id_inmueble.id_tipo_inmueble.id })
                })
                .then(caracteristicasTipoInmueble => {
                    if (caracteristicasTipoInmueble) {
                        this.caracteristicas = mapCaracteristicasTipoInmuebleList(caracteristicasTipoInmueble, unidad.id_inmueble.caracteristicas)
                        this.form = new Form(this.mapFormData(unidad))
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
