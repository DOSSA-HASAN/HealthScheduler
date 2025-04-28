import React from 'react'
import { BriefcaseMedical } from "lucide-react"
import { useAuthStore } from '../store/useAuthStore'
import { useAppointmentStore } from '../store/useAppointmentStore'

function DoctorCard({ doctor }) {

  const { authUser } = useAuthStore()
  const { setDoctorToBook } = useAppointmentStore()
  return (
    <div className=' flex flex-col jusitfy-between shadow-md border-1 border-gray-200 w-full h-[200px] rounded-md' style={{ background: 'linear-gradient(90deg,rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 35%, rgba(157, 190, 196, 1) 100%)' }}>
      <div style={{ backgroundImage: `url(${doctor.profilePic})`, backgroundSize: '100px', backgroundPosition: 'right', backgroundRepeat: 'no-repeat' }} className='h-full flex justify-start items-start flex-col mix-blend-multiply p-[20px]'>
        <p className='text-gray-800 font-bold text-[20px]'>{doctor.username}</p>
        <p className='text-gray-400'>{doctor.specialization}</p>
        <p className='flex items-center justify-start font-normal'><BriefcaseMedical className='text-gray-400' />{doctor.experience} yr</p>
      </div>
      <div className={`p-[20px] ${authUser.role !== "user" ? 'hidden' : ''}`}>
        <button onClick={() => {setDoctorToBook(doctor._id)}} className='hover:cursor-pointer p-[10px] bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-md mt-[10px]'>Book Now</button>
      </div>
    </div>
  )
}

export default DoctorCard
