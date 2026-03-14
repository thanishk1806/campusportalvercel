import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import { StatusBadge, PriorityBadge } from '../../components/Badges'
import { complaintAPI } from '../../api/services'
import { useAuth } from '../../context/AuthContext'
import { PlusCircle, FileText, Clock, CheckCircle, AlertCircle, Building2, Monitor, Hotel, GraduationCap, BookOpen, Shield, Briefcase } from 'lucide-react'

const categoryIcons = {
  INFRASTRUCTURE: <Building2 size={18} />,
  IT_SUPPORT: <Monitor size={18} />,
  HOSTEL: <Hotel size={18} />,
  ACADEMIC: <GraduationCap size={18} />,
  LIBRARY: <BookOpen size={18} />,
  SECURITY: <Shield size={18} />,
  ADMINISTRATION: <Briefcase size={18} />,
}

export default function StudentDashboard() {
  const { user } = useAuth()
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    complaintAPI.getMyComplaints()
      .then(r => setComplaints(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'PENDING').length,
    inProgress: complaints.filter(c => c.status === 'IN_PROGRESS').length,
    resolved: complaints.filter(c => c.status === 'RESOLVED').length,
  }

  const filtered = filter === 'ALL' ? complaints : complaints.filter(c => c.status === filter)

  return (
    <Layout>
      {/* Hero */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-black text-white tracking-tight">
          Welcome back, <span className="text-accent-400">{user?.fullName?.split(' ')[0]}</span> 👋
        </h1>
        <p className="text-gray-500 mt-2 font-medium text-lg">Track and manage your campus requests effortlessly.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-slide-up">
        {[
          { label: 'Total Requests', value: stats.total, icon: <FileText size={22} />, color: 'blue' },
          { label: 'Pending', value: stats.pending, icon: <Clock size={22} />, color: 'yellow' },
          { label: 'In Progress', value: stats.inProgress, icon: <AlertCircle size={22} />, color: 'indigo' },
          { label: 'Resolved', value: stats.resolved, icon: <CheckCircle size={22} />, color: 'emerald' },
        ].map(stat => (
          <div key={stat.label} className="dark-card flex items-center gap-4 group cursor-default">
            <div className={`p-3 rounded-xl bg-${stat.color}-500/15 text-${stat.color}-400 group-hover:scale-110 transition-transform duration-300`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-3xl font-black text-white tracking-tight">{stat.value}</p>
              <p className="text-xs font-semibold text-gray-500 mt-0.5 uppercase tracking-wider">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 mb-6 animate-slide-up" style={{ animationDelay: '50ms' }}>
        {Object.entries(categoryIcons).map(([name, icon]) => (
          <span key={name} className="flex items-center gap-2 px-4 py-2 bg-dark-800/60 border border-surface-border rounded-xl text-xs font-semibold text-gray-400 hover:text-accent-400 hover:border-accent-500/30 transition-all cursor-default">
            <span className="text-accent-500/70">{icon}</span>
            {name.replace('_', ' ')}
          </span>
        ))}
      </div>

      {/* Filter + Action */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4 animate-slide-up" style={{ animationDelay: '100ms' }}>
        <div className="flex bg-dark-800/60 p-1 rounded-xl border border-surface-border overflow-x-auto w-full sm:w-auto">
          {['ALL', 'PENDING', 'IN_PROGRESS', 'RESOLVED'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs px-4 py-2 rounded-lg font-bold transition-all whitespace-nowrap ${
                filter === f
                  ? 'bg-accent-500/15 text-accent-400'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
        <Link to="/student/submit" className="btn-primary flex items-center gap-2 text-sm w-full sm:w-auto">
          <PlusCircle size={18} /> New Request
        </Link>
      </div>

      {/* Complaints List */}
      <div className="animate-slide-up" style={{ animationDelay: '150ms' }}>
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-accent-500 border-t-transparent"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="dark-card text-center py-16">
            <div className="w-16 h-16 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText size={32} className="text-gray-600" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">No requests found</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">You haven't submitted any requests that match this filter yet.</p>
            <Link to="/student/submit" className="btn-primary inline-flex gap-2">
              <PlusCircle size={18} /> Create Request
            </Link>
          </div>
        ) : (
          <div className="grid gap-3">
            {filtered.map(c => (
              <Link key={c.id} to={`/complaints/${c.id}`} className="dark-card block group">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-base font-bold text-white group-hover:text-accent-400 transition-colors">{c.title}</h3>
                      <StatusBadge status={c.status} />
                      <PriorityBadge priority={c.priority} />
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-1 mb-3">{c.description}</p>
                    <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-gray-500">
                      <span className="flex items-center gap-1.5 bg-dark-700/60 px-2.5 py-1 rounded-lg">
                        📂 {c.categoryName}
                      </span>
                      <span className="flex items-center gap-1.5 bg-dark-700/60 px-2.5 py-1 rounded-lg">
                        🏢 {c.departmentName}
                      </span>
                      <span className="flex items-center gap-1.5 bg-dark-700/60 px-2.5 py-1 rounded-lg">
                        📅 {new Date(c.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center">
                    <span className="text-gray-600 text-sm font-mono">#{c.id}</span>
                    <span className="text-accent-400 font-semibold text-sm flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      View &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
