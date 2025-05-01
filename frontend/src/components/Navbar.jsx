import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { Link, useLocation } from "react-router-dom"
import { AlertTriangle, Cog, Menu } from "lucide-react"

function Navbar() {

    const { authUser } = useAuthStore()

    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const location = useLocation()
    const lastSegment = location.pathname.split('/').filter(Boolean).pop() || ''

    return (
        <>
            {/* nav bar for desktop */}
            <nav className='hidden lg:flex justify-between items-center pl-[1.5%] pr-[1.5%] pt-[10px] pb-[10px] shadow-md'>
                <Link to={'/'}>
                    <figure className='flex justify-center items-center w-[200px] h-[50px]'>
                        <img src="/logo.png" className='h-[1/2]' />
                        <p className='font-bold text-[19px]'>HealthScheduler</p>
                    </figure>
                </Link>
                {
                    authUser &&
                    <div className='flex justify-between items-center'>
                        <p className={`font-bold pr-3 pl-3 mr-2 ml-2 ${lastSegment.startsWith("/") || location.pathname === '/' ? 'text-blue-500' : 'text-gray-500'}`}><Link to={'/'}>Home</Link></p>
                        <p className={`font-bold pr-3 pl-3 mr-2 ml-2 ${lastSegment.startsWith("appointments") ? 'text-blue-500' : 'text-gray-500'}`}><Link to={'/appointments'}>Appointments</Link></p>
                        <p className={`font-bold pr-3 pl-3 mr-2 ml-2 ${lastSegment.startsWith("book-appointment") ? 'text-blue-500' : 'text-gray-500'}`}><Link to={'/book-appointment'}>Book Appointments</Link></p>
                        {
                            authUser?.role === "admin" &&
                            <p className={`font-bold pr-3 pl-3 mr-2 ml-2 ${lastSegment.startsWith("admin-doctor-account-registration") ? 'text-blue-500' : 'text-gray-500'}`}><Link to={'/admin-doctor-account-registration'}>Create Admin or Doctor Account</Link></p>
                        }
                    </div>
                }

                {
                    authUser === null ?
                        <div className='flex justify-between items-center w-[230px]'>
                            <Link to={'/login'} className='text-blue-500 font-bold text-[20px]'>Login</Link>
                            <Link to={'/register'} className='font-bold text-[17px] bg-blue-600 text-white pt-[5px] pb-[5px] pr-[15px] pl-[15px] rounded-md hover:bg-blue-500'>Register</Link>
                        </div>
                        :
                        <div className='flex justify-between items-center w-[50px]'>
                            <Link to={'/profile'}>
                                <img className='border-1 border-gray-400 w-[40px] h-[40px] rounded-full ' src={authUser.profilePic || "/no-avatar.png"} alt="" srcset="" />
                            </Link>
                        </div>
                }
            </nav>

            {/* nav bar for mobile */}
            <nav className='flex flex-col pl-[1.5%] pr-[1.5%] pt-[10px] pb-[10px] shadow-md lg:hidden w-full'>
                <figure className='flex justify-between items center w-full'>
                    <Link to={'/'}>
                        <figcaption className='h-[30px] flex justify-center items-center'>
                            <img src="/logo.png" className='h-[1/2]' />
                            <p className='font-bold text-[19px]'>HealthScheduler</p>
                        </figcaption>
                    </Link>
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)}><Menu /></button>
                </figure>
                <div className={`transition-all ease-in-out duration-300 ${isMenuOpen ? 'max-h-100 opacity-100' : 'max-h-0 opacity-0'}`}>
                    {
                        authUser === null ?
                            <div className='flex flex-col justify-center items-center w-full'>
                                <Link to={'/login'} className='text-blue-500 font-bold text-[20px] mt-3 mb-3'>Login</Link>
                                <Link to={'/register'} className='font-bold text-[17px] bg-blue-600 text-white pt-[5px] pb-[5px] pr-[15px] pl-[15px] rounded-md hover:bg-blue-500'>Register</Link>
                            </div>
                            :
                            <div className='flex flex-col justify-between items-center w-full'>
                                <Link className={`mt-3 mb-3 font-bold text-[16px] ${lastSegment.startsWith("dashboard") || location.pathname === '/' ? 'text-blue-500' : 'text-gray-500'}`} to={'/dashboard'}>Dashboard</Link>
                                <Link className={`mt-3 mb-3 font-bold text-[16px] ${lastSegment.startsWith("appointments") ? 'text-blue-500' : 'text-gray-500'}`} to={'/appointments'}>Appointments</Link>
                                <Link className={`mt-3 mb-3 font-bold text-[16px] ${lastSegment.startsWith("book-appointment") ? 'text-blue-500' : 'text-gray-500'}`} to={'/book-appointment'}>Book APpointments</Link>
                                <Link to={'/profile'}>
                                    <img className='border-1 border-gray-400 w-[40px] h-[40px] rounded-full mt-3 mb-t' src={authUser.profilePic || "/no-avatar.png"} alt="" srcset="" />
                                </Link>
                                {
                                    authUser?.role === "admin" &&
                                    <p className={`font-bold pr-3 pl-3 mr-2 ml-2 ${lastSegment.startsWith("admin-doctor-account-registration") ? 'text-blue-500' : 'text-gray-500'}`}><Link to={'/admin-doctor-account-registration'}>Create Admin or Doctor Account</Link></p>
                                }
                            </div>
                    }
                </div>
            </nav>

        </>
    )
}

export default Navbar
