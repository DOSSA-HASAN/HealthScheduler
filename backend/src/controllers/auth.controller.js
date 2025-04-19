import jwt from "jsonwebtoken"
import { userModel } from "../models/userModel.js"
import bcrypt from "bcryptjs"
import { sendEMail } from "../../lib/sendEmail.js"
import cloudinary from "../../lib/cloudinaryImage.js"

export const createAccount = async (req, res) => {
    const { email, password, username, imageUrl, role, specialization, experience } = req.body
    if (!email || !password || !username)
        return res.status(404).json({ message: "Missing password or username or email" })

    try {
        const user = await userModel.findOne({ email })
        if (user)
            return res.status(400).json({ message: "User with email already exists. Please log in" })

        const genSalt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, genSalt)

        let image;
        if(imageUrl) {
            image = await cloudinary.uploader.upload(imageUrl, { folder: "health-scheduler" })
        }

        const newUser = new userModel({
            username,
            password: hashedPassword,
            email,
            role,
        })

        // add profile pic if its provided
        if(image?.secure_url){
            user.profilePic = image.secure_url
        }

        // add xp and specialization if its provided
        if(experience && specialization){
            newUser.experience = experience
            newUser.specialization = specialization
        }

        const userSaved = await newUser.save()

        if (!userSaved)
            return res.status(500).json({ message: "Unable to create account. Please try again later" })

        const subject = `Hey ${newUser.username}!\nWelcome to HealthScheduler ready to book your next checkup?`
        const text = `Hi ${newUser.username}, 👋\nWelcome aboard! We're thrilled to have you as part of the HealthScheduler family.\nYour journey to stress-free appointments starts now. Whether it’s a regular checkup, a consultation, or a follow-up, booking your next visit is just a few clicks away!\n✅ Fast & easy appointment booking\n🩺 Verified doctors at your fingertips\n📅 Smart reminders so you never miss a date\nHere’s to healthier days ahead,\n– The HealthScheduler Team 💙`
        
        await sendEMail(newUser.email, subject, text)

        return res.status(201).json({ message: "Account created successfully. Please log in" })

    } catch (error) {
        console.log(`Error occured in createAccount in auth.controller: ${error.message}`)
        return res.status(500).json({ message: error.message })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password)
        return res.status(404).json({ message: "Missing email or password" })

    try {

        const user = await userModel.findOne({ email })
        if (!user)
            return res.status(404).json({ message: "No user with email was found. Please create an account" })

        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch)
            return res.status(401).json({ message: "Invalid Password or email" })

        const token = jwt.sign(
            { id: user._id },
            process.env.SECRET_KEY,
            { expiresIn: '1d' }
        )

        //send cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        })

        const { password: _, ...userWithoutPassword } = user._doc

        return res.status(200).json(userWithoutPassword)

    } catch (error) {
        console.log(`Error in login: ${error.message}`)
        return res.status(500).json({ message: error.message })
    }
}

export const logout = (req, res) => {
    const token = req.cookies.token
    if (!token)
        return res.status(401).json({ message: "No user was logged in" })
    try {
        res.clearCookie("token")
        return res.status(200).json({ message: "User logged out" })
    } catch (error) {
        console.log(`Error occured while logging out: ${error.message}`)
        return res.status(500).json({ message: error.message })
    }
}