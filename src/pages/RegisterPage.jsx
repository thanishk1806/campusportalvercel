import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { sharedAPI } from '../api/services'
import { GraduationCap, AlertCircle, ArrowRight } from 'lucide-react'

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: '', password: '', email: '', fullName: '',
    phone: '', role: 'ROLE_STUDENT', departmentId: ''
  })
  const [departments, setDepartments] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    sharedAPI.getDepartments()
      .then(r => {
        console.log('Departments fetched:', r.data);
        setDepartments(r.data);
      })
      .catch(err => {
        console.error('Failed to fetch departments:', err);
      });
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = { ...form, departmentId: form.departmentId || null }
      await register(payload)
      setSuccess('Registration successful! Redirecting to login...')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-accent-500/8 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/3 -left-40 w-96 h-96 bg-blue-500/8 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-accent-400 to-accent-600 rounded-xl mb-4 shadow-lg shadow-accent-500/20">
            <GraduationCap className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-black text-white">Create Account</h1>
          <p className="text-gray-500 mt-1 text-sm">Join the Campus Portal</p>
        </div>

        <div className="bg-dark-800/70 backdrop-blur-xl rounded-2xl border border-surface-border p-8 shadow-2xl shadow-black/20">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-sm font-medium">
              <AlertCircle size={16} /> {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm font-medium">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-1">Full Name</label>
                <input className="input-field" placeholder="Full name" value={form.fullName}
                  onChange={e => setForm({ ...form, fullName: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-1">Username</label>
                <input className="input-field" placeholder="Username" value={form.username}
                  onChange={e => setForm({ ...form, username: e.target.value })} required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-1">Email</label>
              <input type="email" className="input-field" placeholder="email@campus.edu" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-1">Password</label>
                <input type="password" className="input-field" placeholder="Min 6 chars" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })} required minLength={6} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-1">Phone</label>
                <input className="input-field" placeholder="Optional" value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-1">Role</label>
              <select className="input-field" value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}>
                <option value="ROLE_STUDENT">Student</option>
                <option value="ROLE_STAFF">Staff</option>
                <option value="ROLE_ADMIN">Admin</option>
              </select>
            </div>

            {(form.role === 'ROLE_STAFF' || form.role === 'ROLE_ADMIN') && (
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-1">Department</label>
                <select className="input-field" value={form.departmentId}
                  onChange={e => setForm({ ...form, departmentId: e.target.value })}>
                  <option value="">Select Department</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full btn-primary py-3 disabled:opacity-60 group">
              {loading ? 'Creating account...' : (
                <span className="flex items-center justify-center gap-2">
                  Create Account <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-accent-400 font-semibold hover:text-accent-300 transition-colors">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
