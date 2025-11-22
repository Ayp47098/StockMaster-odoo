import express from 'express'
import { z } from 'zod'

const router = express.Router()

const movementSchema = z.object({
  product_id: z.string().min(1),
  type: z.enum(['in', 'out']),
  quantity: z.number().min(0.000001),
  notes: z.string().optional().nullable(),
})

// list movements
router.get('/', async (req, res) => {
  const supabase = req.supabase
  try {
    const { data, error } = await supabase.from('stock_movements').select('*').order('created_at', { ascending: false })
    if (error) throw error
    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message || 'Failed to fetch movements' })
  }
})

// create movement and update product quantity
router.post('/', async (req, res) => {
  const supabase = req.supabase
  try {
    const parsed = movementSchema.parse(req.body)

    // fetch product
    const { data: product, error: pErr } = await supabase.from('products').select('*').eq('id', parsed.product_id).single()
    if (pErr) throw pErr
    if (!product) return res.status(404).json({ error: 'Product not found' })

    const qtyBefore = product.quantity || 0
    const delta = parsed.type === 'in' ? parsed.quantity : -parsed.quantity
    const newQty = qtyBefore + delta

    // update product quantity
    const { error: uErr } = await supabase.from('products').update({ quantity: newQty }).eq('id', parsed.product_id)
    if (uErr) throw uErr

    // insert movement
    const movement = {
      product_id: parsed.product_id,
      type: parsed.type,
      quantity: parsed.quantity,
      notes: parsed.notes || null,
    }

    const { data: mData, error: mErr } = await supabase.from('stock_movements').insert(movement).select().single()
    if (mErr) throw mErr

    res.status(201).json({ movement: mData, product: { ...product, quantity: newQty } })
  } catch (err) {
    console.error(err)
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors })
    res.status(500).json({ error: err.message || 'Failed to record movement' })
  }
})

export default router
