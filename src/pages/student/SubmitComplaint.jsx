import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../../components/Layout'
import { complaintAPI, sharedAPI, aiAPI } from '../../api/services'
import { AlertCircle, CheckCircle, Send, Zap } from 'lucide-react'

export default function SubmitComplaint() {
  const [form, setForm] = useState({
    title: '', description: '', categoryId: '', departmentId: '', priority: 'MEDIUM'
  })
  const [departments, setDepartments] = useState([])
  const [categories, setCategories] = useState([])
  const [filteredCategories, setFilteredCategories] = useState([])
  const [estimate, setEstimate] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([sharedAPI.getDepartments(), sharedAPI.getCategories()])
      .then(([depts, cats]) => {
        setDepartments(depts.data)
        setCategories(cats.data)
      })
      .catch(console.error)
  }, [])

  useEffect(() => {
    if (form.departmentId) {
      setFilteredCategories(categories.filter(c => c.departmentId == form.departmentId))
      setForm(f => ({ ...f, categoryId: '' }))
      setEstimate(null)
    }
  }, [form.departmentId, categories])

  useEffect(() => {
    if (form.categoryId) {
      aiAPI.getEstimate(form.categoryId)
        .then(res => setEstimate(res.data))
        .catch(() => setEstimate(null))
    } else {
      setEstimate(null)
    }
  }, [form.categoryId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await complaintAPI.create({
        ...form,
        categoryId: Number(form.categoryId),
        departmentId: Number(form.departmentId)
      })
      setSuccess(true)
      setTimeout(() => navigate('/student'), 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit request.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Layout>
        <div className="dark-card max-w-lg mx-auto text-center py-16 px-6 animate-fade-in mt-10 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
          <CheckCircle size={56} className="mx-auto text-emerald-400 mb-5" />
          <h2 className="text-3xl font-black text-white tracking-tight">Request Submitted!</h2>
          <p className="text-gray-400 mt-3 font-medium text-lg">Your request has been routed automatically. Redirecting...</p>
          <div className="mt-8">
            <div className="w-48 h-1.5 bg-dark-700 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-emerald-500 animate-[progress_1.5s_ease-in-out_forwards]"></div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-4 animate-fade-in">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black text-white mb-2">
            Submit a <span className="text-accent-400">Request</span>
          </h1>
          <p className="text-gray-500 font-medium max-w-lg mx-auto">Provide the details of your issue. It will be routed to the appropriate department automatically.</p>
        </div>

        <div className="dark-card p-8 sm:p-10 animate-slide-up">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm font-medium animate-fade-in">
              <AlertCircle size={18} className="shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-1.5">Title *</label>
              <input
                className="input-field"
                placeholder="Brief title of the issue"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 mb-1.5">Description *</label>
              <textarea
                className="input-field min-h-[140px]"
                placeholder="Describe your issue in detail..."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1.5">Department *</label>
                <select
                  className="input-field"
                  value={form.departmentId}
                  onChange={e => setForm({ ...form, departmentId: e.target.value })}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-400 mb-1.5">Category *</label>
                <select
                  className={`input-field ${!form.departmentId ? 'opacity-50' : ''}`}
                  value={form.categoryId}
                  onChange={e => setForm({ ...form, categoryId: e.target.value })}
                  required
                  disabled={!form.departmentId}
                >
                  <option value="">Select Category</option>
                  {filteredCategories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {estimate && estimate.estimatedTime !== "No data yet" && (
              <div className="bg-accent-500/5 border border-accent-500/10 rounded-xl p-4 flex items-center gap-3 animate-fade-in shadow-inner">
                <div className="bg-accent-500/20 p-2 rounded-lg text-accent-400">
                  <Zap size={20} />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Smart Prediction</p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    Estimated resolution time based on previous requests: <span className="text-accent-400 font-bold">{estimate.estimatedTime}</span>
                  </p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-gray-400 mb-3">Priority Level</label>
              <div className="grid grid-cols-3 gap-3">
                {['LOW', 'MEDIUM', 'HIGH'].map(p => (
                  <label key={p} className={`text-center border rounded-xl py-3 cursor-pointer text-sm font-bold transition-all
                    ${form.priority === p
                      ? p === 'HIGH' ? 'bg-red-500/15 border-red-500/40 text-red-400 scale-[1.02]'
                        : p === 'MEDIUM' ? 'bg-yellow-500/15 border-yellow-500/40 text-yellow-400 scale-[1.02]'
                        : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 scale-[1.02]'
                      : 'border-surface-border text-gray-500 hover:border-gray-600 hover:text-gray-400'}`}>
                    <input type="radio" name="priority" value={p} className="sr-only"
                      checked={form.priority === p}
                      onChange={() => setForm({ ...form, priority: p })} />
                    {p}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-4 pt-6 mt-4 border-t border-surface-border">
              <button type="button" onClick={() => navigate('/student')} className="btn-secondary w-full sm:w-1/3 py-3">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="btn-primary w-full sm:w-2/3 py-3 text-base group disabled:opacity-60">
                <span className="flex items-center justify-center gap-2">
                  {loading ? 'Submitting...' : <><Send size={18} /> Submit Request</>}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}
