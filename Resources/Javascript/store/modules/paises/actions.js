import * as types from "../../mutation-types"
import app from "@/app"

export default {
    fetchAllPaises ({ commit }) {
        commit(types.PAISES_FETCH_ALL_PENDING, true)

        return window.axios.get(app.apiUrl + "/paises")
            .then(response => {
                const all = response.data.data
                commit(types.PAISES_FETCH_ALL, all)
                commit(types.PAISES_FETCH_ALL_PENDING, false)
                return all
            })
            .catch(error => {
                console.log(error)
                commit(types.PAISES_ERROR, error)
                commit(types.PAISES_FETCH_ALL_PENDING, false)
                return error
            })
    }
}
