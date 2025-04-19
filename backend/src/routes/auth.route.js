import express from "express"
import { createAccount, login, logout, createDoctorOrAdminAccount } from "../controllers/auth.controller.js"
import { verifyAdmin } from "../middleware/verifyAdmin.js"

const router = express.Router()
router.post('/login', login)
router.post('/register', createAccount)
router.post('/create', verifyAdmin, createDoctorOrAdminAccount)
router.post('/logout', logout)

export default router
