<template>
  <b-table
    ref="table"
    :data="items.length > 0 ? items : []"
    paginated
    icon-pack="fas"
    per-page="5"
    :opened-detailed="defaultOpenedDetails"
    detailed
    detail-key="id"
    :show-detail-icon="showDetailIcon"
    aria-next-label="Página siguiente"
    aria-previous-label="Página anterior"
    aria-page-label="Página"
    aria-current-label="Página actual"
  >
    <template slot-scope="props">
      <b-table-column
        field="nombre"
        label="Nombre"
        sortable
      >
        <template v-if="showDetailIcon">
          {{ props.row.nombre }}
        </template>
        <template v-else>
          <a @click="toggle(props.row)">
            {{ props.row.nombre }}
          </a>
        </template>
      </b-table-column>

      <b-table-column
        field="direccion"
        label="Ubicación"
        sortable
      >
        <template>
          {{ props.row.direccion }}
        </template>
      </b-table-column>

      <b-table-column
        field="created_at"
        label="Publicación"
        sortable
      >
        <template>
          {{ moment(props.row.created_at).format("DD/MM/YYYY") }}
        </template>
      </b-table-column>

      <b-table-column
        field="link_publico"
        sortable
      >
        <template>
          <b-dropdown aria-role="list">
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
              <RouterLink :to="{ name: 'Ver Inmueble', params: { id: props.row.id }}">
                Ver detalles
              </RouterLink>
            </b-dropdown-item>

            <b-dropdown-item
              v-if="user.role_id == 4"
              has-link="true"
              aria-role="listitem"
            >
              <RouterLink :to="{ name: 'Editar Inmueble', params: { id: props.row.id }}">
                Editar Inmueble
              </RouterLink>
            </b-dropdown-item>
          </b-dropdown>
        </template>
      </b-table-column>
    </template>

    <template
      slot="detail"
      slot-scope="props"
    >
      <div
        v-if="props.row.id_inmueble.id_tipo_inmueble.id == 1"
        class="media-content"
      >
        <div class="content">
          <UnidadMedia
            v-for="item in props.row.unidades"
            :item="item"
          />
        </div>
      </div>

      <div
        v-else
        class="media-content"
      >
        <div class="content">
          <InmuebleMedia :item="props.row" />
        </div>
      </div>
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
        ...authComputed
    },

    methods: {
        moment,
    }
}
</script>
