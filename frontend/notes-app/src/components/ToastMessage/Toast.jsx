import React from 'react'
import { LuCheck } from 'react-icons/lu'
import { MdDeleteOutline } from 'react-icons/md'
import { useEffect } from 'react'
const Toast = ({ isShown, message, type, onClose }) => {

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onClose()
    }, 3000)
    return () => {
      clearTimeout(timeoutId)
    }
  }, [onClose])


  return (
    <div className={
      `h-14 pt-2.5 absolute top-20 left-1/3 ${type === "delete" ? "bg-red-100" : "bg-green-100"}
rounded-full shadow-2xl ml-20 items-center justify-center transition-all duration-300 ${isShown ? "opacity-100" : "opacity-0"}
      `
    }>
      <div className='flex items-center gap-3 py-2 px-4'>
        {
          type === "delete" ? (
            <MdDeleteOutline
              size={20}
              className='text-xl text-red-500'
            />
          ) : (
            <LuCheck
              size={20}
              className='text-xl text-green-700'
            />
          )
        }
        <p className='text-sm text-slate-700'>{message}</p>
      </div>
    </div>
  )
}

export default Toast

