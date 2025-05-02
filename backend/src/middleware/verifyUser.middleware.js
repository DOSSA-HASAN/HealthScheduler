import jwt from "jsonwebtoken"
import { userModel } from "../models/userModel.js"

export const verifyUser = async (req, res, next) => {
    const token = req.cookies.token
    if (!token)
        return res.status(404).json({ message: "No token found" })

    try {
        const decodedUser = jwt.verify(token, process.env.SECRET_KEY)
        if (!decodedUser)
            return res.status(400).json({ message: "User could not be decoded" })

        // find user from user model with corresponding payload id form decode
        const user = await userModel.findById(decodedUser.id)
        if (!user)
            return res.status(404).json({ message: "No valid user found" })

        req.user = user
        next()
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" })
        }
        if (error.name === "JsonWebTokenError") {
            return res.status(403).json({ message: "Invalid token" })
        }
        console.log("Error in verifyUser middleware " + error.message)
        console.log("Error in verifyUser middleware " + error.stack)
        return res.status(500).json({ message: error.message })
    }
}