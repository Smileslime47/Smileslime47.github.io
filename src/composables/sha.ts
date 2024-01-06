import CryptoJS from "crypto-js"

const getSha = (input: string) => CryptoJS.SHA1(input).toString(CryptoJS.enc.Hex)

export default getSha