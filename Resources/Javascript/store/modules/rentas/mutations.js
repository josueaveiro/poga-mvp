import * as types from "../../mutation-types"
import { initialState } from "./rentas"

export default {
    [types.RENTAS_ERROR] (state, payload) {
        state.error = JSON.stringify(payload)
    },

    [types.RENTAS_FETCH_ALL] (state, payload) {
        state.all = payload
    },

    [types.RENTAS_FETCH_ALL_PENDING] (state, payload) {
        state.allPending = payload
    },

    [types.RENTAS_FETCH_ONE] (state, payload) {
        state.one = payload
    },

    [types.RENTAS_FETCH_ONE_PENDING] (state, payload) {
        state.onePending = payload
    },

    [types.RENTAS_RESET] (state) {
        Object.assign(state, { initialState: initialState(), ...initialState() })
    },
}
