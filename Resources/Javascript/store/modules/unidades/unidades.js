import actions from "./actions"
import getters from "./getters"
import mutations from "./mutations"

export function initialState()
{
    return {
        all: [],
        allPending: true,
        one: {
            area: 0,
            area_estacionamiento: 0,
            caracteristicas: [],
            id_administrador_referente: "",
            id_formato_inmueble: "",
            id_inmueble_padre: {
                id_inmueble: {
                    caracteristicas: []
                }
            },
            id_medida: "",
            id_inmueble: {
                caracteristicas: [],
                id_inmueble_padre: "",
                id_tipo_inmueble: "",
                solicitud_directa_inquilinos: true,
            },
            id_propietario_referente: "",
            numero: "",
            piso: "",
        },
        onePending: true,
    }
}

const state = {
    initialState: initialState(),
    ...initialState()
}

export default {
    actions,
    getters,
    mutations,
    state
}
