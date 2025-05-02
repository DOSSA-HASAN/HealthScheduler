import jwt from "jsonwebtoken"
import { userModel } from "../models/userModel.js"
import mongoose from "mongoose"

export const verifyAdmin = async (req, res, next) => {
    const token = req.cookies.token
    if (!token)
        return res.status(401).json({ message: "no token found" })

    try {
        const decodedAdmin = jwt.verify(token, process.env.SECRET_KEY, (err, dec) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    return res.status(401).json({ message: "Token expired" })
                }
                return res.status(403).json({ message: "Invalid token" })
            }
        })
        let adminIdObject;
        if (mongoose.isObjectIdOrHexString(decodedAdmin.id)) {
            adminIdObject = mongoose.Types.ObjectId.createFromHexString(decodedAdmin.id)
        }

        const admin = await userModel.findOne({ _id: adminIdObject, role: "admin" })
        if (!admin)
            return res.status(401).json({ message: "user is not an admin unauthorized person" })
        req.user = admin
        next()
    } catch (error) {
        console.log(`Error occured while verifying admin: ${error.message}`)
        console.log(`Error occured while verifying admin: ${error.stack}`)
        return res.status(500).json({ message: error.message })
    }
}