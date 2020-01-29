<template>
  <form
    aria-label="Reenviar Invitación de registro"
    @keydown="form.errors.clear($event.target.name)"
    @submit.prevent="handeSubmitForm"
  >
    <b-field
      label="Identificación"
      :type="setFieldType('validador')"
      :message="getErrorMessage('validador')"
    >
      <b-input
        v-model="form.validador"
        :disabled="submitted"
        icon="envelope"
        size="is-medium"
        type="validador"
        placeholder="Email, CI o RUC"
      />
    </b-field>

    <b-field>
      <b-button
        :disabled="submitted"
        expanded
        native-type="submit"
        size="is-medium"
        type="is-primary"
      >
        Reenviar
      </b-button>
    </b-field>
  </form>
</template>

<script>
import { alertSuccessMessage, alertErrorMessage } from "@/utilities/helpers"

import app from "@/app"
import Form from "@/utilities/Form"

var fields = {
    validador: "",
}

export default {
    data() {
        return {
            form: new Form(fields),
            submitted: false
        }
    },

    methods: {
        getErrorMessage(field) {
            if (this.form.errors.has(field)) {
                return this.form.errors.get(field)
            }
        },

        handeSubmitForm() {
            this.submitted = true

            return this.form.post(app.apiUrl + "/reenviar-invitacion-registro").then(response => {
                this.form.reset()

                alertSuccessMessage("Reenviar Invitación de Registro", "La invitación fue reenviada.")
                this.$router.push({ path: response.redirect || "/" })

                return this.submitted = false
            }).catch(error => {
                if (error.status > 422) {
                    alertErrorMessage("Reenviar Invitación de Registro", error.data.message || error.message)
                }

                return this.submitted = false
            })
        },

        setFieldType(field) {
            if (this.form.errors.has(field)) {
                return "is-danger"
            }
        }
    }
}
</script>
