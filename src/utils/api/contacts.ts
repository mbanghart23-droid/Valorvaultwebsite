import { apiCall } from '../supabase/client';
import { ContactRequest } from '../../App';

export async function fetchContactRequests(accessToken: string): Promise<ContactRequest[]> {
  try {
    const response = await apiCall('/contact-requests', {}, accessToken);
    if (!response.ok) {
      throw new Error('Failed to fetch contact requests');
    }
    const data = await response.json();
    return data.requests || [];
  } catch (error) {
    console.error('Fetch contact requests error:', error);
    return [];
  }
}

export async function sendContactRequest(
  personId: string,
  toUserId: string,
  message: string,
  accessToken: string
): Promise<ContactRequest | null> {
  try {
    const response = await apiCall('/contact-requests', {
      method: 'POST',
      body: JSON.stringify({ personId, toUserId, message }),
    }, accessToken);
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Send contact request error:', error);
      throw new Error(error.error || 'Failed to send contact request');
    }
    
    const data = await response.json();
    return data.request;
  } catch (error) {
    console.error('Send contact request error:', error);
    return null;
  }
}

export async function approveContactRequest(
  requestId: string,
  accessToken: string
): Promise<boolean> {
  try {
    const response = await apiCall(`/contact-requests/${requestId}/approve`, {
      method: 'PUT',
    }, accessToken);
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Approve request error:', error);
      throw new Error(error.error || 'Failed to approve request');
    }
    
    return true;
  } catch (error) {
    console.error('Approve request error:', error);
    return false;
  }
}

export async function declineContactRequest(
  requestId: string,
  accessToken: string
): Promise<boolean> {
  try {
    const response = await apiCall(`/contact-requests/${requestId}/decline`, {
      method: 'PUT',
    }, accessToken);
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Decline request error:', error);
      throw new Error(error.error || 'Failed to decline request');
    }
    
    return true;
  } catch (error) {
    console.error('Decline request error:', error);
    return false;
  }
}
