import React from 'react'
import {Link} from 'react-router-dom';
import {useState, useEffect} from 'react';
import Swal from 'sweetalert2';

function Dashboard() {
    const [user, setuser] = useState({});
    const [isloggedin, setisloggedin] = useState(false);
     useEffect(()=>{
        const checklogin = async ()=>{
            const response = await fetch('http://localhost:7000/api/dashboard', {
                method: 'GET',
                credentials: 'include'
            })
            const result = await response.json();
            if(!result.success){
                window.location.href = '/login';
            }
            else{
                setisloggedin(prev => !prev);
                setuser(result.user);
            }
        }
        checklogin();

     }, [])

    if(isloggedin===false){
        return <div>Loading...</div>
    }
  return (
    <div>
        {isloggedin && (
            <>
                
            </>

        )}
    </div>
  )
}

export default Dashboard