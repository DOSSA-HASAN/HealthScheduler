import React, { useState } from 'react'
import { AnimationVariants } from '../lib/AnimationVariants'
import Loading from '../components/Loading'
import { useAuthStore } from '../store/useAuthStore'
import { Eye, EyeClosed } from "lucide-react"
import { motion } from 'framer-motion'
import AuthDesign from "../components/AuthDesign"
import { Link } from "react-router-dom"

function CreateDoctorOrAdminAccount() {

    const { isSigningUp, createAdminOrDoctorAccount } = useAuthStore()
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        specialization: '',
        experience: '',
        role: ''
    })

    const handleInputChange = (e) => {
        e.preventDefault()
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
        console.log(formData)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        createAdminOrDoctorAccount(formData.username, formData.password, formData.email, formData.specialization, formData.experience, formData.role)
    }

    return (
        <motion.div className='h-[100%] lg:h-[calc(100vh-70px)]' variants={AnimationVariants} initial={"initial"} animate={"animate"} exit={"exit"} transition={{ duration: 0.3 }}>
            <section className='flex justify-between items-center w-full h-full'>
                {
                    isSigningUp && <Loading />
                }
                <AuthDesign />
                <form className='w-full flex flex-col justify-center lg:w-[50%] h-full p-10'>
                    <h2 className='font-bold text-[40px] mb-10'>Create Authorized Account</h2>
                    <input required type="text" value={formData.username} name='username' placeholder='John Doe' onChange={(e) => handleInputChange(e)} className='border-1 border-gray-300 rounded-md p-3 focus:outline-none mb-5' />
                    <input required type="email" value={formData.email} name='email' placeholder='example@gmail.com' onChange={(e) => handleInputChange(e)} className='border-1 border-gray-300 rounded-md p-3 focus:outline-none mb-5' />
                    <select onChange={(e) => handleInputChange(e)} name="role" id="" className='border-1 border-gray-300 rounded-md p-3 focus:outline-none mb-5'>
                        <option value="" selected hidden>Select users role (Admin or Doctor)</option>
                        <option value="doctor">Doctor</option>
                        <option value="admin">Admin</option>
                    </select >
                    {
                        formData.role === "doctor" &&
                        <>
                            <select onChange={(e) => handleInputChange(e)} className='border-1 border-gray-300 rounded-md p-3 focus:outline-none mb-5' name="specialization" id="">
                                <option value="" selected hidden>Select a specialization</option>
                                <option value="General Physician">General Physician</option>
                                <option value="Cardiologist">Cardiologist</option>
                                <option value="Dermatologist">Dermatologist</option>
                                <option value="Pediatrician">Pediatrician</option>
                                <option value="Orthopedic Surgeon">Orthopedic Surgeon</option>
                                <option value="Neurologist">Neurologist</option>
                                <option value="Psychiatrist">Psychiatrist</option>
                                <option value="Gynecologist">Gynecologist</option>
                                <option value="ENT Specialist">ENT Specialist</option>
                                <option value="Oncologist">Oncologist</option>
                                <option value="Ophthalmologist">Ophthalmologist</option>
                                <option value="Dentist">Dentist</option>
                                <option value="Urologist">Urologist</option>
                                <option value="Gastroenterologist">Gastroenterologist</option>
                                <option value="Pulmonologist">Pulmonologist</option>
                                <option value="Endocrinologist">Endocrinologist</option>
                                <option value="Nephrologist">Nephrologist</option>
                                <option value="Rheumatologist">Rheumatologist</option>
                                <option value="Plastic Surgeon">Plastic Surgeon</option>
                                <option value="Radiologist">Radiologist</option>
                            </select>
                            <input required type="number" value={formData.experience} name='experience' placeholder='Enter experience in years' min={0} onChange={(e) => handleInputChange(e)} className='border-1 border-gray-300 rounded-md p-3 focus:outline-none mb-5' />
                        </>
                    }
                    <div className='flex justify-between items-center border-1 border-gray-300 rounded-md p-3 focus:outline-none w-full mb-5'>
                        <input required value={formData.password} className='w-full focus:outline-none' type={showPassword ? 'text' : 'password'} name="password" placeholder='*******' onChange={(e) => handleInputChange(e)} />
                        {
                            showPassword ?
                                <Eye size={25} color='gray' onClick={() => setShowPassword(!showPassword)} />
                                :
                                <EyeClosed size={25} color='gray' onClick={() => setShowPassword(!showPassword)} />
                        }
                    </div>
                    <button onClick={handleSubmit} className='bg-blue-600 text-white font-bold rounded-md h-10 hover:bg-blue-500 hover:cursor-pointer mb-5'>Signup</button>
                    <p className='w-full font-bold text-center text-gray-400'>Have an account? Click <Link to={'/login'} className='text-blue-600'>here</Link> to login</p>
                </form>
            </section>
        </motion.div>
    )
}

export default CreateDoctorOrAdminAccount
