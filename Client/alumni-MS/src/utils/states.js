const { default: provinces } = require("src/data/provinces")

export const getProvinces = () => {
    const provincesData = []

    for (const [key, value] of Object.entries(provinces)) {
        provincesData.push(key)
    }

    return provincesData
}
export const getCities = (prov) => {
    const cities = provinces[prov]
    return cities
}