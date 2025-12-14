import { useState } from 'react';
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
  inCollection: boolean; // Whether the user physically has this medal
  acquisitionDate?: string;
  acquisitionSource?: string;
  estimatedValue?: string;
  serialNumber?: string;
}

export interface Person {
  id: string;
  name: string;
  rank?: string;
  serviceNumber?: string;
  branch: string;
  country: string;
  era: string;
  dateOfBirth?: string;
  dateOfDeath?: string;
  placeOfBirth?: string;
  unit?: string;
  biography?: string;
  notes?: string;
  images?: string[]; // Max 2 images
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
}

export interface User {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  isAdmin: boolean;
  registeredAt: string;
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

export default function App() {
  const [currentView, setCurrentView] = useState<'login' | 'register' | 'dashboard' | 'profile' | 'add-person' | 'edit-person' | 'person-detail' | 'notifications' | 'admin' | 'contact-support' | 'landing-page' | 'terms-of-service' | 'privacy-policy'>('landing-page');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [currentUserId] = useState('user-1');
  const [isAdmin] = useState(true); // Mock admin status
  
  // Mock users
  const [users, setUsers] = useState<User[]>([
    {
      id: 'user-1',
      email: 'admin@valorvault.com',
      name: 'Admin User',
      isActive: true,
      isAdmin: true,
      registeredAt: '2024-01-01T00:00:00Z'
    },
    {
      id: 'user-2',
      email: 'sarah@example.com',
      name: 'Sarah Wellington',
      isActive: true,
      isAdmin: false,
      registeredAt: '2024-06-15T10:30:00Z'
    },
    {
      id: 'user-3',
      email: 'robert@example.com',
      name: 'Robert Martinez',
      isActive: false,
      isAdmin: false,
      registeredAt: '2024-12-10T14:20:00Z'
    }
  ]);
  
  // Mock user profile
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Admin User',
    email: 'admin@valorvault.com',
    collectorSince: '2015',
    location: 'Washington, D.C.',
    bio: 'Military history enthusiast with a focus on WWII medals and decorations.',
    specialization: 'WWII Allied Decorations',
    isDiscoverable: true
  });

  // Mock persons collection (current user)
  const [persons, setPersons] = useState<Person[]>([
    {
      id: '1',
      name: 'Sgt. James Mitchell',
      rank: 'Sergeant',
      serviceNumber: '12345678',
      branch: 'Army',
      country: 'United States',
      era: 'World War II',
      dateOfBirth: '1920-03-15',
      unit: '29th Infantry Division',
      biography: 'Served with distinction during the Normandy invasion. Wounded in action on D-Day.',
      medals: [
        {
          id: 'm1',
          name: 'Purple Heart',
          country: 'United States',
          branch: 'Army',
          era: 'World War II',
          dateAwarded: '1944-06-15',
          condition: 'Excellent',
          description: 'Original issue Purple Heart with case and ribbon bar. Awarded for wounds received during the Normandy invasion.',
          category: 'Combat Decoration',
          inCollection: true,
          acquisitionDate: '2020-03-15',
          acquisitionSource: 'Estate Sale',
          estimatedValue: '$450',
          serialNumber: 'PH-44-12456'
        },
        {
          id: 'm2',
          name: 'Bronze Star Medal',
          country: 'United States',
          branch: 'Army',
          era: 'World War II',
          dateAwarded: '1945-05-08',
          category: 'Valor Decoration',
          inCollection: false,
          description: 'Entitled to but not in collection'
        }
      ],
      ownerId: 'user-1',
      ownerName: 'Admin User'
    },
    {
      id: '2',
      name: 'Hauptmann Friedrich Weber',
      rank: 'Hauptmann',
      serviceNumber: 'WH-98765',
      branch: 'Wehrmacht',
      country: 'Germany',
      era: 'World War II',
      dateOfBirth: '1918-07-22',
      unit: '7th Panzer Division',
      biography: 'Tank commander who served on the Eastern Front.',
      medals: [
        {
          id: 'm3',
          name: 'Iron Cross Second Class',
          country: 'Germany',
          branch: 'Wehrmacht',
          era: 'World War II',
          dateAwarded: '1943-08-20',
          condition: 'Good',
          description: 'Iron Cross 2nd Class with original ribbon. Shows age-appropriate patina.',
          category: 'Combat Decoration',
          inCollection: true,
          acquisitionDate: '2019-11-10',
          acquisitionSource: 'Online Auction',
          estimatedValue: '$350'
        }
      ],
      ownerId: 'user-1',
      ownerName: 'Admin User'
    }
  ]);

  // Mock global persons (all users' discoverable persons)
  const [globalPersons] = useState<Person[]>([
    ...persons,
    {
      id: '3',
      name: 'Lt. Commander Edward Bingham',
      rank: 'Lieutenant Commander',
      serviceNumber: 'RN-54321',
      branch: 'Royal Navy',
      country: 'United Kingdom',
      era: 'World War I',
      dateOfBirth: '1881-07-21',
      unit: 'HMS Vindictive',
      biography: 'Awarded Victoria Cross for extraordinary valor during the Zeebrugge Raid.',
      medals: [
        {
          id: 'm4',
          name: 'Victoria Cross',
          country: 'United Kingdom',
          branch: 'Royal Navy',
          era: 'World War I',
          dateAwarded: '1917-04-23',
          condition: 'Excellent',
          description: 'Victoria Cross awarded for extraordinary valor during the Zeebrugge Raid. Extremely rare piece.',
          category: 'Valor Decoration',
          inCollection: true,
          acquisitionDate: '2018-09-12',
          acquisitionSource: 'Private Sale',
          estimatedValue: '$15,000'
        }
      ],
      ownerId: 'user-2',
      ownerName: 'Sarah Wellington'
    }
  ]);

  // Mock contact requests
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([
    {
      id: 'req-1',
      fromUserId: 'user-3',
      fromUserName: 'Robert Martinez',
      toUserId: 'user-1',
      personId: '1',
      personName: 'Sgt. James Mitchell',
      message: 'I noticed you have records for Sgt. James Mitchell from the 29th Infantry Division. I\'m researching soldiers from that unit and would love to discuss your collection.',
      status: 'pending',
      createdAt: '2024-12-10T10:30:00Z',
      fromUserEmail: 'robert.martinez@example.com'
    }
  ]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentView('dashboard');
  };

  const handleRegister = () => {
    // In real app, account would need activation
    alert('Registration successful! Your account is pending activation by an administrator.');
    setCurrentView('login');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView('login');
  };

  const handleAddPerson = (person: Omit<Person, 'id' | 'ownerId' | 'ownerName'>) => {
    const newPerson = {
      ...person,
      id: Date.now().toString(),
      ownerId: currentUserId,
      ownerName: userProfile.name
    };
    setPersons([...persons, newPerson]);
    setCurrentView('dashboard');
  };

  const handleEditPerson = (updatedPerson: Person) => {
    setPersons(persons.map(p => p.id === updatedPerson.id ? updatedPerson : p));
    setCurrentView('dashboard');
  };

  const handleDeletePerson = (id: string) => {
    setPersons(persons.filter(p => p.id !== id));
    setCurrentView('dashboard');
  };

  const handleViewPerson = (id: string) => {
    setSelectedPersonId(id);
    setCurrentView('person-detail');
  };

  const handleEditClick = (id: string) => {
    setSelectedPersonId(id);
    setCurrentView('edit-person');
  };

  const handleUpdateProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    setCurrentView('dashboard');
  };

  const handleSendContactRequest = (personId: string, message: string) => {
    const person = globalPersons.find(p => p.id === personId);
    if (person && person.ownerId !== currentUserId) {
      const newRequest: ContactRequest = {
        id: `req-${Date.now()}`,
        fromUserId: currentUserId,
        fromUserName: userProfile.name,
        toUserId: person.ownerId!,
        personId: person.id,
        personName: person.name,
        message,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      setContactRequests([...contactRequests, newRequest]);
      alert('Contact request sent! The owner will be notified.');
    }
  };

  const handleApproveRequest = (requestId: string) => {
    setContactRequests(contactRequests.map(req => 
      req.id === requestId 
        ? { ...req, status: 'approved' as const }
        : req
    ));
  };

  const handleDeclineRequest = (requestId: string) => {
    setContactRequests(contactRequests.map(req => 
      req.id === requestId 
        ? { ...req, status: 'declined' as const }
        : req
    ));
  };

  const handleActivateUser = (userId: string) => {
    setUsers(users.map(u => u.id === userId ? { ...u, isActive: true } : u));
  };

  const handleDeactivateUser = (userId: string) => {
    setUsers(users.map(u => u.id === userId ? { ...u, isActive: false } : u));
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to permanently delete this user and all their data?')) {
      setUsers(users.filter(u => u.id !== userId));
      // Also delete all persons owned by this user
      setPersons(persons.filter(p => p.ownerId !== userId));
    }
  };

  const pendingRequestsCount = contactRequests.filter(
    req => req.toUserId === currentUserId && req.status === 'pending'
  ).length;

  // Show landing page for non-logged in users first
  if (!isLoggedIn && currentView === 'landing-page') {
    return (
      <LandingPage
        onBack={() => {}} // Not used when logged out
        onLogout={() => {}} // Not used when logged out
        onViewTermsOfService={() => setCurrentView('terms-of-service')}
        onViewPrivacyPolicy={() => setCurrentView('privacy-policy')}
        onGetStarted={() => setCurrentView('register')}
        onSignIn={() => setCurrentView('login')}
      />
    );
  }

  if (!isLoggedIn) {
    if (currentView === 'register') {
      return <Register onRegister={handleRegister} onSwitchToLogin={() => setCurrentView('login')} />;
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
    return <Login onLogin={handleLogin} onSwitchToRegister={() => setCurrentView('register')} />;
  }

  if (currentView === 'admin' && isAdmin) {
    return (
      <Admin
        users={users}
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
        requests={contactRequests.filter(req => req.toUserId === currentUserId)}
        currentUserId={currentUserId}
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
      const isOwnPerson = person.ownerId === currentUserId;
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
      currentUserId={currentUserId}
      isAdmin={isAdmin}
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