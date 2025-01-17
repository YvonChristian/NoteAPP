import React from 'react'
import { LuLogOut } from 'react-icons/lu'
import { getInitial } from '../../utils/helper'

const ProfileInfo = ({ userInfo, onLogout }) => {
  return (
    <div className='flex items-center gap-3'>
      <div
        className='w-12 h-12 flex items-center justify-center 
        rounded-full text-slate-950 font-medium bg-slate-100'>
        {getInitial(userInfo?.fullName)}
      </div>
      <div className='text-sm font-medium'>{userInfo?.fullName}</div>
      <button className='text-sm font-medium'>
        <LuLogOut
          size={22}
          className='text-slate-400 hover:text-red-500'
          onClick={onLogout}
        />
      </button>
    </div>
  )
}

export default ProfileInfo
