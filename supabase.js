import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://amaqvdpfwplrezzevodh.supabase.co'
const supabaseAnonKey = 'sb_publishable_VEJHAFPUd2VdVzLMhoKssg_p2Wboo5n'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
