import * as types from "../../mutation-types"
import app from "@/app"

export default {
    deleteOneMonedas ({ commit }, id) {
        return window.axios.delete(app.apiUrl + "/monedas/" + id)
            .then(response => {
                const r = response.data.data
                commit(types.MONEDAS_DELETE_ONE, r)
                return r
            })
            .catch(error => {
                console.log(error)
                commit(types.MONEDAS_ERROR, error)
                return error
            })
    },

    fetchAllMonedas ({ commit }, params) {
        return window.axios.get(app.apiUrl + "/monedas", { params: params })
            .then(response => {
                const all = response.data.data
                commit(types.MONEDAS_FETCH_ALL, all)
                return all
            })
            .catch(error => {
                console.log(error)
                commit(types.MONEDAS_ERROR, error)
                return error
            })
    },

    fetchOneMonedas ({ commit }, id) {
        return window.axios.get(app.apiUrl + "/monedas/" + id)
            .then(response => {
                const one = response.data.data
                commit(types.MONEDAS_FETCH_ONE, one)
                return one
            })
            .catch(error => {
                commit(types.MONEDAS_ERROR, error)
                return error
            })
    },

    reset ({ commit }) {
        commit(types.MONEDAS_RESET)
        return null
    }
}
