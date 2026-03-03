import TextComp from '../TextComp'
import { React,useContext,useEffect,useState } from  'react'
import { MdOutlineMail } from 'react-icons/md';
import { FaEye,FaEyeSlash } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../Loader.jsx';
import { studentuser } from '../../contexts/StudentContext.jsx';
import { FaUser } from "react-icons/fa";
import { HiOutlineAcademicCap } from "react-icons/hi";
import { HiOutlineHashtag } from "react-icons/hi";
import { MdOutlineNumbers } from "react-icons/md";
import toast from 'react-hot-toast';
import { StudentService } from '../../services/StudentService.jsx';


const StudentRegister = () => {
    const navigate=useNavigate()
    const {globalstate,setGlobalState}=useContext(studentuser)
    useEffect(()=>{
        if(globalstate.isAuth){
            navigate("/studenthome",{replace:true})
        }
    },[globalstate.isAuth,navigate])

    
    
    const [val,setVal]=useState({
        username:"",
        email:"",
        password:"",
        "confirm password":"",
        rollnumber:"",
        department:"",
        semester:""
    });

    const handleSubmit= async(e)=>{
        e.preventDefault();
        setGlobalState(prev=>({...prev,isLoading:true}));

        if(val.password!=val["confirm password"]){
            toast.error("passwords dont match");
             setGlobalState(prev=>({...prev,isLoading:false}));
        } 
        else{
            try{
            const {"confirm password":temp,...studentdata}=val;
            const data=await StudentService.createStudent(studentdata);
            setGlobalState(prev=>({...prev,user:data,isAuth:true}));
            toast.success("Registration Successfull");
        }
        catch(err){
            const msg=err.response.data;
            toast.error(msg);
        }
        finally{
            setGlobalState(prev=>({...prev,isLoading:false}));

        }
        }
    }

    const handleClick=(e)=>{
        setVal(prev=>({...prev,[e.target.name]:e.target.value}))
    }
  return (
    <div>
        <div className='min-h-screen px-4 w-screen flex justify-center items-center'>
          <form className="w-full max-w-md shadow-2xl p-5 rounded-2xl flex flex-col gap-7" action="" onSubmit={handleSubmit}>
              <div className='h-10 flex justify-center items-center'>
                <h1 className='h-full text-4xl font-extrabold'>Student Register</h1>
              </div>
              <TextComp type="text" name="username" handleClick={handleClick} val={val} unit={<FaUser className="text-2xl  right-0"></FaUser>}></TextComp>

              <TextComp type="email" name="email" handleClick={handleClick} val={val} unit={<MdOutlineMail className="text-2xl  right-0"></MdOutlineMail>}></TextComp>

              <TextComp type="password" name="password" handleClick={handleClick} val={val} unit={[<FaEye className="text-2xl  right-0"></FaEye>,<FaEyeSlash className="text-2xl  right-0"></FaEyeSlash>]}></TextComp>

              <TextComp type="password" name="confirm password" handleClick={handleClick} val={val} unit={[<FaEye className="text-2xl  right-0"></FaEye>,<FaEyeSlash className="text-2xl  right-0"></FaEyeSlash>]}></TextComp>
              
              <TextComp type="text" name="rollnumber" handleClick={handleClick} val={val} unit={<HiOutlineHashtag className="text-2xl  right-0"></HiOutlineHashtag>}></TextComp>
              
              <TextComp type="text" name="department" handleClick={handleClick} val={val} unit={<HiOutlineAcademicCap className="text-2xl  right-0"></HiOutlineAcademicCap>}></TextComp>

              <TextComp type="text" name="semester" handleClick={handleClick} val={val} unit={<MdOutlineNumbers className="text-2xl  right-0"></MdOutlineNumbers>}></TextComp>

              <button className='w-full flex justify-center items-center h-10 bg-black text-white text-2xl rounded-xl hover:scale-105 active:bg-gray-800' type="submit" disabled={globalstate.isLoading}>{globalstate.isLoading ? <><h1>Registering...</h1><Loader /></> : "Register"}</button>
              <div className='flex justify-center items-center gap-2' >Already have a account? <Link to='/studentlogin' className='hover:underline hover:text-blue-500 '>Login</Link></div>
          </form>
      </div>
    </div>
  )
}

export default StudentRegister