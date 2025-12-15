import { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner@2.0.3';
import { AuthProvider, useAuth } from './utils/auth/AuthContext';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Dashboard } from './components/Dashboard';
import { Profile } from './components/Profile';
import { PersonForm } from './components/PersonForm';
import { PersonDetail } from './components/PersonDetail';
import { Notifications } from './components/Notifications';
import { Admin } from './components/Admin';
import { ContactSupport } from './components/ContactSupport';
import { LandingPage } from './components/LandingPage';
import { TermsOfService } from './components/TermsOfService';
import { PrivacyPolicy } from './components/PrivacyPolicy';
import { ForgotPassword } from './components/ForgotPassword';
import { ResetPassword } from './components/ResetPassword';
import { ConfirmDialog } from './components/ConfirmDialog';
import * as personsApi from './utils/api/persons';
import * as profileApi from './utils/api/profile';
import * as contactsApi from './utils/api/contacts';
import * as adminApi from './utils/api/admin';

export interface PersonMedal {
  id: string;
  name: string;
  country: string;
  branch: string;
  era: string;
  dateAwarded?: string;
  condition?: string;
  description?: string;
  category: string;
  inCollection: boolean;
  acquisitionDate?: string;
  acquisitionSource?: string;
  estimatedValue?: string;
  serialNumber?: string;
  isNamed?: boolean;
  medalNumber?: string;
  clasps?: string[];
}

export interface Person {
  id: string;
  name: string;
  rank?: string[];
  serviceNumber?: string;
  branch?: string;
  country?: string;
  era?: string[];
  dateOfBirth?: string;
  dateOfDeath?: string;
  placeOfBirth?: string;
  unit?: string[];
  biography?: string;
  notes?: string;
  images?: string[];
  profileImage?: string;
  medals: PersonMedal[];
  ownerId: string;
  ownerName: string;
}

export interface UserProfile {
  name: string;
  email: string;
  collectorSince?: string;
  location?: string;
  bio?: string;
  specialization?: string;
  isDiscoverable?: boolean;
  membershipTier?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  isAdmin: boolean;
  registeredAt: string;
  membershipTier?: string;
}

export interface ContactRequest {
  id: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  personId: string;
  personName: string;
  message: string;
  status: 'pending' | 'approved' | 'declined';
  createdAt: string;
  fromUserEmail?: string;
}

