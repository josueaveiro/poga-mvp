<style lang="scss">
.caracteristics_list {
  &-item {
    display: inline-block;
    padding: 0.5rem 1rem;
    width: 50%;
  }
}

.map {
  height: 20rem;
  width: 100%;
}
</style>

<template>
  <div>
    <div class="container">
      <div class="columns">
        <div class="column is-4" />
        <div class="column is-8">
          <h1 class="title is-3">
            ¡Hola! Soy {{ oneUsuario.id_persona.nombre }}
          </h1>
          <h5 class="subtitle is-6">
            Registrado desde {{ moment(oneUsuario.created_at).format("DD/MM/YYYY") }}
          </h5>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { usersComputed, usersMethods } from "@mvp/store/helpers"
import moment from "moment"

export default {
    data() {
        return {
            prepared: false,
        }
    },

    computed: {
        ...usersComputed,
    },

    created() {
        return this.prepare().then(this.prepared = true)
    },

    methods: {
        ...usersMethods,

        moment,

        prepare() {
            var usuario = this.fetchOneUsuario(this.$route.params.id)

            return Promise.all([usuario])
        }
    }
}
</script>
