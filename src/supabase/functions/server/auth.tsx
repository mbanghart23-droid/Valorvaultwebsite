import { createClient } from 'jsr:@supabase/supabase-js@2.49.8';
import * as kv from './kv_store.tsx';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

// Export createClient for use in login/password routes
export { createClient };

export async function verifyToken(authHeader: string | null): Promise<string | null> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  const token = authHeader.substring(7);
  
  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    
    if (error || !user) {
      console.log('Token verification error:', error);
      return null;
    }
    
    return user.id;
  } catch (error) {
    console.log('Token verification exception:', error);
    return null;
  }
}

// Verify token AND check if user is active
export async function verifyActiveUser(authHeader: string | null): Promise<{ userId: string; userProfile: any } | null> {
  const userId = await verifyToken(authHeader);
  
  if (!userId) {
    return null;
  }
  
  const userProfile = await kv.get(`user:${userId}`);
  
  if (!userProfile || !userProfile.isActive) {
    return null;
  }
  
  return { userId, userProfile };
}