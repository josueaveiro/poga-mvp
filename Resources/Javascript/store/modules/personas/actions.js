import * as types from "../../mutation-types"
import app from "@/app"

export default {
    deleteOnePersona ({ commit }, id) {
        return window.axios.delete(app.apiUrl + "/personas/" + id)
            .then(response => {
                const r = response.data.data
                commit(types.PERSONAS_DELETE_ONE, r)
                return r
            })
            .catch(error => {
                console.log(error)
                commit(types.PERSONAS_ERROR, error)
                return error
            })
    },

    fetchAllPersonas ({ commit }, params) {
        commit(types.PERSONAS_FETCH_ALL_PENDING, true)

        return window.axios.get(app.apiUrl + "/personas", { params: params })
            .then(response => {
                const all = response.data.data
                commit(types.PERSONAS_FETCH_ALL, all)
                commit(types.PERSONAS_FETCH_ALL_PENDING, false)
                return all
            })
            .catch(error => {
                console.log(error)
                commit(types.PERSONAS_ERROR, error)
                commit(types.PERSONAS_FETCH_ALL_PENDING, false)
                return error
            })
    },

    fetchOnePersona ({ commit }, id) {
        commit(types.PERSONAS_FETCH_ONE_PENDING, true)

        return window.axios.get(app.apiUrl + "/personas/" + id)
            .then(response => {
                const one = response.data.data
                commit(types.PERSONAS_FETCH_ONE, one)
                commit(types.PERSONAS_FETCH_ONE_PENDING, false)
                return one
            })
            .catch(error => {
                commit(types.PERSONAS_ERROR, error)
                commit(types.PERSONAS_FETCH_ONE_PENDING, false)
                return error
            })
    },

    reset ({ commit }) {
        commit(types.PERSONAS_RESET)
        return null
    }
}
