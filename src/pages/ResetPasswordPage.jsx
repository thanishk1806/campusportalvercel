import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GraduationCap, Lock, ArrowLeft, ShieldCheck, AlertCircle } from 'lucide-react'
import { authAPI } from '../api/services'

export default function ResetPasswordPage() {
  const [form, setForm] = useState({ token: '', newPassword: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.newPassword !== form.confirmPassword) {
      return setError('Passwords do not match')
    }
    
    setLoading(true)
    setError('')
    try {
      await authAPI.resetPassword({
        token: form.token,
        newPassword: form.newPassword
      })
      setSuccess(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired token. Please try again.')
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
            Create <span className="text-accent-400">New Password</span>
          </h1>
          <p className="text-gray-500 mt-2 text-sm font-medium">Use your reset token to set a new password</p>
        </div>

        <div className="bg-dark-800/70 backdrop-blur-xl rounded-2xl border border-surface-border p-8 shadow-2xl shadow-black/20">
          {success ? (
            <div className="text-center py-4 animate-scale-in">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full mb-4">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Password Reset!</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your password has been successfully updated. Redirecting you to login in a few seconds...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2.5 text-red-400 text-sm font-medium">
                  <AlertCircle size={16} /> {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-1.5">Reset Token</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Paste your reset token here"
                  value={form.token}
                  onChange={e => setForm({ ...form, token: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-1.5">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="password"
                    className="input-field pl-11"
                    placeholder="At least 6 characters"
                    value={form.newPassword}
                    onChange={e => setForm({ ...form, newPassword: e.target.value })}
                    required
                    minLength={6}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="password"
                    className="input-field pl-11"
                    placeholder="Repeat new password"
                    value={form.confirmPassword}
                    onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 text-base disabled:opacity-60 transition-all active:scale-[0.98]"
              >
                {loading ? 'Reseting...' : 'Reset Password'}
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
