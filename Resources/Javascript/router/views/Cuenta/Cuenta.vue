<template>
  <div>
    <div class="container">
      <div class="columns">
        <div class="column is-3">
          <b-menu>
            <b-menu-list label="Cuenta">
              <b-menu-item
                icon="account"
                label="Datos personales"
                tag="router-link"
                :to="{ name: 'Datos Personales' }"
              />
            </b-menu-list>
            <b-menu-list>
              <b-menu-item
                icon="home"
                label="Mis Inmuebles"
                tag="router-link"
                :to="{ name: 'Mis Inmuebles' }"
              />
            </b-menu-list>
            <b-menu-list>
              <b-menu-item
                icon="home"
                label="Mis Contratos"
                tag="router-link"
                :to="{ name: 'Mis Rentas' }"
              />
            </b-menu-list>
            <b-menu-list>
              <b-menu-item
                icon="home"
                label="Mis Pagos"
                tag="router-link"
                :to="{ name: 'Mis Pagos' }"
              />
            </b-menu-list>
            <b-menu-list label="Ayuda">
              <b-menu-item
                label="Contrato modelo"
                tag="a"
                href="/storage/doc/Contrato_de_locación_de_Inmueble_modelo_POGA_07012020.docx"
                target="_blank"
              />
            </b-menu-list>
            <b-menu-list label="Sesión">
              <b-menu-item
                label="Cerrar Sesión"
                tag="router-link"
                :to="{ name: 'Logout' }"
              />
            </b-menu-list>
          </b-menu>
        </div>

        <div class="column is-9">
          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>
