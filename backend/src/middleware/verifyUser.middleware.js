import jwt from "jsonwebtoken"
import { userModel } from "../models/userModel.js"

export const verifyUser = async (req, res, next) => {
    const token = req.cookies.token
    if (!token)
        return res.status(404).json({ message: "No token found" })

    try {
        const decodedUser = jwt.verify(token, process.env.SECRET_KEY, (err, dec) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    return res.status(401).json({ message: 'Token expired' })
                }
                return res.status(403).json({ message: 'Token is not valid' });
            }
        })
        if (!decodedUser)
            return res.status().json({ message: "User could not be decoded" })

        // find user from user model with corresponding payload id form decode
        const user = await userModel.findById(decodedUser.id)
        if (!user)
            return res.status(404).json({ message: "No valid user found" })

        req.user = user
        next()
    } catch (error) {
        console.log("Error in verifyUser middleware " + error.message)
        console.log("Error in verifyUser middleware " + error.stack)
        return res.status(500).json({ message: error.message })
    }
}