import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'
import { StatusBadge, PriorityBadge } from '../components/Badges'
import { complaintAPI } from '../api/services'
import { useAuth } from '../context/AuthContext'
import { ArrowLeft, Send, User } from 'lucide-react'

export default function ComplaintDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [complaint, setComplaint] = useState(null)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [rating, setRating] = useState(0)
  const [ratingLoading, setRatingLoading] = useState(false)

  const fetchComplaint = () => {
    complaintAPI.getById(id)
      .then(r => {
        setComplaint(r.data)
        if (r.data.rating) setRating(r.data.rating)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchComplaint() }, [id])

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!comment.trim()) return
    setSubmitting(true)
    try {
      await complaintAPI.addComment({ content: comment, complaintId: Number(id) })
      setComment('')
      fetchComplaint()
    } catch (err) {
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleStatusUpdate = async (newStatus) => {
    try {
      if (user.role === 'ROLE_STAFF') {
        await complaintAPI.updateStatus(id, newStatus)
      } else if (user.role === 'ROLE_ADMIN') {
        await complaintAPI.adminUpdateStatus(id, newStatus)
      }
      fetchComplaint()
    } catch (err) {
      console.error(err)
    }
  }

  const handleRate = async (value) => {
    setRatingLoading(true)
    try {
      await complaintAPI.rate(id, value)
      setRating(value)
      fetchComplaint()
    } catch (err) {
      console.error(err)
    } finally {
      setRatingLoading(false)
    }
  }

  if (loading) return <Layout><div className="flex justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-2 border-accent-500 border-t-transparent"></div></div></Layout>
  if (!complaint) return <Layout><div className="text-center py-16 text-red-400 font-medium">Complaint not found.</div></Layout>

  const backPath = user?.role === 'ROLE_ADMIN' ? '/admin/complaints'
    : user?.role === 'ROLE_STAFF' ? '/staff'
    : '/student'

  return (
    <Layout>
      <div className="max-w-3xl mx-auto animate-fade-in">
        <button onClick={() => navigate(backPath)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-accent-400 mb-4 transition-colors">
          <ArrowLeft size={16} /> Back
        </button>

        {/* Complaint Info */}
        <div className="dark-card mb-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-white">{complaint.title}</h1>
              <div className="flex items-center gap-2 mt-2">
                <StatusBadge status={complaint.status} />
                <PriorityBadge priority={complaint.priority} />
              </div>
            </div>
            <span className="text-xs text-gray-600 font-mono">#{complaint.id}</span>
          </div>

          <p className="text-gray-400 bg-dark-700/50 rounded-xl p-4 text-sm leading-relaxed border border-surface-border">
            {complaint.description}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 text-sm">
            <div><span className="text-gray-600 text-xs uppercase tracking-wider">Department</span><p className="font-semibold text-gray-300 mt-0.5">{complaint.departmentName}</p></div>
            <div><span className="text-gray-600 text-xs uppercase tracking-wider">Category</span><p className="font-semibold text-gray-300 mt-0.5">{complaint.categoryName}</p></div>
            <div><span className="text-gray-600 text-xs uppercase tracking-wider">Submitted by</span><p className="font-semibold text-gray-300 mt-0.5">{complaint.studentName}</p></div>
            <div><span className="text-gray-600 text-xs uppercase tracking-wider">Assigned to</span><p className="font-semibold text-gray-300 mt-0.5">{complaint.assignedStaffName || '—'}</p></div>
          </div>

          <div className="text-xs text-gray-600 mt-4 pt-3 border-t border-surface-border">
            Created: {new Date(complaint.createdAt).toLocaleString()} ·
            Updated: {new Date(complaint.updatedAt).toLocaleString()}
          </div>
        </div>

        {/* Status Update */}
        {(user?.role === 'ROLE_STAFF' || user?.role === 'ROLE_ADMIN') && (
          <div className="dark-card mb-4">
            <h3 className="font-bold text-gray-300 mb-3 text-sm uppercase tracking-wider">Update Status</h3>
            <div className="flex gap-2">
              {['PENDING', 'IN_PROGRESS', 'RESOLVED'].filter(s => {
                if (user.role === 'ROLE_ADMIN') return s === 'IN_PROGRESS';
                if (user.role === 'ROLE_STAFF') return s === 'RESOLVED';
                return false;
              }).map(s => (
                <button
                  key={s}
                  onClick={() => handleStatusUpdate(s)}
                  disabled={complaint.status === s}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all
                    ${complaint.status === s
                      ? 'bg-accent-500/20 text-accent-400 border border-accent-500/30 cursor-default'
                      : 'border border-surface-border text-gray-500 hover:border-accent-500/30 hover:text-accent-400'}`}
                >
                  {s === 'IN_PROGRESS' ? 'Mark In Progress' : s === 'RESOLVED' ? 'Mark Resolved' : s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Rating Section for Student */}
        {user?.role === 'ROLE_STUDENT' && complaint.status === 'RESOLVED' && (
          <div className="dark-card mb-4">
            <h3 className="font-bold text-gray-300 mb-3 text-sm uppercase tracking-wider">Rate Experience</h3>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => !complaint.rating && handleRate(star)}
                  disabled={!!complaint.rating || ratingLoading}
                  className={`text-2xl transition-all ${
                    star <= (rating || 0) ? 'text-yellow-400' : 'text-gray-600 hover:text-yellow-500/50'
                  } ${!complaint.rating ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
                >
                  ★
                </button>
              ))}
              {complaint.rating && (
                <span className="text-sm text-gray-400 ml-2 font-medium">You rated this {complaint.rating}/5</span>
              )}
            </div>
          </div>
        )}

        {/* Comments */}
        <div className="dark-card">
          <h3 className="font-bold text-white mb-4">
            Comments ({complaint.comments?.length || 0})
          </h3>

          <div className="space-y-3 mb-4">
            {complaint.comments?.length === 0 && (
              <p className="text-gray-600 text-sm text-center py-6">No comments yet.</p>
            )}
            {complaint.comments?.map(c => (
              <div key={c.id} className={`flex gap-3 ${
                c.authorRole === 'ROLE_STUDENT' ? '' : 'flex-row-reverse'
              }`}>
                <div className="w-8 h-8 bg-dark-700 rounded-full flex items-center justify-center flex-shrink-0 border border-surface-border">
                  <User size={14} className="text-gray-500" />
                </div>
                <div className={`flex-1 ${c.authorRole !== 'ROLE_STUDENT' ? 'items-end' : ''} flex flex-col`}>
                  <div className={`rounded-xl px-4 py-2.5 text-sm max-w-[80%] ${
                    c.authorRole === 'ROLE_STUDENT'
                      ? 'bg-dark-700/60 text-gray-300 border border-surface-border'
                      : 'bg-accent-500/15 text-accent-200 border border-accent-500/20'
                  }`}>
                    {c.content}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {c.authorName} · {c.authorRole.replace('ROLE_', '')} · {new Date(c.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              className="input-field flex-1"
              placeholder="Add a comment..."
              value={comment}
              onChange={e => setComment(e.target.value)}
            />
            <button type="submit" disabled={submitting || !comment.trim()}
              className="btn-primary px-5 disabled:opacity-50 flex items-center gap-1.5">
              <Send size={14} /> Send
            </button>
          </form>
        </div>
      </div>
    </Layout>
  )
}
