import { sendEMail } from "../../lib/sendEmail.js"
import { appointmentForPateints } from "../models/appointment.model.js"
import { userModel } from "../models/userModel.js"

export const bookAppointment = async (req, res) => {
    const { doctorId, appointmentDate, status, notes } = req.body
    const { patientId, email: userEmail } = req.user._id
    if (!doctorId || !patientId || !appointmentDate)
        return res.status(400).json({ message: "missing required fields" })


    try {
        const patient = await userModel.findById(patientId).select("-password")
        const doctor = await userModel.findById(doctorId).select("-password")

        if (!patient || !doctor)
            return res.status(400).json({ message: "No patient or doctor ID" })

        const existingAppointment = await appointmentForPateints.findOne({ doctorId, appointmentDate })
        if (existingAppointment)
            return res.status(409).json({ message: "This doctor is already booked, please select another time or doctor" })

        const newAppointment = new appointmentForPateints({
            doctorId,
            patientId,
            appointmentDate,
            status,
            notes
        })

        const appointment = await newAppointment.save()
        if (!appointment)
            return res.status(400).json({ message: "could not book appointment" })

        const ISODate = new Date(appointmentDate).toISOString()
        const appointmentDateOnly = ISODate.split("T")[0]
        const appointmentTimeOnly = ISODate.split("T")[1]

        const subject = `You're all set, ${patient.username}! ✅ Appointment confirmed with ${doctor.username}`
        const text = `Hi ${patient.username}, 👋\nYour appointment with Dr. ${doctorName} has been successfully booked!\n🗓️ Date: ${appointmentDateOnly}\n🕒 Time: ${appointmentTimeOnly}\n📍 Location:Right here within our clinic\nNeed to make changes? No worries, you can reschedule or cancel anytime from your dashboard.\nSee you soon!\n– HealthScheduler 💙`
        await sendEMail(userEmail, subject, text)

        return res.status(201).json({ message: "Appointment booked" })

    } catch (error) {
        console.log(`Error in booking appointment: ${error.message}`)
        console.log(`Error in booking appointment: ${error.stack}`)
        return res.status(500).json({ message: error.message })
    }
}

export const getAllAppointments = async (req, res) => {
    const role = req.user.role
    if (role !== "doctor" || role !== "admin")
        return res.status(401).json({ message: "Unauthorized person" })
    try {
        const appointments = await appointmentForPateints.find()
            .sort({ appointmentDate: -1 })
            .populate("doctorId", "username email role")
            .populate("patientId", "username email role");

        if (!appointments)
            return res.status(200).json({ message: "No appointments available" })

        return res.status(200).json(appointments)

    } catch (error) {
        console.log(`Error occured while gettingAllAppointments: ${error.message}`)
        console.log(`Error occured while gettingAllAppointments: ${error.stack}`)
        return res.status(500).json({ message: error.message })
    }
}

export const getBookedAppointments = async (req, res) => {
    const { doctorId } = req.body
    if (!doctorId)
        return res.status(400).json({ message: "Missing doctor Id" })

    try {
        const bookedAppointments = await appointmentForPateints.find(doctorId).select("appointmentDate -_id")

        if (!bookedAppointments)
            return res.status(200).json({ message: "No booked appointments" })

        return res.status(200).json(bookedAppointments)
    } catch (error) {
        console.log(`Error occured while getting booked appointments: ${error.message}`)
        console.log(`Error occured while getting booked appointments: ${error.stack}`)
        return res.status(500).json({ message: error.message })
    }
}

export const getUserAppointments = async (req, res) => {
    const userId = req.user._id
    if (!userId)
        return res.status(401).json({ message: "Unauthorized" })

    try {
        const appointments = await appointmentForPateints.findById(userId)
            .sort({ appointmentDate: -1 })

        if (!appointments)
            return res.status(200).json({ message: "No appointments available" })

        return res.status(200).json(appointments)
    } catch (error) {
        console.log(`Error occured while getting users appointments: ${error.message}`)
        console.log(`Error occured while getting users appointments: ${error.stack}`)
        return res.status(500).json({ message: error.message })
    }
}

export const updateAppointment = async (req, res) => {
    const role = req.user.role
    const { status, notes } = req.body
    const { id: appointmentId } = req.params

    if (role !== "doctor" || role !== "admin")
        return res.status(401).json({ message: "Unauthorized person" })

    if (!appointmentId)
        return res.status(400).json({ message: "missing or invalid appointment Id" })

    try {
        const post = await appointmentForPateints.findById(appointmentId)
        if (post.status === "cancelled")
            return res.status(400).json({ message: "appointment was already cancelled" })

        post.notes = notes
        post.status = status

        const updatedPost = await post.save()

        if (!updatedPost)
            return res.status(400).json({ message: "couldn't update appointment" })

        return res.status(201).json(updatedPost)

    } catch (error) {
        console.log(`Error occured while updating appointment: ${error.message}`)
        console.log(`Error occured while updating appointment: ${error.stack}`)
        return res.status(500).json({ message: error.message })
    }
}

export const updatePastAppointments = async (req, res) => {
    try {
        const now = new Date()
        const updateManyAppointments = await appointmentForPateints.updateMany(
            {
                appointmentDate: { $lt: now },
                status: { $ne: "cancelled" }
            },
            { $set: { status: "cancelled" } }
        )
        return res.status(200).json(updateManyAppointments)

    } catch (error) {
        console.log(`Error occured while updating past appointment: ${error.message}`)
        console.log(`Error occured while updating past appointment: ${error.stack}`)
        return res.status(500).json({ message: error.message })
    }
}

export const cancelAppointment = async (req, res) => {
    const { id: appointmentId } = req.params.id
    if (!appointmentId)
        return res.status(400).json({ message: "missing appointment id" })
    try {
        const appointment = await appointmentForPateints.findByIdAndUpdate(
            appointmentId,
            { status: "cancelled" },
            { new: true }
        )
        return res.status(200).json(appointment)
    } catch (error) {
        console.log(`Error occured while cancelling appointment: ${error.message}`)
        console.log(`Error occured while cancelling appointment: ${error.stack}`)
        return res.status(500).json({ message: error.message })
    }
}


