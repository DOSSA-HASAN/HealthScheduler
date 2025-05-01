import { otpGenerator } from "../../lib/otpGenerator.js"
import { sendEMail } from "../../lib/sendEmail.js"
import { userModel } from "../models/userModel.js"
import bcrypt from "bcryptjs"

export const sendPasswordResetOTP = async (req, res) => {
    const { id: userId, email } = req.user
    if (!userId || !email)
        return res.status(400).json({ message: "Missing required fields" })
    try {

        // expires in 2 hours
        const passwordOtpExpiryDate = new Date(Date.now() + 2 * 60 * 60 * 1000)

        const user = await userModel.findByIdAndUpdate(
            userId,
            {
                passwordResetOtp: otpGenerator(),
                passwordOtpExpiryDate
            },
            { new: true }
        )

        if (!user)
            return res.status(404).json({ message: "user not found" })

        const subject = "Password Reset OTP Request"
        const text = `Your password reset otp is: ${user.passwordResetOtp}`
        await sendEMail(email, subject, text)

        return res.status(200).json({ message: "OTP has successfully been sent to your email" })

    } catch (error) {
        console.log(`Error occured while updating password: ${error.message}`)
        console.log(`Error occured while updating password: ${error.stack}`)
        return res.status(500).json({ message: error.message })
    }

}

export const resetPassword = async (req, res) => {
    const { otp, newPassword } = req.body
    const { id: userId } = req.user
    if (!otp || !newPassword || !userId)
        return res.status(400).json({ message: "Missing required fields" })
    try {
        const user = await userModel.findById(userId)
        if (!user)
            return res.status(404).json({ message: "User not found" })

        if (userId !== user.id)
            return res.status(401).json({ message: "unauthorized - not your account" })

        if (!user.passwordResetOtp || !user.passwordOtpExpiryDate)
            return res.status(400).json({ message: "request for a password reset otp first" })

        if (Date.now() > user.passwordOtpExpiryDate) {
            user.passwordResetOtp = ""
            user.passwordOtpExpiryDate = null
            await user.save()
            return res.status(403).json({ message: "otp has expired request for a new one" })
        }

        if (otp !== user.passwordResetOtp)
            return res.status(409).json({ message: "Invalid otp" })

        const saltRounds = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds)

        user.password = hashedPassword
        user.passwordResetOtp = ""
        user.passwordOtpExpiryDate = ""
        const newUser = await user.save()
        const { password: _, ...userWithoutPassword } = newUser._doc

        const subject = "Your HealthScheduler password has been updated 🔒"
        const text = `Hi ${user.username},\nJust a quick note to confirm that your password was changed successfully.\nIf you made this change, you're good to go!\nDidn't request this change? Please reset your password right away or get in touch with our support team for assistance.\n\nSecurity first,\n— The HealthScheduler Team`

        await sendEMail(user.email, subject, text)
        return res.status(200).json(userWithoutPassword)

    } catch (error) {
        console.log(`Error occured while updating password: ${error.message}`)
        console.log(`Error occured while updating password: ${error.stack}`)
        return res.status(500).json({ message: error.message })
    }
}

export const sendEmailResetOTP = async (req, res) => {
    const { id: userId, email } = req.user;
    if (!userId || !email)
        return res.status(400).json({ message: "Missing required fields" })

    try {

        const emailOtpExpiryDate = new Date(Date.now() + 2 * 60 * 60 * 1000)

        const user = await userModel.findByIdAndUpdate(
            userId,
            {
                emailResetOtp: otpGenerator(),
                emailOtpExpiryDate
            },
            { new: true }
        )

        if (!user)
            return res.status(404).json({ message: "User not found" })

        const subject = "Email Change OTP Request"
        const text = `Your Email reset otp is: ${user.emailResetOtp}`
        await sendEMail(email, subject, text)

        return res.status(200).json({ message: "OTP has been sent to your email" })

    } catch (error) {
        console.log(`Error occured while updating email otp: ${error.message}`)
        console.log(`Error occured while updating email otp: ${error.stack}`)
        return res.status(500).json({ message: error.message })
    }
}

export const changeEmail = async (req, res) => {
    const { id: userId } = req.user
    const { otp, email} = req.body
    if (!email || !otp || !userId)
        return res.status(400).json({ message: "Missing required fields" })
    try {

        const user = await userModel.findById(userId)
        if (!user)
            return res.status(404).json({ message: "user not found" })

        if (!user.emailResetOtp || !user.emailOtpExpiryDate)
            return res.status(400).json({ message: "request for an otp to change your email" })

        if (Date.now() > user.emailOtpExpiryDate) {
            user.emailResetOtp = ""
            user.emailOtpExpiryDate = null
            user.save()
            return res.status(403).json({ message: "OTP has expired, request for a new one" })
        }

        if (otp !== user.emailResetOtp)
            return res.status(409).json({ message: "Invalid otp" })

        user.email = email
        user.emailResetOtp = ""
        user.emailOtpExpiryDate = null
        const newUser = await user.save()
        const { password: _, ...userWithoutPassword } = newUser._doc

        const subject = 'Your HealthScheduler email was successfully updated 🚀';
        const text = `Hi ${user.username},\nWe're letting you know that the email address linked to your HealthScheduler account has been successfully changed.\nIf you made this change, no further action is needed.\nIf this wasn't you, please secure your account immediately by resetting your password or contacting our support team.\n\nStay safe,\n— The HealthScheduler Team
`
        await sendEMail(newUser.email, subject, text)

        return res.status(200).json(userWithoutPassword)
    } catch (error) {
        console.log(`Error occured while updating email: ${error.message}`)
        console.log(`Error occured while updating email: ${error.stack}`)
        return res.status(500).json({ message: error.message })
    }
}

export const updateProfilePic = async (req, res) => {
    const { id: userId } = req.user
    const { imageUrl } = req.body
    if (!imageUrl)
        return res.status(400).json({ message: "missing image url" })
    try {
        const user = await userModel.findByIdAndUpdate(
            userId,
            { profilePic: imageUrl },
            { new: true }
        )
        const { password: _, ...userWithoutPassword } = user._doc
        return res.status(200).json(userWithoutPassword)
    } catch (error) {
        console.log(`Error occured while updating profile pic: ${error.message}`)
        console.log(`Error occured while updating profile pic: ${error.stack}`)
        return res.status(500).json({ message: error.message })
    }
}

// change specialization
export const changeSpecialization = async (req, res) => {
    const { id: userId } = req.user
    const { specialization } = req.body
    if (!userId)
        return res.status(400).json({ message: "no user id provided" })
    try {
        const user = await userModel.findByIdAndUpdate(
            userId,
            { specialization },
            { new: true }
        )

        const { password: _, ...userWithoutPassword } = user._doc

        return res.status(200).json(userWithoutPassword)

    } catch (error) {
        console.log(`Error occured while updating specialization: ${error.message}`)
        console.log(`Error occured while updating specialization: ${error.stack}`)
        return res.status(500).json({ message: error.message })
    }
}

// change experience 
export const changeExperience = async (req, res) => {
    const { id: userId } = req.user
    const { experience } = req.body
    if (!userId)
        return res.status(400).json({ message: "no user id was provided" })
    try {
        const user = await userModel.findByIdAndUpdate(
            userId,
            { experience },
            { new: true }
        )

        const { password: _, ...userWithoutPassword } = user._doc
        return res.status(200).json(userWithoutPassword)

    } catch (error) {
        console.log(`Error occured while updating experience pic: ${error.message}`)
        console.log(`Error occured while updating experience pic: ${error.stack}`)
        return res.status(500).json({ message: error.message })
    }
}
