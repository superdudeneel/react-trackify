import React from 'react'
import {Link} from 'react-router-dom';
import {useState, useEffect} from 'react';
import { AgCharts } from "ag-charts-react";
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Swal from 'sweetalert2';
import { 
  LayoutDashboard, 
  IndianRupee ,
  Receipt, 
  TrendingUp, 
  Settings, 
  CreditCard, 
  PieChart,
  FileText,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  DollarSign, 
  TrendingDown, 
  Target,
  Calendar
} from 'lucide-react';

function Dashboard() {

    
    
    const [user, setuser] = useState({});
    const [firstname, setfirstname] = useState('');
    const [lastname, setlastname] = useState('');
    const [budget, setbudget] = useState('');


    const [isloggedin, setisloggedin] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeItem, setActiveItem] = useState('dashboard');
    const [expenses, setexpenses] = useState([]);
    const [newexpense, setnewexpense] = useState({
        name: '',
        date: '',
        expense: '',
        place:'',
        note:'',
        category:''
    })

    const [isadd, setisadd] = useState(false);
    
    const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'expenses', label: 'Expense Tracker', icon: Receipt },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    ];
     const bottomItems = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'settings', label: 'Settings', icon: Settings },
        { id: 'logout', label: 'Logout', icon: LogOut },
    ];

    const handleItemClick = (id)=>{
        
        setActiveItem(id);
    }

    const updateuserinfo = async (e)=>{
      e.preventDefault();
      const payload = {
        firstname: firstname,
        lastname: lastname,
        budget: budget,
      }
      const response = await fetch('http://localhost:7000/api/updateuser', {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },

        body:JSON.stringify(payload)
      })
      const result = await response.json();
      if(result.success){
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
          })
      }
    }
    
    const populateuserinfo = async ()=>{
      const response = await fetch('http://localhost:7000/api/populate', {
        method: 'GET',
        credentials: 'include',
      })
      const result = await response.json();
      console.log(result);

      if(result.success){
        setfirstname(result.User.firstname);
        setlastname(result.User.lastname);
        setbudget(result.User.budget);

      }
    }

    const getexpenses = async ()=>{
      const response = await fetch('http://localhost:7000/api/expenses', {
        method: 'GET',
        credentials: 'include',
      })

      const result = await response.json();
      if(result.success){
        setexpenses(result.expenses);
        return result.expenses;
      }
      return [];

    }

    const expenseadd = async (e)=>{
        e.preventDefault();
        const response = await fetch('http://localhost:7000/api/addexpense', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newexpense)

        })
        const result =await response.json();
        if(result.success){
          setexpenses(prev => [...prev, newexpense])
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
          })
        }
        
        setnewexpense({
            name:'',
            date:'',
            expense: '',
            place:'',
            note:''
        })
        setisadd(false);

    }

    const parseDate = (str) => {
      const [day, month, year] = str.split('-').map(Number);
      return new Date(year, month - 1, day);
    };
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
                populateuserinfo();
        
                const expensedata = await getexpenses();
            }
        }
        checklogin();
        


     }, [])


     const KPICards = (props) => {
  const kpiData = [
    {
      title: 'Total Expenses Of All Time',
      value: `₹${props.totalexpenses}`,
      icon: IndianRupee,
      color: 'from-red-500 to-red-600'
    },
    {
      title: 'Monthly Budget',
      value:  `₹${props.budget}`,
      change: `${props.percentage}% used`,
      changeType: 'neutral',
      icon: Target,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Total Expenses This month',
      value: `₹${props.totalthismonth}`,
      change: '+8.2%',
      changeType: 'increase',
      icon: TrendingUp,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Transactions',
      value: props.transactions,
      change: 'This month',
      changeType: 'neutral',
      icon: CreditCard,
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      title: 'Average Daily',
      value: `₹${props.avgdailyexpense}`,
      change: '-3.1%',
      changeType: 'decrease',
      icon: Calendar,
      color: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Top Category',
      value: 'Food',
      change: '$687.30',
      changeType: 'neutral',
      icon: TrendingDown,
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <div className="flex-1 bg-gray-950 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Welcome back! Here's your expense overview</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          
          return (
            <div
              key={index}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-200 hover:shadow-lg"
            >
              {/* Icon and Title */}
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${kpi.color} rounded-lg flex items-center justify-center`}>
                  <Icon size={24} className="text-white" />
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm font-medium">{kpi.title}</p>
                </div>
              </div>

              {/* Value */}
              <div className="mb-3">
                <h3 className="text-2xl font-bold text-white">{kpi.value}</h3>
              </div>

              {/* Change Indicator */}
              <div className="flex items-center">
                {kpi.changeType === 'increase' && (
                  <TrendingUp size={16} className="text-green-500 mr-2" />
                )}
                {kpi.changeType === 'decrease' && (
                  <TrendingDown size={16} className="text-red-500 mr-2" />
                )}
                <span
                  className={`text-sm font-medium ${
                    kpi.changeType === 'increase'
                      ? 'text-green-500'
                      : kpi.changeType === 'decrease'
                      ? 'text-red-500'
                      : 'text-gray-400'
                  }`}
                >
                  {kpi.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      
    </div>
  );
};

    const totalexpenses = expenses.reduce((sum, w) => sum + parseInt(w.expense || 0), 0);

    
    const now = new Date();
    const currentMonth = now.getMonth(); // 0-indexed
    const currentYear = now.getFullYear();

    const totalThisMonth = expenses.reduce((sum, e) => {
      const date = parseDate(e.date);
      if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
        return sum + parseInt(e.expense || 0);
      }
      return sum;
    }, 0);

    const thisMonthExpenses = expenses.filter(e => {
      const date = parseDate(e.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
    const transactions = thisMonthExpenses.length;
    
    const numericBudget = Number(budget);
    
    const percentage = numericBudget > 0
      ? (totalThisMonth/ numericBudget) * 100
      : 0;  

    
    const dates = expenses.map(e => parseDate(e.date));
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));
    const dayDiff = Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24)) + 1;
    const averageDailyExpense = dayDiff > 0 ? totalexpenses / dayDiff : 0;
    

    if(isloggedin===false){
        return <div>Loading...</div>
    }
  return (
    <div>
        {isloggedin && (
            <>
            <div className="flex h-screen">
                <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-gray-900 border-r border-gray-800 transition-all duration-300 ease-in-out flex flex-col h-screen`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              <h1 className="text-white font-bold text-xl">Trackify</h1>
            </div>
          )}
          {isCollapsed && (
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-sm">T</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 p-4 space-y-2 mt-10">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={` cursor-pointer w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon size={20} className={`${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'} transition-colors`} />
              {!isCollapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Navigation */}
      <div className="p-4 border-t border-gray-800 space-y-2">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className={`cursor-pointer w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group ${
                isActive 
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon size={20} className={`${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'} transition-colors`} />
              {!isCollapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </button>
          );
        })}
      </div>
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
              <User size={18} className="text-gray-300" />
            </div>
            <div>
              <p className="text-white font-medium text-sm">{user.username}</p>
              <p className="text-gray-400 text-xs">{user.email}</p>
            </div>
          </div>
        </div>
      )}
    
      

                </div>
                
                {activeItem==='dashboard' && (
                    <>
                        <KPICards totalexpenses = {totalexpenses} transactions = {transactions} budget = {budget} percentage = {percentage} avgdailyexpense = {averageDailyExpense} totalthismonth = {totalThisMonth}/>
                        
                    
                    </>
                )}

                {activeItem==='expenses' && (
                    <>
                      <div className="bg-gray-950 p-6 w-full">
                    {!isadd && (
                        <>
                            <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
                            <div className="flex flex-wrap gap-3">
                            <button onClick = {()=>{
                                setisadd(true);
                            }} className="cursor-pointer bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition-all duration-200">
                                Add Expense
                            </button>
                            </div>
                            <div className="mt-6 space-y-4">
                            {expenses.map((ex, index) => (
                                <div
                                key={index}
                                className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-sm text-white flex items-center justify-between hover:bg-gray-700 transition duration-200"
                                >
                                <div>
                                    <h3 className="text-lg font-semibold">{ex.name}</h3>
                                    <p className="text-sm text-gray-400">{ex.date}</p>
                                </div>
                                <div className="text-cyan-400 font-medium">
                                    ₹{ex.expense}
                                </div>
                                </div>
                            ))}
                            </div>
                        </>
                    )}

                    {isadd && (
                        <div>
                            <div className="flex items-center justify-center mt-30">
                                <form className="bg-gray-900 p-6 rounded-xl shadow-lg w-full max-w-md space-y-4" onSubmit = {expenseadd}>
                                <input
                                    type="text"
                                    placeholder="Expense Name"
                                    name = 'name'
                                    value={newexpense.name}
                                    onChange = {(e)=>{
                                        setnewexpense(prev => ({
                                            ...prev,
                                            name: e.target.value,
                                        }))
                                    }}
                                    className="w-full px-4 py-2 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Date (YYYY-MM-DD)"
                                    name = 'date'
                                    value={newexpense.date}
                                    onChange = {(e)=>{
                                        setnewexpense(prev => ({
                                            ...prev,
                                            date: e.target.value,
                                        }))
                                    }}
                                    className="w-full px-4 py-2 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Amount"
                                    name = 'expense'
                                    value={newexpense.expense}
                                    onChange = {(e)=>{
                                        setnewexpense(prev => ({
                                            ...prev,
                                            expense: e.target.value,
                                        }))
                                    }}
                                    className="w-full px-4 py-2 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Place"
                                    name = 'place'
                                    value={newexpense.place}
                                    onChange = {(e)=>{
                                        setnewexpense(prev => ({
                                            ...prev,
                                            place: e.target.value,
                                        }))
                                    }}
                                    className="w-full px-4 py-2 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                                 <input
                                    type="text"
                                    placeholder="Notes.."
                                    name = 'note'
                                    value={newexpense.note}
                                    onChange = {(e)=>{
                                        setnewexpense(prev => ({
                                            ...prev,
                                            note: e.target.value,
                                        }))
                                    }}
                                    className="w-full px-4 py-2 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />

                                <select
                                    name="category"
                                    value={newexpense.category}
                                    onChange={(e) => {
                                        setnewexpense((prev) => ({
                                            ...prev,
                                            category: e.target.value,
                                        }));
                                    }}
                                    className="w-full px-4 py-2 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                >
                                    <option value="">Select Category</option>
                                    <option value="Food">Food</option>
                                    <option value="Transport">Transport</option>
                                    <option value="Utilities">Utilities</option>
                                    <option value="Entertainment">Entertainment</option>
                                    <option value="Other">Other</option>
                                </select>
                
                                <div className="flex justify-end pt-2">
                                    <button
                                    onClick = {()=>{
                                      setisadd(false);
                                    }}
                                    className="cursor-pointer mr-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition-all duration-200"
                                    >
                                    Cancel
                                    </button>
                                    <button
                                    type="submit"
                                    className="cursor-pointer bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition-all duration-200"
                                    >
                                    Save Expense
                                    </button>
                                </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
                    </>
                )}


                {activeItem==='profile' && (
                  <>
                    <form onSubmit = {updateuserinfo} className="bg-gray-950 text-white p-8 w-full shadow-lg">
                      <div className="space-y-12">
                        <div className="border-b border-gray-700 pb-12">
                          <h2 className="text-base font-semibold">Profile</h2>

                          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-4">
                              <label htmlFor="username" className="block text-sm font-medium">
                                Username
                              </label>
                              <div className="mt-2">
                                <div className="flex items-center rounded-md bg-gray-900 pl-3 outline outline-1 outline-gray-700 focus-within:outline-2 focus-within:outline-cyan-500">
                                  <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    value={user.username}
                                    readOnly
                                    className="block min-w-0 grow py-1.5 pr-3 pl-1 bg-transparent text-white placeholder:text-gray-400 focus:outline-none sm:text-sm"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="border-b border-gray-700 pb-12">
                          <h2 className="text-base font-semibold">Personal Information</h2>
                          <p className="mt-1 text-sm text-gray-400">Use a permanent address where you can receive mail.</p>

                          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-3">
                              <label htmlFor="first-name" className="block text-sm font-medium">
                                First name
                              </label>
                              <div className="mt-2">
                                <input
                                  id="first-name"
                                  name="first-name"
                                  type="text"
                                  value={firstname}
                                  onChange={(e) => setfirstname(e.target.value)}
                                  className="block w-full rounded-md bg-gray-900 px-3 py-1.5 text-white outline outline-1 outline-gray-700 placeholder:text-gray-400 focus:outline-2 focus:outline-cyan-500 sm:text-sm"
                                />
                              </div>
                            </div>

                            <div className="sm:col-span-3">
                              <label htmlFor="last-name" className="block text-sm font-medium">
                                Last name
                              </label>
                              <div className="mt-2">
                                <input
                                  id="last-name"
                                  name="last-name"
                                  type="text"
                                  value={lastname}
                                  onChange={(e) => setlastname(e.target.value)}
                                  className="block w-full rounded-md bg-gray-900 px-3 py-1.5 text-white outline outline-1 outline-gray-700 placeholder:text-gray-400 focus:outline-2 focus:outline-cyan-500 sm:text-sm"
                                />
                              </div>
                            </div>

                            <div className="sm:col-span-4">
                              <label htmlFor="email" className="block text-sm font-medium">
                                Email address
                              </label>
                              <div className="mt-2">
                                <input
                                  id="email"
                                  name="email"
                                  type="email"
                                  value={user.email}
                                  readOnly
                                  className="block w-full rounded-md bg-gray-900 px-3 py-1.5 text-white outline outline-1 outline-gray-700 placeholder:text-gray-400 focus:outline-2 focus:outline-cyan-500 sm:text-sm"
                                />
                              </div>
                            </div>

                            

                            <div className="sm:col-span-2">
                              <label htmlFor="height" className="block text-sm font-medium">
                                Set Budget Per Month
                              </label>
                              <div className="mt-2">
                                <input
                                  id="height"
                                  name="height"
                                  type="text"
                                  value={budget}
                                  onChange={(e) => setbudget(e.target.value)}
                                  className="block w-full rounded-md bg-gray-900 px-3 py-1.5 text-white outline outline-1 outline-gray-700 placeholder:text-gray-400 focus:outline-2 focus:outline-cyan-500 sm:text-sm"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

  <div className="mt-6 flex items-center justify-end gap-x-6">
    <button type="button" className="text-sm font-semibold text-white hover:text-gray-300">
      Cancel
    </button>
    <button
      type="submit"
      className="rounded-md bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
    >
      Save
    </button>
  </div>
</form>

                  </>
                )}
            </div>



      
            </>

    )}
    </div>
  )
}

export default Dashboard