import { useState } from 'react'
import reactLogo from './assets/react.svg'
import {Routes, Route} from 'react-router-dom'
import viteLogo from '/vite.svg'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/dashboard.jsx'
import Home from './pages/Home.jsx'
function App() {

  return (
    <Routes>
      <Route path = '/' element = {<Home/>}/>
      
      <Route path = '/signup' element = {<Signup/>} />
      <Route path = '/login' element = {<Login/>}/>
      <Route path = '/dashboard' element = {<Dashboard/>}/>

    </Routes>
  )
}

export default App
