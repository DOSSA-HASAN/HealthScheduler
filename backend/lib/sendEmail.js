import nodemailer from "nodemailer"

export const sendEMail = async (to, subject, text) => {
    try {

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            }
        })

        const mailOptions = {
            from: `HealthScheduler 🩺`,
            to,
            subject,
            text
        }

        await transporter.sendMail(mailOptions)

    } catch (error) {
        console.log(`Error occured in sendMail: ${error.message}`)
        console.log(`Error occured in sendMail: ${error.stack}`)
    }
}