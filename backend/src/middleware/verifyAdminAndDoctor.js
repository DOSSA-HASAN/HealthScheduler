import jwt from "jsonwebtoken"
import { userModel } from "../models/userModel.js"
import mongoose from "mongoose"

export const verifyAdminAndDoctor = async (req, res, next) => {
    const token = req.cookies.token
    if (!token)
        return res.status(400).json({ message: "no token found" })

    try {
        const decodedAdminAndDoctor = jwt.verify(token, process.env.SECRET_KEY)
        let adminOrDoctorId;

        if (mongoose.isObjectIdOrHexString(decodedAdminAndDoctor.id)) {
            adminOrDoctorId = mongoose.Types.ObjectId.createFromHexString(decodedAdminAndDoctor.id)
        }

        const user = await userModel.findOne({
            _id: adminOrDoctorId,
            role: { $in: ["admin", "doctor"] }
        })
        if (!user)
            return res.status(404).json({ message: "admin / doctor not found" })

        req.user = user
        next()

    } catch (error) {
        console.log(`Error occured while verifying admin and doctors: ${error.message}`)
        console.log(`Error occured while verifying admin and doctors: ${error.stack}`)
        return res.status(500).json({ message: error.message })
    }
}