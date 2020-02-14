import * as types from "../../mutation-types"
import app from "@/app"

export default {
    anularPagareRenta ({ commit }, id) {
        commit(types.PAGARES_FETCH_ONE_PENDING, true)

        return window.axios.put(app.apiUrl + "/finanzas/rentas/anular-pago/" + id)
            .then(response => {
                const r = response.data.data
                commit(types.PAGARES_FETCH_ONE, r)
                commit(types.PAGARES_FETCH_ONE_PENDING, false)
                return r
            })
            .catch(error => {
                console.log(error)
                commit(types.PAGARES_ERROR, error)
                commit(types.PAGARES_FETCH_ONE_PENDING, false)
                return error
            })
    },

    deleteOnePagare ({ commit }, id) {
        return window.axios.delete(app.apiUrl + "/pagares/" + id)
            .then(response => {
                const r = response.data.data
                commit(types.PAGARES_DELETE_ONE, r)
                return r
            })
            .catch(error => {
                console.log(error)
                commit(types.PAGARES_ERROR, error)
                return error
            })
    },

    fetchAllPagares ({ commit }, params) {
        commit(types.PAGARES_FETCH_ALL_PENDING, true)

        return window.axios.get(app.apiUrl + "/pagares", { params: params })
            .then(response => {
                const all = response.data.data
                commit(types.PAGARES_FETCH_ALL, all)
                commit(types.PAGARES_FETCH_ALL_PENDING, false)
                return all
            })
            .catch(error => {
                console.log(error)
                commit(types.PAGARES_ERROR, error)
                commit(types.PAGARES_FETCH_ALL_PENDING, false)
                return error
            })
    },

    fetchOnePagare ({ commit }, id) {
        commit(types.PAGARES_FETCH_ONE_PENDING, true)

        return window.axios.get(app.apiUrl + "/pagares/" + id)
            .then(response => {
                const one = response.data.data
                commit(types.PAGARES_FETCH_ONE, one)
                commit(types.PAGARES_FETCH_ONE_PENDING, false)
                return one
            })
            .catch(error => {
                commit(types.PAGARES_ERROR, error)
                commit(types.PAGARES_FETCH_ONE_PENDING, false)
                return error
            })
    },

    reset ({ commit }) {
        commit(types.PAGARES_RESET)
        return null
    }
}
