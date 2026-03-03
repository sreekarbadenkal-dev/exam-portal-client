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

  const handleSubmit= async(e)=>{
    e.preventDefault()
    setGlobalState(prev=>({...prev,isLoading:true}))
    try{
        let data=await AdminServices.loginAdmin(val)
        // console.log(formData);
        console.log("login success");
        setGlobalState(preval=>({...preval,name:data.name,role:data.role,token:data.token}))
        toast.success("login success");
        navigate("/home")
    }
    catch(err){
      toast.error("something went wrong");
      console.log(err);
      
    }
    finally{
      setGlobalState(prev=>({...prev,isLoading:false}))
    }
    // addval(prev=>({...prev,[e.target.name]:e.target.value}))
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
              <button className='w-full flex items-center justify-center h-10 bg-black text-white text-2xl rounded-xl hover:scale-105 active:bg-gray-950' type='submit'>{globalstate.isLoading?<><h1>Login...</h1><Loader></Loader></>:<h1>Login</h1>}</button>
              <div className='flex justify-center items-center gap-2' >No account? <Link to='/register' className='hover:underline hover:text-blue-500 '> Register</Link></div>
          </form>
      </div>
  )
}

export default Login
//  what's wrong