<template>
  <section>
    <b-loading
      :is-full-page="true"
      :active.sync="allPagosPending"
      :can-cancel="true"
    />

    <div class="columns">
      <div class="column is-6">
        <b-field expanded>
          <b-select
            v-model="filters.enum_clasificacion_pagare"
            size="is-medium"
            @input="fetchAllPagares(filters)"
          >
            <option value="">
              Todos los tipos de pago
            </option>
            <option value="RENTA">
              Renta
            </option>
            <option value="OTRO">
              Solicitud de pago
            </option>
            <option value="COMISION">
              Comisión
            </option>
          </b-select>
        </b-field>
        <b-field grouped>
          <b-field>
            <b-select
              v-model="mes_desde"
              size="is-medium"
              @input="fetchAllPagares(filters)"
            >
              <option value="">
                Desde mes
              </option>
              <option value="01">
                Enero
              </option>
              <option value="02">
                Febrero
              </option>
              <option value="03">
                Marzo
              </option>
              <option value="04">
                Abril
              </option>
              <option value="05">
                Mayo
              </option>
              <option value="06">
                Junio
              </option>
              <option value="07">
                Julio
              </option>
              <option value="08">
                Agosto
              </option>
              <option value="09">
                Septiembre
              </option>
              <option value="10">
                Octubre
              </option>
              <option value="11">
                Noviembre
              </option>
              <option value="12">
                Diciembre
              </option>
            </b-select>
          </b-field>
          <b-field>
            <b-select
              v-model="anno_desde"
              size="is-medium"
              @input="fetchAllPagares(filters)"
            >
              <option value="2020">
                2020
              </option>
              <option value="2019">
                2019
              </option>
            </b-select>
          </b-field>
        </b-field>
      </div>

      <div class="column is-6">
        <b-field>
          <b-select
            v-model="filters.id_inmueble"
            size="is-medium"
            @input="fetchAllPagares(filters)"
          >
            <option value="">
              Todos los inmuebles
            </option>
            <optgroup
              v-for="item in allInmuebles.filter(item => item.id_inmueble.id_tipo_inmueble.id == 1)"
              key="item.id"
              :label="item.nombre"
            >
              <option
                v-for="unidad in item.unidades"
                :key="unidad.id"
                :value="unidad.id_inmueble.id"
              >
                Piso {{ unidad.piso }} - Número {{ unidad.numero }}
              </option>
            </optgroup>
            <option
              v-for="item in allInmuebles.filter(item => item.id_inmueble.id_tipo_inmueble.id == 2)"
              :value="item.id_inmueble.id"
            >
              {{ item.nombre }}
            </option>
          </b-select>
        </b-field>

        <b-field grouped>
          <b-field>
            <b-select
              v-model="mes_hasta"
              size="is-medium"
              @input="fetchAllPagares(filters)"
            >
              <option value="">
                Hasta mes
              </option>
              <option value="01">
                Enero
              </option>
              <option value="02">
                Febrero
              </option>
              <option value="03">
                Marzo
              </option>
              <option value="04">
                Abril
              </option>
              <option value="05">
                Mayo
              </option>
              <option value="06">
                Junio
              </option>
              <option value="07">
                Julio
              </option>
              <option value="08">
                Agosto
              </option>
              <option value="09">
                Septiembre
              </option>
              <option value="10">
                Octubre
              </option>
              <option value="11">
                Noviembre
              </option>
              <option value="12">
                Diciembre
              </option>
            </b-select>
          </b-field>
  
          <b-field>
            <b-select
              v-model="anno_hasta"
              size="is-medium"
              @input="fetchAllPagares(filters)"
            >
              <option value="2020">
                2020
              </option>
              <option value="2019">
                2019
              </option>
            </b-select>
          </b-field>
        </b-field>
      </div>
    </div>

    <h3 class="title is-4">
      Mis Pagos
    </h3>
    
    <b-tabs v-model="activeTab">
      <b-tab-item label="Pendientes">
        <b-loading
          :is-full-page="false"
          :active.sync="allPagaresPending"
          :can-cancel="true"
        />
        <b-button
          :disabled="allPagaresPending"
          :loading="allPagaresPending"
          type="is-primary"
          size="is-small"
          outlined
          rounded
          @click="handleReportDownload('PENDIENTE')"
        >
          Exportar a Excel
        </b-button>
        <PagosTable :items="allPagares.filter(pagare => pagare.enum_estado === 'PENDIENTE' && pagare.enum_clasificacion_pagare !== 'COMISION')" />
      </b-tab-item>

      <b-tab-item label="Pagados">
        <b-loading
          :is-full-page="false"
          :active.sync="allPagaresPending"
          :can-cancel="true"
        />
        <b-button
          :disabled="allPagaresPending"
          :loading="allPagaresPending"
          type="is-primary"
          size="is-small"
          outlined
          rounded
          @click="handleReportDownload('PAGADO')"
        >
          Exportar a Excel
        </b-button>
        <PagosTable :items="allPagares.filter(pagare => pagare.enum_estado === 'PAGADO' && pagare.enum_clasificacion_pagare !== 'COMISION')" />
      </b-tab-item>

      <b-tab-item
        v-if="user.role_id == 4"
        label="Anulados"
      >
        <b-loading
          :is-full-page="false"
          :active.sync="allPagaresPending"
          :can-cancel="true"
        />
        <b-button
          :disabled="allPagaresPending"
          :loading="allPagaresPending"
          type="is-primary"
          size="is-small"
          outlined
          rounded
          @click="handleReportDownload('ANULADO')"
        >
          Exportar a Excel
        </b-button>
        <PagosTable :items="allPagares.filter(pagare => pagare.enum_estado === 'ANULADO' && pagare.enum_clasificacion_pagare !== 'COMISION')" />
      </b-tab-item>

      <b-tab-item
        v-if="user.role_id == 4"
        label="Transferidos"
      >
        <b-loading
          :is-full-page="false"
          :active.sync="allPagaresPending"
          :can-cancel="true"
        />
        <b-button
          :disabled="allPagaresPending"
          :loading="allPagaresPending"
          type="is-primary"
          size="is-small"
          outlined
          rounded
          @click="handleReportDownload('TRANSFERIDO')"
        >
          Exportar a Excel
        </b-button>
        <PagosTable :items="allPagares.filter(pagare => pagare.enum_estado === 'TRANSFERIDO')" />
      </b-tab-item>
    </b-tabs>

    <b-button
      v-if="user.role_id == 4||user.role_id == 1"
      class="mb-5"
      type="is-primary"
      native-type="button"
      size="is-medium"
      @click="handleMontoExpensasModal"
    >
      Solicitar Pago
    </b-button>

    <MontoExpensasModal :is-active="isMontoExpensasModalActive" />
  </section>
