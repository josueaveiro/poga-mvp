import * as types from "../../mutation-types"
import app from "@/app"

export default {
    deleteOneBanco ({ commit }, id) {
        return window.axios.delete(app.apiUrl + "/bancos/" + id)
            .then(response => {
                const r = response.data.data
                commit(types.BANCOS_DELETE_ONE, r)
                return r
            })
            .catch(error => {
                console.log(error)
                commit(types.BANCOS_ERROR, error)
                return error
            })
    },

    fetchAllBancos ({ commit }, params) {
        commit(types.BANCOS_FETCH_ALL_PENDING, true)

        return window.axios.get(app.apiUrl + "/bancos", { params: params })
            .then(response => {
                const all = response.data.data
                commit(types.BANCOS_FETCH_ALL, all)
                commit(types.BANCOS_FETCH_ALL_PENDING, false)
                return all
            })
            .catch(error => {
                console.log(error)
                commit(types.BANCOS_ERROR, error)
                commit(types.BANCOS_FETCH_ALL_PENDING, false)
                return error
            })
    },

    fetchOneBanco ({ commit }, id) {
        commit(types.BANCOS_FETCH_ONE_PENDING, true)

        return window.axios.get(app.apiUrl + "/bancos/" + id)
            .then(response => {
                const one = response.data.data
                commit(types.BANCOS_FETCH_ONE, one)
                commit(types.BANCOS_FETCH_ONE_PENDING, false)
                return one
            })
            .catch(error => {
                commit(types.BANCOS_ERROR, error)
                commit(types.BANCOS_FETCH_ONE_PENDING, false)
                return error
            })
    },

    reset ({ commit }) {
        commit(types.BANCOS_RESET)
        return null
    }
}
