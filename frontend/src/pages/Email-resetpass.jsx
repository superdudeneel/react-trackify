import React from 'react'
import {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import Swal from 'sweetalert2'

function Email() {
    const [email, setemail] = useState('');
    const handlesubmit = async (e)=>{
        e.preventDefault();
        const payload = {
            email: email,
        }
        const response = await fetch('http://localhost:7000/api/forgotpass', {
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
        }else{
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: result.message,
                background: '#1e293b',
                color: 'white',
                showConfirmButton: true,
                confirmButtonText: 'Ok',
                showCloseButton: true,
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
            <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                    Reset your password
                </h1>
                <form className="space-y-4 md:space-y-6" onSubmit={handlesubmit}>
                    <div>
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Enter your email
                    </label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        value={email}
                        onChange={(e) => setemail(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="name@company.com"
                        required
                    />
                    </div>
                    <button
                    type="submit"
                    className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-700 hover:bg-blue-500 cursor-pointer"
                    >
                    Send reset link
                    </button>
                    <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                    Remember your password?{" "}
                    <Link to="/login" className="font-medium text-primary-600 hover:underline text-white">
                        Sign in
                    </Link>
                    </p>
                </form>
                </div>
            </div>
            </div>
        </section>
    </>
  )
}

export default Email