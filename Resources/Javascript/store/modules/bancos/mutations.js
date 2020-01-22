import * as types from "../../mutation-types"
import { initialState } from "./bancos"

export default {
    [types.BANCOS_DELETE_ONE] () {},

    [types.BANCOS_ERROR] (state, payload) {
        state.error = JSON.stringify(payload)
    },

    [types.BANCOS_FETCH_ALL] (state, payload) {
        state.all = payload
    },

    [types.BANCOS_FETCH_ALL_PENDING] (state, payload) {
        state.allPending = payload
    },

    [types.BANCOS_FETCH_ONE] (state, payload) {
        state.one = payload
    },

    [types.BANCOS_FETCH_ONE_PENDING] (state, payload) {
        state.onePending = payload
    },

    [types.BANCOS_RESET] (state) {
        Object.assign(state, { initialState: initialState(), ...initialState() })
    },
}
