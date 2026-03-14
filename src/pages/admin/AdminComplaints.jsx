import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import { StatusBadge, PriorityBadge } from '../../components/Badges'
import { complaintAPI, adminAPI } from '../../api/services'
import { Search } from 'lucide-react'

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([])
  const [staff, setStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [search, setSearch] = useState('')

  useEffect(() => {
    Promise.all([complaintAPI.getAll(), adminAPI.getUsers()])
      .then(([complaints, users]) => {
        setComplaints(complaints.data)
        setStaff(users.data.filter(u => u.role === 'ROLE_STAFF'))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleAssign = async (complaintId, staffId) => {
    try {
      const res = await complaintAPI.assign(complaintId, Number(staffId))
      setComplaints(prev => prev.map(c => c.id === complaintId ? res.data : c))
    } catch (err) { console.error(err) }
  }

  const handleStatusChange = async (complaintId, status) => {
    try {
      const res = await complaintAPI.adminUpdateStatus(complaintId, status)
      setComplaints(prev => prev.map(c => c.id === complaintId ? res.data : c))
    } catch (err) { console.error(err) }
  }

  const filtered = complaints.filter(c => {
    const matchStatus = filter === 'ALL' || c.status === filter
    const matchSearch = !search ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.studentName.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  return (
    <Layout>
      <div className="mb-6 animate-fade-in">
        <h1 className="text-3xl font-black text-white">All <span className="text-accent-400">Complaints</span></h1>
        <p className="text-gray-500 mt-1">View, assign, and manage all complaints.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5 animate-slide-up">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
          <input className="input-field pl-9" placeholder="Search by title or student name..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex bg-dark-800/60 p-1 rounded-xl border border-surface-border">
          {['ALL', 'PENDING', 'IN_PROGRESS', 'RESOLVED'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
                filter === f ? 'bg-accent-500/15 text-accent-400' : 'text-gray-500 hover:text-gray-300'
              }`}>
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-2 border-accent-500 border-t-transparent"></div></div>
      ) : (
        <div className="dark-card overflow-hidden p-0 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-dark-800/80 border-b border-surface-border">
                <tr>
                  {['#', 'Title', 'Student', 'Department', 'Status', 'Priority', 'Assigned To', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="text-center py-12 text-gray-600">No complaints found.</td></tr>
                )}
                {filtered.map(c => (
                  <tr key={c.id} className="hover:bg-dark-700/30 transition-colors">
                    <td className="px-4 py-3 text-gray-600 font-mono">#{c.id}</td>
                    <td className="px-4 py-3">
                      <Link to={`/complaints/${c.id}`} className="font-semibold text-accent-400 hover:text-accent-300 line-clamp-1">{c.title}</Link>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{c.studentName}</td>
                    <td className="px-4 py-3 text-gray-400">{c.departmentName}</td>
                    <td className="px-4 py-3">
                      <select className="text-xs bg-dark-700 border border-surface-border rounded-lg px-2 py-1.5 text-gray-300 focus:outline-none focus:ring-1 focus:ring-accent-500/50"
                        value={c.status} onChange={e => handleStatusChange(c.id, e.target.value)}>
                        {['PENDING', 'IN_PROGRESS', 'RESOLVED'].map(s => (
                          <option key={s} value={s}>{s.replace('_', ' ')}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3"><PriorityBadge priority={c.priority} /></td>
                    <td className="px-4 py-3">
                      <select className="text-xs bg-dark-700 border border-surface-border rounded-lg px-2 py-1.5 text-gray-300 min-w-[120px] focus:outline-none focus:ring-1 focus:ring-accent-500/50"
                        value={c.assignedStaffId || ''} onChange={e => handleAssign(c.id, e.target.value)}>
                        <option value="">Unassigned</option>
                        {staff.filter(s => !c.departmentId || s.departmentId === c.departmentId).map(s => (
                          <option key={s.id} value={s.id}>{s.fullName}</option>
                        ))}
                        {staff.filter(s => c.departmentId && s.departmentId !== c.departmentId).length > 0 && (
                          <>
                            <option disabled>── Other Staff ──</option>
                            {staff.filter(s => c.departmentId && s.departmentId !== c.departmentId).map(s => (
                              <option key={s.id} value={s.id}>{s.fullName} ({s.departmentName})</option>
                            ))}
                          </>
                        )}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/complaints/${c.id}`} className="text-accent-400 hover:text-accent-300 text-xs font-semibold">View →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Layout>
  )
}
