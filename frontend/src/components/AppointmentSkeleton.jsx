import React from 'react'

function AppointmentSkeleton() {

    const appointmentList = new Array(5).fill("")

    return (
        <section className='w-full'>
            <table className='w-full flex flex-col justify-between items-center p-[10px]'>
                {
                    appointmentList.map((list, idx) => (
                        <tr key={idx} className='w-full flex flex-col md:flex-row justify-between items-center p-[15px] bg-gray-300 m-[15px] rounded-md shadow-md md:h-auto'>
                            <td className={`flex justify-between items-center text-left w-full md:w-[calc (100%/5)] bg-gray-400 animate-pulse h-[30px] m-3 rounded-md`}></td>
                            <td className={`flex justify-between items-center text-left w-full md:w-[calc (100%/5)] bg-gray-400 animate-pulse h-[30px] m-3 rounded-md`}></td>
                            <td className={`flex justify-between items-center text-left w-full md:w-[calc (100%/5)] bg-gray-400 animate-pulse h-[30px] m-3 rounded-md`}></td>
                            <td className={`flex justify-between items-center text-left w-full md:w-[calc (100%/5)] bg-gray-400 animate-pulse h-[30px] m-3 rounded-md`}></td>
                            <td className={`flex justify-between items-center text-left w-full md:w-[calc (100%/5)] bg-gray-400 animate-pulse h-[30px] m-3 rounded-md`}></td>
                        </tr>
                    ))
                }
            </table>
        </section>
    )
}

export default AppointmentSkeleton
