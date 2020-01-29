<template>
  <div>
    <h3 class="title is-4">
      Mis Contratos de Renta
    </h3>

    <b-tabs v-model="activeTab">
      <b-tab-item label="Activos">
        <b-loading
          :is-full-page="false"
          :active.sync="allRentasPending"
          :can-cancel="true"
        />
        <RentasTable :items="allRentas.filter(item => item.enum_estado === 'ACTIVO')" />
      </b-tab-item>

      <b-tab-item label="Pendientes">
        <b-loading
          :is-full-page="false"
          :active.sync="allRentasPending"
          :can-cancel="true"
        />
        <RentasTable :items="allRentas.filter(item => item.enum_estado === 'PENDIENTE')" />
      </b-tab-item>

      <b-tab-item label="Renovados">
        <b-loading
          :is-full-page="false"
          :active.sync="allRentasPending"
          :can-cancel="true"
        />
        <RentasTable :items="allRentas.filter(item => item.enum_estado === 'RENOVADO')" />
      </b-tab-item>

      <b-tab-item label="Finalizados">
        <b-loading
          :is-full-page="false"
          :active.sync="allRentasPending"
          :can-cancel="true"
        />
        <RentasTable :items="allRentas.filter(item => item.enum_estado === 'FINALIZADO')" />
      </b-tab-item>

      <b-tab-item label="Pendientes de Finalización">
        <b-loading
          :is-full-page="false"
          :active.sync="allRentasPending"
          :can-cancel="true"
        />
        <RentasTable :items="allRentas.filter(item => item.enum_estado === 'PENDIENTE_FINALIZACION')" />
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<script>
import { rentasComputed, rentasMethods } from "@mvp/store/helpers"

import moment from "moment"

export default {
    data(){
        return {
            activeTab: 0,
            defaultOpenedDetails: [1],
            prepared: false,
            showDetailIcon: true
        }
    },

    computed: {
        ...rentasComputed,
    },

    created() {
        return this.prepare().then(this.prepared = true)
    },

    methods: {
        ...rentasMethods,

        moment,

        prepare() {
            var rentas = this.fetchAllRentas({ tipoListado: "MisRentas" }) 

            return Promise.all([rentas])
        }
    },
}
</script>
