import React from 'react'

function DoctorsCardSkeleton() {
    return (
        <div className=' flex flex-col jusitfy-between shadow-md border-1 border-gray-200 w-full h-[200px] rounded-md' style={{ background: 'linear-gradient(90deg,rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 35%, rgba(157, 190, 196, 1) 100%)' }}>
            <div className='h-full flex justify-start items-start flex-col mix-blend-multiply p-[20px]'>
                <p className='bg-gray-400 animate-pulse rounded-md w-[80%] mb-[10px] p-[10px]'></p>
                <p className='bg-gray-400 animate-pulse rounded-md w-[80%] mb-[10px] p-[10px]'></p>
                <p className='bg-gray-400 animate-pulse rounded-md w-[80%] mb-[10px] p-[10px]'></p>
            </div>
            <div className='p-[20px]'>
                <button className='bg-gray-400 animate-pulse p-[10px] rounded-md w-[30%]'></button>
            </div>
        </div>
    )
}

export default DoctorsCardSkeleton
