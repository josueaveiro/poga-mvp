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
        field="enum_clasificacion"
        label="Clasificación"
        sortable
      >
        <template>
          {{ props.row.enum_clasificacion_pagare === 'COMISION_POGA' ? props.row.id_pagare_padre.enum_clasificacion_pagare.replace("_", " ") : props.row.enum_clasificacion_pagare.replace("_", " ") }}
        </template>
      </b-table-column>

      <b-table-column
        field="total"
        label="Monto"
        sortable
      >
        <template>
          {{ format_price((props.row.enum_clasificacion_pagare === 'COMISION_POGA' ? (props.row.id_pagare_padre.monto - props.row.monto) : props.row.total)) }}
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
              v-if="user.role_id == '4'"
              :disabled="true"
              has-link="true"
              aria-role="listitem"
            >
              <a
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
import { alertErrorMessage, alertSuccessMessage } from "@/utilities/helpers"
import { authComputed } from "@/store/helpers"
import { pagaresMethods, usersComputed } from "@mvp/store/helpers"

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

        format_price(price) {
            return Number(price).toLocaleString(undefined, { style: "currency", currency: "PYG" })
        },

        handleAnularPago(id) {
            return this.anularPagareRenta(id)
                .then(value => {
                    if (value) {
                        this.$parent.prepare()
                        return alertSuccessMessage("Mis Pagos", "El pago fue anulado.")
                    }
                })
                .catch(error => {
                    return alertErrorMessage("Mis Pago", error.data.message||error.message||error)
                })
        },

        moment,
    }
}
</script>
