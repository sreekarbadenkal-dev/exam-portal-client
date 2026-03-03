import TextComp from '../TextComp'
import { React,useContext,useState } from  'react'
import { MdOutlineMail } from 'react-icons/md';
import { FaEye,FaEyeSlash } from 'react-icons/fa'
import { Link } from 'react-router-dom';
import Loader from '../Loader.jsx';
import axiosInstance from '../../axiosinstance/AxiosInstance.js';
import { user } from '../../contexts/UserContext.jsx';
import toast from 'react-hot-toast';


const Register = () => {

  const [val,addval]=useState({});
  const {globalstate,setGlobalState}=useContext(user);
  // console.log(x);
  
  
  
    const handleClick=(e)=>{
        // e.preventDefault()
        addval(prev=>({...prev,[e.target.name]:e.target.value}))
    }
  
    const handleSubmit= async(e)=>{
      e.preventDefault()
      setGlobalState(prev=>({...prev,isLoading:true}))
      try{
        const response=await axiosInstance('/register',val);
        console.log("success");
        toast.success("successfully registered")
      }
      catch(err){
        toast.error('something went wrong')
      }
      finally{
        setGlobalState(prev=>({...prev,isLoading:false}))
      }
      // addval(prev=>({...prev,[e.target.name]:e.target.value}))
    }
    console.log(val);
    

  return (
      <div className='min-h-screen px-4 w-screen flex justify-center items-center'>
          <form className="w-full max-w-md shadow-2xl p-5 rounded-2xl flex flex-col gap-7" action="" onSubmit={handleSubmit}>
              <div className='h-10 flex justify-center items-center'>
                <h1 className='h-full text-4xl font-extrabold'>Register</h1>
              </div>
              <TextComp type="text" name="username" handleClick={handleClick} val={val} unit={<MdOutlineMail className="text-2xl  right-0"></MdOutlineMail>}></TextComp>
              <TextComp type="email" name="email" handleClick={handleClick} val={val} unit={<MdOutlineMail className="text-2xl  right-0"></MdOutlineMail>}></TextComp>
              <TextComp type="password" name="password" handleClick={handleClick} val={val} unit={[<FaEye className="text-2xl  right-0"></FaEye>,<FaEyeSlash className="text-2xl  right-0"></FaEyeSlash>]}></TextComp>
              <button className='w-full flex justify-center items-center h-10 bg-black text-white text-2xl rounded-xl hover:scale-105 active:bg-gray-800' type="submit" disabled={globalstate.isLoading}>{globalstate.isLoading ? <><h1>Registering...</h1><Loader /></> : "Register"}</button>
              <div className='flex justify-center items-center gap-2' >Already have a account? <Link to='/login' className='hover:underline hover:text-blue-500 '>Login</Link></div>
          </form>
      </div>
  )
}

export default Register
