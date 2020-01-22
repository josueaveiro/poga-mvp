import actions from "./actions"
import getters from "./getters"
import mutations from "./mutations"

export function initialState()
{
    return {
        all: [],
        allPending: true,
        one: {
            descripcion: "",
            enum_clasificacion_pagare: "OTRO",
            enum_estado: "ACTIVO",
            id_distribucion_expensa: "",
            id_factura: "",
            id_inmueble: "",
            id_moneda: "1",
            id_persona_acreedora: "",
            id_persona_deudora: "",
            id_tabla: "",
            id_tipo_pagare: "",
            fecha_pagare: "",
            fecha_vencimiento: "",
            fecha_pago_a_confirmar: "",
            fecha_pago_confirmado: "",
            fecha_pago_real: "",
            mes_a_pagar: "",
            monto: "",
            nro_comprobante: "",
            pagado_fuera_sistema: "",
            pagado_con_fondos_de: "",
            revertido: 0,
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
