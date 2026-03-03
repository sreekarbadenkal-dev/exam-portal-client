import React, { createContext, useState } from 'react'

export const user=createContext();
const {Provider}=user;
const UserContext = ({children}) => {
    const [globalstate,setGlobalState]=useState({
        isLoading:false
    })
    return (
        <Provider value={{globalstate,setGlobalState}}>{children}</Provider>
  )
}

export default UserContext;
