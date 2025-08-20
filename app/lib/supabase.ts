import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

// Database types
export interface Receivable {
  id: string
  date: string
  customer_name: string
  amount: number
  city: string
  description?: string
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  receivable_id: string
  payment_date: string
  payment_amount: number
  payment_type: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Customer {
  id: string
  name: string
  cities: string[]
  total_receivables: number
  total_paid: number
  outstanding_balance: number
  created_at: string
  updated_at: string
}
