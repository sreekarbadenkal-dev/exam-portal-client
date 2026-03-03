import React, { useState } from 'react'

const TextComp = ({type,name,handleClick,val,unit}) => {

    const [vis,setVis]=useState(false)
    const handleVisibility=()=>{
        setVis(!vis)
    }
    
  return (
    <div className={` h-12 sm:h-10 w-full relative duration-75 flex items-center px-2  focus-within:border-2 focus-within:rounded-lg ${val[name]?"border-2 rounded-lg":"border-b-2"}`}>
    <label className={`text-lg capitalize duration-75 absolute left-2 ${val[name]?"-top-2.75 text-sm bg-white px-1":"top-[calc(50%-14px)]"}`} htmlFor={name}>{name}</label>
    <input className="w-full h-full outline-0 pr-4" type={type==="password" && Array.isArray(unit)?(vis?"text":"password"):type} name={name} value={val[name]||""} onChange={handleClick} />
    <span onClick={handleVisibility}>{type==="password"?vis?unit[0]:unit[1]:unit}</span>
    </div>
  )
}

export default TextComp