//React Libraries
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

//components
import PasswordInput from '../../components/Input/PasswordInput'

//utils
import { validateEmail } from '../../utils/helper'
import axiosInstance from '../../utils/axiosInstance'

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorEmail, setErrorEmail] = useState(null);
  const [errorPassword, setErrorPassword] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate()

  const handlelogin = async (e) => {
    e.preventDefault();
    //loop to identify a value in the form
    if (!validateEmail(email)) {
      setErrorEmail("Please enter a valide email address.")
      return;
    }
    setErrorEmail("");
    if (!password) {
      setErrorPassword("Please enter a password.")
      return;
    }
    setErrorPassword("");

    setError("");

    //Login API Call
    try {
      const response = await axiosInstance.post("/login", {
        email: email,
        password: password,
      });
      //successful login response
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
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
          <form onSubmit={handlelogin}>
            <h4 className='text-2xl mb-7'>Login</h4>

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

            <PasswordInput
              value={password}
              onChange={(e => { setPassword(e.target.value) })}
            />

            {/* show error for Email */}
            {errorPassword && <p className='text-red-600 text-xs mb-1 ml-4'>{errorPassword}</p>}
            {error && <p className='text-red-600 text-xs mb-1 ml-4'>{error}</p>}

            <button type='submit' className='btn-primary'>
              Login
            </button>

            <p className='text-sm text-center mt-4'>Not register yet?{""}
              <Link to="/SignUp" className='font-medium text-primary underline'>create an account</Link>
            </p>
          </form>
        </div>
      </div>
    </>
  )
}

export default Login
