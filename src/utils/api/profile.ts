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

export async function changePassword(
  currentPassword: string,
  newPassword: string,
  accessToken: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await apiCall('/profile/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    }, accessToken);
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Change password error:', error);
      return { success: false, error: error.error || 'Failed to change password' };
    }
    
    const data = await response.json();
    return { success: true };
  } catch (error) {
    console.error('Change password error:', error);
    return { success: false, error: 'Failed to change password' };
  }
}

export async function deleteAccount(
  password: string,
  accessToken: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await apiCall('/profile/delete-account', {
      method: 'DELETE',
      body: JSON.stringify({ password }),
    }, accessToken);
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Delete account error:', error);
      return { success: false, error: error.error || 'Failed to delete account' };
    }
    
    const data = await response.json();
    return { success: true };
  } catch (error) {
    console.error('Delete account error:', error);
    return { success: false, error: 'Failed to delete account' };
  }
}