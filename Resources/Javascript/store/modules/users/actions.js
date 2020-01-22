import * as types from "../../mutation-types"
import app from "@/app"

export default {
    fetchOneGuest ({ commit }, codigo_validacion) {
        return window.axios.get(app.apiUrl + "/usuario-invitado/" + codigo_validacion)
            .then(response => {
                const one = response.data.data
                commit(types.USERS_FETCH_ONE_GUEST, one)
                return one
            })
            .catch(error => {
                commit(types.USERS_ERROR, error)
                return error
            })
    },

    fetchOneUsuario ({ commit }, id) {
        return window.axios.get(app.apiUrl + "/usuarios/" + id)
            .then(response => {
                const one = response.data.data
                commit(types.USERS_FETCH_ONE, one)
                return one
            })
            .catch(error => {
                commit(types.USERS_ERROR, error)
                return error
            })
    },

    fetchTokenForPayments ({ commit }) {
        return window.axios.post(app.apiUrl + "/token-para-pagos")
            .then(response => {
                const token = response.data.data.token
                commit(types.USERS_TOKEN_FOR_PAYMENTS, token)
                return token
            })
            .catch(error => {
                commit(types.USERS_ERROR, error)
                return error
            })
    }
}
