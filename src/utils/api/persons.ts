import { apiCall } from '../supabase/client';
import { Person } from '../../App';

export async function fetchPersons(accessToken: string): Promise<Person[]> {
  try {
    const response = await apiCall('/persons', {}, accessToken);
    if (!response.ok) {
      throw new Error('Failed to fetch persons');
    }
    const data = await response.json();
    return data.persons || [];
  } catch (error) {
    console.error('Fetch persons error:', error);
    return [];
  }
}

export async function fetchPerson(personId: string, accessToken: string): Promise<Person | null> {
  try {
    const response = await apiCall(`/persons/${personId}`, {}, accessToken);
    if (!response.ok) {
      throw new Error('Failed to fetch person');
    }
    const data = await response.json();
    return data.person;
  } catch (error) {
    console.error('Fetch person error:', error);
    return null;
  }
}

export async function createPerson(
  person: Omit<Person, 'id' | 'ownerId' | 'ownerName'>,
  accessToken: string
): Promise<Person | null> {
  try {
    const response = await apiCall('/persons', {
      method: 'POST',
      body: JSON.stringify(person),
    }, accessToken);
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Create person error:', error);
      throw new Error(error.error || 'Failed to create person');
    }
    
    const data = await response.json();
    return data.person;
  } catch (error) {
    console.error('Create person error:', error);
    return null;
  }
}

export async function updatePerson(
  person: Person,
  accessToken: string
): Promise<Person | null> {
  try {
    const response = await apiCall(`/persons/${person.id}`, {
      method: 'PUT',
      body: JSON.stringify(person),
    }, accessToken);
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Update person error:', error);
      throw new Error(error.error || 'Failed to update person');
    }
    
    const data = await response.json();
    return data.person;
  } catch (error) {
    console.error('Update person error:', error);
    return null;
  }
}

export async function deletePerson(
  personId: string,
  accessToken: string
): Promise<boolean> {
  try {
    const response = await apiCall(`/persons/${personId}`, {
      method: 'DELETE',
    }, accessToken);
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Delete person error:', error);
      throw new Error(error.error || 'Failed to delete person');
    }
    
    return true;
  } catch (error) {
    console.error('Delete person error:', error);
    return false;
  }
}

export async function fetchGlobalPersons(accessToken: string): Promise<Person[]> {
  try {
    const response = await apiCall('/search/persons', {}, accessToken);
    if (!response.ok) {
      throw new Error('Failed to fetch global persons');
    }
    const data = await response.json();
    return data.persons || [];
  } catch (error) {
    console.error('Fetch global persons error:', error);
    return [];
  }
}
