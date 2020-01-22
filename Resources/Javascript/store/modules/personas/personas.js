import actions from "./actions"
import getters from "./getters"
import mutations from "./mutations"

export function initialState()
{
    return {
        all: [],
        allPending: true,
        one: {
            apellido: "",
            ci: "",
            cuenta_bancaria: "",
            direccion: "",
            direccion_facturacion: "",
            enum_estado: "ACTIVO",
            enum_tipo_persona: "FISICA",
            enum_sexo: "",
            enum_rol: "INQUILINO",
            fecha_nacimiento: "",
            id_banco: "",
            id_pais: "",
            id_pais_cobertura: "",
            id_usuario_creador: "",
            invitar: 1,
            mail: "",
            mail_solicitudes: "",
            nombre: "",
            razon_social: "",
            ruc: "",
            ruc_facturacion: "",
            telefono: "",
            telefono_celular: "",
            titular_cuenta: ""
        },
        onePending: true,
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
