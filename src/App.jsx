import React from 'react'
import { RouterProvider } from 'react-router-dom'
import routes from './routes/Routes.jsx'
import { Toaster } from 'react-hot-toast'
const App = () => {
  return (
    <>
    <Toaster></Toaster>
    <RouterProvider router={routes}></RouterProvider>
    </>
  )
}

export default App
