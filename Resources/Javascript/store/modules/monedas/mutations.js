import * as types from "../../mutation-types"
import { initialState } from "./monedas"

export default {
    [types.MONEDAS_ERROR] (state, payload) {
        state.error = JSON.stringify(payload)
    },

    [types.MONEDAS_FETCH_ALL] (state, payload) {
        state.all = payload
    },

    [types.MONEDAS_FETCH_ALL_PENDING] (state, payload) {
        state.allPending = payload
    },

    [types.MONEDAS_FETCH_ONE] (state, payload) {
        state.one = payload
    },

    [types.MONEDAS_FETCH_ONE_PENDING] (state, payload) {
        state.onePending = payload
    },

    [types.MONEDAS_RESET] (state) {
        Object.assign(state, { initialState: initialState(), ...initialState() })
    },
}
