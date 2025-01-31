import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';
import toast from 'react-hot-toast';

// Ensure environment variables exist
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please connect to Supabase using the "Connect to Supabase" button.');
}

// Create Supabase client with retry logic and better error handling
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'X-Client-Info': 'rizzumeit'
    }
  },
  // Add retry configuration
  realtime: {
    params: {
      eventsPerSecond: 2
    }
  }
});

// Create a wrapper for Supabase operations with retry logic
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: any;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      
      // Check if we should retry based on error type
      if (error.message?.includes('Failed to fetch') || error.code === 'NETWORK_ERROR') {
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
          continue;
        }
      }
      
      // Don't retry for other types of errors
      break;
    }
  }

  // Show user-friendly error message
  const errorMessage = getErrorMessage(lastError);
  toast.error(errorMessage);
  
  throw lastError;
}

// Helper to get user-friendly error messages
function getErrorMessage(error: any): string {
  if (!error) return 'An unknown error occurred';

  if (error.message?.includes('Failed to fetch')) {
    return 'Connection failed. Please check your internet connection and try again.';
  }

  if (error.code === 'NETWORK_ERROR') {
    return 'Network error. Please check your connection and try again.';
  }

  if (error.code === '23505') {
    return 'This record already exists.';
  }

  if (error.code === '23503') {
    return 'Related record not found.';
  }

  return error.message || 'An unexpected error occurred';
}