import React from 'react'
import { LuSearch, LuX } from 'react-icons/lu'

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
  return (
    <div className='w-80 ml-1 flex items-center px-4 bg-slate-100 rounded-[15px]'>
      <input
        type='text'
        placeholder='Search notes'
        className='w-full text-sm bg-transparent py-[11px] outline-none'
        value={value}
        onChange={onChange}
      />
      {value &&
        (
          <LuX
            size={25}
            className='text-slate-400 cursor-pointer hover:text-black mr-3'
            onClick={onClearSearch}
          />
        )
      }
      <LuSearch
        size={22}
        className='text-slate-400 cursor-pointer hover:text-black'
        onClick={handleSearch}
      />
    </div>
  )
}

export default SearchBar
