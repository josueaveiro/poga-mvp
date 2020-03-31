export function formatMoney(currency, value) {
    if (currency === "PYG" || currency === "Gs" || currency === "Guaraní") {
        return Number(value).toLocaleString("es-PY", {
            style: "currency",
            currency: "PYG"
        })
    } else if (currency === "USD") {
        return Number(value).toLocaleString("es-PY", {
            style: "currency",
            currency: "USD"
        })
    }
}
