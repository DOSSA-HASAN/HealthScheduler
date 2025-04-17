import express from "express"
import { createAccount, login, logout } from "../controllers/auth.controller.js"

const router = express.Router()
router.post('/login', login)
router.post('/register', createAccount)
router.post('/logout', logout)

export default router
