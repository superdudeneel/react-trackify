import React from 'react'
import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';

function Reset() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [password, setpassword] = useState('');
    const [confirmpassword, setconfirmpassword] = useState('');
    const [isvalid, setisvalid] = useState(false);

    const handlesubmit = async (e)=>{
        e.preventDefault();
        const payload = {
            password: password,
            confirmpassword: confirmpassword,

        }
        const response = await fetch(`http://localhost:7000/api/updatepass?token=${token}`, {
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
                timer: 1200,
                showConfirmButton: true,
                confirmButtonText: 'Ok',
                showCloseButton: true,
            }).then(()=>{
                window.location.href = '/login';
            })
        }
    }

    useEffect(()=>{
        const checktoken = async ()=>{
            const response = await fetch(`http://localhost:7000/api/updatepass?token=${token}`, {
                method: 'GET',
                credentials: 'include',
            })
            const result = await response.json();
            if(result.success){
                setisvalid(true);

            }
            
        }
        checktoken();

    }, [])
  return (
    <>
   
    {isvalid && (
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
                    Set a new password
                    </h1>
                    <form className="space-y-4 md:space-y-6" onSubmit={handlesubmit}>
                    <div>
                        <label htmlFor="new-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        New Password
                        </label>
                        <input
                        type="password"
                        name="new-password"
                        id="new-password"
                        value = {password}
                        onChange = {(e)=>{
                            setpassword(e.target.value);
                        }}
                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Enter new password"
                        required
                        />
                    </div>
                    <div>
                        <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Confirm Password
                        </label>
                        <input
                        type="password"
                        name="confirm-password"
                        id="confirm-password"
                        value = {confirmpassword}
                        onChange = {(e)=>{
                            setconfirmpassword(e.target.value);
                        }}
                        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Confirm new password"
                        required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-blue-700 hover:bg-blue-500 cursor-pointer"
                    >
                        Reset Password
                    </button>
                    </form>
                </div>
                </div>
            </div>
            </section>
        </>
    )}

    {!isvalid && (
        <>
            <div className = 'flex justify-center items-center h-screen bg-black text-white'>
                <h1 className = 'text-bold text-4xl'>Invalid Token or expired token</h1>
            </div>
        </>

    )}

    </>

  )
}

export default Reset