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

            <div v-if="!onePagare.ley_emergencia" class="panel-heading">
              <p class="m-0">
                Total a pagar por el mes {{ moment(boleta.debt.validPeriod.start).format("MM/YYYY") }}
              </p>
              <h3 class="title is-3 m-0">
                {{ formatMoney(boleta.debt.amount.currency, boleta.debt.amount.value) }}
              </h3>
            </div>

            <div v-else class="panel-heading">
              <table class="table is-striped">
                <tbody>
                  <tr>
                    <td>Monto del pago mínimo</td>
                    <td>{{ formatMoney(onePagare.id_moneda.abbr, onePagare.monto_minimo) }}</td>
                    <td>
                      <b-radio v-model="form.enum_opcion_pago"
                        name="enum_opcion_pago"
                        native-value="MINIMO"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Deuda total al cierre</td>
                    <td>{{ formatMoney(onePagare.id_moneda.abbr, onePagare.monto) }}</td>
                    <td>
                      <b-radio v-model="form.enum_opcion_pago"
                        name="enum_opcion_pago"
                        native-value="TOTAL"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td>Otro monto</td>
                    <td><b-input name="monto_manual" v-model="form.monto_manual" type="number" /></td>
                    <td>
                      <b-radio v-model="form.enum_opcion_pago"
                        name="enum_opcion_pago"
                        native-value="MANUAL"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
              <b-button @click="handleSubmitForm" type="is-primary">Actualizar boleta</b-button>
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
                <td>{{ formatMoney(item.amount.currency, item.amount.value) }}</td>
              </tr>
              <tr v-if="!boleta.debt.description.items">
                <td>{{ boleta.debt.label }}</td>
                <td>{{ formatMoney(boleta.debt.amount.currency, boleta.debt.amount.value) }}</td>
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
              <a
                v-if="!isAuthenticated"
                :href="'https://test-payments.poga.com.py/pay/mavaite/debtdoc/' + $route.params.id"
                class="button is-large is-primary"
                target="_blank"
                style="background-color:#ff6347;"
              >
                <img
                  src="/img/logoblanco_pagos.png"
                  style="width:8rem;"
                >
              </a>
              <a
                v-else
                :href="'https://test-payments.poga.com.py/pay/mavaite/debtdoc/' + $route.params.id + '?userid=' + tokenForPayments"
                class="button is-large is-primary"
                target="_blank"
                style="background-color:#ff6347;"
              >
                <img
                  src="/img/logoblanco_pagos.png"
                  style="width:8rem;"
                >
              </a>
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
import { alertErrorMessage, alertSuccessMessage } from "@/utilities/helpers"
import { authComputed } from "@/store/helpers"
import { formatMoney } from "@mvp/utilities/helpers"
import { pagaresComputed, pagaresMethods, usersComputed, usersMethods } from "@mvp/store/helpers"

import app from "@/app"
import moment from "moment"
import Form from "@/utilities/Form"

var fields = {
    enum_opcion_pago: "TOTAL",
    monto_manual: 0,
}

export default {
    data() {
        return {
            boleta: {},
            form: new Form(fields),
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
    },

    created() {
        return this.prepare().then(this.prepared = true)
    },

    methods: {
        ...pagaresMethods,
        ...usersMethods,

        formatMoney,

        handleLogin() {
            var intended = "/realiza-un-pago/" + this.$route.params.id
            return this.$router.push({ name: "Login", query: { intended: encodeURI(intended) }})
        },

        handleSubmitForm() {
            return this.form.put(app.apiUrl + "/finanzas/actualizarMontoPago/" + this.$route.params.id)
            .then(response => {
                alertSuccessMessage("Realiza un pago", "El monto de la boleta fue actualizado.")

                return this.prepare()
            })
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

            pagare.then(response => {
                this.form = new Form({
                    enum_opcion_pago: response.enum_opcion_pago,
                    monto_manual: response.monto_manual,
                })

                return response
            })

            return Promise.all([boleta, pagare])
        }
    }
}
</script>
