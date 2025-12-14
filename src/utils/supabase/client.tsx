import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

// Create a singleton Supabase client for the browser
export const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

// API base URL
export const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-8db4ea83`;

// Helper to get authorization headers
export function getAuthHeaders(token?: string): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    headers['Authorization'] = `Bearer ${publicAnonKey}`;
  }
  
  return headers;
}

// Helper to make authenticated API calls
export async function apiCall(
  endpoint: string,
  options: RequestInit = {},
  token?: string
): Promise<Response> {
  const url = `${API_URL}${endpoint}`;
  const headers = getAuthHeaders(token);
  
  return fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });
}
