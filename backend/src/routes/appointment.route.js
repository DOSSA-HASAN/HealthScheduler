import express from "express"
import { verifyUser } from "../middleware/verifyUser.middleware.js"
import { bookAppointment, getAllAppointments, getBookedAppointments, getUserAppointments, updateAppointment, cancelAppointment } from "../controllers/appointment.controller.js"
import { verifyAdminAndDoctor } from "../middleware/verifyAdminAndDoctor.js"
import { verifyAdmin } from "../middleware/verifyAdmin.js"
import { verifyDoctor } from "../middleware/verifyDoctor.js"

const router = express.Router()

router.post('/book-appointment', verifyUser, bookAppointment)
router.get('/all-appointments', verifyAdminAndDoctor, getAllAppointments)
router.get('/doctor/my-appointments', verifyDoctor, getBookedAppointments)
router.get('/user/my-appointments', verifyUser, getUserAppointments)
// this route is only for doctors / admin to add notes and update status
router.post('/update/:id', verifyAdminAndDoctor, updateAppointment)
router.post('/cancel/:id', verifyUser, cancelAppointment)

export default router