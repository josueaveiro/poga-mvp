<template>
  <div
    class="content"
    :item="item"
  >
    <article class="media">
      <figure class="media-left">
        <img
          v-if="item.id_inmueble.featured_photo"
          class="image is-64x64"
          style="object-fit:cover;"
          :src="item.id_inmueble.featured_photo.url"
        >
      </figure>
      <div class="article-content">
        <p>
          <strong>{{ item.id_inmueble.id_tipo_inmueble.tipo }}</strong>
          <!--<small>{{ item.id_formato_inmueble.formato }}</small>-->
          <br>
          <span v-if="item.id_inmueble.descripcion">{{ item.id_inmueble.descripcion }}</span><span v-else>No hay una descripción disponible para mostrar.</span>
        </p>
        <nav class="level is-mobile">
          <div class="level-left">
            <RouterLink
              v-if="user.role_id == 4"
              :to="{ name: 'Perfil Publico Inmueble', params: { id: item.id }}"
              target="_blank"
              class="level-item"
            >
              Link público
            </RouterLink>
            <RouterLink
              :to="{ name: 'Ver Inmueble', params: { id: item.id }}"
              class="level-item"
            >
              Ver detalles
            </RouterLink>
            <RouterLink
              v-if="user.role_id == 4"
              :to="{ name: 'Fotos Inmueble', params: { id: item.id }}"
              class="level-item"
            >
              Agrega o actualiza Fotos
            </RouterLink>
            <RouterLink
              v-if="user.role_id == 4"
              :to="{ name: 'Editar Inmueble', params: { id: item.id }}"
              class="level-item"
            >
              Editar
            </RouterLink>
          </div>
        </nav>
      </div>
    </article>
  </div>
</template>

<script>
import { authComputed } from "@/store/helpers"

export default {
    props: ["item"],

    computed: {
        ...authComputed
    }
}
</script>
