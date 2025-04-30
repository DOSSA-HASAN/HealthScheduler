import React from 'react'
import AppointmentList from '../components/AppointmentList'
import UpdateAppointment from '../components/UpdateAppointment'
import { useAppointmentStore } from '../store/useAppointmentStore'
import Loading from '../components/Loading'

function Appointment() {

    const { appointmentToUpdate } = useAppointmentStore()

    return (
        <section className='w-full flex flex-col justify-between items-center p-[10px]'>
            {appointmentToUpdate && <UpdateAppointment />}
            <AppointmentList />
        </section>
    )
}

export default Appointment
