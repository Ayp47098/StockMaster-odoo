import { supabaseAdmin } from '../lib/supabaseAdmin.js'

/**
 * Auth middleware to verify Supabase JWT tokens
 * Extracts and validates the token from Authorization header
 * Adds user info to req.user for downstream handlers
 */
export async function authenticateUser(req, res, next) {
  try {
    // Extract token from Authorization header (Bearer <token>)
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' })
    }

    const token = authHeader.substring(7) // Remove "Bearer " prefix

    // Verify the JWT using Supabase admin client
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
    
    if (error || !user) {
      console.error('Auth error:', error?.message || 'No user found')
      return res.status(401).json({ error: 'Invalid or expired token' })
    }

    // Attach user info to request for use in route handlers
    req.user = user
    req.userId = user.id

    next()
  } catch (err) {
    console.error('Auth middleware error:', err)
    return res.status(500).json({ error: 'Authentication failed' })
  }
}

/**
 * Optional auth middleware - allows requests with or without auth
 * If token is present and valid, sets req.user; otherwise continues without user
 */
export async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next() // No token, continue without user
    }

    const token = authHeader.substring(7)
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)
    
    if (!error && user) {
      req.user = user
      req.userId = user.id
    }

    next()
  } catch (err) {
    // Don't fail request, just continue without user
    console.warn('Optional auth error:', err)
    next()
  }
}
