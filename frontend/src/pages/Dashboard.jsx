import React from 'react'
import {Link} from 'react-router-dom';
import {useState, useEffect} from 'react';
import Swal from 'sweetalert2';
import { 
  LayoutDashboard, 
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
    const [isloggedin, setisloggedin] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [activeItem, setActiveItem] = useState('dashboard');
    const [expenses, setexpenses] = useState([]);
    const [newexpense, setnewexpense] = useState({
        name: '',
        date: '',
        expense: '',
        place:'',

    })
    
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


     const Expensetracker = ()=>{
        return (
            <>
                <div className="bg-gray-950 p-6 w-full">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <button className="cursor-pointer bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition-all duration-200">
            Add Expense
          </button>
          <button className="cursor-pointer bg-gray-800 border border-gray-700 text-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-700 hover:text-white transition-all duration-200">
            View Reports
          </button>
          <button className="cursoro-pointer bg-gray-800 border border-gray-700 text-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-700 hover:text-white transition-all duration-200">
            Set Budget
          </button>
        </div>
      </div>
            </>
        )
     }

     const KPICards = () => {
  const kpiData = [
    {
      title: 'Total Expenses',
      value: '$2,847.50',
      change: '+12.5%',
      changeType: 'increase',
      icon: DollarSign,
      color: 'from-red-500 to-red-600'
    },
    {
      title: 'Monthly Budget',
      value: '$4,000.00',
      change: '71% used',
      changeType: 'neutral',
      icon: Target,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Savings',
      value: '$1,152.50',
      change: '+8.2%',
      changeType: 'increase',
      icon: TrendingUp,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Transactions',
      value: '127',
      change: 'This month',
      changeType: 'neutral',
      icon: CreditCard,
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      title: 'Average Daily',
      value: '$91.85',
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
              <p className="text-white font-medium text-sm">John Doe</p>
              <p className="text-gray-400 text-xs">john@example.com</p>
            </div>
          </div>
        </div>
      )}
    
      

                </div>
                
                {activeItem==='dashboard' && (
                    <>
                        <KPICards />
                    </>
                )}

                {activeItem==='expenses' && (
                    <>
                        <Expensetracker/>
                    </>
                )}
            </div>



      
            </>

    )}
    </div>
  )
}

export default Dashboard