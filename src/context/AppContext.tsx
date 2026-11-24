import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  UserProfile,
  ChildInfo,
  NotificationItem,
  DigitalGatePass,
  MoodEntry,
  EmergencyAlert,
  Assignment,
  TestAssessment,
  TeacherFeedbackItem,
  WellnessDiagnosticEntry
} from '../types';
import {
  MOCK_USERS,
  MOCK_CHILDREN,
  MOCK_NOTIFICATIONS,
  MOCK_GATE_PASSES,
  MOCK_MOOD_ENTRIES,
  MOCK_EMERGENCY_ALERTS,
  MOCK_ASSIGNMENTS,
  MOCK_TESTS,
  MOCK_TEACHER_FEEDBACK,
  MOCK_WELLNESS_DIAGNOSTICS
} from '../mockData/mockData';
import {
  createGatePassApi,
  createMoodEntryApi,
  createEmergencyAlertApi,
  markNotificationReadApi,
  getNotificationsApi,
  getGatePassesApi,
  getMoodEntriesApi,
  getEmergencyAlertsApi
} from '../services/api';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  user: UserProfile;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void> | void;
  changeUserPassword: (currentPass: string, newPass: string) => Promise<{ success: boolean; message: string }>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedChild: ChildInfo;
  setSelectedChild: (child: ChildInfo) => void;
  childrenList: ChildInfo[];
  setChildrenList: React.Dispatch<React.SetStateAction<ChildInfo[]>>;
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
  isProfileSetupActive: boolean;
  setIsProfileSetupActive: (active: boolean) => void;
  isLanguageSetupActive: boolean;
  setIsLanguageSetupActive: (active: boolean) => void;
  hasCompletedProfile: Record<UserRole, boolean>;
  skipToDashboard: () => void;
  completeProfileSetup: (profileData: Partial<UserProfile>) => void;
  homeworkList: Assignment[];
  submitHomework: (id: string, notes?: string) => void;
  testList: TestAssessment[];
  teacherFeedbackList: TeacherFeedbackItem[];
  wellnessDiagnostics: WellnessDiagnosticEntry[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_PROFILES: Record<UserRole, UserProfile> = {
  student: {
    id: 'usr_std_01',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@edupulse.edu',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Student • 8th Standard',
    gradeOrSubject: '8th Standard - Section A',
    standard: '8th Standard',
    section: 'A',
    rollNo: 'STD-2026-0842',
    phone: '+91 98765 43210',
    bloodGroup: 'O+',
    gender: 'Male',
    dob: '2012-05-14',
    guardianName: 'Priya Sharma',
    guardianPhone: '+91 98765 43210',
    institution: 'St. Jude International Academy',
    address: 'Flat 402, Green Glen Heights, Sector 4, Bangalore'
  },
  parent: {
    id: 'usr_prt_01',
    name: 'Priya Sharma',
    email: 'priya.sharma@gmail.com',
    role: 'parent',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    title: 'Parent (2 Children Enrolled)',
    gradeOrSubject: 'Parent of Aarav (8th Std) & Maya (5th Std)',
    phone: '+91 98765 43210',
    occupation: 'Lead Solutions Architect',
    institution: 'St. Jude International Academy',
    address: 'Flat 402, Green Glen Heights, Sector 4, Bangalore',
    children: [
      { id: 'c_01', name: 'Aarav Sharma', standard: '8th Standard', section: 'A', rollNo: 'STD-2026-0842', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
      { id: 'c_02', name: 'Maya Sharma', standard: '5th Standard', section: 'B', rollNo: 'STD-2026-0518', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' }
    ]
  },
  teacher: {
    id: 'usr_tch_01',
    name: 'Mrs. Ananya Sharma',
    email: 'a.sharma@edupulse.edu',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    title: 'Senior STEM Educator & Class Coordinator',
    gradeOrSubject: 'Mathematics & Science (8th & 9th Std)',
    employeeId: 'TCH-2021-994',
    qualifications: 'M.Sc. Applied Mathematics, B.Ed',
    experience: '8 Years',
    assignedClasses: ['8th Standard - Section A', '8th Standard - Section B', '9th Standard - Section A'],
    phone: '+91 98112 33445',
    institution: 'St. Jude International Academy',
    address: 'Block B-12, Educators Enclave, Bangalore'
  },
  admin: {
    id: 'usr_adm_01',
    name: 'Dr. Eleanor Vance',
    email: 'principal@edupulse.edu',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    title: 'School Principal & Director',
    gradeOrSubject: 'Central Academic & Financial Administration',
    adminId: 'ADM-2018-1001',
    department: 'Central Administration & Campus Safety',
    designation: 'Principal & Director of Academic Affairs',
    phone: '+91 98000 11223',
    institution: 'St. Jude International Academy',
    address: 'Campus Administrative Quarters, St. Jude Campus'
  }
};

const INITIAL_CHILDREN: ChildInfo[] = [
  {
    id: 'c_01',
    name: 'Aarav Sharma',
    grade: '8th Standard',
    section: 'A',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    gpa: 3.88,
    attendancePercent: 97.5,
    busRoute: 'Route 14 - North Sector Express',
    busStatus: 'on_route',
    feeStatus: 'pending',
    pendingFeeAmount: 450
  },
  {
    id: 'c_02',
    name: 'Maya Sharma',
    grade: '5th Standard',
    section: 'B',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    gpa: 3.92,
    attendancePercent: 99.0,
    busRoute: 'Route 14 - North Sector Express',
    busStatus: 'on_route',
    feeStatus: 'paid',
    pendingFeeAmount: 0
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>('student');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [userProfiles, setUserProfiles] = useState<Record<UserRole, UserProfile>>(INITIAL_PROFILES);
  const [childrenList, setChildrenList] = useState<ChildInfo[]>(INITIAL_CHILDREN);
  const [selectedChild, setSelectedChild] = useState<ChildInfo>(INITIAL_CHILDREN[0]);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [gatePasses, setGatePasses] = useState<DigitalGatePass[]>(MOCK_GATE_PASSES);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>(MOCK_MOOD_ENTRIES);
  const [emergencyAlerts, setEmergencyAlerts] = useState<EmergencyAlert[]>(MOCK_EMERGENCY_ALERTS);
  const [isSosModalOpen, setIsSosModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authTargetRole, setAuthTargetRole] = useState<UserRole | null>(null);
  const [isLandingPage, setIsLandingPage] = useState<boolean>(true);
  const [isProfileSetupActive, setIsProfileSetupActive] = useState<boolean>(false);
  const [isLanguageSetupActive, setIsLanguageSetupActive] = useState<boolean>(false);
  const [hasCompletedProfile, setHasCompletedProfile] = useState<Record<UserRole, boolean>>({
    student: false,
    parent: false,
    teacher: false,
    admin: false
  });
  const [homeworkList, setHomeworkList] = useState<Assignment[]>(MOCK_ASSIGNMENTS);
  const [testList, setTestList] = useState<TestAssessment[]>(MOCK_TESTS);
  const [teacherFeedbackList] = useState<TeacherFeedbackItem[]>(MOCK_TEACHER_FEEDBACK);
  const [wellnessDiagnostics, setWellnessDiagnostics] = useState<WellnessDiagnosticEntry[]>(MOCK_WELLNESS_DIAGNOSTICS);

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

  const user = userProfiles[role];

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    setUserProfiles(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        ...data
      }
    }));
  };

  const changeUserPassword = async (_currentPass: string, _newPass: string) => {
    return { success: true, message: 'Password updated securely.' };
  };

  const skipToDashboard = () => {
    setHasCompletedProfile(prev => ({ ...prev, [role]: true }));
    setIsProfileSetupActive(false);
    setIsLanguageSetupActive(false);
    setIsLandingPage(false);
    setActiveTab('dashboard');
    addNotification({
      title: 'Welcome Back',
      message: `Navigated directly to your ${role.toUpperCase()} Dashboard.`,
      type: 'academic'
    });
  };

  const completeProfileSetup = (profileData: Partial<UserProfile>) => {
    setUserProfiles(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        ...profileData
      }
    }));

    if (role === 'parent' && profileData.children && profileData.children.length > 0) {
      const newChildren: ChildInfo[] = profileData.children.map((ch, idx) => ({
        id: ch.id || `c_0${idx + 1}`,
        name: ch.name,
        grade: ch.standard || '8th Standard',
        section: ch.section || 'A',
        avatar: ch.avatar || (idx === 0
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
          : idx === 1
          ? 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=150&auto=format&fit=crop&q=80'),
        gpa: 3.88,
        attendancePercent: 97.5,
        busRoute: 'Route 14 - North Sector Express',
        busStatus: 'on_route',
        feeStatus: idx === 0 ? 'pending' : 'paid',
        pendingFeeAmount: idx === 0 ? 450 : 0
      }));
      setChildrenList(newChildren);
      setSelectedChild(newChildren[0]);
    }

    setHasCompletedProfile(prev => ({ ...prev, [role]: true }));
    setIsProfileSetupActive(false);
    // New profile creation transitions to Language Selection Screen next!
    setIsLanguageSetupActive(true);
    addNotification({
      title: 'Profile Saved',
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} profile details configured successfully. Please choose your preferred language.`,
      type: 'academic'
    });
  };

  const submitHomework = (id: string, notes?: string) => {
    setHomeworkList(prev => prev.map(hw => {
      if (hw.id === id) {
        return {
          ...hw,
          status: 'submitted',
          submittedAt: 'Today, Just now',
          studentSubmission: notes || 'Submitted electronically via Student Workspace portal with attachments.'
        };
      }
      return hw;
    }));

    addNotification({
      title: 'Homework Submitted',
      message: 'Assignment submitted successfully and synchronized with Parent & Teacher portals.',
      type: 'academic'
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
      updateUserProfile,
      changeUserPassword,
      activeTab,
      setActiveTab,
      selectedChild,
      setSelectedChild,
      childrenList,
      setChildrenList,
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
      isProfileSetupActive,
      setIsProfileSetupActive,
      isLanguageSetupActive,
      setIsLanguageSetupActive,
      hasCompletedProfile,
      skipToDashboard,
      completeProfileSetup,
      homeworkList,
      submitHomework,
      testList,
      teacherFeedbackList,
      wellnessDiagnostics
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
