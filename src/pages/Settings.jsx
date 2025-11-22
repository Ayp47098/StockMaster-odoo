import { useState, useEffect } from 'react'
import { supabase } from '../config/supabase'
import { useAuth } from '../context/AuthContext'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Alert } from '../components/ui/Alert'
import { User, Database } from 'lucide-react'

export default function Settings() {
  const { user } = useAuth()
  const [profile, setProfile] = useState({
    full_name: ''
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
          full_name: data.full_name || ''
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
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
        
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <Input
            label="Full Name"
            value={profile.full_name}
            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
            placeholder="Enter your full name"
            required
          />
          
          <div className="p-4 bg-white border-2 border-black rounded">
            <p className="font-bold text-sm text-gray-700 mb-1">Email</p>
            <p className="font-mono text-sm text-gray-600">{user?.email}</p>
            <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
          </div>
          
          <Button 
            type="submit" 
            variant="primary"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
      </Card>

      {/* Database Info */}
      <Card className="bg-green-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-green-500 border-2 border-black">
            <Database size={24} color="white" />
          </div>
          <h2 className="text-2xl font-bold uppercase">Database Information</h2>
        </div>
        <div className="space-y-3">
          <div className="p-4 bg-white border-2 border-black">
            <p className="font-bold text-sm text-gray-700 mb-1">User ID</p>
            <p className="font-mono text-sm break-all">{user?.id}</p>
          </div>
          <div className="p-4 bg-white border-2 border-black">
            <p className="font-bold text-sm text-gray-700 mb-1">Email</p>
            <p className="font-mono text-sm">{user?.email}</p>
          </div>
          <div className="p-4 bg-white border-2 border-black">
            <p className="font-bold text-sm text-gray-700 mb-1">Database Status</p>
            <p className="text-green-600 font-bold flex items-center gap-2">
              <span className="text-2xl">✓</span> Connected to Supabase
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
