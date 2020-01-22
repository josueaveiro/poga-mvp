import actions from "./actions"
import getters from "./getters"
import mutations from "./mutations"

export function initialState()
{
    return {
        all: [],
        allPending: true,
        one: {
            enum_categoria: "",
            enum_estado: "ACTIVO",
            nombre: "",
            pivot: {
                cantidad: 0,
                foto: "",
                reparar: false,
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
