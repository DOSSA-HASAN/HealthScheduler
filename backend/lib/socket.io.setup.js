import { Server } from "socket.io"
import express from "express"
import http from "http"
import { appointmentForPateints } from "../src/models/appointment.model.js"
import { updatePastAppointments } from "../src/controllers/appointment.controller.js"

let blockedDates = []

export const loadBookedDates = async () => {
    try {
        const bookedDates = await appointmentForPateints.find().select("appointmentDate")
        blockedDates = bookedDates.map(appointment => {
            const appointmentDate = new Date(appointment.appointmentDate)
            const formattedTime = appointmentDate.toISOString().split('T')
            return `${formattedTime[0]}T${formattedTime[1].split('.')[0]}`
        })
    } catch (error) {
        console.log(`Error occured while loading booked dates: ${error.message}`)
        console.log(`Error occured while loading booked dates: ${error.stack}`)
        return res.status(500).json({ message: error.message })
    }
}

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
        credentials: true
    }
})

io.on("connection", async (socket) => {
    console.log('user has connected ' + socket.id)

    await updatePastAppointments()

    const bookedDates = await loadBookedDates()
    blockedDates = [...blockedDates, ...bookedDates]
    io.emit("allBookedDates", blockedDates)

    socket.on("disconnect", () => {
        console.log('user has disconnected ' + socket.id)
    })
})

export { io, server, app}