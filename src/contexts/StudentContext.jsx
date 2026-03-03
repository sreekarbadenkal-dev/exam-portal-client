import React, { createContext, useState, useEffect } from 'react'

export const studentuser = createContext();

const StudentContext = ({ children }) => {
    // Initialize state from localStorage if it exists
    const [globalstate, setGlobalState] = useState(() => {
        const savedUser = localStorage.getItem("student_user");
        return {
            isLoading: false,
            user: savedUser ? JSON.parse(savedUser) : null,
            isAuth: !!savedUser
        };
    });

    // Sync state to localStorage whenever the user object changes
    useEffect(() => {
        if (globalstate.user) {
            localStorage.setItem("student_user", JSON.stringify(globalstate.user));
        } else {
            localStorage.removeItem("student_user");
        }
    }, [globalstate.user]);

    return (
        <studentuser.Provider value={{ globalstate, setGlobalState }}>
            {children}
        </studentuser.Provider>
    )
}

export default StudentContext;