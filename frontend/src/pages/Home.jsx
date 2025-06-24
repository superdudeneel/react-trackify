import React, { useState, useEffect } from 'react';
import { TrendingUp, PieChart, BarChart3, Wallet, DollarSign, Calendar, Target, Zap, Shield, Smartphone, ArrowRight, Star, Menu, X } from 'lucide-react';
import {Link} from 'react-router-dom'
const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isloggedin, setisloggedin] = useState(false);

  const checkauth = async ()=>{
    const response = await fetch('http://localhost:7000/api/dashboard', {
        method: 'GET',
        credentials: 'include',
    })
    const result = await response.json();
    if(result.success){
        setisloggedin(true);

    }
  }

  useEffect(() => {
    checkauth();

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Wallet className="w-8 h-8" />,
      title: "Smart Expense Tracking",
      description: "Effortlessly log and categorize your expenses with our intuitive interface."
    },
    {
      icon: <PieChart className="w-8 h-8" />,
      title: "Advanced Analytics",
      description: "Visualize your spending patterns with interactive charts and detailed breakdowns."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Budget Goals",
      description: "Set and track budget goals with real-time notifications and progress monitoring."
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Recurring Expenses",
      description: "Automatically track subscriptions and recurring payments to never miss a charge."
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Mobile Optimized",
      description: "Track expenses on-the-go with our responsive design that works perfectly on any device."
    }
  ];

  const stats = [
    { value: "50K+", label: "Active Users" },
    { value: "$2M+", label: "Expenses Tracked" },
    { value: "4.9★", label: "User Rating" },
    { value: "99.9%", label: "Uptime" }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-gray-900/95 backdrop-blur-sm border-b border-gray-800' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-gray-900" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-br from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                ExpenseFlow
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="hover:text-blue-400 transition-colors">Features</a>
              <a href="#analytics" className="hover:text-blue-400 transition-colors">Analytics</a>
              <a href="#pricing" className="hover:text-blue-400 transition-colors">Pricing</a>
              <button className="cursor-pointer bg-gradient-to-br from-blue-500 to-cyan-500 px-6 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-105">
                {isloggedin && (
                    <Link to = '/dashboard'>Access Dashboard</Link>
                )}
                {!isloggedin && (
                    <Link to = '/signup'>Get Started</Link>
                )}
              </button>
            </div>

            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-gray-800 border-t border-gray-700">
            <div className="px-4 py-4 space-y-4">
              <a href="#features" className="block hover:text-blue-400 transition-colors">Features</a>
              <a href="#analytics" className="block hover:text-blue-400 transition-colors">Analytics</a>
              <a href="#pricing" className="block hover:text-blue-400 transition-colors">Pricing</a>
              <button className="w-full bg-gradient-to-br from-blue-500 to-cyan-500 px-6 py-2 rounded-lg font-semibold">
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-cyan-900/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-br from-blue-400 via-cyan-400 to-blue-300 bg-clip-text text-transparent">
                Track Expenses
              </span>
              <br />
              <span className="text-white">Like Never Before</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your financial life with intelligent expense tracking, powerful analytics, 
              and insights that help you make smarter money decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="group bg-gradient-to-br from-blue-500 to-cyan-500 px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-105 flex items-center space-x-2">
                <span>Start Tracking Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 border-2 border-gray-600 rounded-xl font-semibold text-lg hover:border-blue-400 hover:text-blue-400 transition-all">
                Watch Demo
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-br from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to take control of your finances in one beautiful, easy-to-use platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group bg-gray-800 border border-gray-700 rounded-2xl p-8 hover:border-blue-500/50 hover:bg-gray-750 transition-all duration-300 transform hover:-translate-y-2">
                <div className="text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Analytics Dashboard Preview */}
      <section id="analytics" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-br from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Analytics Dashboard
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Get deep insights into your spending patterns with beautiful, interactive charts and reports.
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border border-gray-700">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Chart Preview */}
              <div className="space-y-6">
                <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Monthly Spending</h3>
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="h-32 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg flex items-end justify-around p-4">
                    <div className="w-8 bg-blue-400 rounded-t" style={{height: '60%'}}></div>
                    <div className="w-8 bg-cyan-400 rounded-t" style={{height: '80%'}}></div>
                    <div className="w-8 bg-blue-400 rounded-t" style={{height: '40%'}}></div>
                    <div className="w-8 bg-cyan-400 rounded-t" style={{height: '90%'}}></div>
                    <div className="w-8 bg-blue-400 rounded-t" style={{height: '70%'}}></div>
                  </div>
                </div>

                <div className="bg-gray-700/50 rounded-xl p-6 border border-gray-600">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Category Breakdown</h3>
                    <PieChart className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                        <span>Food & Dining</span>
                      </div>
                      <span className="text-blue-400 font-semibold">$1,234</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                        <span>Transportation</span>
                      </div>
                      <span className="text-cyan-400 font-semibold">$856</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                        <span>Entertainment</span>
                      </div>
                      <span className="text-slate-400 font-semibold">$432</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Real-time Updates</h4>
                    <p className="text-gray-300">See your spending data update instantly as you add new expenses.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Secure & Private</h4>
                    <p className="text-gray-300">Your financial data is encrypted and stored securely with bank-level security.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-slate-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Custom Reports</h4>
                    <p className="text-gray-300">Generate detailed reports for any time period with exportable data.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900/20 to-cyan-900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Take Control of Your
            <span className="bg-gradient-to-br from-blue-400 to-cyan-400 bg-clip-text text-transparent"> Finances?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of users who have already transformed their financial lives with ExpenseFlow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group bg-gradient-to-br from-blue-500 to-cyan-500 px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-105 flex items-center space-x-2">
              <span>Start Your Free Trial</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-gray-400">No credit card required • 14-day free trial</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-gray-900" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-br from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                  ExpenseFlow
                </span>
              </div>
              <p className="text-gray-400">
                The modern way to track expenses and manage your finances.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Analytics</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Mobile App</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-blue-400 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 ExpenseFlow. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;