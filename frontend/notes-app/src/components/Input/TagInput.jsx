import React, { useState } from 'react'
import { LuPlus, LuTag, LuX } from 'react-icons/lu'

const TagInput = ({ tags, setTags }) => {

  const [inputValue, setInputValue] = useState("");

  //listen the input
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  }

  //add new tag
  const addNewTag = () => {
    if (inputValue.trim() !== "") {
      setTags([...tags, inputValue.trim()])
      setInputValue("")
    }
  }

  //when press in to add new tag
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      addNewTag()
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  return (
    <>
      {tags?.length > 0 && (
        <div className='flex items-center gap-2 flex-wrap mt-2'>
          {tags.map((tag, index) => (
            <span key={index} className='flex items-center gap-2 text-sm text-slate-500 bg-gray-300 px-3 p-1 rounded-md'>
              <LuTag
                size={20}
              />
              {tag}
              <button
                className=''
                onClick={() => { handleRemoveTag(tag) }}>
                <LuX />
              </button>
            </span>
          ))}
        </div>
      )}
      <div className='flex p-2'>
        <LuTag
          size={22}
          className='mt-4 mr-2'
        />
        <input
          className='text-medium p-1 bg-slate-100 rounded-md text-slate-950 border-primary outline-primary'
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder='Tag'
        />
        <div className='mt-0'>
          <button
            className=' w-11 h-11 mt-1 mb-1 ml-5 bg-green-500 rounded-md items-center justify-center hover:bg-green-600'
            onClick={() => {
              addNewTag();
            }}
          >
            <LuPlus
              size={22}
              className='text-2xl ml-2.5'
            />
          </button>
        </div>
      </div >
    </>
  )
}

export default TagInput
