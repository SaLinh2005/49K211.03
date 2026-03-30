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