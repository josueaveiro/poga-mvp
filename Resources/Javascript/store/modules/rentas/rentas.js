import actions from "./actions"
import getters from "./getters"
import mutations from "./mutations"

export function initialState()
{
    return {
        all: [],
        allPending: true,
        one: {
            comision_administrador: 0,
            comision_inmobiliaria: 0,
            dia_mes_pago: 1,
            dias_multa: 0,
            dias_notificacion_previa_renovacion: 60,
            enum_estado: "",
            estados_inmueble: [],
            expensas: 0,
            fecha_fin: "",
            fecha_inicio: "",
            garantia: 0,
            id_moneda: "1",
            id_inmueble: "",
            id_inquilino: "",
            id_renta_padre: "",
            id_unidad: "",
            monto: 0,
            monto_multa_dia: 0,
            motivo_descuento_garantia: "",
            multa: 0,
            observacion: "",
            prim_comision_administrador: 0,
            renovacion: "AUTOMATICA",
            vigente: 0,
        },
        onePending: true
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
