<style lang="scss" scoped>
.is-divider {
  margin-bottom: 1rem;
}
</style>

<template>
  <section>
    <h3 class="title mb-4 is-3">
      {{ title }}
    </h3>
    <form
      :aria-label="title"
      @keydown="form.errors.clear($event.target.name)"
      @submit.prevent="handleSubmitForm"
    >
      <p class="mb-4">Por favor ingresa tu teléfono celular ya que no pudimos deducirlo de tus datos de cuenta en la red social seleccionada.</p>
      <b-field
        label="Teléfono celular (solo números) *"
        :type="setFieldType('id_persona.telefono_celular')"
        :message="getErrorMessage('id_persona.telefono_celular')"
        expanded
      >
        <b-input
          v-model="form.id_persona.telefono_celular"
          class="is-medium"
          placeholder="Teléfono celular"
          size="is-medium"
          type="number"
        />
      </b-field>
      <b-field>
        <b-button
          expanded
          :disabled="submitted"
          native-type="submit"
          size="is-medium"
          type="is-primary"
        >
          Actualizar datos
        </b-button>
      </b-field>
    </form>
  </section>
</template>

<script>
import { alertSuccessMessage, alertErrorMessage, deepClone } from "@/utilities/helpers"
import { authComputed, authMethods } from "@/store/helpers"

import app from "@/app"
import store from "@/store"
import Form from "@/utilities/Form"

var fields = deepClone(store.state.auth.user)

export default {
    data() {
        return {
            action: app.apiUrl + "/actualiza-tu-celular",
            form: new Form(fields),
            submitted: false,
            title: "Ingresá tu teléfono celular"
        }
    },

    computed: {
        ...authComputed,
    },

    methods: {
        ...authMethods,

        getErrorMessage(field) {
            if (this.form.errors.has(field)) {
                return this.form.errors.get(field)
            }
        },

        handleSubmitForm() {
            this.submitted = true

            return this.form.put(this.action)
                .then(()=> {
                    return this.validate()
                })
                .then(()=> {
                    var intended = this.$route.query.intended||"/"
                    alertSuccessMessage(this.title, "Tu registro fue completado.")
                    this.$router.push(intended)
                    return this.submitted = false
                }).catch(error => {
                    var message = error

                    if (error.status > 422) {
                        alertErrorMessage(this.title, message)
                    }

                    return this.submitted = false
                })
        },

        setFieldType(field) {
            var list
            if (this.form.errors.has(field)){
                list = "is-danger"
            }

            return list
        }
    }
}
</script>
