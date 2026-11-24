export type UserRole = 'student' | 'parent' | 'teacher' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  title?: string;
  gradeOrSubject?: string;
  phone?: string;
  address?: string;
  bloodGroup?: string;
  gender?: string;
  dob?: string;
  rollNo?: string;
  standard?: string;
  section?: string;
  guardianName?: string;
  guardianPhone?: string;
  institution?: string;
  occupation?: string;
  children?: { id: string; name: string; standard: string; section: string; rollNo?: string; avatar?: string }[];
  employeeId?: string;
  qualifications?: string;
  experience?: string;
  assignedClasses?: string[];
  adminId?: string;
  department?: string;
  designation?: string;
}

export interface SubjectGrade {
  subject: string;
  score: number;
  grade: string;
  teacher: string;
  trend: 'up' | 'down' | 'stable';
  lastTestScore: number;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  teacherName?: string;
  assignedDate?: string;
  dueDate: string;
  instructions?: string;
  attachmentUrl?: string;
  status: 'pending' | 'submitted' | 'graded' | 'overdue';
  score?: number;
  maxScore: number;
  priority: 'high' | 'medium' | 'low';
  studentSubmission?: string;
  submittedAt?: string;
}

export type AssessmentCategory = 
  | 'Class Test' 
  | 'Unit Test' 
  | 'Weekly Test' 
  | 'Monthly Test' 
  | 'Home Test' 
  | 'Model Examination' 
  | 'Internal Assessment';

export interface TestAssessment {
  id: string;
  title: string;
  category: AssessmentCategory;
  subject: string;
  teacherName: string;
  testDate: string;
  testTime: string;
  duration: string;
  maxMarks: number;
  syllabus: string;
  status: 'upcoming' | 'completed' | 'pending';
  isPublished: boolean; // Must only be displayed after teacher publishes them
  obtainedMarks?: number;
  feedback?: string;
}

export interface TeacherFeedbackItem {
  id: string;
  subject: string;
  teacherName: string;
  teacherAvatar?: string;
  date: string;
  remark: string;
  areaOfImprovement: string;
  strengthArea: string;
  rating: number;
}

export interface WellnessDiagnosticEntry {
  id: string;
  date: string;
  score: 1 | 2 | 3 | 4 | 5;
  moodLabel: string;
  emoji: string;
  primaryTrigger: string;
  symptoms: string[];
  aiDiagnosticAssessment: string;
  parentRecommendations: string[];
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  dateEarned: string;
  category: 'academic' | 'wellness' | 'attendance' | 'safety';
}

export interface MoodEntry {
  id: string;
  date: string;
  score: 1 | 2 | 3 | 4 | 5; // 1: Very Sad, 5: Ecstatic
  tags: string[];
  note?: string;
}

export interface ChildInfo {
  id: string;
  name: string;
  grade: string;
  section: string;
  avatar: string;
  gpa: number;
  attendancePercent: number;
  busRoute: string;
  busStatus: 'on_route' | 'arrived' | 'delayed' | 'not_started';
  feeStatus: 'paid' | 'pending' | 'overdue';
  pendingFeeAmount: number;
}

export interface StrugglingStudentAlert {
  id: string;
  studentId: string;
  studentName: string;
  avatar: string;
  grade: string;
  riskType: 'academic' | 'attendance' | 'wellness' | 'combined';
  severity: 'high' | 'medium';
  reason: string;
  aiRecommendation: string;
  dateFlagged: string;
}

export interface BusStop {
  id: string;
  name: string;
  time: string;
  passed: boolean;
  coords: { x: number; y: number };
}

export interface BusTrackingInfo {
  busId: string;
  busNumber: string;
  driverName: string;
  driverPhone: string;
  routeNumber: string;
  routeName: string;
  currentSpeed: number; // in km/h
  speedLimit: number;
  status: 'on_time' | 'delayed' | 'stopped';
  etaMinutes: number;
  stops: BusStop[];
  currentBusPos: { x: number; y: number };
  passengerCount: number;
  maxCapacity: number;
}

export interface DigitalGatePass {
  id: string;
  studentName: string;
  studentId: string;
  parentName: string;
  reason: string;
  date: string;
  timeOut: string;
  status: 'approved' | 'pending' | 'used' | 'expired';
  qrCodeUrl?: string;
  pickupPerson: string;
}

export interface EmergencyAlert {
  id: string;
  type: 'lockdown' | 'weather' | 'medical' | 'fire' | 'general';
  title: string;
  message: string;
  issuedBy: string;
  timestamp: string;
  status: 'active' | 'resolved';
  severity: 'critical' | 'warning' | 'info';
}

export interface CircularAnnouncement {
  id: string;
  title: string;
  content: string;
  category: 'Urgent' | 'Academic' | 'Transport' | 'Wellness' | 'Event';
  date: string;
  author: string;
  targetRoles: UserRole[];
  attachmentsCount?: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'alert' | 'academic' | 'transport' | 'wellness' | 'message';
  actionUrl?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  role: UserRole | 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
}
