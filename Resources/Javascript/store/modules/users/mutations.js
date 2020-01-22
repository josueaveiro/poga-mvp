import * as types from "../../mutation-types"

export default {
    [types.USERS_FETCH_ONE] (state, payload) {
        state.one = payload
    },

    [types.USERS_FETCH_ONE_GUEST] (state, payload) {
        state.oneGuest = payload
    },

    [types.USERS_TOKEN_FOR_PAYMENTS] (state, payload) {
        state.tokenForPayments = payload
    }
}
