import * as types from "../../mutation-types"
import app from "@/app"
import pick from "lodash/pick"

export default {
    deleteOneFormato ({ commit }, id) {
        return window.axios.delete(app.apiUrl + "/formatos/" + id)
            .then(response => {
                const r = response.data.data
                commit(types.FORMATOS_DELETE_ONE, r)
                return r
            })
            .catch(error => {
                console.log(error)
                commit(types.FORMATOS_ERROR, error)
                return error
            })
    },

    fetchAllFormatos ({ commit }, params) {
        commit(types.FORMATOS_FETCH_ALL_PENDING, true)

        return window.axios.get(app.apiUrl + "/formatos", { params: params })
            .then(response => {
                const all = response.data.data
                commit(types.FORMATOS_FETCH_ALL, all)
                commit(types.FORMATOS_FETCH_ALL_PENDING, false)
                return all
            })
            .catch(error => {
                console.log(error)
                commit(types.FORMATOS_ERROR, error)
                commit(types.FORMATOS_FETCH_ALL_PENDING, false)
                return error
            })
    },

    fetchOneFormato ({ commit }, id) {
        commit(types.FORMATOS_FETCH_ONE_PENDING, true)

        return window.axios.get(app.apiUrl + "/formatos/" + id)
            .then(response => {
                const one = response.data.data
                commit(types.FORMATOS_FETCH_ONE, one)
                commit(types.FORMATOS_FETCH_ONE_PENDING, false)
                return one
            })
            .catch(error => {
                commit(types.FORMATOS_ERROR, error)
                commit(types.FORMATOS_FETCH_ONE_PENDING, false)
                return error
            })
    },

    reset ({ commit }) {
        commit(types.FORMATOS_RESET)
        return null
    }
}

export function mapFormatosList (items, paths = ["id", "formato"]) {
    return items.map(item => pick(item, paths))
}
