import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import Loading from './Loading'

function UpdateProfile() {

    const { updatingProfile, setUpdatingProfile, isUpdatingPassword, changePassword, changeEmail, isUpdatingEmail } = useAuthStore()

    const [formData, setFormData] = useState({
        otp: '',
        newValue: ''
    })


    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleCancel = () => {
        setFormData({ otp: '', updatingProfile: '' })
        setUpdatingProfile(null)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (updatingProfile === "email") {
            changeEmail(formData.otp, formData.newValue)
            setFormData({ otp: '', newValue: '' })
        } else if (updatingProfile === "password") {
            changePassword(formData.otp, formData.newValue)
            setFormData({ otp: '', newValue: '' })
        }
    }

    return (
        <main className='flex justify-center items-center absolute z-[200] h-full lg:h-[calc(100vh-70px)] w-full backdrop-blur'>
            {
                (isUpdatingPassword || isUpdatingEmail) && <Loading />
            }
            <form onSubmit={handleSubmit} className='flex flex-col justify-center items-center bg-white shadow-xl w-[400px] h-[350px] rounded-md'>
                <p className='font-[10px] text-gray-400 mb-[10px]'>Check your email for the latest OTP</p>
                <input required type="text" value={formData.otp} name='otp' placeholder='Enter OTP' onChange={(e) => handleInputChange(e)} className='border-1 border-gray-300 rounded-md p-3 focus:outline-none mb-5 w-[80%]' />
                <input required type={updatingProfile === "email" ? 'email' : 'password'} value={formData.updatingProfile} name='newValue' placeholder={updatingProfile === "email" ? 'Enter new email' : 'Enter new password'} onChange={(e) => handleInputChange(e)} className='border-1 border-gray-300 rounded-md p-3 focus:outline-none mb-5 w-[80%]' />
                <div className='flex flex-col md:flex-row w-full justify-between items-center pl-10 pr-10'>
                    <button type='submit' className='w-full md:w-[50%] bg-blue-600 hover:bg-blue-500 text-white font-bold p-3 rounded-md mb-[10px] md:mb-0'>Update {updatingProfile}</button>
                    <button type='button' className='w-full md:w-[40%] bg-red-600 hover:bg-red-500 text-white font-bold p-3 rounded-md' onClick={() => handleCancel()}>Cancel</button>
                </div>
            </form>
        </main>
    )
}

export default UpdateProfile
