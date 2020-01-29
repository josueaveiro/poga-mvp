<style lang="scss">
// Import Bulma's core
@import "~bulma/sass/utilities/_all";

// Set your colors
$white: #ffffff;
$dark: #3d4b51;
$footer-color: $white;
$footer-background-color: $dark;
$primary: #fc7732;
$primary-invert: findColorInvert($primary);
$twitter: #4099FF;
$twitter-invert: findColorInvert($twitter);

// Setup $colors to use as bulma classes (e.g. 'is-twitter')
$colors: (
    "white": ($white, $black),
    "black": ($black, $white),
    "light": ($light, $light-invert),
    "dark": ($dark, $dark-invert),
    "primary": ($primary, $primary-invert),
    "info": ($info, $info-invert),
    "success": ($success, $success-invert),
    "warning": ($warning, $warning-invert),
    "danger": ($danger, $danger-invert),
    "twitter": ($twitter, $twitter-invert)
);

// Links
$link: $primary;
$link-invert: $primary-invert;
$link-focus-border: $primary;

// Import Bulma and Buefy styles
@import "~bulma";
@import "~buefy/src/scss/buefy";
@import "~bulma-extensions/bulma-divider/src/sass/index";

@import "~sweetalert2/src/variables";

$swal2-background: #fff;

@import "~sweetalert2/src/sweetalert2";
</style>

<template>
  <div id="app">
    <SiteHeader v-if="!$route.meta.header" />
    <SiteHeaderB v-if="$route.meta.header === 'B'" />
    <SiteHeaderC v-if="$route.meta.header === 'C'" />
    <RouterView />
    <SiteFooter v-if="false !== $route.meta.footer" />
  </div>
</template>

<script>
export default {
    name: "App",
}
</script>
