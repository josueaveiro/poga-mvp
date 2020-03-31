<template>
  <b-table
    ref="table"
    :data="items.length > 0 ? items : []"
    paginated
    icon-pack="fas"
    per-page="5"
    aria-next-label="Página siguiente"
    aria-previous-label="Página anterior"
    aria-page-label="Página"
    aria-current-label="Página actual"
  >
    <template slot-scope="props">
      <b-table-column
        field="fecha_pagare"
        label="Fecha"
        sortable
      >
        <template>
          {{ moment(props.row.fecha_pagare).format("MM/YYYY") }}
        </template>
      </b-table-column>

      <b-table-column
        field="nombre"
        label="Inmueble"
        sortable
      >
        <template>
          {{ props.row.id_unidad ? props.row.id_unidad.tipo + " piso " + props.row.id_unidad.piso + " - nº " + props.row.id_unidad.numero : props.row.id_inmueble.id_inmueble_padre.nombre }}
        </template>
      </b-table-column>

      <b-table-column
        v-if="user.role_id == 4"
        field="inquilino_referente"
        label="Inquilino"
        sortable
      >
        <template>
          {{ props.row.id_inmueble.nombre_y_apellidos_inquilino_referente }}
        </template>
      </b-table-column>

      <b-table-column
        v-if="user.role_id == 3"
        field="propietario_referente"
        label="Propietario"
        sortable
      >
        <template>
          {{ props.row.id_inmueble.nombre_y_apellidos_propietario_referente }}
        </template>
      </b-table-column>

      <b-table-column
        field="clasificacion"
        label="Clasificación"
        sortable
      >
        <template>
          {{ props.row.clasificacion }}
        </template>
      </b-table-column>

      <b-table-column
        field="total"
        label="Monto"
        sortable
      >
        <template>
          {{ formatMoney(props.row.id_moneda.abbr, (props.row.enum_clasificacion_pagare === 'COMISION_POGA' ? (props.row.id_pagare_padre.monto - props.row.monto) : props.row.total)) }}
        </template>
      </b-table-column>

      <b-table-column
        field="conversion"
        label="Conversión a Gs."
        sortable
      >
        <template>
          {{ props.row.enum_clasificacion_pagare === 'COMISION_POGA' ? (props.row.id_moneda.id == 2 ? formatMoney((props.row.id_pagare_padre.monto - props.row.monto) * props.row.cotizacion) : 'N/A') : (props.row.id_moneda.id == 2 ? formatMoney('PYG', (props.row.total * props.row.cotizacion)) : 'N/A') }}
        </template>
      </b-table-column>

      <b-table-column
        field="acciones"
        label=""
      >
        <template>
          <b-dropdown aria-role="list">
            <button
              slot="trigger"
              :disabled="allPagaresPending"
              :loading="allPagaresPending"
              class="button is-primary"
            >
              <span>Acciones</span>
              <b-icon
                icon="caret-down"
                pack="fas"
              />
            </button>

            <b-dropdown-item
              has-link="true"
              aria-role="listitem"
            >
              <RouterLink :to="{ name: 'Realiza un Pago', params: { id: props.row.id }}">
                Ver detalles
              </RouterLink>
            </b-dropdown-item>

            <b-dropdown-item
              :disabled="props.row.enum_estado !== 'PENDIENTE' || user.role_id == '4'"
              has-link="true"
              aria-role="listitem"
            >
              <RouterLink
                v-if="props.row.enum_estado === 'PENDIENTE' && user.role_id == '3'"
                :to="{ name: 'Realiza un Pago', params: { id: props.row.id }}"
              >
                Pagar
              </RouterLink>

              <a
                v-else
                class="is-disabled"
                href="javascript:void(0)"
              >
                Pagar
              </a>
            </b-dropdown-item>

            <b-dropdown-item
              v-if="user.role_id == 4"
              :disabled="props.row.enum_estado !== 'PENDIENTE'"
              has-link="true"
              aria-role="listitem"
            >
              <a
                v-if="props.row.enum_estado === 'PENDIENTE'"
                href="javascript:void(0)"
                @click="handleAnularPagare(props.row)"
              >
                Anular
              </a>
              <a
                v-else
                class="is-disabled"
                href="javascript:void(0)"
              >
                Anular
              </a>
            </b-dropdown-item>
          </b-dropdown>
        </template>
      </b-table-column>
    </template>

    <template slot="empty">
      <section class="section">
        <div class="content has-text-grey has-text-centered">
          <p>
            <b-icon
              icon="emoticon-sad"
              size="is-large"
            />
          </p>
          <p>Nada para mostrar.</p>
        </div>
      </section>
    </template>
  </b-table>
</template>

<script>
import { alertErrorMessage, alertSuccessMessage, alertInfoMessage } from "@/utilities/helpers"
import { authComputed } from "@/store/helpers"
import { formatMoney } from "@mvp/utilities/helpers"
import { pagaresMethods, usersComputed } from "@mvp/store/helpers"

import app from "@/app"
import moment from "moment"

