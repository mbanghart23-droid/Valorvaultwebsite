import { apiCall } from '../supabase/client';

export async function sendSupportMessage(
  subject: string,
  message: string,
  accessToken: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await apiCall('/contact-support', {
      method: 'POST',
      body: JSON.stringify({ subject, message }),
    }, accessToken);
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Send support message error:', error);
      return { success: false, error: error.error || 'Failed to send support message' };
    }
    
    const data = await response.json();
    return { success: true };
  } catch (error) {
    console.error('Send support message error:', error);
    return { success: false, error: 'Failed to send support message' };
  }
}
