import * as types from "../../mutation-types"
import app from "@/app"

export default {
    deleteOneCaracteristicaTipoInmueble ({ commit }, id) {
        return window.axios.delete(app.apiUrl + "/caracteristicas-tipo-inmueble/" + id)
            .then(response => {
                const r = response.data.data
                commit(types.CARACTERISTICAS_TIPO_INMUEBLE_DELETE_ONE, r)
                return r
            })
            .catch(error => {
                console.log(error)
                commit(types.CARACTERISTICAS_TIPO_INMUEBLE_ERROR, error)
                return error
            })
    },

    fetchAllCaracteristicasTipoInmueble ({ commit }, params) {
        commit(types.CARACTERISTICAS_TIPO_INMUEBLE_FETCH_ALL_PENDING, true)

        return window.axios.get(app.apiUrl + "/caracteristicas-tipo-inmueble", { params: params })
            .then(response => {
                const all = response.data.data
                commit(types.CARACTERISTICAS_TIPO_INMUEBLE_FETCH_ALL, all)
                commit(types.CARACTERISTICAS_TIPO_INMUEBLE_FETCH_ALL_PENDING, false)
                return all
            })
            .catch(error => {
                console.log(error)
                commit(types.CARACTERISTICAS_TIPO_INMUEBLE_ERROR, error)
                commit(types.CARACTERISTICAS_TIPO_INMUEBLE_FETCH_ALL_PENDING, false)
                return error
            })
    },

    fetchOneCaracteristicaTipoInmueble ({ commit }, id) {
        commit(types.CARACTERISTICAS_TIPO_INMUEBLE_FETCH_ONE_PENDING, true)

        return window.axios.get(app.apiUrl + "/caracteristicas-tipo-inmueble/" + id)
            .then(response => {
                const one = response.data.data
                commit(types.CARACTERISTICAS_TIPO_INMUEBLE_FETCH_ONE, one)
                commit(types.CARACTERISTICAS_TIPO_INMUEBLE_FETCH_ONE_PENDING, false)
                return one
            })
            .catch(error => {
                commit(types.CARACTERISTICAS_TIPO_INMUEBLE_ERROR, error)
                commit(types.CARACTERISTICAS_TIPO_INMUEBLE_FETCH_ALL_PENDING, false)
                return error
            })
    },

    reset ({ commit }) {
        commit(types.CARACTERISTICAS_TIPO_INMUEBLE_RESET)
        return null
    }
}

export function mapCaracteristicasTipoInmuebleList(items, caracteristicas) {
    var obj = {}

    items.forEach(item => {
        var key = item.id_caracteristica.id, value

        var caracteristica = caracteristicas.find(c => c.pivot.id_caracteristica_tipo_inmueble == item.id)
        if (caracteristica) {
            if (typeof(caracteristica.pivot.cantidad) === "number") {
                value = caracteristica.pivot.cantidad
            } else {
                value = true
            }
        } else {
            value = undefined
        }

        obj[key] = value
    })

    return obj
}
