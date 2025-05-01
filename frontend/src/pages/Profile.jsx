import React, { useRef, useState } from 'react'
import { AnimationVariants } from '../lib/AnimationVariants'
import { useAuthStore } from '../store/useAuthStore'
import { motion } from 'framer-motion'
import { Pencil } from 'lucide-react'
import UpdateProfile from '../components/UpdateProfile'
import Loading from '../components/Loading'

function Profile() {

    const { authUser, updatingProfile, setUpdatingProfile, resetPasswordOTP, changeEmailOTP, isUpdatingEmail, changeProfilePic, changingProfilePic, logout } = useAuthStore()
    const [editField, setEditField] = useState(null)
    const [email, setEmail] = useState(authUser.email || "")
    const ImageRef = useRef(null)

    const handleImageRef = () => {
        ImageRef?.current?.click()
    }

    const handleProfilePicChange = (e) => {
        e.preventDefault()
        const file = e.target.files[0]
        if(!file) return;
        const reader = new FileReader()
        reader.onload = async () => {
            const result = reader.result
            changeProfilePic(result)
        }

        reader.readAsDataURL(file)
    }


    return (
        <motion.div variants={AnimationVariants} initial={"initial"} animate={"animate"} exit={"exit"} transition={{ duration: 0.3 }}>
            <section className='flex flex-col pt-5 justify-center items-center h-full'>
                {
                    changingProfilePic && <Loading />
                }
                {
                    (updatingProfile || isUpdatingEmail) && <UpdateProfile />
                }
                <h2 className='text-center text-blue-500 font-bold text-[40px] lg:text-[70px]'>Hey there {authUser?.username}</h2>
                <form onSubmit={(e) => e.preventDefault()} className=' lg:w-[400px] flex flex-col justify-center items-center '>
                    <figure className='flex justify-center items-center relative w-[200px]  mb-5'>
                        <input type="file" accept='image/*' hidden ref={ImageRef} onChange={(e) => handleProfilePicChange(e)} />
                        <img className='w-[50%] lg:w-full rounded-full shadow-md' src={authUser.profilePic || '/no-avatar.png'} alt="" />
                        <figcaption onClick={handleImageRef} className='shadow-lg backdrop-blur absolute bottom-0 right-5 rounded-full p-3 hover:cursor-pointer'>
                            <Pencil size={30} />
                        </figcaption>
                    </figure>
                    <label htmlFor="email" className='w-full text-center lg:text-left text-blue-500 font-bold text-[18px]'>Email</label>
                    <article className='flex flex-col lg:flex-row w-full lg:w-[400px] h-[50px] justify-center items-center mb-5'>
                        <input className='w-full lg:w-[60%] h-full focus:outline-none' type="email" id='email' value={email} readOnly={editField !== "email"} />
                        <button onClick={() => { (setUpdatingProfile('email')), changeEmailOTP() }} className='w-[80%] lg:w-[40%] border-2 bg-blue-600 text-white font-bold  rounded-md  h-full hover:cursor-pointer hover:bg-blue-500'>Change Email</button>
                    </article>

                    <label htmlFor="password" className='w-full text-center lg:text-left text-blue-500 font-bold text-[18px]'>Password</label>
                    <article className='flex flex-col lg:flex-row w-full lg:w-[400px] h-[50px] justify-center items-center'>
                        <input className='w-full lg:w-[60%] h-full focus:outline-none' type="password" id='password' readOnly placeholder='***********' />
                        <button onClick={() => { (setUpdatingProfile('password')), resetPasswordOTP() }} className='w-[80%] lg:w-[40%] border-2 bg-blue-600 text-white font-bold  rounded-md  h-full hover:cursor-pointer hover:bg-blue-500'>Change Password</button>
                    </article>

                    <button onClick={logout} className='p-[10px] w-full bg-red-600 hover:bg-red-500 mt-5 rounded-md text-white font-[18px] font-bold'>Logout</button>
                    {
                        authUser?.role === "doctor" &&
                        <p className='w-full text-center mt-5 font-bold text-gray-700'>{authUser?.username} | {authUser?.specialization}</p>
                    }
                    <p className='w-full text-center mt-5 font-bold text-gray-700'>Member since {authUser.createdAt.split('T')[0]}</p>
                </form>
            </section>
        </motion.div>
    )
}

export default Profile
