import * as types from "../../mutation-types"
import app from "@/app"

export default {
    deleteOneRenta ({ commit }, id) {
        return window.axios.delete(app.apiUrl + "/rentas/" + id)
            .then(response => {
                const r = response.data.data
                commit(types.RENTAS_DELETE_ONE, r)
                return r
            })
            .catch(error => {
                console.log(error)
                commit(types.RENTAS_ERROR, error)
                return error
            })
    },

    fetchAllRentas ({ commit }, params) {
        commit(types.RENTAS_FETCH_ALL_PENDING, true)

        return window.axios.get(app.apiUrl + "/rentas", { params: params })
            .then(response => {
                const all = response.data.data
                commit(types.RENTAS_FETCH_ALL, all)
                commit(types.RENTAS_FETCH_ALL_PENDING, false)
                return all
            })
            .catch(error => {
                console.log(error)
                commit(types.RENTAS_ERROR, error)
                commit(types.RENTAS_FETCH_ALL_PENDING, false)
                return error
            })
    },

    fetchOneRenta ({ commit }, id) {
        commit(types.RENTAS_FETCH_ONE_PENDING, true)

        return window.axios.get(app.apiUrl + "/rentas/" + id)
            .then(response => {
                const one = response.data.data
                commit(types.RENTAS_FETCH_ONE, one)
                commit(types.RENTAS_FETCH_ONE_PENDING, false)
                return one
            })
            .catch(error => {
                commit(types.RENTAS_ERROR, error)
                commit(types.RENTAS_FETCH_ONE_PENDING, false)
                return error
            })
    },

    reset ({ commit }) {
        commit(types.RENTAS_RESET)
        return null
    }
}
