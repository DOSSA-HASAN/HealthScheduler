import express from "express"
import { verifyUser } from "../middleware/verifyUser.middleware.js"
import { sendPasswordResetOTP, resetPassword, sendEmailResetOTP, changeEmail, updateProfilePic, changeSpecialization, changeExperience } from "../controllers/profile.controller.js"
import { verifyDoctor } from "../middleware/verifyDoctor.js"

const router = express.Router()

router.post('/send-password-reset-otp', verifyUser, sendPasswordResetOTP)
router.post('/reset-password', verifyUser, resetPassword)
router.post('/send-email-reset-otp', verifyUser, sendEmailResetOTP)
router.post('/change-email', verifyUser, changeEmail)
router.post('/change-profile-pic', verifyUser, updateProfilePic)
router.post('/change-specialization', verifyDoctor, changeSpecialization)
router.post('/change-experience', verifyDoctor, changeExperience)

export default router