import { createClient } from '@supabase/supabase-js';

// We pull these directly from VITE's environment variables
// Ensure these exist in your .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://dummy.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "dummy";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
