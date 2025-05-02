import jwt from "jsonwebtoken"
import { userModel } from "../models/userModel.js"

export const verifyDoctor = async (req, res, next) => {
    const token = req.cookies.token
    if (!token)
        return res.status(400).json({ message: "missing token" })

    try {
        const decodedDoctor = jwt.verify(token, process.env.SECRET_KEY)
        const doctor = await userModel.findById(decodedDoctor.id).select("-password")
        if (!doctor)
            return res.status(404).json({ message: "doctor not found" })

        if (doctor.role !== "doctor")
            return res.status(401).json({ message: "unathorized - user is not a doctor" })

        req.user = doctor
        next()

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Token expired" })
        }
        if (error.name === "JsonWebTokenError") {
            return res.status(403).json({ message: "Invalid token" })
        }
        console.log(`Error occured while verifying doctor: ${error.message}`)
        console.log(`Error occured while verifying doctor: ${error.stack}`)
        return res.status(500).json({ message: error.message })
    }
}