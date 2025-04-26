import { Loader } from 'lucide-react'
import React from 'react'

function Loading() {
    return (
        <div className='backdrop-blur z-[100] flex w-full h-full absolute top-0 justify-center items-center'>
            <Loader size={40} className='animate-spin' />
        </div>
    )
}

export default Loading
