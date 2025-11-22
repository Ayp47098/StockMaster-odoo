import express from 'express'
import { z } from 'zod'

const router = express.Router()

const categorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional().nullable(),
})

router.get('/', async (req, res) => {
  const supabase = req.supabase
  try {
    const { data, error } = await supabase.from('categories').select('*')
    if (error) throw error
    res.json(data)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message || 'Failed to fetch categories' })
  }
})

router.post('/', async (req, res) => {
  const supabase = req.supabase
  try {
    const parsed = categorySchema.parse(req.body)
    const { data, error } = await supabase.from('categories').insert(parsed).select().single()
    if (error) throw error
    res.status(201).json(data)
  } catch (err) {
    console.error(err)
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors })
    res.status(500).json({ error: err.message || 'Failed to create category' })
  }
})

router.put('/:id', async (req, res) => {
  const supabase = req.supabase
  const { id } = req.params
  try {
    const parsed = categorySchema.partial().parse(req.body)
    const { data, error } = await supabase.from('categories').update(parsed).eq('id', id).select().single()
    if (error) throw error
    res.json(data)
  } catch (err) {
    console.error(err)
    if (err.name === 'ZodError') return res.status(400).json({ error: err.errors })
    res.status(500).json({ error: err.message || 'Failed to update category' })
  }
})

router.delete('/:id', async (req, res) => {
  const supabase = req.supabase
  const { id } = req.params
  try {
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) throw error
    res.status(204).end()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message || 'Failed to delete category' })
  }
})

export default router
