<style lang="scss" scoped>
.step-content {
  min-height: 75vh;
}
</style>

<template>
  <section class="bg-light">
    <div class="columns is-gapless">
      <div class="bg-white column is-7">
        <form>
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
                  <h3 class="title mb-5 is-3">
                    Cláusulas del Contrato de Renta
                  </h3>

                  <div class="columns">
                    <div class="column is-6">
                      <b-field
                        label="Fecha de Inicio"
                      >
                        <b-input
                          v-model="form.fecha_inicio"
                          :disabled="true"
                          name="fecha_inicio"
                          placeholder="Fecha de Inicio"
                          type="text"
                        />
                      </b-field>
                    </div>

                    <div class="column is-6">
                      <b-field
                        label="Fecha de Finalización"
                      >
                        <b-input
                          v-model="form.fecha_fin"
                          :disabled="true"
                          name="fecha_fin"
                          placeholder="Fecha de Finalización"
                          type="text"
                        />
                      </b-field>
                    </div>
                  </div>

                  <div class="columns">
                    <div class="column is-6">
                      <b-field
                        label="Inmueble"
                        expanded
                      >
                        {{ oneRenta.id_unidad ? oneRenta.id_unidad.id_inmueble.nombre : oneRenta.id_inmueble.nombre }}
                      </b-field>
                    </div>

                    <div class="column is-6">
                      <b-field
                        label="Inquilino"
                      >
                        <b-input
                          v-model="form.id_inquilino.nombre_y_apellidos"
                          :disabled="true"
                          :loading="allPersonasPending"
                          name="id_inquilino"
                          expanded
                        />
                      </b-field>
                    </div>
                  </div>  

                  <div class="columns">
                    <div class="column is-6">
                      <b-field
                        label="Moneda"
                      >
                        <b-select
                          v-model="form.id_moneda"
                          v-validate="'required'"
                          :disabled="true"
                          name="id_moneda"
                          data-vv-as="Moneda"
                          placeholdel="Moneda"
                          expanded
                        >
                          <option
                            value="1"
                          >
                            Guaraní
                          </option>
                        </b-select>
                      </b-field>
                    </div>
 
                    <div class="column is-6">
                      <b-field
                        label="Monto mensual de la renta"
                      >
                        <b-input
                          v-model="form.monto"
                          :disabled="true"
                          placeholder="Monto mensual de la renta"
                          name="monto"
                          min="0"
                          type="numeric"
                        />
                      </b-field>
                    </div>
                  </div>

                  <div class="columns">
                    <div class="column is-6">
                      <b-field
                        label="Notificación de renovación (días)"
                      >
                        <b-input
                          v-model="form.dias_notificacion_previa_renovacion"
                          v-validate="'required|numeric'"
                          :disabled="true"
                          placeholder="Notificación de renovación (días)"
                          name="dias_notificacion_previa_renovacion"
                          data-vv-as="Notificación de renovación"
                          min="0"
                          type="numeric"
                        />
                      </b-field>
                    </div>

                    <div class="column is-6">
                      <b-field
                        label="Día de pago mensual"
                      >
                        <b-input
                          v-model="form.dia_mes_pago"
                          v-validate="'required|numeric|max_value:31'"
                          :disabled="true"
                          data-vv-as="Día de pago mensual"
                          name="dia_mes_pago"
                          placeholder="Día de pago mensual"
                          type="number"
                          min="1"
                          max="31"
                        />
                      </b-field>
                    </div>
                  </div>

                  <div class="columns">
                    <div class="column is-6">
                      <b-field label="¿Es un contrato vigente?">
                        {{ form.vigente ? 'Sí' : 'No' }}
                      </b-field>

                      <b-field
                        label="Depósito de garantía"
                      >
                        <b-input
                          v-model="form.garantia"
                          v-validate="'required'"
                          :disabled="true"
                          data-vv-as="Depósito de garantía"
                          name="garantia"
                          placeholder="Depósito de garantia"
                          type="number"
                          min="0"
                        />
                      </b-field>

                      <b-field
                        v-if="!form.vigente"
                        label="Monto de la comisión inmobiliaria"
                      >
                        <b-input
                          v-model="form.comision_inmobiliaria"
                          :disabled="true"
                          name="comision_inmobiliaria"
                          placeholder="Monto de la comisión inmobiliaria"
                          type="number"
                          min="0"
                        />
                      </b-field>
                    </div>

                    <div class="column is-6">
                      <b-field
                        label="¿Incluye cláusula de multa?"
                      >
                        {{ form.multa ? 'Sí' : 'No' }}
                      </b-field>

                      <b-field
                        v-if="form.multa"
                        label="Monto de multa por día de atraso"
                      >
                        <b-input
                          v-model="form.monto_multa_dia"
                          v-validate="'required_if:multa,true'"
                          :disabled="true"
                          name="monto_multa_dia"
                          data-vv-as="Monto por cada día de multa"
                          type="number"
                          placeholder="Monto por cada día de multa"
                        />
                      </b-field>

                      <b-field
                        v-if="form.multa"
                        label="Días de gracia para pago"
                      >
                        <b-input
                          v-model="form.dias_multa"
                          v-validate="'required|numeric'"
                          :disabled="true"
                          name="dias_multa"
                          data-vv-as="Días de gracia"
                          type="number"
                          placeholder="Días de gracia"
                        />
                      </b-field>
                    </div>
                  </div>
                </b-step-item>

                <b-step-item
                  label=""
                  :clickable="true"
                >
                  <h3 class="title mb-5 is-3">
                    Descarga el contrato firmado
                  </h3>

                  <div
                    v-if="oneRenta.documentos.length > 0"
                    class="content"
                  >
                    <article
                      v-for="documento in oneRenta.documentos"
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
                    class="content has-text-grey has-text-centered"
                  >
                    <p>
                      <b-icon
                        icon="emoticon-sad"
                        size="is-large"
                      />
                    </p>
                    <p>No hay documentos para descargar.</p>
                  </div>
                </b-step-item>

                <b-step-item
                  label=""
                  :clickable="true"
                >
                  <h3 class="title mb-5 is-3">
                    Estado del Inmueble al inicio del Contrato
                  </h3>
             
                  <div
                    v-for="categoria in groupBy(allEstadosInmueble, 'enum_categoria')"
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
                        <tr v-for="(item, index) in categoria">
                          <td>{{ item.nombre }}</td>
                          <td>
                            {{ form.estados_inmueble[getIndex(item)] ? form.estados_inmueble[getIndex(item)].cantidad : 'N/A' }}
                          </td>
                          <td>
                            {{ form.estados_inmueble[getIndex(item)] ? form.estados_inmueble[getIndex(item)].reparar : 'N/A' }}
                          </td>
                          <td>
                            <b-button
                              :disabled="!form.estados_inmueble[getIndex(item)]"
                              type="is-light"
                              @click="isImageModalActive = 1"
                            >
                              Previsualizar
                            </b-button>

                            <b-modal
                              v-if="form.estados_inmueble[getIndex(item)]"
                              :active.sync="isImageModalActive"
                            >
                              <p class="image is-4by3">
                                <img :src="'/storage/' + form.estados_inmueble[getIndex(item)].foto">
                              </p>
                            </b-modal>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <b-field
                    label="Observaciones"
                  >
                    <b-input
                      v-model="form.observacion"
                      type="textarea"
                      placeholder="Observaciones"
                      :disabled="true"
                    />
                  </b-field>

                  <b-button
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
                    native-type="button"
                    size="is-large"
                    type="is-primary"
                    @click="$router.push({ name: 'Mis Rentas' })"
                  >
                    Volver a "Mis Contratos"
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
                        type="is-second"
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
      </div>
    </div>

    <PreviewImageModal :is-active="isPreviewImageModalActive" />
    <NuevoInquilinoModal :is-active="isNuevoInquilinoModalActive" />
  </section>