function AppContent() {
  const { user, accessToken, isLoading, login, register, logout } = useAuth();
  const [currentView, setCurrentView] = useState<'login' | 'register' | 'dashboard' | 'profile' | 'add-person' | 'edit-person' | 'person-detail' | 'notifications' | 'admin' | 'contact-support' | 'landing-page' | 'terms-of-service' | 'privacy-policy' | 'forgot-password' | 'reset-password'>('landing-page');
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  
  const [persons, setPersons] = useState<Person[]>([]);
  const [globalPersons, setGlobalPersons] = useState<Person[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    email: '',
    isDiscoverable: false
  });
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Load data when user logs in
  useEffect(() => {
    if (user && accessToken) {
      loadUserData();
    }
  }, [user, accessToken]);

  // Automatically navigate to dashboard when session is restored
  useEffect(() => {
    if (user && !isLoading && currentView === 'landing-page') {
      setCurrentView('dashboard');
    }
  }, [user, isLoading, currentView]);

  const loadUserData = async () => {
    if (!accessToken) return;

    // Load profile
    const profile = await profileApi.fetchProfile(accessToken);
    if (profile) {
      setUserProfile({
        ...profile,
        name: user?.name || '',
        email: user?.email || ''
      });
    }

    // Load persons
    const personsData = await personsApi.fetchPersons(accessToken);
    setPersons(personsData);

    // Load global persons for search
    const globalData = await personsApi.fetchGlobalPersons(accessToken);
    setGlobalPersons(globalData);

    // Load contact requests
    const requestsData = await contactsApi.fetchContactRequests(accessToken);
    setContactRequests(requestsData);

    // Load users if admin
    if (user?.isAdmin) {
      const usersData = await adminApi.fetchUsers(accessToken);
      setUsers(usersData);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    const result = await login(email, password);
    if (result.success) {
      setCurrentView('dashboard');
    } else {
      toast.error(result.error || 'Login failed');
    }
  };

  const handleRegister = async (name: string, email: string, password: string, membershipTier: string) => {
    const result = await register(name, email, password, membershipTier);
    if (result.success) {
      toast.success('Registration successful! Please check your email for next steps. Your account will be activated by an administrator within 24-48 hours.', {
        duration: 8000,
      });
      setCurrentView('login');
    } else {
      toast.error(result.error || 'Registration failed');
    }
  };

  const handleLogout = async () => {
    await logout();
    setCurrentView('login');
    setPersons([]);
    setGlobalPersons([]);
    setContactRequests([]);
    setUsers([]);
  };

  const handleAddPerson = async (person: Omit<Person, 'id' | 'ownerId' | 'ownerName'>) => {
    if (!accessToken) return;

    const newPerson = await personsApi.createPerson(person, accessToken);
    if (newPerson) {
      setPersons([...persons, newPerson]);
      // Refresh global persons
      const globalData = await personsApi.fetchGlobalPersons(accessToken);
      setGlobalPersons(globalData);
      setCurrentView('dashboard');
    } else {
      toast.error('Failed to add person');
    }
  };

  const handleEditPerson = async (updatedPerson: Person) => {
    if (!accessToken) return;

    const result = await personsApi.updatePerson(updatedPerson, accessToken);
    if (result) {
      setPersons(persons.map(p => p.id === updatedPerson.id ? result : p));
      // Refresh global persons
      const globalData = await personsApi.fetchGlobalPersons(accessToken);
      setGlobalPersons(globalData);
      setCurrentView('dashboard');
    } else {
      toast.error('Failed to update person');
    }
  };

  const handleDeletePerson = async (id: string) => {
    if (!accessToken) return;

    if (confirm('Are you sure you want to delete this person and all their medals?')) {
      const success = await personsApi.deletePerson(id, accessToken);
      if (success) {
        setPersons(persons.filter(p => p.id !== id));
        // Refresh global persons
        const globalData = await personsApi.fetchGlobalPersons(accessToken);
        setGlobalPersons(globalData);
        setCurrentView('dashboard');
      } else {
        toast.error('Failed to delete person');
      }
    }
  };

  const handleViewPerson = (id: string) => {
    setSelectedPersonId(id);
    setCurrentView('person-detail');
  };

  const handleEditClick = (id: string) => {
    setSelectedPersonId(id);
    setCurrentView('edit-person');
  };

  const handleUpdateProfile = async (profile: UserProfile) => {
    if (!accessToken) return;

    const result = await profileApi.updateProfile(profile, accessToken);
    if (result) {
      setUserProfile(result);
      toast.success('Profile updated successfully');
      setCurrentView('dashboard');
    } else {
      toast.error('Failed to update profile');
    }
  };

  const handleSendContactRequest = async (personId: string, message: string) => {
    if (!accessToken) return;

    const person = globalPersons.find(p => p.id === personId);
    if (person && person.ownerId !== user?.id) {
      const result = await contactsApi.sendContactRequest(personId, person.ownerId, message, accessToken);
      if (result) {
        toast.success('Contact request sent! The owner will be notified.');
      } else {
        toast.error('Failed to send contact request');
      }
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    if (!accessToken) return;

    const success = await contactsApi.approveContactRequest(requestId, accessToken);
    if (success) {
      setContactRequests(contactRequests.map(req => 
        req.id === requestId 
          ? { ...req, status: 'approved' as const }
          : req
      ));
    } else {
      toast.error('Failed to approve request');
    }
  };

  const handleDeclineRequest = async (requestId: string) => {
    if (!accessToken) return;

    const success = await contactsApi.declineContactRequest(requestId, accessToken);
    if (success) {
      setContactRequests(contactRequests.map(req => 
        req.id === requestId 
          ? { ...req, status: 'declined' as const }
          : req
      ));
    } else {
      toast.error('Failed to decline request');
    }
  };

  const handleActivateUser = async (userId: string) => {
    if (!accessToken) return;

    const success = await adminApi.activateUser(userId, accessToken);
    if (success) {
      setUsers(users.map(u => u.id === userId ? { ...u, isActive: true } : u));
    } else {
      toast.error('Failed to activate user');
    }
  };

  const handleDeactivateUser = async (userId: string) => {
    if (!accessToken) return;

    const success = await adminApi.deactivateUser(userId, accessToken);
    if (success) {
      setUsers(users.map(u => u.id === userId ? { ...u, isActive: false } : u));
    } else {
      toast.error('Failed to deactivate user');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!accessToken) return;

    if (confirm('Are you sure you want to permanently delete this user and all their data?')) {
      const success = await adminApi.deleteUser(userId, accessToken);
      if (success) {
        setUsers(users.filter(u => u.id !== userId));
        // Refresh persons as they may have been deleted
        const personsData = await personsApi.fetchPersons(accessToken);
        setPersons(personsData);
        const globalData = await personsApi.fetchGlobalPersons(accessToken);
        setGlobalPersons(globalData);
      } else {
        toast.error('Failed to delete user');
      }
    }
  };

  const pendingRequestsCount = contactRequests.filter(
    req => req.toUserId === user?.id && req.status === 'pending'
  ).length;

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show landing page for non-logged in users first
  if (!user && currentView === 'landing-page') {
    return (
      <LandingPage
        onBack={() => {}}
        onLogout={() => {}}
        onViewTermsOfService={() => setCurrentView('terms-of-service')}
        onViewPrivacyPolicy={() => setCurrentView('privacy-policy')}
        onGetStarted={() => setCurrentView('register')}
        onSignIn={() => setCurrentView('login')}
      />
    );
  }

  if (!user) {
    if (currentView === 'register') {
      return <Register onRegister={handleRegister} onSwitchToLogin={() => setCurrentView('login')} />;
    }
    if (currentView === 'forgot-password') {
      return <ForgotPassword onBack={() => setCurrentView('login')} />;
    }
    if (currentView === 'reset-password') {
      // Get token from URL query param
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token') || '';
      return (
        <ResetPassword
          token={token}
          onSuccess={() => setCurrentView('login')}
          onBack={() => setCurrentView('login')}
        />
      );
    }
    if (currentView === 'terms-of-service') {
      return (
        <TermsOfService
          onBack={() => setCurrentView('landing-page')}
          onLogout={() => {}}
        />
      );
    }
    if (currentView === 'privacy-policy') {
      return (
        <PrivacyPolicy
          onBack={() => setCurrentView('landing-page')}
          onLogout={() => {}}
        />
      );
    }
    return (
      <Login
        onLogin={handleLogin}
        onSwitchToRegister={() => setCurrentView('register')}
        onForgotPassword={() => setCurrentView('forgot-password')}
      />
    );
  }

  if (currentView === 'admin' && user.isAdmin) {
    return (
      <Admin
        users={users}
        accessToken={accessToken || ''}
        onActivateUser={handleActivateUser}
        onDeactivateUser={handleDeactivateUser}
        onDeleteUser={handleDeleteUser}
        onBack={() => setCurrentView('dashboard')}
        onLogout={handleLogout}
      />
    );
  }

  if (currentView === 'notifications') {
    return (
      <Notifications
        requests={contactRequests.filter(req => req.toUserId === user.id)}
        currentUserId={user.id}
        onApprove={handleApproveRequest}
        onDecline={handleDeclineRequest}
        onBack={() => setCurrentView('dashboard')}
        onLogout={handleLogout}
      />
    );
  }

  if (currentView === 'profile') {
    return (
      <Profile
        profile={userProfile}
        onUpdate={handleUpdateProfile}
        onBack={() => setCurrentView('dashboard')}
        onLogout={handleLogout}
      />
    );
  }

  if (currentView === 'add-person') {
    return (
      <PersonForm
        onSubmit={handleAddPerson}
        onCancel={() => setCurrentView('dashboard')}
      />
    );
  }

  if (currentView === 'edit-person' && selectedPersonId) {
    const person = persons.find(p => p.id === selectedPersonId);
    if (person) {
      return (
        <PersonForm
          person={person}
          onSubmit={handleEditPerson}
          onCancel={() => setCurrentView('dashboard')}
        />
      );
    }
  }

  if (currentView === 'person-detail' && selectedPersonId) {
    const person = globalPersons.find(p => p.id === selectedPersonId);
    if (person) {
      const isOwnPerson = person.ownerId === user.id;
      return (
        <PersonDetail
          person={person}
          onBack={() => setCurrentView('dashboard')}
          onEdit={isOwnPerson ? () => handleEditClick(person.id) : undefined}
          onDelete={isOwnPerson ? () => handleDeletePerson(person.id) : undefined}
          onContactOwner={!isOwnPerson ? handleSendContactRequest : undefined}
        />
      );
    }
  }

  if (currentView === 'contact-support') {
    return (
      <ContactSupport
        onBack={() => setCurrentView('dashboard')}
        onLogout={handleLogout}
      />
    );
  }

  if (currentView === 'landing-page') {
    return (
      <LandingPage
        onBack={() => setCurrentView('dashboard')}
        onLogout={handleLogout}
        onViewTermsOfService={() => setCurrentView('terms-of-service')}
        onViewPrivacyPolicy={() => setCurrentView('privacy-policy')}
      />
    );
  }

  if (currentView === 'terms-of-service') {
    return (
      <TermsOfService
        onBack={() => setCurrentView('dashboard')}
        onLogout={handleLogout}
      />
    );
  }

  if (currentView === 'privacy-policy') {
    return (
      <PrivacyPolicy
        onBack={() => setCurrentView('dashboard')}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <Dashboard
      persons={persons}
      globalPersons={globalPersons}
      userProfile={userProfile}
      currentUserId={user.id}
      isAdmin={user.isAdmin}
      pendingRequestsCount={pendingRequestsCount}
      onAddPerson={() => setCurrentView('add-person')}
      onViewPerson={handleViewPerson}
      onEditPerson={handleEditClick}
      onDeletePerson={handleDeletePerson}
      onViewProfile={() => setCurrentView('profile')}
      onViewNotifications={() => setCurrentView('notifications')}
      onViewAdmin={() => setCurrentView('admin')}
      onViewContactSupport={() => setCurrentView('contact-support')}
      onViewAbout={() => setCurrentView('landing-page')}
      onViewTermsOfService={() => setCurrentView('terms-of-service')}
      onViewPrivacyPolicy={() => setCurrentView('privacy-policy')}
      onLogout={handleLogout}
      onSendContactRequest={handleSendContactRequest}
    />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster />
    </AuthProvider>
  );
}