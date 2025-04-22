import crypto from "crypto"

export const otpGenerator = (length = 6) => {
    return crypto.randomBytes(length).toString('hex').slice(0, length)
}