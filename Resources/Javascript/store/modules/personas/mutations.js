import * as types from "../../mutation-types"
import { initialState } from "./personas"

export default {
    [types.PERSONAS_DELETE_ONE] () {},

    [types.PERSONAS_ERROR] (state, payload) {
        state.error = JSON.stringify(payload)
    },

    [types.PERSONAS_FETCH_ALL] (state, payload) {
        state.all = payload
    },

    [types.PERSONAS_FETCH_ALL_PENDING] (state, payload) {
        state.allPending = payload
    },

    [types.PERSONAS_FETCH_ONE] (state, payload) {
        state.one = payload
    },

    [types.PERSONAS_FETCH_ONE_PENDING] (state, payload) {
        state.onePending = payload
    },

    [types.PERSONAS_RESET] (state) {
        Object.assign(state, { initialState: initialState(), ...initialState() })
    },
}
