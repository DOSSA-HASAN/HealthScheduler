import { create } from "zustand"
import { axiosInstance } from "../lib/axiosInstance"
import { toast } from "react-hot-toast"

export const useAuthStore = create((set, get) => ({
    authUser: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null,
    isUpdatingEmail: false,
    isUpdatingPassword: false,
    isLogginIn: false,  
    isSigningUp: false,
    updatingProfile: null,
    changingProfilePic: false,

    setUpdatingProfile: (field) => {
        set({ updatingProfile: field })
    },

    // make sure to redirect user to dashboard / home page once they login
    login: async (email, password) => {
        set({ isLogginIn: true })
        try {
            const res = await axiosInstance.post('auth/login', { email, password })
            set({ authUser: res.data })
            console.log(res.data)
            toast.success("Logged in successfully")
            localStorage.setItem("user", JSON.stringify(res.data))
        } catch (error) {
            toast.error("Could not login")
            console.log(error.message)
        } finally {
            set({ isLogginIn: false })
        }

    },

    signup: async (email, password, username) => {
        set({ isSigningUp: true })
        try {
            const res = await axiosInstance.post('auth/register', { email, password, username })
            toast.success("Account created. Login to continue")
            setTimeout(() => {
                window.location.pathname = "/login"
            }, 1000);
        } catch (error) {
            toast.error("Could not create account\nTry again")
            console.log(error.message)
        } finally {
            set({ isSigningUp: false })
        }
    },

    logout: async () => {
        try {
            const res = await axiosInstance.post('auth/logout')
            if (res.status === 200) {
                localStorage.clear()
            }
            window.location.pathname = '/'
        } catch (error) {
            toast.error("Could not log out user")
            console.log(error.message)
        }
    },

    resetPasswordOTP: async () => {
        try {
            const res = await axiosInstance.post('update-profile/send-password-reset-otp')
            toast.success("OTP sent to email")
        } catch (error) {
            console.log(error.stack)
            toast.error("Could not send OTP")
        }
    },

    changePassword: async (otp, newPassword) => {
        set({ isUpdatingPassword: true })
        try {
            const res = await axiosInstance.post('update-profile/reset-password', { otp, newPassword })
            toast.success("Password change\nPlease log in again to continue")
            await get().logout()
        } catch (error) {

        } finally {
            set({ isUpdatingPassword: false })
        }
    },

    changeEmailOTP: async () => {
        try {
            const res = await axiosInstance.post('update-profile/send-email-reset-otp')
            toast.success("OTP sent to email")
        } catch (error) {
            console.log(error.message)
            toast.error("Could not send OTP")
        }
    },

    changeEmail: async (otp, email) => {
        set({ isUpdatingEmail: true })
        try {
            const res = await axiosInstance.post('update-profile/change-email', { otp, email })
            toast.success("Email changed")
            setTimeout(async () => {
                await get().logout()
            }, 2000);
        } catch (error) {
            console.log(error.stack)
            toast.error("Could not change email")
        } finally {
            set({ isUpdatingEmail: false })
        }
    },

    changeProfilePic: async (imageUrl) => {
        set({ changingProfilePic: true })
        try {
            const res = await axiosInstance.post('update-profile/change-profile-pic', { imageUrl })
            toast.success("Profile picture changed")
            set({ authUser: res.data })
            localStorage.setItem("user", JSON.stringify(res.data))
        } catch (error) {
            toast.error("Could not change profile pic")
            console.log(error.stack)
        } finally {
            set({ changingProfilePic: false })
        }
    },

    createAdminOrDoctorAccount: async (username, password, email, specialization, experience, role) => {
        set({ isSigningUp: true })
        try {
            const res = await axiosInstance.post('auth/create', { email: email, password: password, username: username, role: role, specialization: specialization, experience: experience })
            toast.success("Account created successfully")

        } catch (error) {
            console.log(error.message)
            toast.error(error.message)
        } finally {
            set({ isSigningUp: false })
        }
    },

    googleLogin: async (token) => {
        try {
            const { data } = await axiosInstance.post("auth/google-login", { token }, {
                headers: {
                    'Cross-Origin-Opener-Policy': 'same-origin',
                    'Cross-Origin-Embedder-Policy': 'require-corp',
                    'Content-Type': 'application/json'
                }
            });
            set({ authUser: data })
            localStorage.setItem("user", JSON.stringify(data));
        } catch (error) {
            console.error("Google login failed:", error.response?.data?.message || error.message);
            throw error; // let calling components handle UI feedback
        }
    }

}))