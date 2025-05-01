import { Server } from "socket.io"
import express from "express"
import http from "http"
import { appointmentForPateints } from "../src/models/appointment.model.js"
import { updatePastAppointments } from "../src/controllers/appointment.controller.js"

let blockedDates = []
export let connectedDoctors = []

export const loadBookedDates = async () => {
    try {
        const bookedDates = await appointmentForPateints.find().select("doctorId appointmentDate").lean()
        return bookedDates
    } catch (error) {
        console.log(`Error occured while loading booked dates: ${error.message}`)
        console.log(`Error occured while loading booked dates: ${error.stack}`)
        return []
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

io.on("connection", (socket) => {
    console.log('user has connected ' + socket.id);

    // Attach all listeners first
    socket.on("joinDoctorRoom", (doctorId) => {
        const doctorRoom = String(doctorId);
        connectedDoctors[doctorRoom] = socket.id;
        socket.join(doctorRoom);
        console.log(`Doctor ${doctorRoom} joined their room with socket ID: ${socket.id}`);
    });

    socket.on("disconnect", () => {
        console.log('user has disconnected ' + socket.id);
        const doctorId = Object.keys(connectedDoctors).find(key => connectedDoctors[key] === socket.id);
        if (doctorId) {
            delete connectedDoctors[doctorId];
            console.log(`Doctor ${doctorId} has disconnected.`);
        }
    });

    // THEN do async stuff
    (async () => {
        await updatePastAppointments();
        const bookedDates = await loadBookedDates();
        blockedDates = bookedDates
        io.emit("allBookedDates", blockedDates);
    })();
});


export { io, server, app }