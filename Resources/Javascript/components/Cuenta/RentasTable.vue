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
        field="id"
        label="ID"
        width="40"
        numeric
      >
        {{ props.row.id }}
      </b-table-column>

      <b-table-column
        field="inmueble"
        label="Inmueble"
        sortable
      >
        <template v-if="showDetailIcon">
          {{ props.row.id_unidad ? (props.row.id_unidad.id_inmueble.direccion) : props.row.id_inmueble.direccion }}
        </template>
      </b-table-column>

      <b-table-column
        field="unidad"
        label="Unidad"
        sortable
      >
        <template v-if="showDetailIcon">
          {{ props.row.id_unidad ? ("Nº " + props.row.id_unidad.numero) : props.row.id_inmueble.id_inmueble_padre.nombre }}
        </template>
        <template v-else>
          <a @click="toggle(props.row)">
            Completar con textos comunicación
          </a>
        </template>
      </b-table-column>

      <b-table-column
        field="fecha_inicio"
        label="Fecha de inicio"
        sortable
      >
        <template>
          {{ moment(props.row.fecha_inicio).format("DD/MM/YYYY") }}
        </template>
      </b-table-column>

      <b-table-column
        field="fecha_fin"
        :label="props.row.enum_estado === 'FINALIZADO' ? 'Finalización efectiva' : 'Fecha de finalización'"
        sortable
      >
        <template>
          {{ moment((props.row.enum_estado === 'FINALIZADO' ? props.row.fecha_finalizacion_contrato : props.row.fecha_fin)).format("DD/MM/YYYY") }}
        </template>
      </b-table-column>

      <b-table-column
        v-if="user.role_id == 4"
        field="id_inquilino"
        label="Inquilino"
        sortable
      >
        <template>
          {{ props.row.id_inquilino.nombre_y_apellidos }}
        </template>
      </b-table-column>

      <b-table-column
        v-if="user.role_id == 3"
        field="id_propietario_referente"
        label="Propietario"
        sortable
      >
        <template>
          {{ props.row.id_inmueble.id_propietario_referente.id_persona.enum_tipo_persona === 'FISICA' ? "CI " + props.row.id_inmueble.id_propietario_referente.id_persona.ci : "RUC " + props.row.id_propietario_refernete.id_persona.ruc }}
        </template>
      </b-table-column>

      <b-table-column
        field="monto"
        label="Monto de renta mensual"
        sortable
      >
        <template>
          {{ props.row.monto }} {{ props.row.id_moneda.abbr }}
        </template>
      </b-table-column>

      <b-table-column
        field="acciones"
        label=""
      >
        <template>
          <b-dropdown
            aria-role="list"
          >
            <button
              slot="trigger"
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
              <RouterLink
                :to="{ name: 'Ver Renta', params: { id: props.row.id }}"
              >
                Ver detalles
              </RouterLink>
            </b-dropdown-item>

            <b-dropdown-item
              v-if="user.role_id == 4"
              :disabled="props.row.enum_estado === 'ACTIVO'||props.row.enum_estado === 'PENDIENTE'"
              has-link="true"
              aria-role="listitem"
            >
              <RouterLink
                v-if="props.row.enum_estado === 'ACTIVO'||props.row.enum_estado === 'PENDIENTE'"
                :to="{ name: 'Editar Renta', params: { id: props.row.id }}"
              >
                Editar Contrato
              </RouterLink>
              <a
                v-else
                class="is-disabled"
                href="javascript:void(0)"
              >
                Editar Contrato
              </a>
            </b-dropdown-item>

            <b-dropdown-item
              v-if="user.role_id == 4"
              :disabled="props.row.enum_estado !== 'ACTIVO'||props.row.enum_estado !== 'PENDIENTE_FINALIZACION'"
              has-link="true"
              aria-role="listitem"
            >
              <RouterLink
                v-if="props.row.enum_estado === 'ACTIVO'||props.row.enum_estado === 'PENDIENTE_FINALIZACION'"
                :to="{ name: 'Finalizar Renta', params: { id: props.row.id }}"
              >
                Finalizar
              </RouterLink>
              <a
                v-else
                class="is-disabled"
                href="javascript:void(0)"
              >
                Finalizar
              </a>
            </b-dropdown-item>

            <b-dropdown-item
              v-if="user.role_id == 4"
              :disabled="props.row.enum_estado === 'ACTIVO'"
              has-link="true"
              aria-role="listitem"
            >
              <RouterLink
                v-if="props.row.enum_estado === 'ACTIVO'"
                :to="{ name: 'Renovar Renta', params: { id: props.row.id }}"
              >
                Programar renovación
              </RouterLink>
              <a
                v-else
                class="is-disabled"
                href="javascript:void(0)"
              >
                Programar renovación
              </a>
            </b-dropdown-item>
          </b-dropdown>
        </template>
      </b-table-column>
    </template>
  </b-table>
</template>

<script>
import { authComputed } from "@/store/helpers"

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
    },

    methods: {
        moment,
    }
}
</script>
