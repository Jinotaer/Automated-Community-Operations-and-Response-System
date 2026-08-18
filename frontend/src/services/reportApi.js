import { supabase } from './supabase'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * Create a new report in Supabase
 */
export async function createReport({
  title,
  description,
  category,
  priority,
  department,
  photo_url,
  latitude,
  longitude,
  contact_name = '',
  contact_number = '',
  contact_email = '',
}) {
  try {
    const { data, error } = await supabase
      .from('reports')
      .insert([
        {
          title,
          description,
          category,
          priority,
          department,
          photo_url,
          latitude,
          longitude,
          contact_name,
          contact_number,
          contact_email,
          status: 'submitted',
        },
      ])
      .select()

    if (error) throw error
    return { success: true, data: data?.[0] }
  } catch (error) {
    console.error('Error creating report:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Call the draft-report function to get AI analysis
 */
export async function callDraftReport(photoUrl, latitude, longitude) {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/draft-report`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          photo_url: photoUrl,
          title: '',
          description: '',
          latitude,
          longitude,
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error('Error calling draft-report function:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get all reports with optional filters
 */
export async function getReports(filters = {}) {
  try {
    let query = supabase.from('reports').select('*')

    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    if (filters.category) {
      query = query.eq('category', filters.category)
    }

    query = query.order('created_at', { ascending: false })

    const { data, error } = await query

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error fetching reports:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get a single report by ID
 */
export async function getReport(reportId) {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', reportId)
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error fetching report:', error)
    return { success: false, error: error.message }
  }
}