export default {

    props: {
        items: Array
    },

    data() {
        return {
            defaultOpenedDetails: [1],
            showDetailIcon: true
        }
    },

    computed: {
        ...authComputed,
        ...usersComputed,
    },

    methods: {
        ...pagaresMethods,

        formatMoney,

        handleAnularPagare(pagare) {
            var html
            if (pagare.enum_clasificacion_pagare === "RENTA") {
                window.axios.get(app.apiUrl + "/pagos/" + pagare.id)
                    .then(response => {
                        if (response) {
                            var boleta = response.data.data.debt
                            if (pagare.id_renta.enum_estado === "ACTIVO") {
                                var multa = boleta.description.items.find(item => item.label.indexOf("Multa") > -1)
                                if (multa) {
                                    html = "<p class='mb-3'>No es posible anular un pago de renta para un contrato activo. Sin embargo, puede anular el pago de multa asociado:</p><p class='mb-3'><i>" + multa.label + ": " + formatMoney(multa.amount.currency, multa.amount.value) + "</i></p><p>Una vez anulada no se generarán multas adicionales por la renta del mes asociado.</p><strong>Esta operación no se puede revertir</strong>.<br>¿Confirma la operación?</p>"
    
                                    app.$swal({
                                        title: "Anulación de Pago",
                                        html: html,
                                        type: "warning",
                                        showCancelButton: true,
                                        cancelButtonText: "No, cancelar",
                                        confirmButtonText: "Sí, estoy seguro",
                                        showLoaderOnConfirm: true,
                                        preConfirm: ()=> {
                                            return this.anularPagareRenta(pagare.id)
                                        },
                                        allowOutsideClick: false,
                                    })
                                        .then(result => {
                                            var dismiss = result.dismiss
                                            if (dismiss) {
                                                return null
                                            }

                                            var value = result.value
                                            if (!value.pagare) {
                                                var response = value.response
                                                var message = response.data ? response.data.message : response.message
                                                alertErrorMessage("Anulación de Pago", message)
                                            } else {
                                                this.$parent.$parent.$parent.prepare()
                                                alertSuccessMessage("Hecho", "El pago fue anulado.")
                                            }

                                            return response
                                        })
                                        .catch(error => {
                                            var message = error.data ? error.data.message : error.message
                                            alertErrorMessage(message)
                                            return message
                                        })
                                } else {
                                    html = "<p class='mb-3'>No es posible anular un pago de renta para un contrato activo. Sin embargo, puede anular el pago de multa asociado:</p><p class='mb-3'><i>No hay pagos de multa asociados.</i></p>"
    
                                    alertInfoMessage("Anulación de Pago", html)
                                }
                            } else if (pagare.id_renta.enum_estado === "FINALIZADO") {
                                var items = boleta.description.items
                                html = "<p class='mb-3'>Está a punto de anular un pago renta para un contrato finalizado. Serán anulados los siguientes conceptos:</p>"

                                items.forEach(item => {
                                    html = html + "<p class='mb-3'><i>" + item.label + ": " + formatMoney(item.amount.currency, item.amount.value) + "</i></p>"
                                })

                                html = html + "<strong>Esta operación no se puede revertir</strong>.<br>¿Confirma la operación?</p>"

                                app.$swal({
                                    title: "Anulación de Pago",
                                    html: html,
                                    type: "warning",
                                    showCancelButton: true,
                                    cancelButtonText: "No, cancelar",
                                    confirmButtonText: "Sí, estoy seguro",
                                    showLoaderOnConfirm: true,
                                    preConfirm: ()=> {
                                        return this.anularPagareRenta(pagare.id)
                                    },
                                    allowOutsideClick: false,
                                })
                                    .then(result => {
                                        var dismiss = result.dismiss
                                        if (dismiss) {
                                            return null
                                        }

                                        var value = result.value
                                        if (!value.pagare) {
                                            var response = value.response
                                            var message = response.data ? response.data.message : response.message
                                            alertErrorMessage("Anulación de Pago", message)
                                        } else {
                                            this.$parent.$parent.$parent.prepare()
                                            alertSuccessMessage("Hecho", "El pago fue anulado.")
                                        }

                                        return response
                                    })
                                    .catch(error => {
                                        var message = error.data ? error.data.message : error.message
                                        alertErrorMessage(message)
                                        return message
                                    })
                            }
                        }

                        return boleta
                    })
            } else if (pagare.enum_clasificacion_pagare === "OTRO") {
                html = "Está a punto de anular una solicitud de pago para un contrato activo.<br><strong>Esta operación no se puede revertir</strong>.<br>¿Confirma la operación?</p> "

                app.$swal({
                    title: "Anulación de Pago",
                    html: html,
                    type: "warning",
                    showCancelButton: true,
                    cancelButtonText: "No, cancelar",
                    confirmButtonText: "Sí, estoy seguro",
                    showLoaderOnConfirm: true,
                    preConfirm: ()=> {
                        return this.anularPagareRenta(pagare.id)
                    },
                    allowOutsideClick: false,
                })
                    .then(result => {
                        var dismiss = result.dismiss
                        if (dismiss) {
                            return null
                        }

                        var value = result.value
                        if (!value.pagare) {
                            var response = value.response
                            var message = response.data ? response.data.message : response.message
                            alertErrorMessage("Anulación de Pago", message)
                        } else {
                            this.$parent.$parent.$parent.prepare()
                            alertSuccessMessage("Hecho", "El pago fue anulado.")
                        }

                        return response
                    })
                    .catch(error => {
                        var message = error.data ? error.data.message : error.message
                        alertErrorMessage(message)
                        return message
                    })
            }
        },

        moment,
    }
}
</script>
