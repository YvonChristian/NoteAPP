//React libraries
import React, { useState } from 'react'

//icons
import { LuX } from 'react-icons/lu'

//components
import TagInput from '../../components/Input/TagInput'

//utils
import axiosInstance from '../../utils/axiosInstance'

const AddEditNotes = ({ noteData, getAllNotes, type, onClose, showToastMessage }) => {

  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);

  //ERRORS
  const [errorTitle, setErrorTitle] = useState(null);
  const [errorContent, setErrorContent] = useState(null);
  const [error, setError] = useState(null)

  //Add Note
  const AddNewNotes = async () => {
    try {
      const response = await axiosInstance.post("/add-note", {
        title,
        content,
        tags,
      })

      if (response.data && response.data.note) {
        showToastMessage("Note added successfully.")
        getAllNotes()
        onClose()
      }
    } catch (error) {
      if (error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message)
      }
    }
  }

  //Edit Note
  const editNote = async () => {
    const noteId = noteData._id
    try {
      const response = await axiosInstance.put("/edit-note/" + noteId, {
        title,
        content,
        tags,
      })

      if (response.data && response.data.note) {
        showToastMessage("Note updated successfully.")
        getAllNotes()
        onClose()
      }
    } catch (error) {
      if (error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message)
      }
    }
  }

  //Listen the inputs
  const handleEditNote = () => {
    if (!title) {
      setErrorTitle("Please enter a title.")
      return
    }
    setErrorTitle("")

    if (!content) {
      setErrorContent("Please enter a content.")
      return
    }
    setErrorContent("")

    if (type === 'edit') {
      editNote()
    } else {
      AddNewNotes()
    }
  }

  return (
    <div className=' relative'>
      <button
        className='w-8 h-8 p-[5px] rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-red-400 '
        onClick={onClose}
      >
        <LuX
          size={25}
        />
      </button>
      <div className='flex flex-col gap-2'>
        <label className='input-label'>TITLE</label>
        <input
          type='text'
          className='text-medium p-2 bg-slate-100 rounded-md text-slate-900 border-primary outline-primary'
          placeholder='GO to the gym at 10pm'
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
        {errorTitle && <p className='text-red-600 text-xs mb-1 ml-4'>{errorTitle}</p>}
      </div>
      <div>
        <div className='flex flex-col gap-2 mt-4'>
          <label className='input-label'>CONTENT</label>
          <textarea
            type='text'
            className='text-medium bg-slate-100 rounded-md text-slate-900 border-primary p-2 outline-primary'
            placeholder='Content'
            rows={10}
            value={content}
            onChange={({ target }) => setContent(target.value)}
          />
          {errorContent && <p className='text-red-600 text-xs mb-1 ml-4'>{errorContent}</p>}
        </div>
        <div className='mt-3'>
          <div className=' mt-3'>
            <TagInput tags={tags} setTags={setTags} />
            {/* <input */}
            {/*   type='text' */}
            {/*   placeholder='Tags' */}
            {/* /> */}
          </div>
        </div>
        <button
          className='btn btn-primary font-medium mt-5 mp-3'
          onClick={handleEditNote}>
          {type === "edit" ? "UPDATE" : "ADD"}
        </button>
      </div>
    </div>
  )
}

export default AddEditNotes
