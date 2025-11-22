import express from 'express'
import { z } from 'zod'

const router = express.Router()

const supplierSchema = z.object({
  name: z.string().min(1),
  contact_email: z.string().email().optional().nullable(),
  contact_phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
})

router.get('/', async (req, res) => {
  const supabase = req.supabase
  try {
    const { data, error } = await supabase.from('suppliers').select('*')
    if (error) throw error
    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message || 'Failed to fetch suppliers' })
  }
})

router.post('/', async (req, res) => {
  const supabase = req.supabase
  try {
    const parsed = supplierSchema.parse(req.body)
    const { data, error } = await supabase.from('suppliers').insert(parsed).select().single()
    if (error) throw error
    res.status(201).json(data)
  } catch (err) {
    console.error(err)
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors })
    res.status(500).json({ error: err.message || 'Failed to create supplier' })
  }
})

router.put('/:id', async (req, res) => {
  const supabase = req.supabase
  const { id } = req.params
  try {
    const parsed = supplierSchema.partial().parse(req.body)
    const { data, error } = await supabase.from('suppliers').update(parsed).eq('id', id).select().single()
    if (error) throw error
    res.json(data)
  } catch (err) {
    console.error(err)
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors })
    res.status(500).json({ error: err.message || 'Failed to update supplier' })
  }
})

router.delete('/:id', async (req, res) => {
  const supabase = req.supabase
  const { id } = req.params
  try {
    const { error } = await supabase.from('suppliers').delete().eq('id', id)
    if (error) throw error
    res.status(204).end()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message || 'Failed to delete supplier' })
  }
})

export default router
