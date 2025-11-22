import express from 'express'

const router = express.Router()

// Get dashboard analytics
router.get('/dashboard', async (req, res) => {
  const supabase = req.supabase
  try {
    // Fetch key metrics in parallel
    const [productsRes, categoriesRes, suppliersRes, movementsRes, alertsRes] = await Promise.all([
      supabase.from('products').select('id, quantity, cost_price, selling_price'),
      supabase.from('categories').select('id'),
      supabase.from('suppliers').select('id'),
      supabase.from('stock_movements').select('id, type, quantity, created_at').order('created_at', { ascending: false }).limit(10),
      supabase.from('alerts').select('id, type, message, status').eq('status', 'active'),
    ])

    const products = productsRes.data || []
    const categories = categoriesRes.data || []
    const suppliers = suppliersRes.data || []
    const movements = movementsRes.data || []
    const alerts = alertsRes.data || []

    // Calculate metrics
    const totalProducts = products.length
    const lowStockProducts = products.filter(p => (p.quantity || 0) < 10).length
    const totalValue = products.reduce((sum, p) => sum + ((p.quantity || 0) * (p.cost_price || 0)), 0)
    const potentialRevenue = products.reduce((sum, p) => sum + ((p.quantity || 0) * (p.selling_price || 0)), 0)

    res.json({
      totals: {
        products: totalProducts,
        categories: categories.length,
        suppliers: suppliers.length,
        lowStock: lowStockProducts,
      },
      inventory: {
        totalValue: Math.round(totalValue * 100) / 100,
        potentialRevenue: Math.round(potentialRevenue * 100) / 100,
      },
      recentMovements: movements,
      alerts,
    })
  } catch (err) {
    console.error('Dashboard analytics error:', err)
    res.status(500).json({ error: err.message || 'Failed to fetch dashboard data' })
  }
})

// Get inventory value report
router.get('/inventory-value', async (req, res) => {
  const supabase = req.supabase
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, sku, quantity, cost_price, selling_price')
      .order('name')

    if (error) throw error

    const report = products.map(p => ({
      ...p,
      totalCost: Math.round((p.quantity || 0) * (p.cost_price || 0) * 100) / 100,
      totalValue: Math.round((p.quantity || 0) * (p.selling_price || 0) * 100) / 100,
      potentialProfit: Math.round((p.quantity || 0) * ((p.selling_price || 0) - (p.cost_price || 0)) * 100) / 100,
    }))

    const summary = {
      totalCost: report.reduce((sum, p) => sum + p.totalCost, 0),
      totalValue: report.reduce((sum, p) => sum + p.totalValue, 0),
      potentialProfit: report.reduce((sum, p) => sum + p.potentialProfit, 0),
    }

    res.json({ report, summary })
  } catch (err) {
    console.error('Inventory value report error:', err)
    res.status(500).json({ error: err.message || 'Failed to generate inventory value report' })
  }
})

// Get stock movement history report
router.get('/stock-movements', async (req, res) => {
  const supabase = req.supabase
  try {
    const { startDate, endDate, productId } = req.query

    let query = supabase
      .from('stock_movements')
      .select('id, product_id, type, quantity, notes, created_at')
      .order('created_at', { ascending: false })

    if (startDate) {
      query = query.gte('created_at', startDate)
    }
    if (endDate) {
      query = query.lte('created_at', endDate)
    }
    if (productId) {
      query = query.eq('product_id', productId)
    }

    const { data: movements, error } = await query

    if (error) throw error

    res.json({ movements, count: movements.length })
  } catch (err) {
    console.error('Stock movements report error:', err)
    res.status(500).json({ error: err.message || 'Failed to generate stock movements report' })
  }
})

// Get low stock products report
router.get('/low-stock', async (req, res) => {
  const supabase = req.supabase
  try {
    const threshold = parseInt(req.query.threshold) || 10

    const { data: products, error } = await supabase
      .from('products')
      .select('id, name, sku, quantity, reorder_level')
      .lt('quantity', threshold)
      .order('quantity', { ascending: true })

    if (error) throw error

    res.json({ products, threshold, count: products.length })
  } catch (err) {
    console.error('Low stock report error:', err)
    res.status(500).json({ error: err.message || 'Failed to generate low stock report' })
  }
})

export default router
