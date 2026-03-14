import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { sharedAPI } from '../api/services'
import {
  Bell, LogOut, Menu, X, Home, PlusCircle,
  ClipboardList, Users, Settings, BarChart2
} from 'lucide-react'

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    sharedAPI.getUnreadCount().then(r => setUnread(r.data.count)).catch(() => {})
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const studentLinks = [
    { to: '/student', label: 'Dashboard', icon: <Home size={16} /> },
    { to: '/student/submit', label: 'New Request', icon: <PlusCircle size={16} /> },
  ]
  const staffLinks = [
    { to: '/staff', label: 'My Complaints', icon: <ClipboardList size={16} /> },
  ]
  const adminLinks = [
    { to: '/admin', label: 'Dashboard', icon: <BarChart2 size={16} /> },
    { to: '/admin/complaints', label: 'All Complaints', icon: <ClipboardList size={16} /> },
    { to: '/admin/users', label: 'Users', icon: <Users size={16} /> },
    { to: '/admin/categories', label: 'Categories', icon: <Settings size={16} /> },
  ]

  const links = user?.role === 'ROLE_ADMIN' ? adminLinks
    : user?.role === 'ROLE_STAFF' ? staffLinks
    : studentLinks

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-dark-900/80 backdrop-blur-xl border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Left: Brand + Nav */}
            <div className="flex items-center gap-8">
              <Link to="/" className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                <span className="w-8 h-8 bg-gradient-to-br from-accent-400 to-accent-600 rounded-lg flex items-center justify-center text-sm">🏫</span>
                Campus<span className="text-accent-400">Portal</span>
              </Link>
              <div className="hidden md:flex items-center gap-1">
                {links.map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                      ${location.pathname === link.to
                        ? 'text-accent-400 bg-accent-500/10'
                        : 'text-gray-400 hover:text-white hover:bg-dark-800'}`}
                  >
                    {link.icon} {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-dark-800 transition-all">
                <Bell size={18} />
                {unread > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-accent-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {unread}
                  </span>
                )}
              </button>
              <div className="hidden md:flex items-center gap-3 ml-2 pl-3 border-l border-surface-border">
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">{user?.fullName}</p>
                  <p className="text-[11px] font-medium text-accent-400 uppercase tracking-wider">{user?.role?.replace('ROLE_', '')}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </div>
              <button className="md:hidden p-2 rounded-lg text-gray-400 hover:bg-dark-800" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-surface-border px-4 pb-4 pt-2 space-y-1 animate-slide-up bg-dark-900/95 backdrop-blur-xl">
            {links.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:text-accent-400 hover:bg-dark-800 transition-all"
              >
                {link.icon} {link.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm font-semibold text-red-400 hover:bg-red-500/10 rounded-lg transition-all mt-2"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        {children}
      </main>
    </div>
  )
}
