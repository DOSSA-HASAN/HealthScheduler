import { Pencil } from 'lucide-react'
import React, { useEffect } from 'react'
import UpdateAppointment from './UpdateAppointment'
import { useAuthStore } from '../store/useAuthStore'
import { useAppointmentStore } from '../store/useAppointmentStore'
import { Link } from "react-router-dom"
import AppointmentSkeleton from "./AppointmentSkeleton"

function AppointmentList() {

    const { authUser } = useAuthStore()
    const { appointments, getMyAppointments, getDoctorAppointments, isFetchingAppointments, setAppointmentToUpdate, cancelAppointmentStatus, viewAllAppointments } = useAppointmentStore()

    useEffect(() => {
        if (authUser.role === "doctor") {
            getDoctorAppointments()
        } else if (authUser.role === "admin") {
            viewAllAppointments()
        }
        else {
            getMyAppointments()
        }
    }, [])

    return (
        <section className='w-full'>
            {
                isFetchingAppointments && <AppointmentSkeleton />
            }
            {
                (!isFetchingAppointments && appointments.length === 0) ?
                    <div className='w-full text-center absolute top-[50%] font-bold text-[20px] '>
                        <p className='text-gray-400'>Book an appointment to start monitoring them</p>
                        <p className='text-gray-400'>Click <span className='text-blue-600'><Link to={'/see-doctors'}>here</Link></span> to get started</p>
                    </div>
                    :
                    <table className='w-full flex flex-col justify-start items-center p-[10px] h-screen overflow-y-scroll overflow-x-hidden'>
                        {
                            appointments.length > 0 && appointments.map((appointment, idx) => (
                                <tr key={idx} className='w-full flex flex-col justify-center items-center bg-gray-100 m-[15px] rounded-md hover:bg-gray-200 shadow-md h-[200px] md:h-auto' >
                                    <div className={`rounded-t-lg w-full rounded-top-md p-[10px] ${appointment?.status === "pending" ? 'bg-gray-500' : appointment?.status === "completed" ? 'bg-green-400' : 'bg-red-400'}`}>
                                        <p className='font-bold text-white text-center'>{appointment.status}</p>
                                    </div>
                                    <div className='p-[15px] bg-blue-600 text-white flex flex-col lg:flex-row w-full rounded-b-lg'>
                                        <td className='w-full flex justify-between items-center md:w-[calc(100%/5)] md:block text-center font-bold'><p className='md:hidden'>Doctor Name:</p>{appointment?.doctor?.username}</td>
                                        <td className='w-full flex justify-between items-center md:w-[calc(100%/5)] md:block text-center font-bold'><p className='md:hidden'>Appointment Date:</p>{new Date(appointment?.appointmentDate).toISOString().split("T")[0]} - {appointment.appointmentDate.split("T")[1].split(".")[0]}</td>
                                        <td className='w-full flex justify-between items-center md:w-[calc(100%/5)] md:block text-center font-bold'><p className='md:hidden'>Patient Name:</p>{appointment?.patient?.username}</td>
                                        <td className='flex justify-between items-center w-full text-left md:w-[calc(100%/5)] text-center font-bold'><p>{appointment?.notes}</p><span className={`hover:cursor-pointer text-white-500 ${appointment.status === "cancelled" || appointment.status === "completed" ? 'hidden' : ''}`}>{authUser.role === 'user' ? <button onClick={() => { cancelAppointmentStatus(appointment.id) }} className='p-[10px] bg-red-600 hover:bg-red-500 hover:cursor-pointer rounded-md text-white'>Cancel</button> : <Pencil onClick={() => setAppointmentToUpdate(appointment)} />}</span></td>
                                    </div>
                                </tr>
                            ))
                        }
                    </table>
            }
        </section>
    )
}

export default AppointmentList
