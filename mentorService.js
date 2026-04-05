import { supabase } from './supabase.js'

export const getMentors = async ({ subject = '', rating = '' }) => {
  let mentorQuery = supabase.from('mentors').select('*')

  if (subject && subject.trim() !== '') {
    mentorQuery = mentorQuery.contains('subjects', [subject.trim()])
  }

  if (rating && rating !== '') {
    mentorQuery = mentorQuery.gte('rating', Number(rating))
  }

  const { data: mentors, error: mentorError } = await mentorQuery

  if (mentorError) {
    return { data: null, error: mentorError }
  }

  const mentorIds = (mentors || []).map((mentor) => mentor.id)

  let profileMap = {}

  if (mentorIds.length > 0) {
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, avatar_url, bio')
      .in('id', mentorIds)

    if (profileError) {
      return { data: null, error: profileError }
    }

    profileMap = (profiles || []).reduce((acc, profile) => {
      acc[profile.id] = profile
      return acc
    }, {})
  }

  const mergedData = (mentors || []).map((mentor) => ({
    ...mentor,
    avatar_url: profileMap[mentor.id]?.avatar_url || null,
    bio: profileMap[mentor.id]?.bio || null,
  }))

  return { data: mergedData, error: null }
}

export const getMentorDetail = async (mentorId) => {
  const { data: mentor, error: mentorError } = await supabase
    .from('mentors')
    .select('*')
    .eq('id', mentorId)
    .single()

  if (mentorError) throw new Error(mentorError.message)

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, avatar_url, bio, major, skills, interests, experiences, documents')
    .eq('id', mentorId)
    .maybeSingle()

  return {
    ...mentor,
    avatar_url: profile?.avatar_url || null,
    bio: profile?.bio || null,
    major: profile?.major || null,
    skills: profile?.skills || [],
    interests: profile?.interests || [],
    experiences: profile?.experiences || [],
    documents: profile?.documents || [],
  }
}

export const getMentorReviews = async (mentorId) => {
  const { data: reviewRows, error: reviewError } = await supabase
    .from('reviews')
    .select('*')
    .eq('mentor_id', mentorId)
    .order('created_at', { ascending: false })

  if (reviewError) throw new Error(reviewError.message)
  if (!reviewRows || reviewRows.length === 0) return []

  const studentIds = [...new Set(reviewRows.map((r) => r.student_id).filter(Boolean))]

  const [{ data: userRows }, { data: profileRows }] = await Promise.all([
    supabase.from('users').select('id, full_name').in('id', studentIds),
    supabase.from('profiles').select('id, avatar_url, major').in('id', studentIds),
  ])

  const userMap = (userRows || []).reduce((acc, u) => { acc[u.id] = u; return acc }, {})
  const profileMap = (profileRows || []).reduce((acc, p) => { acc[p.id] = p; return acc }, {})

  return reviewRows.map((review) => ({
    ...review,
    student_name: userMap[review.student_id]?.full_name || 'Người dùng',
    student_major: profileMap[review.student_id]?.major || 'Chưa cập nhật',
    reviewer_avatar: profileMap[review.student_id]?.avatar_url || '',
  }))
}

export const checkCanReview = async (mentorId, studentId) => {
  const { data, error } = await supabase
    .from('mentor_sessions')
    .select('id')
    .eq('mentor_id', mentorId)
    .eq('student_id', studentId)
    .maybeSingle()

  if (error) throw new Error(error.message)
  return !!data
}
