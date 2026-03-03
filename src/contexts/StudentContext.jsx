import React, { createContext, useState } from 'react'

export const studentuser=createContext();
const {Provider}=studentuser;
const StudentContext = ({children}) => {
    const [globalstate,setGlobalState]=useState({
        isLoading:false,
        user:null,
        isAuth:false
    })
    return (
        <Provider value={{globalstate,setGlobalState}}>{children}</Provider>
  )
}

export default StudentContext;
