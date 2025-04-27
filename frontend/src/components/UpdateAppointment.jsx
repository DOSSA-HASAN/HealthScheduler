import React, { useEffect, useState } from 'react'
import { useAppointmentStore } from '../store/useAppointmentStore'
import { AnimationVariants } from '../lib/AnimationVariants'
import { motion } from 'framer-motion'

function UpdateAppointment() {

    const { setAppointmentToUpdate, updateAppointmentDetails } = useAppointmentStore()

    const [formData, setFormData] = useState({
        status: '',
        notes: ''
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    console.log(formData)

    const handleUpdateAppointment = (e) => {
        e.preventDefault()
        updateAppointmentDetails(formData.status, formData.notes)
    }

    return (
        <motion.div variants={AnimationVariants} initial={"initial"} animate={"animate"} exit={"exit"} transition={{ duration: 0.3 }} className='flex justify-center items-center absolute z-[200] h-full lg:h-[calc(100vh-70px)] w-full backdrop-blur'>
            <form className='flex flex-col justify-center items-center bg-white shadow-xl w-[400px] h-[350px] rounded-md'>
                <p className='w-full text-center font-bold text-[20px] mb-[20px] text-blue-600'>Update Appointment Details</p>
                <input onChange={(e) => handleInputChange(e)} required type="text" name='notes' placeholder='Enter notes' className='border-1 border-gray-300 rounded-md p-3 focus:outline-none mb-5 w-[80%]' />
                <select onChange={(e) => handleInputChange(e)} className='appearance-none border-1 text-gray-500 border-gray-300 rounded-md p-3 focus:outline-none mb-5 w-[80%]' name="status" id="">
                    <option value="" selected hidden>Update appointment status</option>
                    <option className='bg-red-300 text-white' value="cancelled">Cancel Appointment</option>
                    <option value="completed" className='bg-green-300 text-white'>Complete Appointment</option>
                </select>
                <div className='flex flex-col md:flex-row w-full justify-between items-center pl-10 pr-10'>
                    <button onClick={handleUpdateAppointment} className='w-full md:w-[50%] bg-blue-600 hover:bg-blue-500 text-white font-bold p-3 rounded-md mb-[10px] md:mb-0'>Update</button>
                    <button onClick={() => setAppointmentToUpdate(null)} type='button' className='w-full md:w-[40%] bg-red-600 hover:bg-red-500 text-white font-bold p-3 rounded-md'>Cancel</button>
                </div>
            </form>
        </motion.div>
    )
}

export default UpdateAppointment
