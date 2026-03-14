import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { GraduationCap, AlertCircle, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(form.username, form.password)
      if (user.role === 'ROLE_ADMIN') navigate('/admin')
      else if (user.role === 'ROLE_STAFF') navigate('/staff')
      else navigate('/student')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-400 to-accent-600 rounded-2xl mb-5 shadow-lg shadow-accent-500/30">
            <GraduationCap className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Campus <span className="text-accent-400">Portal</span>
          </h1>
          <p className="text-gray-500 mt-2 text-sm font-medium">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-dark-800/70 backdrop-blur-xl rounded-2xl border border-surface-border p-8 shadow-2xl shadow-black/20">
          {error && (
            <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2.5 text-red-400 text-sm font-medium">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-1.5">Username</label>
              <input
                type="text"
                className="input-field"
                placeholder="Enter your username"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-1.5">Password</label>
              <input
                type="password"
                className="input-field"
                placeholder="Enter your password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
              <div className="flex justify-end mt-2">
                <Link to="/forgot-password" size="sm" className="text-xs font-semibold text-gray-500 hover:text-accent-400 transition-colors">
                  Forgot Password?
                </Link>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-base disabled:opacity-60 group"
            >
              {loading ? 'Signing in...' : (
                <span className="flex items-center justify-center gap-2">
                  Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-accent-400 font-semibold hover:text-accent-300 transition-colors">Register</Link>
          </p>
        </div>

        {/* Demo Accounts */}
        <div className="mt-6 p-4 bg-dark-800/40 backdrop-blur rounded-xl border border-surface-border text-xs text-gray-500">
          <p className="font-bold text-gray-400 mb-2">Demo Accounts:</p>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-dark-800/60 rounded-lg p-2 text-center">
              <p className="text-gray-400 font-semibold mb-0.5">Admin</p>
              <p className="font-mono text-gray-500">admin</p>
              <p className="font-mono text-gray-600">admin123</p>
            </div>
            <div className="bg-dark-800/60 rounded-lg p-2 text-center">
              <p className="text-gray-400 font-semibold mb-0.5">Staff</p>
              <p className="font-mono text-gray-500">staff_it</p>
              <p className="font-mono text-gray-600">staff123</p>
            </div>
            <div className="bg-dark-800/60 rounded-lg p-2 text-center">
              <p className="text-gray-400 font-semibold mb-0.5">Student</p>
              <p className="font-mono text-gray-500">student1</p>
              <p className="font-mono text-gray-600">student123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
