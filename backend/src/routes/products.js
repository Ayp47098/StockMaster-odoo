import express from 'express'
import { z } from 'zod'

const router = express.Router()

const productSchema = z.object({
  name: z.string().min(1),
  sku: z.string().optional().nullable(),
  category_id: z.string().optional().nullable(),
  supplier_id: z.string().optional().nullable(),
  cost_price: z.number().optional().nullable(),
  selling_price: z.number().optional().nullable(),
  quantity: z.number().optional().default(0),
  reorder_level: z.number().optional().nullable(),
})

// list products
router.get('/', async (req, res) => {
  const supabase = req.supabase
  try {
    const { data, error } = await supabase.from('products').select('*')
    if (error) throw error
    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message || 'Failed to fetch products' })
  }
})

// get single
router.get('/:id', async (req, res) => {
  const supabase = req.supabase
  const { id } = req.params
  try {
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single()
    if (error) return res.status(404).json({ error: 'Not found' })
    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message || 'Failed to fetch product' })
  }
})

// create
router.post('/', async (req, res) => {
  const supabase = req.supabase
  try {
    const parsed = productSchema.parse(req.body)
    const { data, error } = await supabase.from('products').insert(parsed).select().single()
    if (error) throw error
    res.status(201).json(data)
  } catch (err) {
    console.error(err)
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors })
    res.status(500).json({ error: err.message || 'Failed to create product' })
  }
})

// update
router.put('/:id', async (req, res) => {
  const supabase = req.supabase
  const { id } = req.params
  try {
    const parsed = productSchema.partial().parse(req.body)
    const { data, error } = await supabase.from('products').update(parsed).eq('id', id).select().single()
    if (error) throw error
    res.json(data)
  } catch (err) {
    console.error(err)
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors })
    res.status(500).json({ error: err.message || 'Failed to update product' })
  }
})

// delete
router.delete('/:id', async (req, res) => {
  const supabase = req.supabase
  const { id } = req.params
  try {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) throw error
    res.status(204).end()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message || 'Failed to delete product' })
  }
})

export default router
