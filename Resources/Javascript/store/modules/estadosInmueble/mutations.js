import * as types from "../../mutation-types"
import { initialState } from "./estadosInmueble"

export default {
    [types.ESTADOS_INMUEBLE_ERROR] (state, payload) {
        state.error = JSON.stringify(payload)
    },

    [types.ESTADOS_INMUEBLE_FETCH_ALL] (state, payload) {
        state.all = payload
    },

    [types.ESTADOS_INMUEBLE_FETCH_ALL_PENDING] (state, payload) {
        state.allPending = payload
    },

    [types.ESTADOS_INMUEBLE_FETCH_ONE] (state, payload) {
        state.one = payload
    },

    [types.ESTADOS_INMUEBLE_FETCH_ONE_PENDING] (state, payload) {
        state.onePending = payload
    },

    [types.ESTADOS_INMUEBLE_RESET] (state) {
        Object.assign(state, { initialState: initialState(), ...initialState() })
    },
}
