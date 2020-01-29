<template>
  <div>
    <h3 class="title is-4">
      Mis Inmuebles
    </h3>

    <b-tabs v-model="activeTab">
      <b-tab-item label="Activos">
        <b-loading
          :is-full-page="false"
          :active.sync="allInmueblesPending"
          :can-cancel="true"
        />
        <InmueblesTable :items="allInmuebles" />
      </b-tab-item>
    </b-tabs>
  </div>
</template>

<script>
import { authComputed } from "@/store/helpers"
import { inmueblesComputed, inmueblesMethods } from "@mvp/store/helpers"

import moment from "moment"

export default {
    data(){
        return {
            defaultOpenedDetails: [1],
            prepared: false,
            showDetailIcon: true
        }
    },

    computed: {
        ...authComputed,
        ...inmueblesComputed,
    },

    created() {
        return this.prepare().then(this.prepared = true)
    },

    methods: {
        ...inmueblesMethods,

        moment,

        prepare() {
            var inmuebles
           
            // Si el usuario es inquilino solo muestra inmuebles con Renta activa.
            if (this.user.role_id == 3) {
                inmuebles = this.fetchAllInmuebles({ tipoListado: "MisInmuebles", excluir: "sin_renta" }) 

            } else if (this.user.role_id == 4) {
                inmuebles = this.fetchAllInmuebles({ tipoListado: "MisInmuebles" })
            }

            return Promise.all([inmuebles])
        }
    },
}
</script>
