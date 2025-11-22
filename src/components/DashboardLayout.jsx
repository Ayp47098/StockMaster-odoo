import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  Settings, 
  LogOut,
  Menu,
  X,
  Bell,
  User
} from 'lucide-react'
import { Button } from '../components/ui/Button'

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { signOut, user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Failed to sign out:', error)
    }
  }

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/dashboard/products', icon: Package },
    { name: 'Categories', path: '/dashboard/categories', icon: ShoppingCart },
    { name: 'Suppliers', path: '/dashboard/suppliers', icon: Users },
    { name: 'Stock Movement', path: '/dashboard/stock-movement', icon: TrendingUp },
    { name: 'Reports', path: '/dashboard/reports', icon: TrendingUp },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white border-b-4 border-black sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 border-2 border-black hover:bg-gray-100 transition-colors"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="p-2 bg-blue-500 border-2 border-black">
                <Package size={24} color="white" />
              </div>
              <h1 className="text-2xl font-black uppercase">StockMaster</h1>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 border-2 border-black hover:bg-gray-100 transition-colors relative">
              <Bell size={24} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-black">
                3
              </span>
            </button>
            
            <div className="flex items-center gap-2 px-4 py-2 border-2 border-black bg-white">
              <User size={20} />
              <span className="font-bold">{user?.email?.split('@')[0]}</span>
            </div>
            
            <Button variant="danger" onClick={handleSignOut}>
              <LogOut size={20} />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'w-64' : 'w-0'
          } bg-white border-r-4 border-black transition-all duration-300 overflow-hidden`}
        >
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 border-2 border-black font-bold transition-all ${
                    active
                      ? 'bg-blue-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                      : 'bg-white hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
