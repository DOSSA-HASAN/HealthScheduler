import React from 'react'
import { motion } from 'framer-motion'
import { AnimationVariants } from '../lib/AnimationVariants'
import { Activity } from "lucide-react"
import { Link } from "react-router-dom"

function Home() {
    return (
        <motion.div className='h-[100%] lg:h-[calc(100vh-70px)] p-[20px]' variants={AnimationVariants} initial={"initial"} exit={"exit"} animate={"animate"} transition={{ duration: 0.3 }}>
            <section className='w-full rounded-md h-full bg-[#EBECF0] flex flex-col lg:flex-row justify-between items-center'>
                <article className='flex justify-center items-start flex-col flex-1 p-[30px]'>
                    <div className='flex justify-center items-center mb-[20px]'>
                        <span className='text-blue-600 mr-[10px] animate-pulse'><Activity /></span>
                        <p className='font-semibold'>Your Health, Our Priority</p>
                    </div>
                    <h1 className='font-bold text-[50px] leading-[1] w-full lg:w-[70%]'>Serving Your Health Needs Is Our Priority</h1>
                    <p className='text-gray-600 mt-[30px] mb-[30px] w-full lg:w-[70%]'>Easily book an appointment from the comfort of your home with our experienced health specialists</p>
                    <Link to={'/book-appointment'} ><button className='shadow-md p-[10px] bg-blue-600 hover:bg-blue-500 hover:cursor-pointer rounded-md text-white font-bold text-center w-[200px]'>Book Now</button></Link>
                </article>
                <figure className='flex flex-1 h-full justify-center items-end relative'>
                    <img className='h-100' src="/home-banner-img.png" />
                    
                    <div className="shadow-lg absolute top-[30%] left-[15%] w-[150px] rounded-md bg-white p-[10px] flex justify-center items-center">
                        <img src="/heart.svg" />
                        <p>Cardiology</p>
                    </div>
                    <div className="shadow-lg absolute w-[150px] top-[50%] right-[10%] rounded-md bg-white p-[10px] flex justify-center items-center">
                        <img src="/neuron.svg" />
                        <p>Neuron</p>
                    </div>
                    <div className="shadow-lg absolute w-[150px] bottom-[10%] right-[50%] rounded-md bg-white p-[10px] flex justify-center items-center">
                        <img src="/orthopedics.svg" />
                        <p>Orthopedics</p>
                    </div>
                </figure>
            </section>
        </motion.div>
    )
}

export default Home
