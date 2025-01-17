import React from 'react'
import { useState } from 'react';
import { LuTag, LuX, LuPlus, LuPencilLine } from 'react-icons/lu'
import { AiFillPushpin, AiOutlinePushpin } from 'react-icons/ai'
import { GrSend } from 'react-icons/gr'
import moment from 'moment';


// const [showPin, setShowPin] = useState(false);
// //toggle to who password
// const toggleShowPin = () => {
//   setShowPin(!showPin);
// }
const NoteCard = ({
  title,
  date,
  content,
  tags,
  isPinned,
  onEdit,
  onDelete,
  onPinNote,
}) => {
  return (
    <div className="Card">
      <div className="p-2.5 pl-2.5">
        <div className='flex justify-between items-center'>
          {isPinned ? (
            <AiFillPushpin
              size={28}
              className='hover:bg-slate-200 w-7 h-7 rounded-[8px] p-1'
              onClick={onPinNote}
            />
          ) : (
            <AiOutlinePushpin
              size={28}
              className='hover:bg-slate-200 w-7 h-7 rounded-[8px] p-1'
              onClick={onPinNote}
            />
          )
          }
          <div className='flex'>
            <LuPencilLine
              size={28}
              className='hover:bg-slate-200 w-7 h-7 rounded-[8px] p-1'
              onClick={onEdit}
            />
            <GrSend
              size={28}
              className='hover:bg-slate-200 w-7 h-7 rounded-[8px] p-1'
            />
            <LuX
              size={28}
              className='hover:bg-red-500 w-7 h-7 rounded-full p-1'
              onClick={onDelete}
            />
          </div>
        </div>
        <div className='flex ml-1 mr-1'>
          <h5 className="block mb-2 mr-2 font-sans text-xl font-semibold text-blue-gray-900">
            {title}
          </h5>
          <h4 className='block mt-2 mb-2 mr-2 font-sans text-[12px] text-slate-400'>
            {moment(date).format('Do MMM YYYY')}
          </h4>
        </div>
        <p className="block ml-1 font-sans text-base antialiased font-normal leading-relaxed text-inherit">
          {content.slice(0, 300)}
        </p>
      </div>
      <div className="p-6 pt-0">
        <div className='flex p-1'>
          {tags.map((item, index) => (
            <p key={index} className='flex text-sm text-gray-400 mr-4'>
              <LuTag
                size={20}
                className='text-gray-400 mr-1'
              />
              {item}
            </p>
          ))}
        </div>
        {/* <a href="#" className="inline-block"> */}
        {/*   <button */}
        {/*     className="flex items-center gap-2 px-4 py-2 font-sans text-xs font-bold text-center text-gray-900 uppercase align-middle transition-all rounded-lg select-none disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none hover:bg-gray-900/10 active:bg-gray-900/20" */}
        {/*     type="button"> */}
        {/*     Learn More */}
        {/*   </button> */}
        {/* </a> */}
      </div>
    </div>
  )
}

export default NoteCard
