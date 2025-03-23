import React from 'react'

import { Map } from 'lucide-react';

interface Props {
    className?: string;
}

export const Footer: React.FC<Props> = () => {
  return (
    <div className='h-10 min-w-max bg-slate-100 rounded-md'>
        <div className='flex justify-between items-center h-full px-4'>
            <div className='items-center flex justify-between'>
                <Map size={24} color='black' textDecoration={"digital-map"}/>
                <h1 className='text-md font-bold ml-2 text-black'>Polytic 2025</h1>
            </div> 
            <button className='text-slate-100 text-sm w-[4%] h-[72%] rounded-md bg-black'>Войти</button>          
        </div>
    </div>
  )
}

