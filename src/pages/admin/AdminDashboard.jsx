import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/Layout'
import { adminAPI } from '../../api/services'
import { BarChart2, Users, ClipboardList, Settings, Clock, AlertCircle, CheckCircle, FileText, Award } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminAPI.getDashboard()
      .then(r => setStats(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Layout><div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-2 border-accent-500 border-t-transparent"></div></div></Layout>

  return (
    <Layout>
      <div className="mb-8 animate-fade-in">
        <h1 className="text-4xl font-black text-white tracking-tight">
          Admin <span className="text-accent-400">Dashboard</span>
        </h1>
        <p className="text-gray-500 mt-2 font-medium text-lg">System overview and management</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-slide-up">
        {[
          { label: 'Total Complaints', value: stats?.totalComplaints, icon: <FileText size={22} />, color: 'blue' },
          { label: 'Pending', value: stats?.pendingComplaints, icon: <Clock size={22} />, color: 'yellow' },
          { label: 'In Progress', value: stats?.inProgressComplaints, icon: <AlertCircle size={22} />, color: 'indigo' },
          { label: 'Resolved', value: stats?.resolvedComplaints, icon: <CheckCircle size={22} />, color: 'emerald' },
        ].map(stat => (
          <div key={stat.label} className="dark-card">
            <div className={`inline-flex p-3 rounded-xl bg-${stat.color}-500/15 text-${stat.color}-400 mb-3`}>
              {stat.icon}
            </div>
            <p className="text-3xl font-black text-white">{stat.value ?? '—'}</p>
            <p className="text-xs font-semibold text-gray-500 mt-1 uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
        {/* Users */}
        <div className="dark-card">
          <h2 className="font-bold text-white mb-4 flex items-center gap-2">
            <Users size={18} className="text-accent-400" /> User Overview
          </h2>
          <div className="space-y-1">
            {[
              { label: 'Total Users', value: stats?.totalUsers },
              { label: 'Students', value: stats?.totalStudents },
              { label: 'Staff Members', value: stats?.totalStaff },
            ].map(item => (
              <div key={item.label} className="flex justify-between items-center py-3 border-b border-surface-border last:border-0">
                <span className="text-sm text-gray-400">{item.label}</span>
                <span className="font-bold text-white text-lg">{item.value ?? '—'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Department Chart */}
        <div className="dark-card">
          <h2 className="font-bold text-white mb-4 flex items-center gap-2">
            <BarChart2 size={18} className="text-accent-400" /> By Department
          </h2>
          {stats?.complaintsByDepartment && Object.entries(stats.complaintsByDepartment).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(stats.complaintsByDepartment).map(([dept, count]) => {
                const pct = stats.totalComplaints > 0 ? Math.round((count / stats.totalComplaints) * 100) : 0
                return (
                  <div key={dept}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-gray-400 truncate">{dept}</span>
                      <span className="font-bold text-white ml-2">{count}</span>
                    </div>
                    <div className="w-full bg-dark-700 rounded-full h-2">
                      <div className="bg-gradient-to-r from-accent-500 to-accent-400 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-gray-600 text-sm">No data yet.</p>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: '150ms' }}>
        {[
          { to: '/admin/complaints', label: 'Manage Complaints', icon: <ClipboardList size={24} />, color: 'blue' },
          { to: '/admin/users', label: 'Manage Users', icon: <Users size={24} />, color: 'emerald' },
          { to: '/admin/categories', label: 'Categories & Depts', icon: <Settings size={24} />, color: 'purple' },
          { to: '/admin/performance', label: 'Performance Insights', icon: <Award size={24} />, color: 'accent' },
        ].map(link => (
          <Link key={link.to} to={link.to}
            className="dark-card flex flex-col items-center text-center py-8 cursor-pointer group">
            <div className={`p-3 rounded-xl bg-${link.color}-500/15 text-${link.color}-400 mb-3 group-hover:scale-110 transition-transform`}>
              {link.icon}
            </div>
            <span className="text-sm font-semibold text-gray-300 group-hover:text-accent-400 transition-colors">{link.label}</span>
          </Link>
        ))}
      </div>
    </Layout>
  )
}
