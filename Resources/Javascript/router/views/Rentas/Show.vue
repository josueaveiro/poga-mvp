<template>
  <main class="bg-light main">
    <b-loading
      :is-full-page="true"
      :active.sync="oneRentaPending"
      :can-cancel="false"
    />
    <div
      v-if="!oneRentaPending"
      class="columns is-gapless"
    >
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
                  label="Datos"
                  :clickable="true"
                >
                  <h3 class="title mb-4 is-3">
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
                        :label="oneRenta.id_unidad ? 'Departamento nº' : 'Inmueble'"
                        expanded
                      >
                        <b-input
                          v-model="form.id_inmueble"
                          :disabled="true"
                          name="id_inmueble"
                          placeholder="Inmueble"
                          type="text"
                        />
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
                        <b-input
                          v-model="form.id_moneda"
                          :disabled="true"
                          name="id_moneda"
                          placeholdel="Moneda"
                          expanded
                        />
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
                        <b-input
                          v-model="form.vigente"
                          :disabled="true"
                          name="vigente"
                          placeholder="¿Es un contrato vigente?"
                          type="text"
                        />
                      </b-field>

                      <b-field
                        label="Depósito de garantía"
                      >
                        <b-input
                          v-model="form.garantia"
                          v-validate="'required'"
                          :disabled="true"
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
                        <b-input
                          v-model="form.garantia"
                          v-validate="'required'"
                          :disabled="true"
                          name="garantia"
                          placeholder="Depósito de garantia"
                          type="number"
                          min="0"
                        />
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
                          type="number"
                          placeholder="Días de gracia"
                        />
                      </b-field>
                    </div>
                  </div>
                </b-step-item>

                <b-step-item
                  label="Contrato firmado"
                  :clickable="true"
                >
                  <h3 class="title mb-4 is-3">
                    Descarga el contrato firmado
                  </h3>

                  <div
                    v-if="oneRenta.documentos.length > 0"
                    class="content"
                  >
                    <article
                      v-for="documento in oneRenta.documentos"
                      :key="documento.id"
                      class="media"
                    >
                      <figure class="media-left">
                        <p class="image is-64x64">
                          <img
                            class="is-64x64"
                            :src="documento.thumbnail"
                          >
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
                    class="content mb-5 has-text-grey"
                  >
                    <p>No hay documentos para descargar.</p>
                  </div>
                </b-step-item>

                <b-step-item
                  label="Estado del Inmueble"
                  :clickable="true"
                >
                  <h3 class="title mb-4 is-3">
                    Estado del Inmueble al inicio del Contrato
                  </h3>
             
                  <div
                    v-for="(categoria, index) in groupBy(allEstadosInmueble, 'enum_categoria')"
                    :key="index"
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
                        <tr
                          v-for="item in categoria"
                          :key="item.id"
                        >
                          <td>{{ item.nombre }}</td>
                          <td>
                            {{ form.estados_inmueble[getEstadosInmuebleIndex(item)] ? form.estados_inmueble[getEstadosInmuebleIndex(item)].cantidad : 'N/A' }}
                          </td>
                          <td>
                            {{ form.estados_inmueble[getEstadosInmuebleIndex(item)] ? form.estados_inmueble[getEstadosInmuebleIndex(item)].reparar : 'N/A' }}
                          </td>
                          <td>
                            <b-button
                              :disabled="!form.estados_inmueble[getEstadosInmuebleIndex(item)].foto"
                              type="is-light"
                              @click="handleFotoModal(form.estados_inmueble[getEstadosInmuebleIndex(item)].foto)"
                            >
                              Previsualizar
                            </b-button>
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
                </b-step-item>

                <b-step-item
                  :clickable="true"
                  :visible="form.enum_estado === 'FINALIZADO'"
                  label="Finalización"
                >
                  <h3 class="title is-3 mb-4">
                    Finalización
                  </h3>
                  <div class="columns">
                    <div class="column is-6">
                      <b-field
                        label="Fecha de finalización efectiva"
                      >
                        <b-input
                          v-model="form.fecha_finalizacion_contrato"
                          :disabled="true"
                          name="fecha_finalizacion_contrato"
                          placeholder="Fecha de finalización efectiva"
                          type="text"
                        />
                      </b-field>
                    </div>

                    <div class="column is-6">
                      <b-field
                        label="Monto descontado del fondo de garantía"
                      >
                        <b-input
                          v-model="form.monto_descontado_garantia_finalizacion_contrato"
                          :disabled="true"
                          name="monto_descontado_garantia_finalizacion_contrato"
                          placeholder="Monto descontado del fondo de garantía"
                          type="number"
                        />
                      </b-field>
                    </div>
                  </div>

                  <b-field
                    label="Motivo del descuento"            
                  >
                    <b-input
                      v-model="form.motivo_descuento_garantia"
                      :disabled="true"
                      name="motivo_descuento_garantia"
                      placeholder="Motivo del descuento"
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
                        type="is-second"
                        @click.prevent="handlePreviousStep(previous)"
                      >
                        Anterior
                      </b-button>
                      <b-button
                        v-else
                        icon-pack="fas"
                        icon-left="chevron-left"
                        type="is-second"
                        @click.prevent="$router.push({ name: 'Mis Rentas' })"
                      >
                        Volver a "Mis Contratos"
                      </b-button>
                    </div>
                    <div class="level-right">
                      <b-button
                        v-if="activeStep < 2"
                        :disabled="next.disabled"
                        icon-pack="fas"
                        icon-right="chevron-right"
                        type="is-primary"
                        @click.prevent="handleNextStep(next)"
                      >
                        Siguiente
                      </b-button>
                      <b-button
                        v-else
                        icon-pack="fas"
                        icon-right="chevron-right"
                        type="is-primary"
                        @click.prevent="$router.push({ name: 'Mis Rentas' })"
                      >
                        Volver a "Mis Contratos"
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
  </main>
