import store from "@/store"

export const redirectIfAccountIsIncomplete = (to, from, next) => {
    var fieldsPropietario = ["nombre", "cuenta_bancaria", "direccion", "direccion_facturacion", "id_pais", "id_banco", "titular_cuenta", "telefono_celular", "ruc_facturacion"]
    var fieldsInquilino = ["nombre", "direccion", "id_pais", "telefono_celular"]

    var fieldsFisica = ["apellido", "ci", "fecha_nacimiento"]
    var fieldsJuridica = ["razon_social", "ruc"]

    var intended = to.fullpath !== "/logout" ? to.fullPath : "/"

    if (store.state.auth.role_id == 3) {
        fieldsInquilino.forEach(item => {
            if (!store.state.auth.user.id_persona[item]) {
                return next({ name: "RegisterCompletion", query: { intended: encodeURI(intended) }})
            }
        })
    }

    if (store.state.auth.role_id == 4) {
        fieldsPropietario.forEach(item => {
            if (!store.state.auth.user.id_persona[item]) {
	        return next({ name: "RegisterCompletion", query: { intended: encodeURI(intended) }})
            }
        })
    }

    fieldsFisica.forEach(item => {
        if (store.state.auth.user.id_persona.enum_tipo_persona === "FISICA" && !store.state.auth.user.id_persona[item]) {
            return next({ name: "RegisterCompletion" })
        }
    })

    fieldsJuridica.forEach(item => {
        if (store.state.auth.user.id_persona.enum_tipo_persona === "JURIDICA" && !store.state.auth.user.id_persona[item]) {
            return next({ name: "RegisterCompletion" })
        }
    })

    return next()
}

export const redirectIfNotAuthenticated = (to, from, next) => {
    var intended = to.fullpath !== "/logout" ? to.fullPath : "/"
    if (store.getters["auth/isAuthenticated"]) {
        return next()
    }

    return next({name: "Login", query: { intended: encodeURI(intended) }})

}

export const redirectIfAuthenticated = (to, from, next) => {
    if (!store.getters["auth/isAuthenticated"]) {
        return next()
    }

    return next({ name: "Home"})
}

export const redirectIfMobilePhoneIsIncomplete = (to, from, next) => {
    var intended = to.fullpath !== "/logout" ? to.fullPath : "/"

    if (!store.state.auth.user.id_persona.telefono_celular) {
        return next({ name: "MobilePhoneCompletion", query: { intended: encodeURI(intended) }})
    }

    return next()
}
