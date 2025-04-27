import { useCallback } from "react"
import { create } from "zustand"
import { toast } from "react-hot-toast"
import { axiosInstance } from "../lib/axiosInstance"
import { socket } from "../lib/socket"

export const useAppointmentStore = create((set, get) => ({
    blockedDates: [],
    appointments: null,
    isBookingAppointment: false,
    isUpdatingAppointmentDetails: false,
    isFetchingAppointments: false,
    appointmentToUpdate: null,
    setAppointmentToUpdate: (status) => set({ appointmentToUpdate: status }),

    initializeSocketListener: () => {
        socket.off("allBookedDates")
        socket.off("connect")
        socket.off("disconnect")

        socket.on("allBookedDates", (bookedDates) => {
            console.log(`dates that are booked`, bookedDates)
            set({ blockedDates: bookedDates })
        })

        socket.on("connected", (socket) => {
            console.log(`connected`, socket.id)
        })

        socket.on("disconnect", () => {
            console.log(`disconnected`)
        })
    },

    bookAppointment: async (doctorId, appointmentDate, status, notes) => {
        set({ isBookingAppointment: true })
        try {
            const res = await axiosInstance.post('appointment/book-appointment', { doctorId, appointmentDate, status, notes })
            set((prev) => ({ appointments: [...prev.appointments, res.data] }))
            toast.success("Appointment Booked")
        } catch (error) {
            console.log(error.stack)
            toast.error("Appointment not booked")
        } finally {
            set({ isBookingAppointment: true })
        }
    },

    getMyAppointments: async () => {
        set({ isFetchingAppointments: true })
        try {
            const res = await axiosInstance.get('appointment/user/my-appointments')
            set({ appointments: res.data })
            console.log(get().appointments)
            console.log(res.data)
        } catch (error) {
            console.log(error.stack)
            toast.error("An error occurred while fetching appointments")
        } finally {
            set({ isFetchingAppointments: false })
        }
    },

    getDoctorAppointments: async () => {
        set({ isFetchingAppointments: true })
        try {
            const res = await axiosInstance.get('appointment/doctor/my-appointments')
            set({ appointments: res.data })
            console.log(get().appointments)
            console.log(res.data)
        } catch (error) {
            console.log(error.stack)
            toast.error("An error occurred while fetching appointments")
        } finally {
            set({ isFetchingAppointments: false })
        }
    },

    // for doctors
    updateAppointmentDetails: async (status, notes) => {
        set({ isUpdatingAppointmentDetails: true })
        try {
            const res = await axiosInstance.post(`appointment/update/${get().appointmentToUpdate.id}`, { status, notes })
            set((state) => ({
                appointments: [...state.appointments.filter(appointment => appointment.id !== get().appointmentToUpdate.id), res.data]
            }))
            toast.success("Update successful")
        } catch (error) {
            console.log(error.stack)
            toast.error("Update failed!\nPlease try again")
        } finally {
            set({ isUpdatingAppointmentDetails: false })
            set({ appointmentToUpdate: null })
        }
    },

    // for users
    cancelAppointmentStatus: async (appointmentId) => {
        set({ isUpdatingAppointmentDetails: true })
        try {
            const res = await axiosInstance.post(`appointment/cancel/${appointmentId}`)
            set((prev) => ({
                appointments: [...prev.appointments.filter(appointment => appointment.id !== appointmentId), res.data]
            }))
            toast.success("Appointment cancelled")
        } catch (error) {
            console.log(error.stack)
            toast.error("Could not cancel appointment")
        } finally {
            set({ isUpdatingAppointmentDetails: false })
        }
    },

    // for adming
    viewAllAppointments: async () => {
        set({ isFetchingAppointments: true })
        try {
            const res = await axiosInstance.get('appointment/all-appointments')
            set({ appointments: res.data })
        } catch (error) {
            console.log(error.stack)
            toast.error("Could not cancel appointment")
        } finally {
            set({ isFetchingAppointments: false })
        }
    }

}))