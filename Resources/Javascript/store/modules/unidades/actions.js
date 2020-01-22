import * as types from "../../mutation-types"
import app from "@/app"

export default {
    deleteOneUnidad ({ commit }, id) {
        return window.axios.delete(app.apiUrl + "/unidades" + id)
            .then(response => {
                const r = response.data.data
                commit(types.UNIDADES_DELETE_ONE, r)
                return r
            })
            .catch(error => {
                console.log(error)
                commit(types.UNIDADES_ERROR, error)
                return error
            })
    },

    fetchAllUnidades ({ commit }, params) {
        commit(types.UNIDADES_FETCH_ALL_PENDING, true)
        return window.axios.get(app.apiUrl + "/unidades", { params: params })
            .then(response => {
                const all = response.data.data
                commit(types.UNIDADES_FETCH_ALL, all)
                commit(types.UNIDADES_FETCH_ALL_PENDING, false)
                return all
            })
            .catch(error => {
                console.log(error)
                commit(types.UNIDADES_ERROR, error)
                commit(types.UNIDADES_FETCH_ALL_PENDING, false)
                return error
            })
    },

    fetchOneUnidad ({ commit }, id) {
        commit(types.UNIDADES_FETCH_ONE_PENDING, true)
        return window.axios.get(app.apiUrl + "/unidades/" + id)
            .then(response => {
                const one = response.data.data
                commit(types.UNIDADES_FETCH_ONE, one)
                commit(types.UNIDADES_FETCH_ONE_PENDING, false)
                return one
            })
            .catch(error => {
                commit(types.UNIDADES_ERROR, error)
                commit(types.UNIDADES_FETCH_ONE_PENDING, false)
                return error
            })
    },

    reset ({ commit }) {
        commit(types.UNIDADES_RESET)
        return null
    }
}
