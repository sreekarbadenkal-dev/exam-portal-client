import React, { useContext, useState } from 'react'
import { MdOutlineMail } from 'react-icons/md'
import TextComp from '../TextComp';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import {user} from "../../contexts/UserContext"
import toast from 'react-hot-toast';
import Loader from '../Loader';
import { AdminServices } from '../../services/AdminServices';

const Login = () => {

  let [val,addval]=useState({});
  const {globalstate,setGlobalState}=useContext(user)
  const navigate=useNavigate()

  const handleClick=(e)=>{
          // e.preventDefault()
          addval(prev=>({...prev,[e.target.name]:e.target.value}))
      }

      const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Basic Validation
        if (!val.email || !val.password) {
            return toast.error("Please fill in all fields");
        }

        setGlobalState(prev => ({ ...prev, isLoading: true }));

        try {
            // 2. Authentication call
            const data = await StudentService.loginStudent(val);
            
            // 3. Clear local input state
            setVal({ email: "", password: "" });

            // 4. Update Global State (This triggers the localStorage save in your Context)
            setGlobalState(prev => ({
                ...prev,
                user: data,
                isAuth: true
            }));

            toast.success("Login Successful!");
            navigate("/studenthome", { replace: true });
        }
        catch (err) {
            // 5. Enhanced Error Handling
            const statusCode = err.response?.status;
            let msg = "Server error, try again later";

            if (statusCode === 401) msg = "Invalid password";
            else if (statusCode === 404) msg = "User not found";
            else if (err.response?.data) msg = err.response.data;

            toast.error(msg);
        }
        finally {
            setGlobalState(prev => ({ ...prev, isLoading: false }));
        }
    }
  console.log(val);
  
  return (
      <div className='min-h-screen px-4 w-screen flex justify-center items-center'>
          <form className="w-full max-w-md shadow-2xl p-5 rounded-2xl flex flex-col gap-7" onSubmit={handleSubmit} action="">
              <div className='h-10 flex justify-center items-center'>
                <h1 className='h-full text-4xl font-extrabold'>Examiner Login</h1>
              </div>
              <TextComp type="email" handleClick={handleClick} val={val} name="email" unit={<MdOutlineMail className="text-2xl  right-0"></MdOutlineMail>}></TextComp>
              <TextComp type="password" handleClick={handleClick} val={val} name="password" unit={[<FaEye className="text-2xl  right-0"></FaEye>,<FaEyeSlash className="text-2xl  right-0"></FaEyeSlash>]}></TextComp>
              <button className='w-full flex gap-5 items-center justify-center h-10 bg-black text-white text-2xl rounded-xl hover:scale-105 active:bg-gray-950' type='submit'>{globalstate.isLoading?<><h1>Login...</h1><Loader></Loader></>:<h1>Login</h1>}</button>
              <div className='flex justify-center items-center gap-2' >No account? <Link to='/register' className='hover:underline hover:text-blue-500 '> Register</Link></div>
          </form>
      </div>
  )
}

export default Login
//  what's wrong