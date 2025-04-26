import React from 'react'
import { AnimationVariants } from '../lib/AnimationVariants'
import { motion } from "framer-motion"

function Login() {

    const bulletPoints = ["Book Appointments in Seconds", "Top-Rated Doctors", "Secure & Private", "Real-Time Availability"]

    return (
        <motion.div className='hidden lg:flex w-[50%] h-full p-4' variants={AnimationVariants} initial={"initial"} animate={"animate"} exit={"exit"} transition={{ duration: 0.3 }}>
            <section className='flex justify-between items-center w-full h-full shadow-lg rounded-md' style={{
                backgroundImage: "linear-gradient(45deg, #006cbe, #70a7dd)",
            }}>
                <article className='flex flex-col justify-center items-center w-full'>
                    <div className='flex justify-start-center items-center w-full'>
                        <h1 className='text-white font-bold text-[50px] w-[450px] text-left p-5'>HealthScheduler Medical Portal</h1>
                    </div>
                    <ul className='flex flex-col justify-start p-5 items-center w-full'>
                        {
                            bulletPoints.map((point, idx) => (
                                <li className='text-gray-300 font-semibold w-full mt-[5px] mb-[5px]' key={idx}>{point}</li>
                            ))
                        }
                    </ul>
                </article>
            </section>
        </motion.div>
    )
}

export default Login
