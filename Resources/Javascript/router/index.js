import * as middleware from "./middleware"
import multiguard from "vue-router-multiguard"
import router from "@/router"

router.addRoutes([
    {
        beforeEnter: multiguard([middleware.redirectIfNotAuthenticated, middleware.redirectIfMobilePhoneIsIncomplete]),
        component: asyncView("Inmuebles/Create"),
        name: "Crear Inmueble",
        path: "/inmuebles/crear"
    },
    {
        beforeEnter: multiguard([middleware.redirectIfNotAuthenticated, middleware.redirectIfAccountIsIncomplete]),
        component: asyncView("Rentas/Create"),
        name: "Crear Renta",
        path: "/rentas/crear",
    },
    {
        beforeEnter: multiguard([middleware.redirectIfNotAuthenticated, middleware.redirectIfMobilePhoneIsIncomplete]),
        component: asyncView("Inmuebles/Edit"),
        name: "Editar Inmueble",
        path: "/inmuebles/:id/editar"
    },
    {
        beforeEnter: multiguard([middleware.redirectIfNotAuthenticated, middleware.redirectIfAccountIsIncomplete]),
        component: asyncView("Rentas/Edit"),
        name: "Editar Renta",
        path: "/rentas/:id/editar"
    },
    {
        beforeEnter: multiguard([middleware.redirectIfNotAuthenticated, middleware.redirectIfMobilePhoneIsIncomplete]),
        component: asyncView("Unidades/Edit"),
        name: "Editar Unidad",
        path: "/unidades/:id/editar"
    },
    {
        beforeEnter: multiguard([middleware.redirectIfNotAuthenticated, middleware.redirectIfAccountIsIncomplete]),
        component: asyncView("Rentas/Finalizar"),
        name: "Finalizar Renta",
        path: "/rentas/:id/finalizar",
    },
    {
        children: [
            {
                beforeEnter: multiguard([middleware.redirectIfNotAuthenticated]),
                meta: {
                    header: "B",
                },
                name: "Datos Personales",
                path: "",
                component: asyncView("Cuenta/DatosPersonales"),
            },
            {
                beforeEnter: multiguard([middleware.redirectIfNotAuthenticated, middleware.redirectIfMobilePhoneIsIncomplete]),
                meta: {
                    header: "B",
                },
                name: "Mis Inmuebles",
                path: "/cuenta/mis-inmuebles",
                component: asyncView("Cuenta/MisInmuebles")
            },
            {
                beforeEnter: multiguard([middleware.redirectIfNotAuthenticated, middleware.redirectIfAccountIsIncomplete]),
                meta: {
                    header: "B",
                },
                name: "Mis Pagos",
                path: "/cuenta/mis-pagos",
                component: asyncView("Cuenta/MisPagos")
            },
            {
                beforeEnter: multiguard([middleware.redirectIfNotAuthenticated, middleware.redirectIfAccountIsIncomplete]),
                meta: {
                    header: "B",
                },
                name: "Mis Rentas",
                path: "/cuenta/mis-rentas",
                component: asyncView("Cuenta/MisRentas"),
            },
        ],
        beforeEnter: middleware.redirectIfNotAuthenticated,
        component: asyncView("Cuenta/Cuenta"),
        path: "/cuenta",
    },
    {
        beforeEnter: multiguard([middleware.redirectIfNotAuthenticated, middleware.redirectIfMobilePhoneIsIncomplete]),
        name: "Fotos Inmueble",
        path: "/inmuebles/:id/fotos",
        component: asyncView("Inmuebles/Fotos"),
    },	
    {
        beforeEnter: multiguard([middleware.redirectIfNotAuthenticated, middleware.redirectIfMobilePhoneIsIncomplete]),
        name: "Fotos Unidad",
        path: "/unidades/:id/fotos",
        component: asyncView("Unidades/Fotos"),
    },
    {
        component: asyncView("Cuenta/MobilePhoneCompletion"),
        meta: {
            footer: false
        },
        name: "MobilePhoneCompletion",
        path: "/actualiza-tu-celular",
    },
    {
        beforeEnter: middleware.redirectIfAuthenticated,
        component: asyncView("auth/GuestRegister"),
        meta: {
            footer: false
        },
        name: "Registro Invitado",
        path: "/registro-invitado/:codigoValidacion"
    },
    {
        beforeEnter: multiguard([middleware.redirectIfNotAuthenticated, middleware.redirectIfAccountIsIncomplete]),
        component: asyncView("Rentas/Renovar"),
        name: "Renovar Renta",
        path: "/rentas/:id/renovar",
    },
    {
        component: asyncView("Home"),
        name: "Home",
        path: "/",
        redirect: "/cuenta/mis-inmuebles",
    },
    {
        beforeEnter: middleware.redirectIfAuthenticated,
        component: asyncView("auth/Login"),
        meta: {
            footer: false
        },
        name: "Login",
        path: "/login"
    },
    {
        component: asyncView("Inmuebles/PerfilPublico"),
        meta: {
            header: "C"
        },
        name: "Perfil Publico Inmueble",
        path: "/inmuebles/:id/perfil-publico",
    },
    {
        component: asyncView("Unidades/PerfilPublico"),
        meta: {
            header: "C"
        },
        name: "Perfil Publico Unidad",
        path: "/unidades/:id/perfil-publico",
    },
    {
        component: asyncView("legal/PolicyOfPrivacy"),
        name: "Policy of Privacy",
        path: "/politica-de-privacidad",
    },
    {
        component: asyncView("RealizaUnPago"),
        meta: {
	    header: "C",
            footer: false
        },
        name: "Realiza un Pago",
        path: "/realiza-un-pago/:id",
    },
    {
        component: asyncView("auth/ReenviarInvitacionRegistro"),
        meta: {
            footer: false
        },
        name: "Reenviar Invitacion Registro",
        path: "/reenviar-invitacion-registro",
    },
    {
        beforeEnter: middleware.redirectIfAuthenticated,
        component: asyncView("auth/Register"),
        meta: {
            footer: false
        },
        name: "Register",
        path: "/register"
    },
    {
        beforeEnter: middleware.redirectIfNotAuthenticated,
        component: asyncView("auth/RegisterCompletion"),
        meta: {
            footer: false
        },
        name: "RegisterCompletion",
        path: "/completa-tu-registro"
    },
    {
        name: "Retorno Pagos",
        path: "/pagos/retorno",
        redirect: "/cuenta/mis-pagos",
    },
    {
        component: asyncView("legal/TermsAndConditions"),
        name: "Terms and Conditions",
        path: "/terminos-y-condiciones",
    },
    {
        beforeEnter: multiguard([middleware.redirectIfNotAuthenticated, middleware.redirectIfMobilePhoneIsIncomplete]),
        beforeEnter: middleware.redirectIfNotAuthenticated,
        component: asyncView("Inmuebles/Show"),
        meta: {
            footer: false
        },
        name: "Ver Inmueble",
        path: "/inmuebles/:id"
    },
    {
        beforeEnter: multiguard([middleware.redirectIfNotAuthenticated, middleware.redirectIfAccountIsIncomplete]),
        component: asyncView("Rentas/Show"),
        name: "Ver Renta",
        path: "/rentas/:id"
    },
    {
        beforeEnter: multiguard([middleware.redirectIfNotAuthenticated, middleware.redirectIfMobilePhoneIsIncomplete]),
        beforeEnter: middleware.redirectIfNotAuthenticated,
        component: asyncView("Unidades/Show"),
        meta: {
            footer: false
        },
        name: "Ver Unidad",
        path: "/unidades/:id"
    },
    {
        beforeEnter: middleware.redirectIfNotAuthenticated,
        component: asyncView("Usuarios/Show"),
        meta: {
            footer: false
        },
        name: "Ver Usuario",
        path: "/usuarios/:id"
    },
])

/**
 * Load view.
 *
 * @param {string} name The filename (basename) of the view to load.
 */
function view(name) {
    return function() {
        require("./views/" + name + ".vue")
    }
}

/**
 * Asynchronously load view (Webpack Lazy loading compatible)
 *
 * @param {string} name The filename (basename) of the view to load.
 */
function asyncView(name) {
    return function(resolve) {
        require(["./views/" + name + ".vue"], resolve)
    }
}
