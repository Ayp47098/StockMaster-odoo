import { useState, useEffect } from 'react'
import { supabase } from '../config/supabase'
import { useAuth } from '../context/AuthContext'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Alert } from '../components/ui/Alert'
import { User, Lock } from 'lucide-react'

export default function Settings() {
  const { user } = useAuth()
  const [profile, setProfile] = useState({
    full_name: '',
    email: ''
  })
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (error) throw error
      
      if (data) {
        setProfile({
          full_name: data.full_name || '',
          email: data.email || user.email
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name
        })
        .eq('id', user.id)
      
      if (updateError) throw updateError
      
      setSuccess('Profile updated successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('Error updating profile:', error)
      setError('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    setError('')
    
    if (passwords.newPassword !== passwords.confirmPassword) {
      return setError('Passwords do not match')
    }
    
    if (passwords.newPassword.length < 6) {
      return setError('Password must be at least 6 characters')
    }
    
    setLoading(true)
    
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: passwords.newPassword
      })
      
      if (updateError) throw updateError
      
      setSuccess('Password updated successfully!')
      setPasswords({ newPassword: '', confirmPassword: '' })
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      console.error('Error updating password:', error)
      setError('Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-4xl font-black uppercase">Settings</h1>

      {error && <Alert variant="danger" onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" onClose={() => setSuccess('')}>{success}</Alert>}

      {/* Profile Settings */}
      <Card className="bg-blue-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-500 border-2 border-black">
            <User size={24} color="white" />
          </div>
          <h2 className="text-2xl font-bold uppercase">Profile Information</h2>
        </div>
        
        <form onSubmit={handleUpdateProfile}>
          <Input
            label="Full Name"
            value={profile.full_name}
            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
          />
          
          <Input
            label="Email"
            value={profile.email}
            disabled
            className="bg-gray-100 cursor-not-allowed"
          />
          
          <Button 
            type="submit" 
            variant="primary"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
      </Card>

      {/* Password Settings */}
      <Card className="bg-orange-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-orange-500 border-2 border-black">
            <Lock size={24} color="white" />
          </div>
          <h2 className="text-2xl font-bold uppercase">Change Password</h2>
        </div>
        
        <form onSubmit={handleUpdatePassword}>
          <Input
            type="password"
            label="New Password"
            value={passwords.newPassword}
            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
            placeholder="••••••••"
          />
          
          <Input
            type="password"
            label="Confirm Password"
            value={passwords.confirmPassword}
            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
            placeholder="••••••••"
          />
          
          <Button 
            type="submit" 
            variant="warning"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Password'}
          </Button>
        </form>
      </Card>

      {/* Database Info */}
      <Card className="bg-green-100">
        <h2 className="text-2xl font-bold uppercase mb-4">Database Information</h2>
        <div className="space-y-2">
          <div className="p-4 bg-white border-2 border-black">
            <p className="font-bold">User ID</p>
            <p className="font-mono text-sm">{user?.id}</p>
          </div>
          <div className="p-4 bg-white border-2 border-black">
            <p className="font-bold">Email</p>
            <p className="font-mono text-sm">{user?.email}</p>
          </div>
          <div className="p-4 bg-white border-2 border-black">
            <p className="font-bold">Database Status</p>
            <p className="text-green-600 font-bold">✓ Connected to Supabase</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
