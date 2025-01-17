import React, { useState } from 'react'
import ProfileInfo from '../Cards/ProfileInfo'
import { LuSticker } from 'react-icons/lu'
import { Navigate, useNavigate } from 'react-router-dom'
import SearchBar from '../SearchBar/SearchBar'

const Navbar = ({ userInfo, onSearchNote, handleClearSearch }) => {

  const [searchQuery, setSearchQuery] = useState("")

  //Variable for the navigation
  const navigate = useNavigate();

  //for logout
  const onLogout = () => {
    localStorage.clear()
    navigate("/login");
  }

  //for Search
  const handleSearch = () => {
    if (searchQuery) {
      onSearchNote(searchQuery)
    }
  }

  //for ClearSerach
  const onClearSearch = () => {
    setSearchQuery("")
    handleClearSearch()
  }

  return (
    <div className="bg-white justify-between flex items-center px-3  drop-shadow">

      <div className='flex items-center ml-5'>
        <LuSticker
          size={60}
          className='text-red-600 m-1'
        />
        <h4 className='text-red-600 font-semibold '>
          Notes
        </h4>
      </div>

      <SearchBar
        value={searchQuery}
        onChange={({ target }) => {
          setSearchQuery(target.value)
        }}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
      />

      <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
    </div>
  )
}

export default Navbar
