import React from 'react'

const EmptyCard = ({ imgSrc, message }) => {
  return (
    <div className='ml-[35%] mt-[10%]  items-center justify-center'>
      <img src={imgSrc} alt='No notes' className='w-80 pl-[10%]' />
      <p className='w-1/2 text-sm font-medium text-slate-700 text-center leading-5 mt-1'>
        {message}
      </p>
    </div>
  )
}

export default EmptyCard
