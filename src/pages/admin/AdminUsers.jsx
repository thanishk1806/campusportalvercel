import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { adminAPI } from '../../api/services'
import { Search } from 'lucide-react'

const ROLE_COLORS = {
  ROLE_ADMIN: 'bg-red-500/15 text-red-400 border border-red-500/20',
  ROLE_STAFF: 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
  ROLE_STUDENT: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
}

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')

  useEffect(() => {
    adminAPI.getUsers()
      .then(r => setUsers(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = users.filter(u => {
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter
    const matchSearch = !search ||
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    return matchRole && matchSearch
  })

  return (
    <Layout>
      <div className="mb-6 animate-fade-in">
        <h1 className="text-3xl font-black text-white">User <span className="text-accent-400">Management</span></h1>
        <p className="text-gray-500 mt-1">View all registered users.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5 animate-slide-up">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
          <input className="input-field pl-9" placeholder="Search users..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex bg-dark-800/60 p-1 rounded-xl border border-surface-border">
          {['ALL', 'ROLE_STUDENT', 'ROLE_STAFF', 'ROLE_ADMIN'].map(r => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
                roleFilter === r ? 'bg-accent-500/15 text-accent-400' : 'text-gray-500 hover:text-gray-300'
              }`}>
              {r === 'ALL' ? 'All' : r.replace('ROLE_', '')}
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
                  {['#', 'Name', 'Username', 'Email', 'Role', 'Department', 'Status'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="text-center py-12 text-gray-600">No users found.</td></tr>
                )}
                {filtered.map(u => (
                  <tr key={u.id} className="hover:bg-dark-700/30 transition-colors">
                    <td className="px-4 py-3 text-gray-600">{u.id}</td>
                    <td className="px-4 py-3 font-semibold text-white">{u.fullName}</td>
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">{u.username}</td>
                    <td className="px-4 py-3 text-gray-400">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${ROLE_COLORS[u.role]}`}>
                        {u.role?.replace('ROLE_', '')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400">{u.departmentName || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        u.active ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/15 text-red-400 border border-red-500/20'
                      }`}>
                        {u.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-surface-border text-xs text-gray-600">
            Showing {filtered.length} of {users.length} users
          </div>
        </div>
      )}
    </Layout>
  )
}
