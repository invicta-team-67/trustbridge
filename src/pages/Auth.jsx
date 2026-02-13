import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Loader2, Mail, Lock, ArrowLeft } from 'lucide-react'

export default function Auth() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [view, setView] = useState('login')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    const mode = searchParams.get('mode')
    if (mode === 'signup') setView('signup')
  }, [searchParams])

  // Handle Form Submission
  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      if (view === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setMessage({ type: 'success', text: 'Check your email for the confirmation link!' })
      } 
      else if (view === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        navigate('/dashboard')
      }
      else if (view === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email)
        if (error) throw error
        setMessage({ type: 'success', text: 'Password reset link sent to your email.' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        
        {/* Header */}
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-bold text-slate-900">
            {view === 'login' && 'Welcome Back'}
            {view === 'signup' && 'Create Account'}
            {view === 'forgot' && 'Reset Password'}
          </h2>
          <p className="text-slate-500">
            {view === 'login' && 'Enter your details to access your dashboard.'}
            {view === 'signup' && 'Start building your business trust score today.'}
            {view === 'forgot' && 'Enter your email to receive a reset link.'}
          </p>
        </div>

        {/* Feedback Message */}
        {message && (
          <div className={`p-3 rounded-lg text-sm text-center ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
            {message.text}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          
          {/* Email Field */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input 
                type="email" 
                required
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Field (Hidden for Forgot Password view) */}
          {view !== 'forgot' && (
            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-slate-700">Password</label>
                {view === 'login' && (
                  <button 
                    type="button"
                    onClick={() => setView('forgot')}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input 
                  type="password" 
                  required
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all flex items-center justify-center disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
              view === 'login' ? 'Sign In' : view === 'signup' ? 'Create Account' : 'Send Reset Link'
            )}
          </button>
        </form>

        {/* Toggle Links */}
        <div className="text-center text-sm text-slate-600">
          {view === 'login' ? (
            <>
              Don't have an account?{' '}
              <button onClick={() => setView('signup')} className="text-blue-600 font-semibold hover:underline">
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button onClick={() => setView('login')} className="text-blue-600 font-semibold hover:underline">
                Log in
              </button>
            </>
          )}
        </div>

        {/* Back to Home Link */}
        <div className="pt-4 border-t border-slate-100 text-center">
             <button onClick={() => navigate('/')} className="inline-flex items-center text-sm text-slate-400 hover:text-slate-600">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
             </button>
        </div>

      </div>
    </div>
  )
}