import React from 'react'
import {Link} from 'react-router-dom';
import {useState} from 'react';
import Swal from 'sweetalert2';
function Signup() {
    const [username, setusername] = useState('');
    const [email, setemail] = useState('');
    const [password, setpassword] = useState('');

    const handlesubmit = async (e)=>{
        e.preventDefault();
        const payload = {
             username,
             email,
             password,
        }
        const response = await fetch('http://localhost:7000/api/signup', {
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
                window.location.href = '/login';
            })
        }
    }

  return (
    <>
        <section className="bg-gray-50 dark:bg-gray-900">
  <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <a href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo" />
          Flowbite    
      </a>
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Create an account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit = {handlesubmit}>

                  <div>
                      <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                      <input type="text" name="username" id="username" value = {username} onChange = {(e)=>{
                        setusername(e.target.value);
                      }} placeholder="Username" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                  </div>
                  <div>
                      <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                      <input type="email" name="email" id="email" value = {email} onChange = {(e)=>{
                        setemail(e.target.value);
                      }} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" />
                  </div>
                  
                  <div>
                      <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                      <input type="password" name="password" id="password" value = {password} onChange = {(e)=>{
                        setpassword(e.target.value);
                      }} placeholder="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                  </div>
                  <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input id="terms" aria-describedby="terms" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required="" />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">I accept the <a className="font-medium text-primary-600 hover:underline dark:text-primary-500" href="#">Terms and Conditions</a></label>
                      </div>
                  </div>
                  <button type="submit" className="cursor-pointer w-full text-white bg-blue-700 hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Create an account</button>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                      Already have an account? <Link to = '/login' className="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</Link>
                  </p>
              </form>
          </div>
      </div>
  </div>
</section>
    </>
  )
}

export default Signup