import React from 'react'
import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import Swal from 'sweetalert2'

function Login() {
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [isloggedin, setisloggedin] = useState(false);

  const handlesubmit = async (e)=>{
    e.preventDefault();
    const payload = {
      email,
      password
    }
    const response = await fetch('http://localhost:7000/api/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
                'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    const result = await response.json();
    if(!result.success){
      Swal.fire({
          icon: 'error',
          title: 'Error',
          text: result.message,
          showConfirmButton: true,
          background: '#1e293b',
          color: 'white',
          confirmButtonText: 'Try Again',
          showCloseButton: true,
      })
    }
    else{
      Swal.fire({
          icon: 'success',
          title: 'Success',
          text: result.message,
          background: '#1e293b',
          color: 'white',
          showConfirmButton: true,
          timer: 1200,
          confirmButtonText: 'Ok',
          showCloseButton: true,
      }).then(() => {
          window.location.href = '/dashboard';
      })
    }
  }

  useEffect( ()=>{
    const checkLogin = async () => {
      try {
        const response = await fetch('http://localhost:7000/api/dashboard', {
          method: 'GET',
          credentials: 'include',
        });
        const result = await response.json();
        if (result.success) {
          setisloggedin(true);
          window.location.href = '/dashboard';
        }
      } catch (error) {
        console.error('Error during fetch:', error);
      }
  };
  checkLogin();

  }, [])

  if(isloggedin===true){
    return <div>Loading...</div>
  }

  return (
    <>
      {!isloggedin && (
        <section class="bg-gray-50 dark:bg-gray-900">
  <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <a href="#" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img class="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo"/>
          Flowbite    
      </a>
      <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Sign in to your account
              </h1>
              <form class="space-y-4 md:space-y-6" onSubmit = {handlesubmit}>
                  <div>
                      <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                      <input type="email" name="email" id="email" value = {email} onChange = {(e)=>{
                        setemail(e.target.value);
                      }} class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" />
                  </div>
                  <div>
                      <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                      <input type="password" name="password" id="password" value = {password} onChange = {(e)=>{
                        setpassword(e.target.value);
                      }} placeholder="password" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required=""/>
                  </div>
                  <div class="flex items-center justify-between">
                      
                      <Link to = '/forgotpass' class="text-sm font-medium text-primary-600 hover:underline text-white">Forgot password?</Link>
                  </div>
                  <button type="submit" class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-700 hover:bg-blue-500 cursor-pointer">Sign in</button>
                  <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                      Don’t have an account yet? <Link to = '/signup' class="font-medium text-primary-600 hover:underline text-white">Sign up</Link>
                  </p>
              </form>
          </div>
      </div>
  </div>
</section>
      )}
    </>
  )
}

export default Login