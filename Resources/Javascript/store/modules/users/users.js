import actions from "./actions"
import getters from "./getters"
import mutations from "./mutations"

export function initialState()
{
    return {
        all: [],
        allPending: true,
        one: {
            accepted: 0,
            email: "",
            first_name: "",
            last_name: "",
            password: "",
            password_confirmation: "",
            id_persona: {
                apellido: "",
                ci: "",
                cuenta_bancaria: "",
                direccion: "",
                direccion_facturacion: "",
                enum_estado: "ACTIVO",
                enum_sexo: "",
                enum_tipo_persona: "",
                fecha_nacimiento: "",
                id_banco: "",
                id_pais: "",
                mail: "",
                nombre: "",
                razon_social: "",
                ruc: "",
                ruc_facturacion: "",
                telefono: "",
                telefono_celular: "",
                titular_cuenta: "",
            }
        },
        onePending: true,
        tokenForPayments: "",
    }
}

const state = {
    initialState: initialState(),
    ...initialState()
}

export default {
    actions,
    getters,
    mutations,
    state
}
