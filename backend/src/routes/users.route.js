import express from "express"
import { getAllPatients, getAllDoctors, getAllUsers, getUser, getDoctor } from "../controllers/user.controller.js"
import { verifyAdminAndDoctor } from "../middleware/verifyAdminAndDoctor.js"
import { verifyAdmin } from "../middleware/verifyAdmin.js"
import { verifyUser } from "../middleware/verifyUser.middleware.js"

const router = express.Router()

router.get('/doctors', verifyUser, getAllDoctors)
router.get('/patients', verifyAdminAndDoctor, getAllPatients)
router.get('/users', verifyAdmin, getAllUsers)
router.get('/user/:id', verifyAdminAndDoctor, getUser)
router.get('/doctor/:id', verifyUser, getDoctor)

export default router