import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Loading } from '../components/ui/Loading'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" />
  }

  return children
}
