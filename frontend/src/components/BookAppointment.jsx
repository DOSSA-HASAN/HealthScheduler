import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAppointmentStore } from '../store/useAppointmentStore'
import { AnimationVariants } from '../lib/AnimationVariants'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loading from './Loading';

function BookAppointment() {

  const { isBookingAppointment, setDoctorToBook, blockedDates, doctorToBook, bookAppointment } = useAppointmentStore()
  const [notes, setNotes] = useState("")

  const maxTime = new Date()
  maxTime.setHours(16, 0, 0, 0)

  const minTime = new Date()
  minTime.setHours(8, 0, 0, 0)

  const [selectedDate, setSelectedDate] = useState("")

  const [currentBlockedDates, setCurrentBlockedDates] = useState([])

  useEffect(() => {
    if (blockedDates.length > 0 && doctorToBook) {
      const processedBlockedDates = blockedDates
        .filter((date) => date?.doctorId === doctorToBook)
        .map((entry) => {
          const utcDate = new Date(entry.appointmentDate)
          // const localDate = new Date(utcDate)
          // console.log(utcDategetUTCHours)
          const localDate = new Date(
            utcDate.getUTCFullYear(),
            utcDate.getUTCMonth(),
            utcDate.getUTCDate(),
            utcDate.getUTCHours()
          )
          console.log(localDate)
          return (localDate)

        })
      setCurrentBlockedDates(processedBlockedDates);
    }
  }, [blockedDates, doctorToBook]);

  useEffect(() => {
    console.log("Blocked Times:", blockedDates.map(d => d.toString()));
  }, [currentBlockedDates]);

  const handleBookAppointment = (e) => {
    e.preventDefault()
    const localDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000).toISOString();
    console.log("Converted to UTC:", localDate);
    bookAppointment(doctorToBook, localDate, notes)

  }

  return (
    <motion.div variants={AnimationVariants} initial={"initial"} animate={"animate"} exit={"exit"} transition={{ duration: 0.3 }} className='flex justify-center items-center absolute z-[200] h-full lg:h-[calc(100vh-70px)] w-full backdrop-blur'>
      {
        (isBookingAppointment || blockedDates.length === 0) && <Loading />
      }
      <form className='flex flex-col justify-center items-center bg-white shadow-xl w-[400px] h-[350px] rounded-md'>
        <p className='w-full text-center font-bold text-[20px] mb-[20px] text-blue-600'>Book Appointment Details</p>
        <input required type="text" value={notes} placeholder='Enter notes for doctor' onChange={(e) => setNotes(e.target.value)} className='border-1 border-gray-300 rounded-md p-3 focus:outline-none mb-5 w-[80%]' />
        <DatePicker
          className='border-1 border-gray-300 rounded-md p-3 focus:outline-none mb-5 w-full'
          wrapperClassName='w-[80%]'
          placeholderText='Select Date & Time of Appointment'
          showTimeSelect
          timeIntervals={60} // Set intervals to hourly or as needed
          minDate={new Date()} // Today's date or later
          minTime={minTime} // Define business hours
          maxTime={maxTime} // Define business hours
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="MMMM d, yyyy h:mm aa"
          excludeTimes={currentBlockedDates}
        />

        {
          selectedDate && <p className='mb-5 w-[80%] text-left'>Date: {new Date(selectedDate).toLocaleString(undefined, {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}</p>
        }
        <div className='flex flex-col md:flex-row w-full justify-between items-center pl-10 pr-10'>
          <button type='submit' onClick={(e) => handleBookAppointment(e)} className='w-full md:w-[50%] bg-blue-600 hover:bg-blue-500 text-white font-bold p-3 rounded-md mb-[10px] md:mb-0'>Book</button>
          <button onClick={() => setDoctorToBook(null)} type='button' className='w-full md:w-[40%] bg-red-600 hover:bg-red-500 text-white font-bold p-3 rounded-md' >Cancel</button>
        </div>
      </form>
    </motion.div>
  )
}

export default BookAppointment
