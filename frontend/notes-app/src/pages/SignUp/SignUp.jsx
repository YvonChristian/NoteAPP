import React from 'react'
import axiosInstance from '../../utils/axiosInstance'
import PasswordInput from '../../components/Input/PasswordInput'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { validateEmail } from '../../utils/helper'

const SignUp = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState(null);
  const [errorPassword, setErrorPassword] = useState(null);
  const [errorName, setErrorName] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate()

  const handleSignUp = async (e) => {
    e.preventDefault();
    //to identify a value in the form
    if (!name) {
      setErrorName("Please enter a name")
      return;
    }
    setErrorName("");

    if (!validateEmail(email)) {
      setErrorEmail("Please enter a valide email address.")
      return;
    }
    setErrorEmail("");

    if (!password) {
      setErrorPassword("Password doesn't match.")
      return;
    }
    setErrorPassword("");

    //Sign up API Call
    try {
      const response = await axiosInstance.post("/create-account", {
        fullName: name,
        email: email,
        password: password,
      });
      //successful registration response
      if (response.data && response.data.error) {
        setError(response.data.message)
        return
      }

      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken)
        navigate('/dashboard')
      }
    } catch (error) {
      //login error
      if (error.response && error.response.data && error.response.data.message) {
        // setErrorEmail(error.response.data.message);
        // setErrorPassword(error.response.data.message);
        setError(error.response.data.message);
      } else {
        setError("An excepted server error occured.Please try again.");
      }
    }
  }
  return (
    <>
      <div className='flex items-center justify-center mt-28'>
        <div className='w-96 border rounded bg-white px-7 py-10'>
          <form onSubmit={handleSignUp}>
            <h4 className='text-2xl mb-7'>Create an account</h4>

            {/* input for UserName */}
            <input
              type='text'
              placeholder='UserName'
              className='input-box'
              value={name}
              onChange={(e) => { setName(e.target.value) }}
            />

            {/* show error for Email */}
            {errorName && <p className='text-red-600 text-xs mb-1 ml-4'>{errorName}</p>}

            {/* input for Email */}
            <input
              type='text'
              placeholder='Email'
              className='input-box'
              value={email}
              onChange={(e) => { setEmail(e.target.value) }}
            />

            {/* show error for Email */}
            {errorEmail && <p className='text-red-600 text-xs mb-1 ml-4'>{errorEmail}</p>}

            {/* input for Password */}
            <PasswordInput
              value={password}
              onChange={(e => { setPassword(e.target.value) })}
            />

            {/* show error for Email */}
            {errorPassword && <p className='text-red-600 text-xs mb-1 ml-4'>{errorPassword}</p>}
            {error && <p className='text-red-600 text-xs mb-1 ml-4'>{error}</p>}
            <button type='submit' className='btn-primary'>
              SignUp
            </button>
            <p className='text-sm text-center mt-4'>Already have an account?
              <Link to="/Login" className='font-medium text-primary underline'>Login</Link>
            </p>

          </form>
        </div>
      </div>
    </>
  )
}

export default SignUp
