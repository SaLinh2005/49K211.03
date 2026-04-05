import express from 'express'
import cors from 'cors'
import { getMentors, getMentorDetail, getMentorReviews, checkCanReview } from './mentorService.js'
import { supabase } from './supabase.js'

const app = express()

app.use(cors())
app.use(express.json())

// API unread messages count
app.get('/messages/unread-count', async (req, res) => {
  const { receiver_id } = req.query

  if (!receiver_id) return res.json({ count: 0 })

  const { count, error } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('receiver_id', receiver_id)
    .eq('is_read', false)

  if (error) return res.json({ count: 0 })

  return res.json({ count: count || 0 })
})

// API danh sách mentor
app.get('/mentors', async (req, res) => {
  try {
    const { subject = '', rating = '' } = req.query

    console.log('req.query =', { subject, rating })

    const { data, error } = await getMentors({ subject, rating })

    console.log('mentors data =', data)
    console.log('mentors error =', error)

    if (error) {
      return res.status(500).json({
        data: null,
        error: error.message
      })
    }

    return res.json({
      data,
      error: null
    })
  } catch (err) {
    return res.status(500).json({
      data: null,
      error: err.message
    })
  }
})

// API xem chi tiết 1 mentor
app.get('/mentors/:id', async (req, res) => {
  try {
    const { id } = req.params
    const data = await getMentorDetail(id)
    return res.json({ data, error: null })
  } catch (err) {
    return res.status(500).json({ data: null, error: err.message })
  }
})

// API reviews của mentor
app.get('/mentors/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params
    const data = await getMentorReviews(id)
    return res.json({ data, error: null })
  } catch (err) {
    return res.status(500).json({ data: null, error: err.message })
  }
})

// API kiểm tra điều kiện đánh giá
app.get('/mentors/:id/can-review', async (req, res) => {
  try {
    const { id } = req.params
    const { student_id } = req.query
    if (!student_id) return res.json({ canReview: false })
    const canReview = await checkCanReview(id, student_id)
    return res.json({ canReview })
  } catch (err) {
    return res.status(500).json({ canReview: false, error: err.message })
  }
})

// API toggle helpful
app.post('/reviews/:reviewId/helpful', async (req, res) => {
  const { reviewId } = req.params
  const { user_id } = req.body
  if (!user_id) return res.status(400).json({ error: 'user_id required' })

  const { data: existing } = await supabase
    .from('review_helpful')
    .select('id')
    .eq('review_id', reviewId)
    .eq('user_id', user_id)
    .maybeSingle()

  if (existing) {
    await supabase.from('review_helpful').delete().eq('review_id', reviewId).eq('user_id', user_id)
    const { data: current } = await supabase.from('reviews').select('helpful_count').eq('id', reviewId).single()
    const newCount = Math.max(0, (current?.helpful_count || 0) - 1)
    await supabase.from('reviews').update({ helpful_count: newCount }).eq('id', reviewId)
    return res.json({ liked: false, helpful_count: newCount })
  } else {
    await supabase.from('review_helpful').insert({ review_id: reviewId, user_id })
    const { data } = await supabase.from('reviews').select('helpful_count').eq('id', reviewId).single()
    const newCount = (data?.helpful_count || 0) + 1
    await supabase.from('reviews').update({ helpful_count: newCount }).eq('id', reviewId)
    return res.json({ liked: true, helpful_count: newCount })
  }
})

// API lấy danh sách review_id mà user đã helpful
app.get('/reviews/helpful-by-user', async (req, res) => {
  const { user_id } = req.query
  if (!user_id) return res.json({ data: [] })
  const { data } = await supabase.from('review_helpful').select('review_id').eq('user_id', user_id)
  return res.json({ data: (data || []).map(r => r.review_id) })
})

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000')
})
