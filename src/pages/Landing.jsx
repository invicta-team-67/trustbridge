
import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck } from 'lucide-react'

export default function Landing() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
      {/* Navbar / Logo Area */}
      <div className="absolute top-6 left-6 flex items-center gap-2">
        <div className="p-2 bg-blue-600 rounded-lg">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-900">Trust Bridge</span>
      </div>

      {/* Hero Section */}
      <div className="max-w-2xl text-center space-y-8">
        <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
          This is a Template<br />
          <span className="text-blue-600">For our skeleton</span>
        </h1>
        
        <p className="text-lg text-slate-600">
         Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
        </p>

        {/* The Two Main Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <Link 
            to="/auth?mode=signup" 
            className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            Get Started
          </Link>
          
          <Link 
            to="/auth?mode=login" 
            className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all"
          >
            Login to Account
          </Link>
        </div>
      </div>
      
      {/* Footer */}
      <div className="absolute bottom-6 text-sm text-slate-400">
        Note: This is a template for the auth tryout (Team 67)
      </div>
    </div>
  )
}