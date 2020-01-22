import * as types from "../../mutation-types"
import app from "@/app"
import map from "lodash/map"

export default {
    deleteOneEstadoInmueble ({ commit }, id) {
        return window.axios.delete(app.apiUrl + "/estados-inmueble/" + id)
            .then(response => {
                const r = response.data.data
                commit(types.ESTADOS_INMUEBLE_DELETE_ONE, r)
                return r
            })
            .catch(error => {
                console.log(error)
                commit(types.ESTADOS_INMUEBLE_ERROR, error)
                return error
            })
    },

    fetchAllEstadosInmueble ({ commit }, params) {
        commit(types.ESTADOS_INMUEBLE_FETCH_ALL_PENDING, true)

        return window.axios.get(app.apiUrl + "/estados-inmueble", { params: params })
            .then(response => {
                const all = response.data.data
                commit(types.ESTADOS_INMUEBLE_FETCH_ALL, all)
                commit(types.ESTADOS_INMUEBLE_FETCH_ALL_PENDING, false)
                return all
            })
            .catch(error => {
                console.log(error)
                commit(types.ESTADOS_INMUEBLE_ERROR, error)
                commit(types.ESTADOS_INMUEBLE_FETCH_ALL_PENDING, false)
                return error
            })
    },

    fetchOneEstadoInmueble ({ commit }, id) {
        commit(types.ESTADOS_INMUEBLE_FETCH_ONE_PENDING, true)

        return window.axios.get(app.apiUrl + "/estados-inmueble/" + id)
            .then(response => {
                const one = response.data.data
                commit(types.ESTADOS_INMUEBLE_FETCH_ONE, one)
                commit(types.ESTADOS_INMUEBLE_FETCH_ONE_PENDING, false)
                return one
            })
            .catch(error => {
                commit(types.ESTADOS_INMUEBLE_ERROR, error)
                commit(types.ESTADOS_INMUEBLE_FETCH_ONE_PENDING, false)
                return error
            })
    },

    reset ({ commit }) {
        commit(types.ESTADOS_INMUEBLE_RESET)
        return null
    }
}

export function mapEstadosInmuebleList(items) {
    return map(items, item => { 
        if(item.pivot) {
            return { id: item.id, cantidad: item.pivot.cantidad, reparar: item.pivot.reparar, foto: item.pivot.foto }
        } else {
            return { id: item.id, cantidad: 0, reparar: false, foto: "" }
        }
    })
}
