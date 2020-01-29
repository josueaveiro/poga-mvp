
/**
 * First we will load all of this project"s JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require("@mvp/router")
require("@mvp/store")

import { app } from "@/app"
import Vue from "vue"
import VueCarousel from "vue-carousel"

Vue.use(VueCarousel)

Vue.config.silent = true

/**
 * The following block of code may be used to automatically register your
 * Vue components. It will recursively scan this directory for the Vue
 * components and automatically register them with their "basename".
 *
 * Eg. ./components/ExampleComponent.vue -> <example-component></example-component>
 */

const files = require.context("./", true, /\.vue$/i)
files.keys().map(key => Vue.component(key.split("/").pop().split(".")[0], (resolve) => resolve(files(key))).default)
