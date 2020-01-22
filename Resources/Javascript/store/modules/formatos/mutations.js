import * as types from "../../mutation-types"
import { initialState } from "./formatos"

export default {
    [types.FORMATOS_DELETE_ONE] () {},

    [types.FORMATOS_ERROR] (state, payload) {
        state.error = JSON.stringify(payload)
    },

    [types.FORMATOS_FETCH_ALL] (state, payload) {
        state.all = payload
    },

    [types.FORMATOS_FETCH_ALL_PENDING] (state, payload) {
        state.allPending = payload
    },

    [types.FORMATOS_FETCH_ONE] (state, payload) {
        state.one = payload
    },

    [types.FORMATOS_FETCH_ONE_PENDING] (state, payload) {
        state.onePending = payload
    },

    [types.FORMATOS_RESET] (state) {
        Object.assign(state, { initialState: initialState(), ...initialState() })
    },
}
