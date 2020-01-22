import * as types from "../../mutation-types"
import { initialState } from "./unidades"

export default {
    [types.UNIDADES_DELETE_ONE] () {},

    [types.UNIDADES_ERROR] (state, payload) {
        state.error = JSON.stringify(payload)
    },

    [types.UNIDADES_FETCH_ALL] (state, payload) {
        state.all = payload
    },

    [types.UNIDADES_FETCH_ALL_PENDING] (state, payload) {
        state.allPending = payload
    },

    [types.UNIDADES_FETCH_ONE] (state, payload) {
        state.one = payload
    },

    [types.UNIDADES_FETCH_ONE_PENDING] (state, payload) {
        state.onePending = payload
    },

    [types.UNIDADES_RESET] (state) {
        Object.assign(state, { initialState: initialState(), ...initialState() })
    },
}
