import express from "express"
import dotenv from "dotenv/config"
import { connectDB } from "../lib/dbConnection.js"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.route.js"
import usersRouter from "./routes/users.route.js"
import appointmentRouter from "./routes/appointment.route.js"
import updateProfileRouter from "./routes/profile.route.js"
import { io, app, server } from "../lib/socket.io.setup.js"

const PORT = process.env.PORT

// connect to db
connectDB()

// const app = express()

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(cookieParser())
app.use(express.json())

app.use('/api/auth', authRouter)
app.use('/api/user', usersRouter)
app.use('/api/appointment', appointmentRouter)
app.use('/api/update-profile', updateProfileRouter)

server.listen(PORT, () => {
    console.log(`server started on port: ${PORT}`)
})