import TextComp from '../TextComp'
import { React,useContext,useEffect,useState } from  'react'
import { MdOutlineMail } from 'react-icons/md';
import { FaEye,FaEyeSlash } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom';
import Loader from '../Loader.jsx';
import { studentuser } from '../../contexts/StudentContext.jsx';
import { FaUser } from "react-icons/fa";
import {FaGraduationCap} from "react-icons/fa6";
import { HiOutlineHashtag } from "react-icons/hi";
import { MdOutlineNumbers } from "react-icons/md";
import toast from 'react-hot-toast';
import { StudentService } from '../../services/StudentService.jsx';
import { IoMdArrowDropdownCircle } from 'react-icons/io';

const StudentRegister = () => {
    const navigate=useNavigate()
    const {globalstate,setGlobalState}=useContext(studentuser)
    const alldepts=[{value:"COMPUTER_SCIENCE",label:"Computer Science"},{value:"ARTIFICIAL_INTELLIGENCE",label:"Artificial Intelligence"},{value:"ACCOUNTING",label:"Accounting"},{value:"BOTANY", label:"Botany"},{value:"ZOOLOGY",label:"Zoology"}];
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    // useEffect(()=>{
    //     if(globalstate.isAuth){
    //         navigate("/studenthome",{replace:true})
    //     }
    // },[globalstate.isAuth,navigate])

    
    
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
        if(val.semester!="" && !/^\d+$/.test(val.semester)) {
            toast.error("semester must be a number");
            setGlobalState(prev=>({...prev,isLoading:false}));
            return;
        }
        if(val.department==""){
            toast.error("please select a department");
            setGlobalState(prev=>({...prev,isLoading:false}));
            return;
        }
        if (!strongPasswordRegex.test(val.password)) {
        toast.error("Password is too weak. Include uppercase, numbers, and symbols.");
        setGlobalState(prev=>({...prev,isLoading:false}));
        return;
        }
        if(val.password!=val["confirm password"]){
            toast.error("passwords dont match");
            setGlobalState(prev=>({...prev,isLoading:false}));
        } 
        else{
            try{
            const {"confirm password":temp,...studentdata}=val;
            const correctedstudentdata={...studentdata,semester:parseInt(studentdata.semester)};
            const data=await StudentService.createStudent(correctedstudentdata);
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
              
              <div className={` group h-12 sm:h-10 w-full relative duration-75 flex items-center  focus-within:border-2 focus-within:rounded-lg ${val.department?"border-2 rounded-lg":"border-b-2"}`}>
                <select name="department" id="department" onChange={handleClick} value={val.department} className='w-full h-10 rounded-xl  bg-transparent px-2 text-lg appearance-none outline-none decoration-0' >
                    <option value="" disabled>Select Department</option>
                  {alldepts.map((dept) => (
                    <option key={dept.value} value={dept.value}>{dept.label}</option>
                  ))}
                </select>
                <label className={`absolute left-2 transition-all pointer-events-none z-10  px-1
                ${val.department 
                    ? "top-0 -translate-y-1/2 text-sm bg-white" 
                    : "display-none bg-transparent text-transparent"}`}>
                Department
            </label>
                <div className="absolute right-2 pointer-events-none z-20">
                    <IoMdArrowDropdownCircle className="text-2xl text-gray-500 group-focus-within:text-black" />
                </div>
              </div>

              <TextComp type="text" name="semester" handleClick={handleClick} val={val} unit={<FaGraduationCap className="text-2xl  right-0"></FaGraduationCap>}></TextComp>

              <button className='w-full flex justify-center gap-5 items-center h-10 bg-black text-white text-2xl rounded-xl hover:scale-105 active:bg-gray-800' type="submit" disabled={globalstate.isLoading}>{globalstate.isLoading ? <><h1>Registering...</h1><Loader /></> : "Register"}</button>
              <div className='flex justify-center items-center gap-2' >Already have a account? <Link to='/studentlogin' className='hover:underline hover:text-blue-500 '>Login</Link></div>
          </form>
      </div>
    </div>
  )
}

export default StudentRegister