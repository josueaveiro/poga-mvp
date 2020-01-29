<style lang="scss">
.navbar-burger {
  display: none;
}

.navbar-brand {
  padding: 0;

  img {
    width: 6rem;
    height: 100%;
    max-height: 100%;
  }
}
</style>

<template>
  <b-navbar class="is-primary">
    <template slot="brand">
      <b-navbar-item
        tag="router-link"
        :to="{ path: '/' }"
      >
        <img
          src="http://7vidas.com.ar/poga/wp-content/uploads/2019/12/logoblanco.svg"
          alt="POGA"
        >
      </b-navbar-item>
    </template>
  </b-navbar>
</template>
