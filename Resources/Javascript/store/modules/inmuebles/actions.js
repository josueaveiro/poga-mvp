import * as types from "../../mutation-types"
import app from "@/app"

export default {
    deleteOneInmueble ({ commit }, id) {
        return window.axios.delete(app.apiUrl + "/inmuebles/" + id)
            .then(response => {
                const r = response.data.data
                commit(types.INMUEBLES_DELETE_ONE, r)
                return r
            })
            .catch(error => {
                console.log(error)
                commit(types.INMUEBLES_ERROR, error)
                return error
            })
    },

    fetchAllInmuebles ({ commit }, params) {
        commit(types.INMUEBLES_FETCH_ALL_PENDING, true)

        return window.axios.get(app.apiUrl + "/inmuebles", { params: params })
            .then(response => {
                const all = response.data.data
                commit(types.INMUEBLES_FETCH_ALL, all)
                commit(types.INMUEBLES_FETCH_ALL_PENDING, false)
                return all
            })
            .catch(error => {
                console.log(error)
                commit(types.INMUEBLES_ERROR, error)
                commit(types.INMUEBLES_FETCH_ALL_PENDING, false)
                return error
            })
    },

    fetchOneInmueble ({ commit }, id) {
        commit(types.INMUEBLES_FETCH_ONE_PENDING, true)

        return window.axios.get(app.apiUrl + "/inmuebles/" + id)
            .then(response => {
                const one = response.data.data
                commit(types.INMUEBLES_FETCH_ONE, one)
                commit(types.INMUEBLES_FETCH_ONE_PENDING, false)
                return one
            })
            .catch(error => {
                commit(types.INMUEBLES_ERROR, error)
                commit(types.INMUEBLES_FETCH_ONE_PENDING, false)
                return error
            })
    },

    reset ({ commit }) {
        commit(types.INMUEBLES_RESET)
        return null
    }
}
