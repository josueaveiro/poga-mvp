import * as types from "../../mutation-types"
import { initialState } from "./pagares"

export default {
    [types.PAGARES_ANULAR_PAGO_RENTA] (state, payload) {
        state.one = payload
    },

    [types.PAGARES_ERROR] (state, payload) {
        state.error = JSON.stringify(payload)
    },

    [types.PAGARES_FETCH_ALL] (state, payload) {
        state.all = payload
    },

    [types.PAGARES_FETCH_ALL_PENDING] (state, payload) {
        state.allPending = payload
    },

    [types.PAGARES_FETCH_ONE] (state, payload) {
        state.one = payload
    },

    [types.PAGARES_FETCH_ONE_PENDING] (state, payload) {
        state.onePending = payload
    },

    [types.PAGARES_RESET] (state) {
        Object.assign(state, { initialState: initialState(), ...initialState() })
    },
}
