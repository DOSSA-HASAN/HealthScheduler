import React, { useEffect } from 'react'
import { AnimationVariants } from "../lib/AnimationVariants"
import DoctorCard from "../components/DoctorCard"
import { motion } from 'framer-motion'
import DoctorsCardSkeleton from '../components/DoctorsCardSkeleton'
import { useAppointmentStore } from '../store/useAppointmentStore'
import { socket } from '../lib/socket'
import BookAppointment from '../components/BookAppointment'
import Loading from '../components/Loading'

function SeeDoctors() {

    const { doctors, getAllDoctors, doctorToBook, isBookingAppointment } = useAppointmentStore()
    const skeletonArray = new Array(10).fill("")

    useEffect(() => {
        getAllDoctors()
    }, [])

    return (
        <motion.div variants={AnimationVariants} initial={"initial"} animate={"animate"} exit={"exit"} transition={{ duration: 0.3 }}>
            <section className='p-10 w-full h-screen overflow-y-scroll overflow-x-hidden grid grid-cols-[repeat(auto-fit,minmax(250px,300px))] gap-4 justify-center items-center ' >
                {
                    doctorToBook && <BookAppointment />
                }
                {
                    doctors === null && skeletonArray.map((item) => (
                        <DoctorsCardSkeleton />
                    ))

                }
                {
                    doctors !== null && doctors.map((doctor, idx) => (
                        <DoctorCard key={idx} doctor={doctor} />
                    ))
                }
            </section>
        </motion.div>
    )
}

export default SeeDoctors