</template>

<script>
import { alertErrorMessage, alertSuccessMessage, deepClone, getSavedState } from "@/utilities/helpers"
import { authComputed } from "@/store/helpers"
import { estadosInmuebleComputed, estadosInmuebleMethods, inmueblesComputed, inmueblesMethods, personasComputed, personasMethods, rentasComputed, rentasMethods } from "@mvp/store/helpers"
import { mapEstadosInmuebleList } from "@mvp/store/modules/estadosInmueble/actions"


import groupBy from "lodash/groupBy"
import moment from "moment"
import store from "@/store"
import Form from "@/utilities/Form"

var fields = deepClone(store.state.rentas.initialState.one)

export default {
    data() {
        return {
            activeStep: 0,
            form: new Form(fields),
            isImageModalActive: false,
            prepared: false,
        }
    },

    computed: {
        ...authComputed,
        ...estadosInmuebleComputed,
        ...inmueblesComputed,
        ...personasComputed,
        ...rentasComputed,

        filteredInquilinos() {
            if (this.busquedaInquilino.length > 4) {
                return this.personasMap.filter(item => {
                    return item.toString().toLowerCase().indexOf(this.busquedaInquilino) > -1
                })
            }

            return 
        }
    },

    watch: {
        inquilinoSeleccionado (value) {
            var tipoDocumento = value.split(":")[0]
            var documento = value.split(":")[1].replace(/\(/g, "").replace(/\)/g, "").split(" ")[0]
        
            var result = this.allPersonas.find(item => { return item[tipoDocumento.toLowerCase()] === documento })
            if (!result) {
                this.form.id_inquilino = null
            } else {
                this.form.id_inquilino = result.id
            }
        }
    },

    created() {
        return this.prepare().then(this.prepared = true)
    },

    methods: {
        ...estadosInmuebleMethods,
        ...inmueblesMethods,
        ...personasMethods,
        ...rentasMethods,

        getIndex(item) {
            return this.form.estados_inmueble.findIndex(i => i.id === item.id)
        },

        groupBy,

        handleNextStep(next) {
            return next.action()
        },

        handleFileInputChange(evt, id) {
            this.oFiles[id] = new FileReader()
            this.oFiles[id].readAsDataURL(document.getElementById("estado-inmueble-img-" + id).files[0])
            this.oFiles[id].onload = this.readSuccess

            this.activeOFile = id
        },

        handlePreviewImage(id) {
            this.isPreviewImageModalActive = true
        },

        handlePreviousStep(previous) {
            return previous.action()
        },

        mapEstadosInmuebleList,

        mapFormData(data) {
            return {
                dia_mes_pago: data.dia_mes_pago,
                dias_multa: data.dias_multa,
                dias_notificacion_previa_renovacion: data.dias_notificacion_previa_renovacion,
                documentos: data.documentos,
                estados_inmueble: mapEstadosInmuebleList(data.estados_inmueble),
                expensas: data.expensas,
                fecha_fin: moment(data.fecha_fin).format("DD/MM/YYYY"),
                fecha_inicio: moment(data.fecha_inicio).format("DD/MM/YYYY"),
                garantia: data.garantia,
                id_inmueble: data.id_inmuble,
                id_inquilino: data.id_inquilino,
                id_moneda: data.id_moneda,
                monto: data.monto,
                monto_multa_dia: data.monto_multa_dia,
                motivo_descuento_garanta: data.motivo_descuenta_garantia,
                multa: data.multa,
                observacion: data.observacion,
                renovacion: data.renovacion,
                vigente: data.vigente,
            }
        },

        moment,

        prepare() {
            var renta = this.fetchOneRenta(this.$route.params.id)
            var estadosInmueble = this.fetchAllEstadosInmueble()
            var inmuebles = this.fetchAllInmuebles({ tipoListado: "MisInmuebles", excluir: "con_renta" })
            var personas = this.fetchAllPersonas()

            return Promise.all([renta, estadosInmueble, inmuebles, personas])
                .then(values => {
                    if (values[0] && values[1]) {
                        this.form = new Form(this.mapFormData(values[0]))
                    }

                    return values
                })
        },

        readSuccess(evt) {
        },

        setFieldType(fields) {
            if (this.form.errors.has(fields[0])||this.$validator.errors.has(fields[1])) {
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