</template>

<script>
import { deepClone } from "@/utilities/helpers"
import { estadosInmuebleComputed, estadosInmuebleMethods, rentasComputed, rentasMethods } from "@mvp/store/helpers"
import { mapEstadosInmuebleList } from "@mvp/store/modules/estadosInmueble/actions"


import app from "@/app"
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
        ...estadosInmuebleComputed,
        ...rentasComputed,
    },

    watch: {
        "$route" (value) {
            if (value.name === "Ver Renta") {
                this.prepare()
            }
        }
    },

    created() {
        return this.prepare().then(this.prepared = true)
    },

    methods: {
        ...estadosInmuebleMethods,
        ...rentasMethods,

        getEstadosInmuebleIndex(item) {
            return this.form.estados_inmueble.findIndex(i => i.id === item.id)
        },

        groupBy,

        handleNextStep(next) {
            return next.action()
        },

        handleFotoModal(foto) {
            this.$buefy.modal.open(
                `<p class="image is-4by3">
                    <img src="` + app.storagePath + "/" + foto + `" />
                </p>`
            )
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
                enum_estado: data.enum_estado,
                estados_inmueble: mapEstadosInmuebleList(this.allEstadosInmueble, data.estados_inmueble),
                expensas: data.expensas,
                fecha_fin: moment(data.fecha_fin).format("DD/MM/YYYY"),
                fecha_finalizacion_contrato: moment(data.fecha_finalizacion_contrato).format("DD/MM/YYYY"),
                fecha_inicio: moment(data.fecha_inicio).format("DD/MM/YYYY"),
                garantia: data.garantia,
                id_inmueble: data.id_unidad ? data.id_unidad.numero : data.id_inmueble.id_inmueble_padre.nombre,
                id_inquilino: data.id_inquilino,
                id_moneda: data.id_moneda.abbr,
                monto: data.monto,
                monto_comision_inmobiliaria: data.monto_comision_inmobiliaria,
                monto_descontado_garantia_finalizacion_contrato: data.monto_descontado_garantia_finalizacion_contrato,
                monto_multa_dia: data.monto_multa_dia,
                motivo_descuento_garantia: data.motivo_descuento_garantia,
                multa: data.multa ? "Sí" : "No",
                observacion: data.observacion,
                renovacion: data.renovacion,
                vigente: data.vigente ? "Sí" : "No",
            }
        },

        moment,

        prepare() {
            var renta = this.fetchOneRenta(this.$route.params.id)
            var estadosInmueble = this.fetchAllEstadosInmueble()

            return Promise.all([renta, estadosInmueble])
                .then(values => {
                    if (values[0] && values[1]) {
                        this.form = new Form(this.mapFormData(values[0]))
                    }

                    return values
                })
        }
    }
}
</script>
