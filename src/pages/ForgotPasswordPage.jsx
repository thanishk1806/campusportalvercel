import { useState } from 'react'
import { Link } from 'react-router-dom'
import { GraduationCap, Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import { authAPI } from '../api/services'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await authAPI.forgotPassword(email)
      setSent(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-accent-400 to-accent-600 rounded-2xl mb-5 shadow-lg shadow-accent-500/30">
            <GraduationCap className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Reset <span className="text-accent-400">Password</span>
          </h1>
          <p className="text-gray-500 mt-2 text-sm font-medium">Enter your email to receive a reset link</p>
        </div>

        <div className="bg-dark-800/70 backdrop-blur-xl rounded-2xl border border-surface-border p-8 shadow-2xl shadow-black/20">
          {sent ? (
            <div className="text-center py-4 animate-scale-in">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full mb-4">
                <CheckCircle size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Check your email</h3>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                We've sent a password reset link to <span className="text-white font-bold">{email}</span>. Please check your inbox and follow the instructions.
              </p>
              <p className="text-xs text-accent-500 bg-accent-500/10 p-3 rounded-lg border border-accent-500/20 mb-6">
                <strong>Demo Note:</strong> The token has been logged to the server console. Use it on the next page.
              </p>
              <Link
                to="/reset-password"
                className="btn-primary w-full py-2.5 flex items-center justify-center gap-2"
              >
                Go to Reset Page
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2.5 text-red-400 text-sm font-medium animate-shake">
                  <AlertCircle size={16} /> {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="email"
                    className="input-field pl-11"
                    placeholder="name@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 text-base disabled:opacity-60"
              >
                {loading ? 'Sending link...' : 'Send Reset Link'}
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-surface-border/50">
            <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-white transition-colors">
              <ArrowLeft size={16} /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
