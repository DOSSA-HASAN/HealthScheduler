import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence } from "framer-motion"
import Login from './pages/Login'
import { Toaster } from "react-hot-toast"
import Signup from './pages/Signup'
import AuthDesign from "./components/AuthDesign"
import { useAuthStore } from './store/useAuthStore'
import Loading from './components/Loading'
import Profile from './pages/Profile'
import Appointment from './pages/Appointment'
import SeeDoctors from './pages/SeeDoctors'
import { useAppointmentStore } from './store/useAppointmentStore'
import { socket } from './lib/socket'
import CreateDoctorOrAdminAccount from './pages/CreateDoctorOrAdminAccount'
import Home from './pages/Home'

function AnimatedRoutes() {

  const location = useLocation()
  const { authUser } = useAuthStore()
  const { initializeSocketListener, blockedDates } = useAppointmentStore()

  useEffect(() => {
    // pass the doctors id / admin id to view their appointments once patient books them
    if (authUser?.role === "doctor") {
      console.log(socket.connected)
      initializeSocketListener(authUser._id)
    } else {
      initializeSocketListener()
      console.log(authUser)

    }
    if (blockedDates.length > 0) {
      console.log(blockedDates)
    }
  }, [authUser])

  return (
    <AnimatePresence mode='wait'>
      <Routes location={location} key={location.pathname}>
        <Route path='/login' element={authUser !== null ? <Navigate to={'/'}/> : <Login />} />
        <Route path='/register' element={authUser !== null ? <Navigate to={'/'}/> : <Signup />} />
        <Route path='/profile' element={authUser !== null ? <Profile /> : <Login />} />
        <Route path='/appointments' element={<Appointment />} />
        <Route path='/' element={<Home />} />
        <Route path='/book-appointment' element={authUser !== null ? <SeeDoctors /> : <Navigate to={'/register'}/> } />
        <Route path='/admin-doctor-account-registration' element={authUser?.role !== "admin" ? <Navigate to={'/register'} /> : <CreateDoctorOrAdminAccount />} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <AnimatedRoutes />
        <Toaster />
      </BrowserRouter>
    </>
  )
}

export default App
