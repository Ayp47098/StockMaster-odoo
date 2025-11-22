import jwt from 'jsonwebtoken'

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.userId = decoded.userId
    req.userEmail = decoded.email
    
    next()
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

export const errorHandler = (err, req, res, next) => {
  console.error(err.stack)
  
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}
