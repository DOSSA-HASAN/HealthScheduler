import React, { useState } from 'react'
import { motion } from "framer-motion"
import { AnimationVariants } from '../lib/AnimationVariants'
import { Eye, EyeClosed } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import AuthDesign from "../components/AuthDesign"
import { Link } from 'react-router-dom'
import Loading from '../components/Loading'

function Login() {

    const { login, isLogginIn } = useAuthStore()
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        login(formData.email, formData.password)
    }

    return (
        <motion.div className='h-[100%] lg:h-[calc(100vh-70px)]' variants={AnimationVariants} initial={"initial"} animate={"animate"} exit={"exit"} transition={{ duration: 0.3 }}>
            <section className='flex justify-between items-center w-full h-full'>
                {
                    isLogginIn && <Loading />
                }
                <AuthDesign />
                <form onSubmit={handleSubmit} className='w-full flex flex-col justify-center lg:w-[50%] h-full p-10'>
                    <h2 className='font-bold text-[40px] mb-10'>Welcome Back</h2>
                    <input required type="email" value={formData.email} name='email' placeholder='example@gmail.com' onChange={(e) => handleInputChange(e)} className='border-1 border-gray-300 rounded-md p-3 focus:outline-none mb-5' />
                    <div className='flex justify-between items-center border-1 border-gray-300 rounded-md p-3 focus:outline-none w-full mb-5'>
                        <input required value={formData.password} className='w-full focus:outline-none' type={showPassword ? 'text' : 'password'} name="password" placeholder='*******' onChange={(e) => handleInputChange(e)} />
                        {
                            showPassword ?
                                <Eye size={25} color='gray' onClick={() => setShowPassword(!showPassword)} />
                                :
                                <EyeClosed size={25} color='gray' onClick={() => setShowPassword(!showPassword)} />
                        }
                    </div>
                    <button className='bg-blue-600 text-white font-bold rounded-md h-10 hover:bg-blue-500 hover:cursor-pointer mb-5'>Login</button>
                    <p className='w-full font-bold text-center text-gray-400'>Don't have an account click <Link to={'/register'} className='text-blue-600'>here</Link> to create one</p>
                </form>
            </section>
        </motion.div>
    )
}

export default Login
