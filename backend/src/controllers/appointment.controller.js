import { sendEMail } from "../../lib/sendEmail.js"
import { io, loadBookedDates } from "../../lib/socket.io.setup.js"
import { appointmentForPateints } from "../models/appointment.model.js"
import { userModel } from "../models/userModel.js"

export const bookAppointment = async (req, res) => {
    const { doctorId, appointmentDate, status, notes } = req.body
    const { _id: patientId, email: userEmail, role } = req.user

    if (role !== "user")
        return res.status(400).json({ message: "non-user accounts cant book appointments, create a user account to do so" })

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
        const bookedDates = await loadBookedDates()
        io.emit("allBookedDates", bookedDates)

        if (!appointment)
            return res.status(400).json({ message: "could not book appointment" })

        const ISODate = new Date(appointmentDate).toISOString()
        const appointmentDateOnly = ISODate.split("T")[0]
        const appointmentTimeOnly = ISODate.split("T")[1]

        const subject = `You're all set, ${patient.username}! ✅ Appointment confirmed with ${doctor.username}`
        const text = `Hi ${patient.username}, 👋\nYour appointment with Dr. ${doctor.username} has been successfully booked!\n🗓️ Date: ${appointmentDateOnly}\n🕒 Time: ${appointmentTimeOnly}\n📍 Location:Right here within our clinic\nNeed to make changes? No worries, you can reschedule or cancel anytime from your dashboard.\nSee you soon!\n– HealthScheduler 💙`
        await sendEMail(userEmail, subject, text)

        return res.status(201).json(appointment)

    } catch (error) {
        console.log(`Error in booking appointment: ${error.message}`)
        console.log(`Error in booking appointment: ${error.stack}`)
        return res.status(500).json({ message: error.message })
    }
}

export const getAllAppointments = async (req, res) => {
    const user = req.user
    if (user.role !== "doctor" && user.role !== "admin")
        return res.status(401).json({ message: "Unauthorized person" })
    try {
        const appointments = await appointmentForPateints.find()
            .sort({ appointmentDate: -1 })
            .populate("doctor")
            .populate("patient");

        if (!appointments)
            return res.status(200).json({ message: "No appointments available" })

        return res.status(200).json(appointments)

    } catch (error) {
        console.log(`Error occured while gettingAllAppointments: ${error.message}`)
        console.log(`Error occured while gettingAllAppointments: ${error.stack}`)
        return res.status(500).json({ message: error.message })
    }
}

// appointments for doctor, protected route for doctors only
export const getBookedAppointments = async (req, res) => {
    const { id: doctorId } = req.user
    if (!doctorId)
        return res.status(400).json({ message: "Missing doctor Id" })

    try {
        const bookedAppointments = await appointmentForPateints.find({ doctorId })

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
    const { id: userId, role } = req.user
    if (!userId)
        return res.status(401).json({ message: "Unauthorized" })

    if (role !== "user")
        return res.status(401).json({ message: "unauthorized - only users can check their own appointments" })

    try {
        const appointments = await appointmentForPateints.find({ patientId: userId })
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
    const user = req.user
    const { status, notes } = req.body
    const { id: appointmentId } = req.params

    if (user.role !== "doctor" && user.role !== "admin")
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

// when app starts it should run to check all appointements that have past their dates and set their status to "cancelled"
export const updatePastAppointments = async (req, res) => {
    try {
        const now = new Date()
        const updateManyAppointments = await appointmentForPateints.updateOne(
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

// meant for users only, only they should have a cancel-only option
export const cancelAppointment = async (req, res) => {
    const { id: appointmentId } = req.params
    const user = req.user
    const notes = "cancelled by self"

    if (!appointmentId)
        return res.status(400).json({ message: "missing appointment id" })

    if (user.role !== "user")
        return res.status(401).json({ message: "unauthorized - only users can cancel this appointment" })
    try {
        const appointment = await appointmentForPateints.findById(appointmentId).populate("doctor").populate("patient")

        if (user._id.toString() !== appointment.patientId._id.toString())
            return res.status(401).json({ message: "unauthorized  not ur appointment" })

        if (appointment.status === "cancelled")
            return res.status(400).json({ message: "cant modify an appointment that has been cancelled" })

        appointment.status = "cancelled"
        appointment.notes = notes

        const cancelledAppointment = await appointment.save()

        const bookedDates = await loadBookedDates()
        io.emit("allBookedDates", bookedDates)

        return res.status(200).json(cancelledAppointment)
    } catch (error) {
        console.log(`Error occured while cancelling appointment: ${error.message}`)
        console.log(`Error occured while cancelling appointment: ${error.stack}`)
        return res.status(500).json({ message: error.message })
    }
}


