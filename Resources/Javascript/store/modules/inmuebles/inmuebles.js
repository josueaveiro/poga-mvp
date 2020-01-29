import actions from "./actions"
import getters from "./getters"
import mutations from "./mutations"

export function initialState()
{
    return {
        all: [],
        allPending: true,
        one: {
            administrador: "otra_persona",
            cant_pisos: 1,
            caracteristicas: [],
            comision_administrador: 0,
            dia_cobro_mensual: "",
            divisible_en_unidades: false,
            formatos: [],
            id_administrador_referente: "",
            id_moneda_salario: "",
            id_direccion: {
                calle_principal: "",
                calle_secundaria: "",
                ciudad: "",
                departamento: "",
                latitud: -25.2968361,
                longitud: -57.6681294,
                numeracion: "",
            },
            id_inmueble: {
                area: "0",
                area_estacionamiento: "0",
                caracteristicas: [],
                descripcion: "",
                enum_estado: "ACTIVO",
                id_medida: "1",
                id_tipo_inmueble: "1",
                solicitud_directa_inquilinos: true,
            },
            id_inmueble_padre: "",
            id_propietario_referente: "",
            modalidad_propiedad: "UNICO_PROPIETARIO",
            monto_fondo_expensas: 0,
            monto_fondo_reserva: 0,
            nombre: "",
            unidades: [],
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
