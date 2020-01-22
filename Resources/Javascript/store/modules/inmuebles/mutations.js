import * as types from "../../mutation-types"
import { initialState } from "./inmuebles"

export default {
    [types.INMUEBLES_DELETE_ONE] () {},

    [types.INMUEBLES_ERROR] (state, payload) {
        state.error = JSON.stringify(payload)
    },

    [types.INMUEBLES_FETCH_ALL] (state, payload) {
        state.all = payload
    },

    [types.INMUEBLES_FETCH_ALL_PENDING] (state, payload) {
        state.allPending = payload
    },

    [types.INMUEBLES_FETCH_ONE] (state, payload) {
        state.one = payload
    },

    [types.INMUEBLES_FETCH_ONE_PENDING] (state, payload) {
        state.onePending = payload
    },

    [types.INMUEBLES_RESET] (state) {
        Object.assign(state, { initialState: initialState(), ...initialState() })
    },
}
