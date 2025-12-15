import { apiCall } from '../supabase/client';
import { User } from '../../App';

export async function fetchUsers(accessToken: string): Promise<User[]> {
  try {
    const response = await apiCall('/admin/users', {}, accessToken);
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    const data = await response.json();
    return data.users || [];
  } catch (error) {
    console.error('Fetch users error:', error);
    return [];
  }
}

export async function activateUser(userId: string, accessToken: string): Promise<boolean> {
  try {
    const response = await apiCall(`/admin/users/${userId}/activate`, {
      method: 'PUT',
    }, accessToken);
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Activate user error:', error);
      throw new Error(error.error || 'Failed to activate user');
    }
    
    return true;
  } catch (error) {
    console.error('Activate user error:', error);
    return false;
  }
}

export async function deactivateUser(userId: string, accessToken: string): Promise<boolean> {
  try {
    const response = await apiCall(`/admin/users/${userId}/deactivate`, {
      method: 'PUT',
    }, accessToken);
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Deactivate user error:', error);
      throw new Error(error.error || 'Failed to deactivate user');
    }
    
    return true;
  } catch (error) {
    console.error('Deactivate user error:', error);
    return false;
  }
}

export async function deleteUser(userId: string, accessToken: string): Promise<boolean> {
  try {
    const response = await apiCall(`/admin/users/${userId}`, {
      method: 'DELETE',
    }, accessToken);
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Delete user error:', error);
      throw new Error(error.error || 'Failed to delete user');
    }
    
    return true;
  } catch (error) {
    console.error('Delete user error:', error);
    return false;
  }
}

export async function fetchDropdownStats(accessToken: string): Promise<Record<string, { value: string; usageCount: number }[]>> {
  try {
    const response = await apiCall('/admin/dropdown-stats', {}, accessToken);
    if (!response.ok) {
      throw new Error('Failed to fetch dropdown stats');
    }
    const data = await response.json();
    return data.dropdownData || {};
  } catch (error) {
    console.error('Fetch dropdown stats error:', error);
    return {};
  }
}

export async function renameDropdownValue(
  field: string, 
  oldValue: string, 
  newValue: string, 
  accessToken: string
): Promise<{ success: boolean; updatedCount?: number; error?: string }> {
  try {
    const response = await apiCall('/admin/dropdown-rename', {
      method: 'POST',
      body: JSON.stringify({ field, oldValue, newValue }),
    }, accessToken);
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Rename dropdown value error:', error);
      return { success: false, error: error.error || 'Failed to rename value' };
    }
    
    const data = await response.json();
    return { success: true, updatedCount: data.updatedCount };
  } catch (error) {
    console.error('Rename dropdown value error:', error);
    return { success: false, error: 'Failed to rename value' };
  }
}

export async function mergeDropdownValues(
  field: string, 
  sourceValue: string, 
  targetValue: string, 
  accessToken: string
): Promise<{ success: boolean; updatedCount?: number; error?: string }> {
  try {
    const response = await apiCall('/admin/dropdown-merge', {
      method: 'POST',
      body: JSON.stringify({ field, sourceValue, targetValue }),
    }, accessToken);
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Merge dropdown values error:', error);
      return { success: false, error: error.error || 'Failed to merge values' };
    }
    
    const data = await response.json();
    return { success: true, updatedCount: data.updatedCount };
  } catch (error) {
    console.error('Merge dropdown values error:', error);
    return { success: false, error: 'Failed to merge values' };
  }
}

export async function deleteDropdownValue(
  field: string, 
  value: string, 
  accessToken: string
): Promise<{ success: boolean; updatedCount?: number; error?: string }> {
  try {
    const response = await apiCall('/admin/dropdown-delete', {
      method: 'POST',
      body: JSON.stringify({ field, value }),
    }, accessToken);
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Delete dropdown value error:', error);
      return { success: false, error: error.error || 'Failed to delete value' };
    }
    
    const data = await response.json();
    return { success: true, updatedCount: data.updatedCount };
  } catch (error) {
    console.error('Delete dropdown value error:', error);
    return { success: false, error: 'Failed to delete value' };
  }
}