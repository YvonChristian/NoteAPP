//React Librairies
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";

//Components
import Navbar from "../../components/Navbar/Navbar"
import NoteCard from "../../components/Cards/NoteCard";
import AddEditNotes from "./AddEditNotes";
import Toast from "../../components/ToastMessage/Toast";
import EmptyCard from "../../components/EmptyCard/EmptyCard";
import AddNotesImg from "../../assets/images/add-note.svg"
import NoData from "../../assets/images/noNote.png"

//icons
import { LuPlus } from "react-icons/lu";

//utils
import axiosInstance from "../../utils/axiosInstance"

const Home = () => {

  // tables
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  })
  const [allNotes, setAllNotes] = useState([])
  const [userInfo, setUserInfo] = useState(null)
  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  })
  const [isSearch, setIsSearch] = useState(false)

  //navigation
  const navigate = useNavigate()

  //function who shows the modal(edit)
  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" })
  }

  //const who shows the notification
  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message,
      type
    })
  }
  //constant who close the notification
  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: ""
    })
  }
  //constant who shows al notes after searching
  const handleClearSearch = () => {
    setIsSearch(false)
    getAllNotes()
  }

  //get user info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user")

      if (response.data && response.data.user) {
        setUserInfo(response.data.user)
      }
    } catch (error) {
      if (response.data.user === 401) {
        localStorage.clear()
        navigate("/login")
      } else {
        navigate("/dashboard")
      }
    }
  }

  //get all notes
  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes")
      // console.log(response.data.note)
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes)
        // console.log(response.data.note)
      }
    } catch (error) {
      console.log("An error was occured,please try again.")
    }
  }

  //delete a note
  const deleteNote = async (data) => {
    const noteId = data._id
    try {
      const response = await axiosInstance.delete("/delete-note/" + noteId)

      if (response.data && !response.data.error) {
        showToastMessage("Note deleted successfully.", 'delete')
        getAllNotes()
      }
    } catch (error) {
      if (error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.log("Server error, please try again.")
      }
    }
  }

  //Search a note
  const onSearchNote = async (query) => {
    try {
      const response = await axiosInstance.get("/searchNote", {
        params: { query },
      })

      if (response.data && response.data.notes) {
        setIsSearch(true)
        setAllNotes(response.data.notes)
      }
    } catch (error) {
      console.log(error)
    }
  }

  //Update the pin
  const updateisPinned = async (noteData) => {
    const noteId = noteData._id
    try {
      const response = await axiosInstance.put("/update-isPinned/" + noteId, {
        isPinned: !noteId.isPinned,
      })

      if (response.data && !response.data.error) {
        showToastMessage("Note updated successfully.")
        getAllNotes()
      }
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    getAllNotes()
    getUserInfo()
    return () => { }
  }, [])

  return (
    <>
      <Navbar
        userInfo={userInfo}
        onSearchNote={onSearchNote}
        handleClearSearch={handleClearSearch}
      />
      <div className="container mx-auto">
        {
          allNotes.length > 0 ? (
            <div className="grid grid-cols-3 mt-5">
              {allNotes.map((item, index) => (
                <NoteCard
                  key={item._id}
                  title={item.title}
                  date={item.createdOn}
                  content={item.content}
                  tags={item.tags}
                  isPinned={item.isPinned}
                  onEdit={() => handleEdit(item)}
                  onDelete={() => deleteNote(item)}
                  onPinNote={() => updateisPinned(item)}
                />
              ))}
            </div>
          ) : (
            <EmptyCard imgSrc={isSearch ? NoData : AddNotesImg} message={isSearch ? `Oops!No notes found with your query!` : `Create your first Note using the 'add'.\n Concretise your thoughts,ideas or reminders.\n Let's get started! `} />
          )
        }
      </div>

      <button
        className="AddIcon"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null });
        }}
      >
        <LuPlus
          className="text-[32px]"
        />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => { }}
        ariaHideApp={true}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contenLabel=""
        className="w-[70%] bg-white border-slate-100 rounded-md mt-[10%] ml-[15%] p-6 overflow-scroll"
      >
        {/* Edit Note */}
        < AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null })
          }}
          getAllNotes={getAllNotes}
          showToastMessage={showToastMessage}
        />
      </Modal >
      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </>
  )
}
export default Home
