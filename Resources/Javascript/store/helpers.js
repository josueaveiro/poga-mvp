import { mapActions, mapGetters, mapState } from "vuex"

export const bancosComputed = {
    ...mapGetters("bancos", [
        "allBancosPending",
        "oneBancoPending"
    ]),

    ...mapState(
        "bancos", {
            allBancos: state => state.all,
            oneBanco: state => state.one,
        }
    ),
}

export const bancosMethods = {
    ...mapActions(
        "bancos", [
            "deleteOneBanco",
            "fetchAllBancos",
            "fetchOneBanco",
        ]
    )
}

export const caracteristicasTipoInmuebleComputed = {
    ...mapGetters("caracteristicasTipoInmueble", [
        "allCaracteristicasTipoInmueblePending",
        "oneCaracteristicaTipoInmueblePending"
    ]),

    ...mapState(
        "caracteristicasTipoInmueble", {
            allCaracteristicasTipoInmueble: state => state.all,
            oneCaracteristicaTipoInmueble: state => state.one,
        }
    ),
}

export const caracteristicasTipoInmuebleMethods = {
    ...mapActions(
        "caracteristicasTipoInmueble", [
            "deleteOneCaracteristicaTipoInmueble",
            "fetchAllCaracteristicasTipoInmueble",
            "fetchOneCaracteristicaTipoInmueble",
        ]
    )
}

export const estadosInmuebleComputed = {
    ...mapGetters("estadosInmueble", [
        "allEstadosInmueblePending",
        "oneEstadoInmueblePending"
    ]),

    ...mapState(
        "estadosInmueble", {
            allEstadosInmueble: state => state.all,
            oneEstadosInmueble: state => state.one,
        }
    ),
}

export const estadosInmuebleMethods = {
    ...mapActions(
        "estadosInmueble", [
            "deleteOneEstadosInmueble",
            "fetchAllEstadosInmueble",
            "fetchOneEstadosInmueble",
        ]
    )
}

export const formatosComputed = {
    ...mapGetters("formatos", [
        "allFormatosPending",
        "oneFormatoPending"
    ]),

    ...mapState(
        "formatos", {
            allFormatos: state => state.all,
            oneFormato: state => state.one,
        }
    ),
}

export const formatosMethods = {
    ...mapActions(
        "formatos", [
            "deleteOneFormato",
            "fetchAllFormatos",
            "fetchOneFormato",
        ]
    )
}

export const inmueblesComputed = {
    ...mapGetters("inmuebles", [
        "allInmueblesPending",
        "oneInmueblePending"
    ]),

    ...mapState(
        "inmuebles", {
            allInmuebles: state => state.all,
            oneInmueble: state => state.one,
        }
    ),
}

export const inmueblesMethods = {
    ...mapActions(
        "inmuebles", [
            "deleteOneInmueble",
            "fetchAllInmuebles",
            "fetchOneInmueble",
        ]
    )
}

export const monedasComputed = {
    ...mapGetters("monedas", [
        "allMonedasPending",
        "oneMonedaPending"
    ]),

    ...mapState(
        "monedas", {
            allMonedas: state => state.all,
            oneMoneda: state => state.one,
        }
    ),
}

export const monedasMethods = {
    ...mapActions(
        "monedas", [
            "deleteOneMoneda",
            "fetchAllMonedas",
            "fetchOneMoneda",
        ]
    )
}

export const pagaresComputed = {
    ...mapGetters("pagares", [
        "allPagaresPending",
        "onePagarePending"
    ]),

    ...mapState(
        "pagares", {
            allPagares: state => state.all,
            onePagare: state => state.one,
        }
    )
}

export const pagaresMethods = {
    ...mapActions(
        "pagares", [
            "anularPagareRenta",
            "deleteOnePagare",
            "fetchAllPagares",
            "fetchOnePagare",
        ]
    )
}

export const paisesComputed = {
    ...mapGetters("paises", [
        "allPaisesPending",
        "onePaisPending"
    ]),

    ...mapState(
        "paises", {
            allPaises: state => state.all,
        }
    ),
}

export const paisesMethods = {
    ...mapActions(
        "paises", [
            "fetchAllPaises",
        ]
    )
}

export const personasComputed = {
    ...mapGetters("personas", [
        "allPersonasPending",
        "onePersonaPending"
    ]),

    ...mapState(
        "personas", {
            allPersonas: state => state.all,
            onePersona: state => state.one,
        }
    ),
}

export const personasMethods = {
    ...mapActions(
        "personas", [
            "deleteOnePersona",
            "fetchAllPersonas",
            "fetchOnePersona",
        ]
    )
}

export const rentasComputed = {
    ...mapGetters("rentas", [
        "allRentasPending",
        "oneRentaPending"
    ]),

    ...mapState(
        "rentas", {
            allRentas: state => state.all,
            oneRenta: state => state.one,
        }
    ),
}

export const rentasMethods = {
    ...mapActions(
        "rentas", [
            "deleteOneRenta",
            "fetchAllRentas",
            "fetchOneRenta",
        ]
    )
}

export const rolesComputed = {
    ...mapGetters("roles", [
        "allRolesPending",
        "oneRolPending"
    ]),

    ...mapState(
        "roles", {
            allRoles: state => state.all,
            oneRol: state => state.one,
        }
    ),
}

export const rolesMethods = {
    ...mapActions(
        "roles", [
            "deleteOneRol",
            "fetchAllRoles",
            "fetchOneRol",
        ]
    )
}

export const unidadesComputed = {
    ...mapGetters("unidades", [
        "allUnidadesPending",
        "oneUnidadPending"
    ]),

    ...mapState(
        "unidades", {
            allUnidades: state => state.all,
            oneUnidad: state => state.one,
        }
    ),
}

export const unidadesMethods = {
    ...mapActions(
        "unidades", [
            "deleteOneUnidad",
            "fetchAllUnidades",
            "fetchOneUnidad",
        ]
    )
}

export const usersComputed = {
    ...mapGetters("users", [
        "allUsersPending",
        "oneUserPending"
    ]),

    ...mapState(
        "users", {
            oneGuest: state => state.oneGuest,
            oneUsuario: state => state.one,
            tokenForPayments: state => state.tokenForPayments,
        }
    )
}

export const usersMethods = {
    ...mapActions(
        "users", [
            "fetchOneGuest",
            "fetchOneUsuario",
            "fetchTokenForPayments",
        ]
    )
}
