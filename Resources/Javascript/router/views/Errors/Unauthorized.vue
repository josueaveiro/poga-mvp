<template>
  <ErrorPage>
    <h4 
      slot="subtitle" 
      class="error__subtitle"
    >
      Error 401
    </h4>
    <h1 
      slot="title" 
      class="error__title"
    >
      No Autorizado
    </h1>
    <p 
      slot="description" 
      class="error__text"
    >
      No tenés permiso concedido para ingresar a esta página o sección.
    </p>
  </ErrorPage>
</template>
