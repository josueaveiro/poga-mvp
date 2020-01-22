import actions from "./actions"
import getters from "./getters"
import mutations from "./mutations"

export function initialState()
{
    return {
        all: [],
        allPending: true,
        one: {
            enum_estado: "ACTIVO",
            enum_tipo_campo: "boolean",
            id_tipo_inmueble: "",
            id_caracteristica: "",
            id_grupo_caracteristica: "",
            id_tipo_caracteristica: "",
            pivot: {
                cantidad: 0,
                enum_estado: "ACTIVO",
                id_caracteristica_tipo_inmueble: ""
            }
        },
        onePending: true
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
