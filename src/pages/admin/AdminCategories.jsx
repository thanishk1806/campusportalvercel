import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { adminAPI } from '../../api/services'
import { PlusCircle, AlertCircle, CheckCircle } from 'lucide-react'

export default function AdminCategories() {
  const [departments, setDepartments] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [deptForm, setDeptForm] = useState({ name: '', description: '' })
  const [catForm, setCatForm] = useState({ name: '', description: '', departmentId: '' })
  const [msg, setMsg] = useState({ type: '', text: '' })

  const showMsg = (type, text) => {
    setMsg({ type, text })
    setTimeout(() => setMsg({ type: '', text: '' }), 3000)
  }

  const load = () => {
    Promise.all([adminAPI.getDepartments(), adminAPI.getCategories()])
      .then(([d, c]) => { setDepartments(d.data); setCategories(c.data) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleAddDept = async (e) => {
    e.preventDefault()
    try {
      await adminAPI.createDepartment(deptForm)
      setDeptForm({ name: '', description: '' })
      load()
      showMsg('success', 'Department created!')
    } catch (err) {
      showMsg('error', err.response?.data?.message || 'Failed to create department.')
    }
  }

  const handleAddCat = async (e) => {
    e.preventDefault()
    try {
      await adminAPI.createCategory({ ...catForm, departmentId: Number(catForm.departmentId) })
      setCatForm({ name: '', description: '', departmentId: '' })
      load()
      showMsg('success', 'Category created!')
    } catch (err) {
      showMsg('error', err.response?.data?.message || 'Failed to create category.')
    }
  }

  return (
    <Layout>
      <div className="mb-6 animate-fade-in">
        <h1 className="text-3xl font-black text-white">Categories & <span className="text-accent-400">Departments</span></h1>
        <p className="text-gray-500 mt-1">Manage complaint categories and departments.</p>
      </div>

      {msg.text && (
        <div className={`mb-4 p-3 rounded-xl flex items-center gap-2 text-sm font-medium animate-fade-in ${
          msg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
        }`}>
          {msg.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />} {msg.text}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-2 border-accent-500 border-t-transparent"></div></div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6 animate-slide-up">
          {/* Departments */}
          <div>
            <div className="dark-card mb-4">
              <h2 className="font-bold text-white mb-4">Add Department</h2>
              <form onSubmit={handleAddDept} className="space-y-3">
                <input className="input-field" placeholder="Department name *" value={deptForm.name}
                  onChange={e => setDeptForm({ ...deptForm, name: e.target.value })} required />
                <input className="input-field" placeholder="Description (optional)" value={deptForm.description}
                  onChange={e => setDeptForm({ ...deptForm, description: e.target.value })} />
                <button type="submit" className="btn-primary text-sm flex items-center gap-1.5">
                  <PlusCircle size={15} /> Add Department
                </button>
              </form>
            </div>
            <div className="dark-card p-0 overflow-hidden">
              <div className="px-4 py-3 border-b border-surface-border bg-dark-800/80">
                <h3 className="font-bold text-sm text-gray-300">Departments ({departments.length})</h3>
              </div>
              <div className="divide-y divide-surface-border">
                {departments.map(d => (
                  <div key={d.id} className="px-4 py-3 hover:bg-dark-700/30 transition-colors">
                    <p className="font-semibold text-sm text-white">{d.name}</p>
                    {d.description && <p className="text-xs text-gray-500 mt-0.5">{d.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <div className="dark-card mb-4">
              <h2 className="font-bold text-white mb-4">Add Category</h2>
              <form onSubmit={handleAddCat} className="space-y-3">
                <input className="input-field" placeholder="Category name *" value={catForm.name}
                  onChange={e => setCatForm({ ...catForm, name: e.target.value })} required />
                <input className="input-field" placeholder="Description (optional)" value={catForm.description}
                  onChange={e => setCatForm({ ...catForm, description: e.target.value })} />
                <select className="input-field" value={catForm.departmentId}
                  onChange={e => setCatForm({ ...catForm, departmentId: e.target.value })} required>
                  <option value="">Select Department *</option>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
                <button type="submit" className="btn-primary text-sm flex items-center gap-1.5">
                  <PlusCircle size={15} /> Add Category
                </button>
              </form>
            </div>
            <div className="dark-card p-0 overflow-hidden">
              <div className="px-4 py-3 border-b border-surface-border bg-dark-800/80">
                <h3 className="font-bold text-sm text-gray-300">Categories ({categories.length})</h3>
              </div>
              <div className="divide-y divide-surface-border max-h-96 overflow-y-auto">
                {categories.map(c => (
                  <div key={c.id} className="px-4 py-3 hover:bg-dark-700/30 transition-colors">
                    <p className="font-semibold text-sm text-white">{c.name}</p>
                    <p className="text-xs text-accent-400 mt-0.5">{c.departmentName}</p>
                    {c.description && <p className="text-xs text-gray-500">{c.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
