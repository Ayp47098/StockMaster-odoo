import express from 'express'
import { supabase } from '../config/database.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const router = express.Router()

// Sign up
router.post('/signup', async (req, res) => {
  try {
    const { email, password, fullName } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName
      }
    })

    if (authError) {
      return res.status(400).json({ error: authError.message })
    }

    // Create profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([{
        id: authData.user.id,
        email: email,
        full_name: fullName
      }])

    if (profileError) {
      console.error('Profile creation error:', profileError)
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: authData.user.id, email: email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: authData.user.id,
        email: email,
        fullName: fullName
      }
    })
  } catch (error) {
    console.error('Signup error:', error)
    res.status(500).json({ error: 'Failed to create user' })
  }
})

// Sign in
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: data.user.id, email: data.user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Get profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: data.user.id,
        email: data.user.email,
        fullName: profile?.full_name
      }
    })
  } catch (error) {
    console.error('Signin error:', error)
    res.status(500).json({ error: 'Failed to sign in' })
  }
})

// Get current user profile
router.get('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', decoded.userId)
      .single()

    if (error) {
      return res.status(404).json({ error: 'Profile not found' })
    }

    res.json({
      id: profile.id,
      email: profile.email,
      fullName: profile.full_name,
      createdAt: profile.created_at
    })
  } catch (error) {
    console.error('Profile fetch error:', error)
    res.status(500).json({ error: 'Failed to fetch profile' })
  }
})

// Update profile
router.put('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const { fullName } = req.body

    const { data, error } = await supabase
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', decoded.userId)
      .select()
      .single()

    if (error) {
      return res.status(400).json({ error: error.message })
    }

    res.json({
      message: 'Profile updated successfully',
      profile: data
    })
  } catch (error) {
    console.error('Profile update error:', error)
    res.status(500).json({ error: 'Failed to update profile' })
  }
})

export default router
