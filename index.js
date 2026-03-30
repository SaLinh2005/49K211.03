import express from 'express'
import cors from 'cors'
import { getMentors } from './mentorService.js'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/mentors', async (req, res) => {
  try {
    const { subject = '', rating = '' } = req.query

    const { data, error } = await getMentors({ subject, rating })

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

app.listen(3000, () => {
  console.log('Server running at http://localhost:3000')
})
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