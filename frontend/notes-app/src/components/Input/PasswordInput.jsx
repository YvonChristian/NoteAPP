import React, { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6'

const PasswordInput = ({ value, onChange, placeholder }) => {
  const [isShowPassword, setIsShowPassword] = useState(false);
  //toggle to who password
  const toggleShowPasssword = () => {
    setIsShowPassword(!isShowPassword);
  }
  return (
    <div className='flex items-center bg-transparent border-[1px] rounded mb-1'>
      <input
        value={value}
        onChange={onChange}
        type={isShowPassword ? "text" : "password"}
        placeholder={placeholder || "Password"}
        className='w-full text-sm bg-transparent px-5 py-3 rounded outline-none hover:border-primary'
      />

      {
        isShowPassword ? (
          <FaRegEye
            size={22}
            className='text-primary cursor-pointer mr-5'
            onClick={() => toggleShowPasssword()}
          />
        ) : (
          <FaRegEyeSlash
            size={22}
            className='text-slate-400 cursor-pointer mr-5'
            onClick={() => toggleShowPasssword()}
          />
        )
      }
    </div>
  )
}

export default PasswordInput

