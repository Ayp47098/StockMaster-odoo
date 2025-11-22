import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Alert } from '../components/ui/Alert'
import { Package, Eye, EyeOff } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setError('')
      setLoading(true)
      await signIn(email, password)
      navigate('/dashboard')
    } catch (error) {
      setError(error.message || 'Failed to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center p-4">
      <div className="card-brutal max-w-md w-full bg-yellow-300">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-black">
              <Package size={40} color="white" />
            </div>
            <h1 className="text-4xl font-black uppercase">StockMaster</h1>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-6 uppercase text-center">Login</h2>
        
        {error && (
          <Alert variant="danger" onClose={() => setError('')} className="mb-4">
            {error}
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] p-2 hover:opacity-70 transition-opacity"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          
          <div className="text-right mb-4">
            <Link to="/forgot-password" className="text-sm font-bold text-blue-600 hover:underline">
              Forgot Password?
            </Link>
          </div>
          
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="w-full mb-4"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
          
          <div className="text-center">
            <p className="font-bold">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-600 hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