</template>

<script>
import { authComputed } from "@/store/helpers"
import { inmueblesComputed, pagaresComputed, pagaresMethods, usersComputed, usersMethods } from "@mvp/store/helpers"

import app from "@/app"
import moment from "moment"

export default {
    data(){
        return {
            activeTabs: 0,
            anno_desde: moment().format("Y"),
            anno_hasta: moment().format("Y"),
            defaultOpenedDetails: [1],
            filters: {
                enum_clasificacion_pagare: "",
                id_inmueble: "",
                fecha_pagare_desde: "",
                fecha_pagare_hasta: "",
                tipoListado: "MisPagos"
            },
            isMontoExpensasModalActive: false,
            mes_desde: "",
            mes_hasta: "",
            prepared: false,
            showDetailIcon: true
        }
    },

    computed: {
        ...authComputed,
        ...inmueblesComputed,
        ...pagaresComputed,
        ...usersComputed,
    },

    watch: {
        anno_desde (value) {
            var fecha = moment(value + "-" + this.mes_desde).startOf("month").format("YYYY-MM-DD")
            this.filters.fecha_pagare_desde = fecha
        },

        anno_hasta (value) {
            var fecha = moment(value + "-" + this.mes_hasta).endOf("month").format("YYYY-MM-DD")
            this.filters.fecha_pagare_desde = fecha
        },

        mes_desde (value) {
            var fecha = moment(this.anno_desde + "-" + value).startOf("month").format("YYYY-MM-DD")
            this.filters.fecha_pagare_desde = fecha
        },

        mes_hasta (value) {
            var fecha = moment(this.anno_hasta + "-" + value).endOf("month").format("YYYY-MM-DD")
            this.filters.fecha_pagare_hasta = fecha
        },
    },

    created() {
        return this.prepare().then(this.prepared = true)
    },

    methods: {
        ...pagaresMethods,
        ...usersMethods,

        moment,

        handleMontoExpensasModal() {
            this.isMontoExpensasModalActive = true
        },

        handleReportDownload(estado) {
            var filters = this.filters
            filters["enum_estado"] = estado

            return window.axios.get(app.apiUrl + "/reportes", { params: this.filters })
                .then(value => {
                    var link = document.createElement("a")
                    link.href = "https://testing.api.poga.com.py/storage/" + value.data.data
                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)
                })
        },

        prepare() {
            var tokenForPayments = this.fetchTokenForPayments()

            var pagares = this.fetchAllPagares(this.filters)

            return Promise.all([tokenForPayments, pagares])
        }
    },
}
</script>
