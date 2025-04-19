import { userModel } from "../models/userModel.js"

export const getAllDoctors = async (req, res) => {
    try {
        const doctors = await userModel.find({ role: "doctor" })
        return res.status(200).json(doctors)
    } catch (error) {
        console.log(`Error occured while fetching all doctors: ${error.message}`)
        console.log(`Error occured while fetching all doctors: ${error.stack}`)
        return res.status(500).json({ message: error.message })
    }
}

// protected route must be an admin or doctor
export const getAllPatients = async (req, res) => {
    const user = req.user
    if (user.role !== "doctor" && user.role !== "admin")
        return res.status(401).json({ message: "unauthorized person" })

    try {
        const patients = await userModel.find({ role: "user" })
        return res.status(200).json(patients)
    } catch (error) {
        console.log(`Error occured while fetching all patients: ${error.message}`)
        console.log(`Error occured while fetching all patients: ${error.stack}`)
        return res.status(500).json({ message: error.message })
    }
}

// protected route must be an admin only
export const getAllUsers = async (req, res) => {
    const user = req.user
    if (user.role !== "admin")
        return res.status(401).json({ message: "unauthorized person" })
    try {
        const allUsers = await userModel.find()
        return res.status(200).json(allUsers)
    } catch (error) {
        console.log(`Error occured while fetching all users: ${error.message}`)
        console.log(`Error occured while fetching all users: ${error.stack}`)
        return res.status(500).json({ message: error.message })
    }
}

// protected route must be a doctor or an admin
export const getUser = async (req, res) => {
    const { id: userId } = req.params
    if (!userId)
        return res.status(400).json({ message: "no user id provided" })
    try {
        const user = await userModel.findById(userId)
        if (!user)
            return res.status(404).json({ message: "user not found" })

        const { password: _, ...userWithoutPassword } = user._doc
        return res.status(200).json(userWithoutPassword)
    } catch (error) {
        console.log(`Error occured while fetching specific users: ${error.message}`)
        console.log(`Error occured while fetching specific users: ${error.stack}`)
        return res.status(500).json({ message: error.message })
    }
}

export const getDoctor = async (req, res) => {
    const { id: docId } = req.params
    if (!docId)
        return res.status(400).json({ message: "no doctor id was provided" })
    try {
        const user = await userModel.findById(docId)
        if (!user)
            return res.status(404).json({ message: "doctor not found" })

        const { password: _, ...userWithoutPassword } = user._doc
        return res.status(200).json(userWithoutPassword)
    } catch (error) {
        console.log(`Error occured while fetching specific doctor: ${error.message}`)
        console.log(`Error occured while fetching specific doctor: ${error.stack}`)
        return res.status(500).json({ message: error.message })
    }
}