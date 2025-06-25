import { useState } from 'react'
import reactLogo from './assets/react.svg'
import {Routes, Route} from 'react-router-dom'
import viteLogo from '/vite.svg'
import Signup from './pages/Signup.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/dashboard.jsx'
import Home from './pages/Home.jsx'
import Email from './pages/Email-resetpass.jsx';
import Reset from './pages/Reset.jsx'
function App() {

  return (
    <Routes>
      <Route path = '/' element = {<Home/>}/>
      <Route path = '/forgotpass' element = {<Email/>}/>
      <Route path = '/signup' element = {<Signup/>} />
      <Route path = '/login' element = {<Login/>}/>
      <Route path = '/dashboard' element = {<Dashboard/>}/>
      <Route path = '/resetpass' element = {<Reset/>}/>

    </Routes>
  )
}

export default App
