import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { aiAPI } from '../../api/services'
import { BarChart2, Users, TrendingUp, Zap, Clock, Star, Award, ShieldAlert } from 'lucide-react'

export default function StaffPerformance() {
  const [deptStats, setDeptStats] = useState([])
  const [staffStats, setStaffStats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([aiAPI.getDeptPerformance(), aiAPI.getStaffPerformance()])
      .then(([depts, staff]) => {
        setDeptStats(depts.data)
        setStaffStats(staff.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Layout><div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-2 border-accent-500 border-t-transparent"></div></div></Layout>

  return (
    <Layout>
      <div className="mb-8 animate-fade-in text-center sm:text-left">
        <h1 className="text-4xl font-black text-white tracking-tight">
          Performance <span className="text-accent-400">Insights</span>
        </h1>
        <p className="text-gray-500 mt-2 font-medium text-lg">AI-driven analytics for promotions and efficiency</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-12">
        {/* Department Efficiency */}
        <div className="dark-card h-fit animate-slide-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-500/20 p-2.5 rounded-xl text-blue-400">
              <TrendingUp size={22} />
            </div>
            <h2 className="text-xl font-black text-white">Department Efficiency</h2>
          </div>
          
          <div className="space-y-6">
            {deptStats.map((dept, i) => (
              <div key={dept.departmentName} className="relative animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <span className="text-sm font-bold text-gray-300 block">{dept.departmentName}</span>
                    <span className="text-xs text-gray-500">{dept.totalResolved} resolutions</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-white block">
                      {dept.averageResolutionTimeHours ? `${dept.averageResolutionTimeHours.toFixed(1)}h` : 'N/A'}
                    </span>
                    <span className="text-[10px] text-gray-500 uppercase font-bold">Avg Response</span>
                  </div>
                </div>
                <div className="w-full bg-dark-700 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full bg-gradient-to-r transition-all duration-1000 ${
                      dept.averageResolutionTimeHours > 10 ? 'from-red-500 to-red-400' : 
                      dept.averageResolutionTimeHours > 5 ? 'from-yellow-500 to-yellow-400' : 
                      'from-emerald-500 to-accent-500'
                    }`}
                    style={{ width: `${Math.min(100, (dept.averageResolutionTimeHours || 0) * 10)}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Staff Leaderboard */}
        <div className="dark-card animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-accent-500/20 p-2.5 rounded-xl text-accent-400">
              <Award size={22} />
            </div>
            <h2 className="text-xl font-black text-white">Staff Performance</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-surface-border">
                  <th className="pb-4 text-xs font-black text-gray-500 uppercase tracking-widest">Name</th>
                  <th className="pb-4 text-xs font-black text-gray-500 uppercase tracking-widest text-center">Resolved</th>
                  <th className="pb-4 text-xs font-black text-gray-500 uppercase tracking-widest text-center">Avg Time</th>
                  <th className="pb-4 text-xs font-black text-gray-500 uppercase tracking-widest text-right">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/50">
                {staffStats.sort((a, b) => b.resolvedCount - a.resolvedCount).map((staff, i) => (
                   <tr key={staff.staffId} className="group animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                    <td className="py-4 font-bold text-white text-sm">{staff.staffName}</td>
                    <td className="py-4 text-center">
                      <span className="inline-flex items-center justify-center min-w-[32px] px-2 py-1 rounded-lg bg-dark-700 text-accent-400 text-xs font-black">
                        {staff.resolvedCount}
                      </span>
                    </td>
                    <td className="py-4 text-center font-bold text-gray-400 text-xs">
                      {staff.averageResolutionTimeHours ? `${staff.averageResolutionTimeHours.toFixed(1)}h` : '—'}
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex items-center justify-end gap-1 text-yellow-500">
                        <Star size={12} fill="currentColor" />
                        <span className="font-black text-white text-sm">{staff.averageRating ? staff.averageRating.toFixed(1) : '—'}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {staffStats.length === 0 && (
            <div className="py-12 text-center">
              <ShieldAlert className="mx-auto text-gray-700 mb-3" size={40} />
              <p className="text-gray-500 font-medium">No performance data recorded yet.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
