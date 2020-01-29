<style lang="scss" scoped>
.card-header {
  padding: 0;
}

.container {
  max-width: 960px;
}

.level-item img {
  max-height: 6rem;
  max-width: 10rem;
}
</style>

<template>
  <section class="bg-light py-5">
    <div
      v-if="boleta.debt"
      class="container"
    >
      <h3 class="title is-3">
        Estado de Cuenta del {{ moment(boleta.debt.validPeriod.start).format("MM/YYYY") }}
      </h3>
      <div class="card">
        <div class="card-header">
          <p class="card-header-title">
            Datos del Contrato
          </p>
        </div>
        <div class="card-content">
          <div class="content">
            <p>Propiedad en Alquiler: {{ onePagare.id_unidad ? onePagare.id_unidad.id_inmueble_padre.nombre : onePagare.id_inmueble.id_inmueble_padre.nombre }}</p>
            <p v-if="onePagare.id_renta">
              Período del contrato: {{ moment(onePagare.id_renta.fecha_inicio).format("DD/MM/YYYY") }} a {{ moment(onePagare.id_renta.fecha_fin).format("DD/MM/YYYY") }}
            </p>
            <p>Inquilino: {{ onePagare.id_renta.id_inquilino.enum_tipo_persona === 'FISICA' ? (onePagare.id_renta.id_inquilino.nombre + ' ' + onePagare.id_renta.id_inquilino.apellido) : onePagare.id_renta.id_inquilino.nombre }}</p>
            <p>Propietario: {{ onePagare.id_persona_acreedora.enum_tipo_persona === 'FISICA' ? (onePagare.id_persona_acreedora.nombre + ' ' + onePagare.id_persona_acreedora.apellido) : onePagare.id_persona_acreedora.nombre }}</p>
            <div class="panel-heading">
              <p class="m-0">
                Total a pagar por el mes {{ moment(boleta.debt.validPeriod.start).format("MM/YYYY") }}
              </p>
              <h3 class="title is-3 m-0">
                {{ boleta.debt.amount.value }} {{ onePagare.id_moneda.abbr }}
              </h3>
            </div>
          </div>
        </div>

        <div class="card-header">
          <p class="card-header-title">
            Detalles
          </p>
        </div>
        <div class="card-content">
          <table class="table">
            <tbody>
              <tr>
                <td>Vencimiento</td>
                <td>{{ moment(boleta.debt.validPeriod.end).format("DD/MM/YYYY") }}</td>
              </tr>
              <tr v-for="item in boleta.debt.description.items">
                <td>{{ item.label }}</td>
                <td>{{ item.amount.currency }} {{ item.amount.value }}</td>
              </tr>
              <tr v-if="!boleta.debt.description.items">
                <td>{{ boleta.debt.label }}</td>
                <td>{{ boleta.debt.amount.currency }} {{ boleta.debt.amount.value }}</td>
              </tr>
              <tr v-if="onePagare.enum_clasificacion_pagare === 'OTRO'">
                <td>Observación</td>
                <td>{{ onePagare.descripcion }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          v-if="!isAuthenticated"
          class="card-header"
        >
          <p class="card-header-title">
            Iniciá sesión
          </p>
        </div>
        <div
          v-if="!isAuthenticated"
          class="card-content"
        >
          <div class="columns">
            <div class="column">
              <p>Si sos el inquilino asociado al contrato y queres almacenar tus medios de pagos para simplificar más tus futuros pagos, ingresa a Poga.</p>
              <b-button
                size="is-medium"
                type="is-primary"
                @click="handleLogin"
              >
                Ingresá ahora
              </b-button>
            </div>
            <div
              class="is-divider-vertical"
              data-content="O"
            />
            <div class="column">
              <p class="mb-4">
                Si aún no te registraste y no recibiste la invitación, puedes generarla nuevamente.
              </p>

              <b-button
                size="is-medium"
                type="is-primary"
                @click="$router.push({ name: 'Reenviar Invitacion Registro' })"
              >
                Generar invitación
              </b-button>
            </div>
          </div>
        </div>

        <div class="card-header">
          <p class="card-header-title">
            Elegí un método de pago
          </p>
        </div>

        <div class="card-content">
          <div class="field">
            <div class="mb-3">
              <strong>Efectivo/Cheque</strong><br>
              <small>Acércate a las bocas de pago habilitadas y realiza el pago indicando el número de CI o RUC del inquilino. Bocas habilitadas:</small>
            </div>
            <div class="level">
              <div class="level-left">
                <div class="level-item">
                  <a
                    href="https://www.bancard.com.py/index.php/productos-servicios/personas/bocas-ic/"
                    target="_blank"
                  ><img src="/img/cobranzas.png"></a>
                </div>
              </div>
            </div>
          </div>
          <hr>
          <div class="field">
            <div class="mb-3">
              <strong>Pago por Internet(Tarjeta de Crédito/Débito)</strong><br>
              <small>"Acepta Visa, MasterCard, American Express, Diners Club, Discover"</small><br>
            </div>
            <div class="mb-3">
              <b-button
                v-if="!isAuthenticated"
                tag="a"
                :href="paymentsUrl + '/' + $route.params.id"
                class="is-primary"
                size="is-large"
                target="_blank"
                style="background-color:#ff6347;"
              >
                <img
                  src="/img/logoblanco.svg"
                  style="width:8rem;"
                >
              </b-button>
              <b-button
                v-else
                :href="paymentsUrl + '/' + $route.params.id + '?userid=' + tokenForPayments"
                tag="a"
                class="is-primary"
                size="is-large"
                target="_blank"
                style="background-color:#ff6347;"
              >
                <img
                  src="/img/logoblanco_pagos.png"
                  style="width:8rem;"
                >
              </b-button>
            </div>
            <div class="level">
              <div class="level-left">
                <div class="level-item">
                  <a
                    href="https://www.bancard.com.py/index.php/productos-servicios/personas/pagomovil/"
                    target="_blank"
                  ><img src="/img/bancard.png"></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { authComputed } from "@/store/helpers"
import { pagaresComputed, pagaresMethods, usersComputed, usersMethods } from "@mvp/store/helpers"

import app from "@/app"
import moment from "moment"

export default {
    data() {
        return {
            boleta: {},
            isEfectivoOpen: false,
            isIntenetOpen: true,
            isOpen: false,
            metodoPago: "internet",
            prepared: false,
        }
    },

    computed: {
        ...authComputed,
        ...pagaresComputed,
        ...usersComputed,

        paymentsUrl() {
            return app.paymentsUrl
        }
    },

    created() {
        return this.prepare().then(this.prepared = true)
    },

    methods: {
        ...pagaresMethods,
        ...usersMethods,

        handleLogin() {
            var intended = "/realiza-un-pago/" + this.$route.params.id
            return this.$router.push({ name: "Login", query: { intended: encodeURI(intended) }})
        },

        moment,

        prepare() {
            if (this.isAuthenticated) {
                this.fetchTokenForPayments()
            }

            var boleta = window.axios.get(app.apiUrl + "/pagos/" + this.$route.params.id)
                .then(value => {
                    if (value) {
                        this.boleta = value.data.data
                    }

                    return value.data.data
                })

            var pagare = this.fetchOnePagare(this.$route.params.id)

            return Promise.all([boleta, pagare])
        }
    }
}
</script>
