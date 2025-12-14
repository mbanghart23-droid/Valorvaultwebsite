import { apiCall } from '../supabase/client';
import { UserProfile } from '../../App';

export async function fetchProfile(accessToken: string): Promise<UserProfile | null> {
  try {
    const response = await apiCall('/profile', {}, accessToken);
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
    const data = await response.json();
    return data.profile;
  } catch (error) {
    console.error('Fetch profile error:', error);
    return null;
  }
}

export async function updateProfile(
  profile: UserProfile,
  accessToken: string
): Promise<UserProfile | null> {
  try {
    const response = await apiCall('/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    }, accessToken);
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Update profile error:', error);
      throw new Error(error.error || 'Failed to update profile');
    }
    
    const data = await response.json();
    return data.profile;
  } catch (error) {
    console.error('Update profile error:', error);
    return null;
  }
}
