import { createClient } from '@supabase/supabase-js';

// We pull these directly from VITE's environment variables
// Ensure these exist in your .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
