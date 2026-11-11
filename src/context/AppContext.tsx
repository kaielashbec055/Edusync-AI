import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, UserProfile, ChildInfo, NotificationItem, DigitalGatePass, MoodEntry, EmergencyAlert } from '../types';
import { MOCK_USERS, MOCK_CHILDREN, MOCK_NOTIFICATIONS, MOCK_GATE_PASSES, MOCK_MOOD_ENTRIES, MOCK_EMERGENCY_ALERTS } from '../mockData/mockData';
import {
  createGatePassApi,
  createMoodEntryApi,
  createEmergencyAlertApi,
  markNotificationReadApi,
  getNotificationsApi,
  getGatePassesApi,
  getMoodEntriesApi,
  getEmergencyAlertsApi,
  updateProfileApi,
  changePasswordApi,
  loginApi,
  registerApi,
  logoutApi,
  clearTokens
} from '../services/api';
import { hashPasswordClient, verifyPasswordClient } from '../utils/crypto';

export interface RegisteredUserRecord extends UserProfile {
  passwordHash?: string;
}

const DEFAULT_ACCOUNTS: RegisteredUserRecord[] = [
  {
    id: 'usr_std_01',
    name: 'Alex Vance',
    email: 'alex.vance@edupulse.edu',
    username: 'alex_student',
    phone: '+91 98765 43210',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Student',
    gradeOrSubject: 'Grade 10 - Section A'
  },
  {
    id: 'usr_prt_01',
    name: 'Sarah Vance',
    email: 'sarah.vance@gmail.com',
    username: 'sarah_parent',
    phone: '+91 98765 43211',
    role: 'parent',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    title: 'Parent',
    gradeOrSubject: 'Parent of Alex & Maya'
  },
  {
    id: 'usr_tch_01',
    name: 'Dr. Marcus Thorne',
    email: 'm.thorne@edupulse.edu',
    username: 'dr_thorne',
    phone: '+91 98765 43212',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    title: 'Senior STEM Educator',
    gradeOrSubject: 'Physics & Advanced Mathematics'
  },
  {
    id: 'usr_adm_01',
    name: 'Dr. Eleanor Vance',
    email: 'principal@edupulse.edu',
    username: 'eleanor_admin',
    phone: '+91 98765 43213',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    title: 'Principal',
    gradeOrSubject: 'Institutional Command'
  }
];

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  user: UserProfile;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedChild: ChildInfo;
  setSelectedChild: (child: ChildInfo) => void;
  childrenList: ChildInfo[];
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  addNotification: (notif: { title: string; message: string; type?: 'alert' | 'academic' | 'transport' | 'wellness' }) => void;
  gatePasses: DigitalGatePass[];
  addGatePass: (pass: Omit<DigitalGatePass, 'id' | 'status' | 'qrCodeUrl'>) => void;
  moodEntries: MoodEntry[];
  addMoodEntry: (entry: Omit<MoodEntry, 'id'>) => void;
  emergencyAlerts: EmergencyAlert[];
  triggerEmergencyAlert: (alert: Omit<EmergencyAlert, 'id' | 'timestamp' | 'status'>) => void;
  isSosModalOpen: boolean;
  setIsSosModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authMode: 'signin' | 'signup';
  setAuthMode: (mode: 'signin' | 'signup') => void;
  authTargetRole: UserRole | null;
  setAuthTargetRole: (role: UserRole | null) => void;
  openAuthModal: (mode?: 'signin' | 'signup', targetRole?: UserRole) => void;
  isLandingPage: boolean;
  setIsLandingPage: (isLanding: boolean) => void;
  isLoggedIn: boolean;
  registerAccount: (data: {
    name: string;
    email: string;
    phone?: string;
    username: string;
    password: string;
    role: UserRole;
  }) => Promise<{ success: boolean; message: string; user?: UserProfile }>;
  loginAccount: (identifier: string, password: string) => Promise<{ success: boolean; message: string; user?: UserProfile }>;
  logoutAccount: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  changeUserPassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>('student');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [childrenList] = useState<ChildInfo[]>(MOCK_CHILDREN);
  const [selectedChild, setSelectedChild] = useState<ChildInfo>(MOCK_CHILDREN[0]);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [gatePasses, setGatePasses] = useState<DigitalGatePass[]>(MOCK_GATE_PASSES);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>(MOCK_MOOD_ENTRIES);
  const [emergencyAlerts, setEmergencyAlerts] = useState<EmergencyAlert[]>(MOCK_EMERGENCY_ALERTS);
  const [isSosModalOpen, setIsSosModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authTargetRole, setAuthTargetRole] = useState<UserRole | null>(null);
  const [isLandingPage, setIsLandingPage] = useState<boolean>(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return !!localStorage.getItem('edupulse_access_token');
  });

  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUserRecord[]>(() => {
    try {
      const saved = localStorage.getItem('edupulse_registered_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_ACCOUNTS;
  });

  // Fetch initial API data on mount
  useEffect(() => {
    async function loadInitialData() {
      try {
        const notifs = await getNotificationsApi();
        if (notifs && notifs.length > 0) setNotifications(notifs);

        const passes = await getGatePassesApi();
        if (passes && passes.length > 0) setGatePasses(passes);

        const moods = await getMoodEntriesApi();
        if (moods && moods.length > 0) setMoodEntries(moods);

        const emergencies = await getEmergencyAlertsApi();
        if (emergencies && emergencies.length > 0) setEmergencyAlerts(emergencies);
      } catch (err) {
        console.log('[AppContext] API load fallback active');
      }
    }
    loadInitialData();
  }, []);

  const openAuthModal = (mode: 'signin' | 'signup' = 'signin', targetRole?: UserRole) => {
    setAuthMode(mode);
    if (targetRole) {
      setAuthTargetRole(targetRole);
    }
    setIsAuthModalOpen(true);
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    setActiveTab('dashboard');
  };

  const [profiles, setProfiles] = useState<Record<UserRole, UserProfile>>(() => {
    try {
      const saved = localStorage.getItem('edupulse_user_profiles');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return MOCK_USERS;
  });

  const user = profiles[role] || MOCK_USERS[role];

  const updateUserProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    const updatedUser = { ...user, ...updates };
    const updatedProfiles = { ...profiles, [role]: updatedUser };
    setProfiles(updatedProfiles);
    try {
      localStorage.setItem('edupulse_user_profiles', JSON.stringify(updatedProfiles));
    } catch (e) {
      console.error(e);
    }
    try {
      await updateProfileApi(updates);
    } catch (err) {
      console.log('[updateUserProfile] Local storage update successful');
    }
    addNotification({
      title: 'Profile Updated',
      message: `Your ${role} profile information has been saved successfully.`,
      type: 'academic'
    });
    return true;
  };

  const changeUserPassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    const storedPasswordsKey = 'edupulse_hashed_passwords';
    let passwordMap: Record<string, string> = {};
    try {
      const saved = localStorage.getItem(storedPasswordsKey);
      if (saved) passwordMap = JSON.parse(saved);
    } catch {
      passwordMap = {};
    }

    const userKey = user.email || user.id || role;
    let existingHash = passwordMap[userKey];

    if (!existingHash) {
      existingHash = await hashPasswordClient('Password123!');
      passwordMap[userKey] = existingHash;
    }

    const isCurrentValid = await verifyPasswordClient(currentPassword, existingHash);
    if (!isCurrentValid) {
      return { success: false, message: 'Current password does not match records.' };
    }

    const newHash = await hashPasswordClient(newPassword);
    passwordMap[userKey] = newHash;
    try {
      localStorage.setItem(storedPasswordsKey, JSON.stringify(passwordMap));
    } catch (e) {
      console.error(e);
    }

    try {
      await changePasswordApi(currentPassword, newPassword);
    } catch {
      console.log('[changeUserPassword] Backend offline, hashed password saved securely in local storage.');
    }

    addNotification({
      title: 'Password Changed',
      message: 'Your account password has been updated and securely hashed.',
      type: 'alert'
    });

    return { success: true, message: 'Password changed successfully!' };
  };

  const registerAccount = async (data: {
    name: string;
    email: string;
    phone?: string;
    username: string;
    password: string;
    role: UserRole;
  }): Promise<{ success: boolean; message: string; user?: UserProfile }> => {
    const emailNorm = data.email.trim().toLowerCase();
    const usernameNorm = data.username.trim().toLowerCase();

    // Check duplicate email
    const duplicateEmail = registeredUsers.find(u => u.email.toLowerCase() === emailNorm);
    if (duplicateEmail) {
      return { success: false, message: 'An account with this email address already exists.' };
    }

    // Check duplicate username
    const duplicateUsername = registeredUsers.find(u => (u.username || '').toLowerCase() === usernameNorm);
    if (duplicateUsername) {
      return { success: false, message: 'This username is already taken. Please choose another.' };
    }

    // Cryptographic hash (salt + SHA-256)
    const passwordHash = await hashPasswordClient(data.password);

    const newUser: RegisteredUserRecord = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: data.name.trim(),
      email: emailNorm,
      username: usernameNorm,
      phone: data.phone?.trim() || '',
      role: data.role,
      avatar: MOCK_USERS[data.role]?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      title: data.role.charAt(0).toUpperCase() + data.role.slice(1),
      gradeOrSubject: data.role === 'student' ? 'Grade 10 - Section A' : data.role === 'teacher' ? 'STEM General' : 'Parent Ward',
      passwordHash
    };

    const updated = [...registeredUsers, newUser];
    setRegisteredUsers(updated);
    try {
      localStorage.setItem('edupulse_registered_users', JSON.stringify(updated));
      const pwRaw = localStorage.getItem('edupulse_hashed_passwords');
      const pwMap = pwRaw ? JSON.parse(pwRaw) : {};
      pwMap[newUser.email] = passwordHash;
      pwMap[newUser.username] = passwordHash;
      localStorage.setItem('edupulse_hashed_passwords', JSON.stringify(pwMap));
    } catch (e) {
      console.error(e);
    }

    // Attempt backend registration
    try {
      await registerApi({
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        username: newUser.username,
        role: newUser.role,
        password: data.password
      });
    } catch {
      console.log('[registerAccount] Backend offline, user saved securely in local database.');
    }

    addNotification({
      title: 'Registration Successful',
      message: `Account created for ${newUser.name} as ${newUser.role.toUpperCase()}.`,
      type: 'academic'
    });

    return { success: true, message: 'Account registered successfully!', user: newUser };
  };

  const loginAccount = async (
    identifier: string,
    password: string
  ): Promise<{ success: boolean; message: string; user?: UserProfile }> => {
    const normId = identifier.trim().toLowerCase();
    if (!normId || !password) {
      return { success: false, message: 'Please enter both username/email and password.' };
    }

    // Try backend API login first
    try {
      const res = await loginApi(normId, password);
      if (res && res.user) {
        setRoleState(res.user.role);
        setActiveTab('dashboard');
        setIsLandingPage(false);
        setIsLoggedIn(true);
        setProfiles(prev => ({ ...prev, [res.user.role]: res.user }));
        localStorage.setItem('edupulse_current_user', JSON.stringify(res.user));
        return { success: true, message: 'Signed in successfully!', user: res.user };
      }
    } catch {}

    // Find locally
    let candidate = registeredUsers.find(
      u => u.email.toLowerCase() === normId || (u.username && u.username.toLowerCase() === normId)
    );

    if (!candidate) {
      const def = DEFAULT_ACCOUNTS.find(
        u => u.email.toLowerCase() === normId || (u.username && u.username.toLowerCase() === normId)
      );
      if (def) candidate = def;
    }

    if (!candidate) {
      return { success: false, message: 'Invalid username or email. Please check your credentials.' };
    }

    // Retrieve hash
    let storedHash = candidate.passwordHash;
    if (!storedHash) {
      try {
        const pwRaw = localStorage.getItem('edupulse_hashed_passwords');
        const pwMap = pwRaw ? JSON.parse(pwRaw) : {};
        storedHash = pwMap[candidate.email] || (candidate.username ? pwMap[candidate.username] : undefined);
      } catch {}
    }

    if (!storedHash) {
      storedHash = await hashPasswordClient('Password123!');
    }

    const isValid = await verifyPasswordClient(password, storedHash);
    if (!isValid) {
      return { success: false, message: 'Incorrect password. Please verify and try again.' };
    }

    // Login successful
    setRoleState(candidate.role);
    setActiveTab('dashboard');
    setIsLandingPage(false);
    setIsLoggedIn(true);
    setProfiles(prev => ({ ...prev, [candidate!.role]: candidate! }));
    localStorage.setItem('edupulse_current_user', JSON.stringify(candidate));
    localStorage.setItem('edupulse_access_token', 'token_' + candidate.id);

    addNotification({
      title: 'Welcome Back',
      message: `Signed in as ${candidate.name} (${candidate.role.toUpperCase()}).`,
      type: 'wellness'
    });

    return { success: true, message: 'Signed in successfully!', user: candidate };
  };

  const logoutAccount = async () => {
    try {
      await logoutApi();
    } catch {}
    clearTokens();
    localStorage.removeItem('edupulse_current_user');
    setIsLoggedIn(false);
    setIsLandingPage(true);
    setActiveTab('dashboard');

    addNotification({
      title: 'Signed Out',
      message: 'You have been securely signed out of your account.',
      type: 'alert'
    });
  };

  const markNotificationRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    await markNotificationReadApi(id);
  };

  const addNotification = (notif: { title: string; message: string; type?: 'alert' | 'academic' | 'transport' | 'wellness' }) => {
    const newItem: NotificationItem = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      title: notif.title,
      message: notif.message,
      timestamp: 'Just now',
      read: false,
      type: notif.type || 'academic'
    };
    setNotifications(prev => [newItem, ...prev]);
  };

  const addGatePass = async (pass: Omit<DigitalGatePass, 'id' | 'status' | 'qrCodeUrl'>) => {
    const created = await createGatePassApi(pass);
    setGatePasses(prev => [created, ...prev]);
  };

  const addMoodEntry = async (entry: Omit<MoodEntry, 'id'>) => {
    const created = await createMoodEntryApi(entry);
    setMoodEntries(prev => [created, ...prev.filter(e => e.date !== entry.date)]);
  };

  const triggerEmergencyAlert = async (alertData: Omit<EmergencyAlert, 'id' | 'timestamp' | 'status'>) => {
    const created = await createEmergencyAlertApi(alertData);
    setEmergencyAlerts(prev => [created, ...prev]);

    // Add to notifications stream
    addNotification({
      title: `EMERGENCY ALERT: ${alertData.title}`,
      message: alertData.message,
      type: 'alert'
    });
  };

  return (
    <AppContext.Provider value={{
      role,
      setRole,
      user,
      activeTab,
      setActiveTab,
      selectedChild,
      setSelectedChild,
      childrenList,
      notifications,
      markNotificationRead,
      addNotification,
      gatePasses,
      addGatePass,
      moodEntries,
      addMoodEntry,
      emergencyAlerts,
      triggerEmergencyAlert,
      isSosModalOpen,
      setIsSosModalOpen,
      isAuthModalOpen,
      setIsAuthModalOpen,
      authMode,
      setAuthMode,
      authTargetRole,
      setAuthTargetRole,
      openAuthModal,
      isLandingPage,
      setIsLandingPage,
      isLoggedIn,
      registerAccount,
      loginAccount,
      logoutAccount,
      updateUserProfile,
      changeUserPassword
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
