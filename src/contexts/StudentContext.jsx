import React, { createContext, useState, useEffect } from 'react';

export const studentuser = createContext();

const StudentContext = ({ children }) => {
    // 1. Initialize state from localStorage (Using "student_user" consistently)
    const [globalstate, setGlobalState] = useState(() => {
        const savedUser = localStorage.getItem("student_user");
        return {
            isLoading: false,
            user: savedUser ? JSON.parse(savedUser) : null,
            isAuth: !!savedUser
        };
    });

    // 2. The Logout Story: Clear both Disk and Memory
    const logout = () => {
        // Use the same key here as you do in your initialization
        localStorage.removeItem("student_user"); 
        
        // Reset the React State to trigger a re-render
        setGlobalState({ 
            isLoading: false, 
            user: null, 
            isAuth: false 
        });
        
        // Optional: reload is fine, but state update might be enough
        // window.location.reload(); 
    };

    // 3. Sync state to localStorage whenever the user object changes
    useEffect(() => {
        if (globalstate.user) {
            localStorage.setItem("student_user", JSON.stringify(globalstate.user));
        } else {
            localStorage.removeItem("student_user");
        }
    }, [globalstate.user]);

    return (
        <studentuser.Provider value={{ globalstate, setGlobalState, logout }}>
            {children}
        </studentuser.Provider>
    );
}

export default StudentContext;