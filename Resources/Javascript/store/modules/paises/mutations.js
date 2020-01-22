import * as types from "../../mutation-types"

export default {
    [types.PAISES_ERROR] (state, payload) {
        state.error = JSON.stringify(payload)
    },

    [types.PAISES_FETCH_ALL] (state, payload) {
        state.all = payload
    },

    [types.PAISES_FETCH_ALL_PENDING] (state, payload) {
        state.allPending = payload
    },
}
