import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Alert } from '../components/ui/Alert'
import { Package, Eye, EyeOff } from 'lucide-react'

export default function SignUp() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match')
    }
    
    if (password.length < 6) {
      return setError('Password must be at least 6 characters')
    }
    
    try {
      setError('')
      setLoading(true)
      await signUp(email, password, fullName)
      setSuccess(true)
      setTimeout(() => navigate('/dashboard'), 2000)
    } catch (error) {
      setError(error.message || 'Failed to create an account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-400 to-purple-400 flex items-center justify-center p-4">
      <div className="card-brutal max-w-md w-full bg-pink-300">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-black">
              <Package size={40} color="white" />
            </div>
            <h1 className="text-4xl font-black uppercase">StockMaster</h1>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-6 uppercase text-center">Create Account</h2>
        
        {error && (
          <Alert variant="danger" onClose={() => setError('')} className="mb-4">
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert variant="success" className="mb-4">
            Account created successfully! Redirecting to dashboard...
          </Alert>
        )}
        
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            label="Full Name"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          
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
          
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              label="Confirm Password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-[38px] p-2 hover:opacity-70 transition-opacity"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          
          <Button
            type="submit"
            variant="success"
            disabled={loading}
            className="w-full mb-4"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </Button>
          
          <div className="text-center">
            <p className="font-bold">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
