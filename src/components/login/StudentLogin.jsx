import React, { useContext, useState,useEffect } from 'react'
import TextComp from '../TextComp'
import { MdOutlineMail } from 'react-icons/md'
import { FaEye } from 'react-icons/fa'
import { FaEyeSlash } from 'react-icons/fa'
import { studentuser } from '../../contexts/StudentContext'
import { Link, replace, useNavigate } from 'react-router-dom'
import { StudentService } from '../../services/StudentService'
import toast from 'react-hot-toast'
import Loader from '../Loader'
// import { ExamService } from '../../services/ExamService'

const StudentLogin = () => {

    const {globalstate,setGlobalState}=useContext(studentuser)
    const navigate=useNavigate()

     useEffect(()=>{
            if(globalstate.isAuth){
                navigate("/studenthome",{replace:true})
            }
        },[globalstate.isAuth,navigate])

    const [val,setVal]=useState({
        email:"",
        password:""
    })

     const handleClick=(e)=>{
      // e.preventDefault()
      setVal(prev=>({...prev,[e.target.name]:e.target.value}))
    }

    console.log(val);
    
    const handleSubmit= async (e)=>{
        e.preventDefault()
        setGlobalState(prev=>({...prev,isLoading:true}))
        try{
            const data=await StudentService.loginStudent(val);
            setVal({email:"",password:""});
            setGlobalState(prev=>({...prev,user:data,isAuth:true}))
            toast.success("Login Success")
            navigate("/studenthome")
        }
        catch(err){
            const msg=err.response?.status===401 ?"Invalid password":"Server error, try again later";
            toast.error(msg);
        }
        finally{
            setGlobalState(prev=>({...prev,isLoading:false}))
        }
    }


  return (
     <div className='min-h-screen px-4 w-screen flex justify-center items-center'>
          <form className="w-full max-w-md shadow-2xl p-5 rounded-2xl flex flex-col gap-7" onSubmit={handleSubmit} action="">
              <div className='h-10 flex justify-center items-center'>
                <h1 className='h-full text-4xl font-extrabold'>Student Login</h1>
              </div>
              <TextComp type="email" handleClick={handleClick} val={val} name="email" unit={<MdOutlineMail className="text-2xl  right-0"></MdOutlineMail>}></TextComp>
              <TextComp type="password" handleClick={handleClick} val={val} name="password" unit={[<FaEye className="text-2xl  right-0"></FaEye>,<FaEyeSlash className="text-2xl  right-0"></FaEyeSlash>]}></TextComp>
              <button className='w-full flex items-center justify-center h-10 bg-black text-white text-2xl rounded-xl hover:scale-105 active:bg-gray-950' type='submit'>{globalstate.isLoading?<><h1>Login...</h1><Loader></Loader></>:<h1>Login</h1>}</button>
              <div className='flex justify-center items-center gap-2' >No account? <Link to='/studentregister' className='hover:underline hover:text-blue-500 '> Register</Link></div>
          </form>
      </div>
  )
}

export default StudentLogin;