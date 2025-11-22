import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'

import productsRouter from './routes/products.js'
import categoriesRouter from './routes/categories.js'
import suppliersRouter from './routes/suppliers.js'
import stockRouter from './routes/stock.js'
import reportsRouter from './routes/reports.js'
import { supabaseAdmin } from './lib/supabaseAdmin.js'
import { authenticateUser } from './middleware/auth.js'

dotenv.config()

const PORT = process.env.PORT || 54321

const app = express()
app.use(express.json())

const FRONTEND = process.env.FRONTEND_ORIGIN || 'http://localhost:5173'
app.use(cors({ 
  origin: FRONTEND,
  credentials: true // Allow cookies/auth headers
}))

// Public health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

// provide a small way for routes to access admin client if needed
app.use((req, _res, next) => {
  req.supabase = supabaseAdmin
  next()
})

// Mount routers - all protected with auth middleware
app.use('/api/products', authenticateUser, productsRouter)
app.use('/api/categories', authenticateUser, categoriesRouter)
app.use('/api/suppliers', authenticateUser, suppliersRouter)
app.use('/api/stock-movements', authenticateUser, stockRouter)
app.use('/api/reports', authenticateUser, reportsRouter)

app.listen(PORT, () => {
  console.log(`StockMaster backend running at http://localhost:${PORT}`)
})
