import {
  UserProfile,
  SubjectGrade,
  Assignment,
  TestAssessment,
  TeacherFeedbackItem,
  WellnessDiagnosticEntry,
  AchievementBadge,
  MoodEntry,
  ChildInfo,
  StrugglingStudentAlert,
  BusTrackingInfo,
  DigitalGatePass,
  EmergencyAlert,
  CircularAnnouncement,
  NotificationItem,
  ChatMessage
} from '../types';

export const MOCK_USERS: Record<string, UserProfile> = {
  student: {
    id: 'usr_std_01',
    name: 'Alex Vance',
    email: 'alex.vance@edupulse.edu',
    role: 'student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Student',
    gradeOrSubject: 'Grade 10 - Section A'
  },
  parent: {
    id: 'usr_prt_01',
    name: 'Sarah Vance',
    email: 'sarah.vance@gmail.com',
    role: 'parent',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    title: 'Parent',
    gradeOrSubject: 'Parent of Alex & Maya'
  },
  teacher: {
    id: 'usr_tch_01',
    name: 'Dr. Marcus Thorne',
    email: 'm.thorne@edupulse.edu',
    role: 'teacher',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    title: 'Senior STEM Educator',
    gradeOrSubject: 'Physics & Advanced Mathematics'
  },
  admin: {
    id: 'usr_adm_01',
    name: 'Dr. Eleanor Vance',
    email: 'principal@edupulse.edu',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    title: 'School Principal & Director',
    gradeOrSubject: 'Central Administration'
  }
};

export const MOCK_STUDENT_SUBJECTS: SubjectGrade[] = [
  { subject: 'Advanced Physics', score: 94, grade: 'A', teacher: 'Dr. Marcus Thorne', trend: 'up', lastTestScore: 96 },
  { subject: 'Algebra & Calculus', score: 88, grade: 'A-', teacher: 'Mrs. Rebecca Sterling', trend: 'up', lastTestScore: 90 },
  { subject: 'Computer Science', score: 98, grade: 'A+', teacher: 'Mr. David Zhang', trend: 'stable', lastTestScore: 98 },
  { subject: 'World History', score: 82, grade: 'B+', teacher: 'Dr. Harrison Ford', trend: 'down', lastTestScore: 78 },
  { subject: 'Chemistry', score: 91, grade: 'A', teacher: 'Dr. Elena Rostova', trend: 'up', lastTestScore: 92 },
  { subject: 'English Literature', score: 87, grade: 'B+', teacher: 'Ms. Clara Bennett', trend: 'stable', lastTestScore: 86 }
];

export const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg_01',
    title: 'Newton\'s Laws & Force Equilibrium Problem Set',
    subject: 'Science (Physics)',
    teacherName: 'Dr. Marcus Thorne',
    assignedDate: '2026-05-18',
    dueDate: '2026-05-25',
    instructions: 'Solve problems 1 to 15 from Chapter 4. Draw free-body force diagrams for each question clearly showing normal and gravitational components.',
    status: 'pending',
    maxScore: 100,
    priority: 'high'
  },
  {
    id: 'asg_02',
    title: 'Linear Equations & Graphing Worksheet #3',
    subject: 'Mathematics',
    teacherName: 'Mrs. Rebecca Sterling',
    assignedDate: '2026-05-15',
    dueDate: '2026-05-22',
    instructions: 'Plot lines using slope-intercept form y = mx + c and find intersection points algebraically.',
    status: 'submitted',
    score: 95,
    maxScore: 100,
    priority: 'medium',
    submittedAt: '2026-05-21',
    studentSubmission: 'Completed all graphs on grid paper with step-by-step algebra.'
  },
  {
    id: 'asg_03',
    title: 'Industrial Revolution Analytical Essay',
    subject: 'Social Studies',
    teacherName: 'Dr. Harrison Ford',
    assignedDate: '2026-05-17',
    dueDate: '2026-05-26',
    instructions: 'Write a 400-word analysis on the socioeconomic impact of steam engine mechanization on agrarian communities.',
    status: 'pending',
    maxScore: 50,
    priority: 'medium'
  },
  {
    id: 'asg_04',
    title: 'Chemical Reactions & Balancing Equations',
    subject: 'Science (Chemistry)',
    teacherName: 'Dr. Elena Rostova',
    assignedDate: '2026-05-19',
    dueDate: '2026-05-27',
    instructions: 'Complete the balancing exercises for redox and neutralization reactions in Worksheet B.',
    status: 'pending',
    maxScore: 50,
    priority: 'low'
  },
  {
    id: 'asg_05',
    title: 'Shakespearean Sonnets Paraphrase & Themes',
    subject: 'English Literature',
    teacherName: 'Ms. Clara Bennett',
    assignedDate: '2026-05-10',
    dueDate: '2026-05-16',
    instructions: 'Analyze Sonnet 18 meter, rhyme scheme, and imagery metaphor of eternal summer.',
    status: 'overdue',
    maxScore: 40,
    priority: 'high'
  }
];

export const MOCK_TESTS: TestAssessment[] = [
  {
    id: 'tst_01',
    title: 'Periodic Unit Assessment 2 - Algebra & Geometry',
    category: 'Unit Test',
    subject: 'Mathematics',
    teacherName: 'Mrs. Rebecca Sterling',
    testDate: '2026-05-12',
    testTime: '09:00 AM - 10:30 AM',
    duration: '90 Mins',
    maxMarks: 50,
    syllabus: 'Quadratic equations, Polynomial division, Similar triangles & Pythagoras theorem',
    status: 'completed',
    isPublished: true,
    obtainedMarks: 47,
    feedback: 'Outstanding mastery in factoring quadratics and neat geometric proofs.'
  },
  {
    id: 'tst_02',
    title: 'Weekly Physics Concept Check: Gravitation & Motion',
    category: 'Weekly Test',
    subject: 'Science (Physics)',
    teacherName: 'Dr. Marcus Thorne',
    testDate: '2026-05-16',
    testTime: '11:15 AM - 12:00 PM',
    duration: '45 Mins',
    maxMarks: 25,
    syllabus: 'Universal law of gravitation, Acceleration due to gravity (g), and Free fall kinematics',
    status: 'completed',
    isPublished: true,
    obtainedMarks: 21,
    feedback: 'Good conceptual grasp. Double-check numerical unit conversions (m/s²).'
  },
  {
    id: 'tst_03',
    title: 'Home Test #1: World Geography & Trade Routes',
    category: 'Home Test',
    subject: 'Social Studies',
    teacherName: 'Dr. Harrison Ford',
    testDate: '2026-05-22',
    testTime: 'Take-home assessment (2 hours limit)',
    duration: '120 Mins',
    maxMarks: 40,
    syllabus: 'Major maritime shipping straits, Silk Route historical impacts, and modern trade corridors',
    status: 'completed',
    isPublished: true,
    obtainedMarks: 36,
    feedback: 'Well-researched map annotations and clear trade treaty comparisons.'
  },
  {
    id: 'tst_04',
    title: 'Class Test: English Grammar & Reading Comprehension',
    category: 'Class Test',
    subject: 'English Literature',
    teacherName: 'Ms. Clara Bennett',
    testDate: '2026-05-24',
    testTime: '10:00 AM - 10:45 AM',
    duration: '45 Mins',
    maxMarks: 20,
    syllabus: 'Direct and indirect speech conversion, clauses, unseen passage comprehension',
    status: 'completed',
    isPublished: false,
    obtainedMarks: undefined,
    feedback: 'Pending paper evaluation by Ms. Clara Bennett.'
  },
  {
    id: 'tst_05',
    title: 'Monthly Term Comprehensive Assessment - Science',
    category: 'Monthly Test',
    subject: 'Science (Physics & Chem)',
    teacherName: 'Dr. Marcus Thorne',
    testDate: '2026-05-30',
    testTime: '09:00 AM - 11:00 AM',
    duration: '120 Mins',
    maxMarks: 80,
    syllabus: 'Units 1-4: Mechanics, Wave Optics, Chemical bonding, Acids, Bases & Salts',
    status: 'upcoming',
    isPublished: false
  },
  {
    id: 'tst_06',
    title: 'Model Examination - Mathematics Board Prep',
    category: 'Model Examination',
    subject: 'Mathematics',
    teacherName: 'Mrs. Rebecca Sterling',
    testDate: '2026-06-08',
    testTime: '09:00 AM - 12:00 PM',
    duration: '180 Mins',
    maxMarks: 100,
    syllabus: 'Full Term Syllabus covering Number Systems, Algebra, Coordinate Geometry, Trigonometry',
    status: 'upcoming',
    isPublished: false
  }
];

export const MOCK_TEACHER_FEEDBACK: TeacherFeedbackItem[] = [
  {
    id: 'fb_01',
    subject: 'Mathematics',
    teacherName: 'Mrs. Rebecca Sterling',
    teacherAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    date: '2026-05-14',
    remark: 'Aarav exhibits exceptional computational speed and algebraic clarity. Consistently completes worksheets ahead of time with zero calculation errors.',
    strengthArea: 'Quadratic algebra, Graph plotting & Mental math',
    areaOfImprovement: 'Needs to write out step-by-step theorem justifications for full geometry board marks.',
    rating: 5
  },
  {
    id: 'fb_02',
    subject: 'Science (Physics)',
    teacherName: 'Dr. Marcus Thorne',
    teacherAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    date: '2026-05-18',
    remark: 'Very curious and asks insightful conceptual questions during lab sessions. Had brief exam anxiety on Tuesday during numericals but bounced back quickly.',
    strengthArea: 'Physical intuition, Lab apparatus setup & Experimental design',
    areaOfImprovement: 'Multi-step kinematics numerical problems involving acceleration components.',
    rating: 4
  },
  {
    id: 'fb_03',
    subject: 'English Literature',
    teacherName: 'Ms. Clara Bennett',
    teacherAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    date: '2026-05-12',
    remark: 'Expressive vocabulary and thoughtful essay arguments. Homework submission was delayed this week due to science test preparation.',
    strengthArea: 'Analytical essay prose, Reading speed & Class debates',
    areaOfImprovement: 'Time management to avoid deadline clashes with STEM subjects.',
    rating: 4
  }
];

export const MOCK_WELLNESS_DIAGNOSTICS: WellnessDiagnosticEntry[] = [
  {
    id: 'wdiag_01',
    date: '2026-05-24',
    score: 4,
    moodLabel: 'Happy & Motivated',
    emoji: '😊',
    primaryTrigger: 'Algebra Exam High Score',
    symptoms: ['High focus', 'Energetic', 'Enthusiastic in class discussions'],
    aiDiagnosticAssessment: 'Child felt validated and proud after receiving 47/50 on Unit Test 2. Academic self-efficacy is high.',
    parentRecommendations: [
      'Celebrate student achievement with verbal affirmation',
      'Encourage regular sleeping schedule to sustain energy'
    ]
  },
  {
    id: 'wdiag_02',
    date: '2026-05-22',
    score: 2,
    moodLabel: 'Stressed / Overwhelmed',
    emoji: '😟',
    primaryTrigger: 'Upcoming Physics Lab & Heavy Homework Load',
    symptoms: ['Fatigue reported at 08:30 AM', 'Concentration dip during 4th period', 'Worry over numerical formulas'],
    aiDiagnosticAssessment: 'Detected dual pressure: Physics problem set was due alongside Geography home test. Late-night study (slept only 5.5 hours) caused cognitive drain.',
    parentRecommendations: [
      'Help break homework assignments into 25-minute Pomodoro intervals',
      'Enforce no-screen bedtime by 10:00 PM',
      'Assure the student that questions can be reviewed with Dr. Thorne during office hours'
    ]
  },
  {
    id: 'wdiag_03',
    date: '2026-05-20',
    score: 5,
    moodLabel: 'Ecstatic / Confident',
    emoji: '🌟',
    primaryTrigger: 'Robotics Team Project Victory',
    symptoms: ['Joyful social engagement', 'Zero anxiety flags', 'On-time bus check-in'],
    aiDiagnosticAssessment: 'Peer collaboration was highly invigorating. Active teamwork significantly buffers academic stress.',
    parentRecommendations: [
      'Encourage continuous participation in extracurricular clubs'
    ]
  },
  {
    id: 'wdiag_04',
    date: '2026-05-18',
    score: 3,
    moodLabel: 'Calm & Steady',
    emoji: '😐',
    primaryTrigger: 'Routine Mid-week Schedule',
    symptoms: ['Even emotional baseline', 'Completed all morning classes without incident'],
    aiDiagnosticAssessment: 'Balanced emotional regulation across the school day.',
    parentRecommendations: [
      'Maintain daily hydration and healthy nutrition'
    ]
  }
];

export const MOCK_BADGES: AchievementBadge[] = [
  {
    id: 'bdg_01',
    title: 'STEM Genius',
    description: 'Maintained 95%+ average in Science & Coding for 3 consecutive terms.',
    iconName: 'Zap',
    dateEarned: '2026-06-15',
    category: 'academic'
  },
  {
    id: 'bdg_02',
    title: 'Perfect Attendance',
    description: '100% attendance recorded over 60 consecutive school days.',
    iconName: 'Award',
    dateEarned: '2026-07-01',
    category: 'attendance'
  },
  {
    id: 'bdg_03',
    title: 'Mindfulness Champion',
    description: 'Completed 14 consecutive daily wellness check-ins.',
    iconName: 'Heart',
    dateEarned: '2026-07-20',
    category: 'wellness'
  },
  {
    id: 'bdg_04',
    title: 'Safety Pioneer',
    description: 'Verified bus check-in logger badge for digital security.',
    iconName: 'ShieldCheck',
    dateEarned: '2026-05-10',
    category: 'safety'
  }
];

export const MOCK_MOOD_ENTRIES: MoodEntry[] = [
  { id: 'm_01', date: '2026-07-29', score: 4, tags: ['Energized', 'Focused', 'Prepared'], note: 'Felt great during Physics lab!' },
  { id: 'm_02', date: '2026-07-28', score: 3, tags: ['Neutral', 'Tired'], note: 'Late night finishing History assignment.' },
  { id: 'm_03', date: '2026-07-27', score: 5, tags: ['Happy', 'Motivated', 'Proud'], note: 'Got top score in CS exam!' },
  { id: 'm_04', date: '2026-07-26', score: 4, tags: ['Relaxed', 'Family'], note: 'Weekend prep went smooth.' },
  { id: 'm_05', date: '2026-07-25', score: 2, tags: ['Anxious', 'Exam Stress'], note: 'Worried about History test result.' },
  { id: 'm_06', date: '2026-07-24', score: 4, tags: ['Calm', 'Balanced'] },
  { id: 'm_07', date: '2026-07-23', score: 5, tags: ['Optimistic', 'High Energy'] }
];

export const MOCK_CHILDREN: ChildInfo[] = [
  {
    id: 'c_01',
    name: 'Alex Vance',
    grade: 'Grade 10',
    section: 'A',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    gpa: 3.88,
    attendancePercent: 97.5,
    busRoute: 'Route 14 - North Sector Express',
    busStatus: 'on_route',
    feeStatus: 'paid',
    pendingFeeAmount: 0
  },
  {
    id: 'c_02',
    name: 'Maya Vance',
    grade: 'Grade 6',
    section: 'B',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    gpa: 3.92,
    attendancePercent: 99.0,
    busRoute: 'Route 14 - North Sector Express',
    busStatus: 'on_route',
    feeStatus: 'pending',
    pendingFeeAmount: 450
  }
];

export const MOCK_RISK_ALERTS: StrugglingStudentAlert[] = [
  {
    id: 'r_01',
    studentId: 'std_102',
    studentName: 'Liam Hemsworth',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    grade: 'Grade 10-A',
    riskType: 'academic',
    severity: 'high',
    reason: 'Score dropped 22% in Physics homework; missed 2 consecutive labs.',
    aiRecommendation: 'Recommend scheduling 1-on-1 review session for Newton\'s Laws & assignment deadline extension.',
    dateFlagged: '2026-07-28'
  },
  {
    id: 'r_02',
    studentId: 'std_105',
    studentName: 'Chloe Bennett',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    grade: 'Grade 10-A',
    riskType: 'wellness',
    severity: 'high',
    reason: 'Logged score 1 (Very Sad) for 3 consecutive days; high exam stress indicated.',
    aiRecommendation: 'Counselor flag raised automatically. Recommend gentle check-in by Ms. Harper.',
    dateFlagged: '2026-07-29'
  },
  {
    id: 'r_03',
    studentId: 'std_108',
    studentName: 'Ethan Wright',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    grade: 'Grade 10-A',
    riskType: 'attendance',
    severity: 'medium',
    reason: 'Unexcused absence on Monday & Friday mornings over past 2 weeks.',
    aiRecommendation: 'Send automated attendance verification request to parent via EduPulse app.',
    dateFlagged: '2026-07-27'
  }
];

export const MOCK_BUS_TRACKER: BusTrackingInfo = {
  busId: 'bus_14',
  busNumber: 'BUS-14',
  driverName: 'Robert Jenkins',
  driverPhone: '+1 (555) 382-9910',
  routeNumber: 'Route 14',
  routeName: 'North Sector -> Central Campus',
  currentSpeed: 38,
  speedLimit: 45,
  status: 'on_time',
  etaMinutes: 8,
  passengerCount: 28,
  maxCapacity: 40,
  currentBusPos: { x: 340, y: 160 },
  stops: [
    { id: 'st_1', name: 'Oakridge Estate Gate 2', time: '07:30 AM', passed: true, coords: { x: 80, y: 80 } },
    { id: 'st_2', name: 'Pinecrest Apartments', time: '07:42 AM', passed: true, coords: { x: 210, y: 120 } },
    { id: 'st_3', name: 'Maple Street Circle (Vance Stop)', time: '07:54 AM', passed: false, coords: { x: 380, y: 180 } },
    { id: 'st_4', name: 'Westside Transit Hub', time: '08:05 AM', passed: false, coords: { x: 520, y: 240 } },
    { id: 'st_5', name: 'EduPulse Academy Main Gate', time: '08:15 AM', passed: false, coords: { x: 650, y: 300 } }
  ]
};

export const MOCK_GATE_PASSES: DigitalGatePass[] = [
  {
    id: 'gp_01',
    studentName: 'Alex Vance',
    studentId: 'usr_std_01',
    parentName: 'Sarah Vance',
    reason: 'Scheduled Orthodontist Appointment',
    date: '2026-07-30',
    timeOut: '01:30 PM',
    status: 'approved',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=GP-EDUPULSE-2026-778912',
    pickupPerson: 'Sarah Vance (Mother)'
  },
  {
    id: 'gp_02',
    studentName: 'Maya Vance',
    studentId: 'c_02',
    parentName: 'Sarah Vance',
    reason: 'Family Emergency Leave',
    date: '2026-07-22',
    timeOut: '11:00 AM',
    status: 'used',
    pickupPerson: 'David Vance (Father)'
  }
];

export const MOCK_EMERGENCY_ALERTS: EmergencyAlert[] = [
  {
    id: 'emg_01',
    type: 'weather',
    title: 'Heavy Rain Warning & Early Bus Dispatch',
    message: 'Due to severe torrential rainfall, afternoon buses will depart at 02:30 PM today. Parents picking up children directly please report to Gate B.',
    issuedBy: 'Admin Office - Dr. Eleanor Vance',
    timestamp: '2026-07-29 11:45 AM',
    status: 'active',
    severity: 'warning'
  },
  {
    id: 'emg_02',
    type: 'medical',
    title: 'Routine Health Checkup Drill Complete',
    message: 'Grade 9-12 annual eye & dental screenings concluded smoothly.',
    issuedBy: 'School Medical Clinic',
    timestamp: '2026-07-25 04:00 PM',
    status: 'resolved',
    severity: 'info'
  }
];

export const MOCK_CIRCULARS: CircularAnnouncement[] = [
  {
    id: 'circ_01',
    title: 'Annual Science & AI Innovation Fair 2026',
    content: 'Registration is now open for students from Grades 8 to 12. Top projects win full robotics kits and mentorship from university labs.',
    category: 'Event',
    date: '2026-07-28',
    author: 'STEM Department',
    targetRoles: ['student', 'parent', 'teacher'],
    attachmentsCount: 2
  },
  {
    id: 'circ_02',
    title: 'Important: Mid-Term Examination Schedule Released',
    content: 'The mid-term examination timetable for Term II has been published. Parents can review the subject breakdown in the Parent Portal.',
    category: 'Academic',
    date: '2026-07-26',
    author: 'Academic Council',
    targetRoles: ['student', 'parent', 'teacher'],
    attachmentsCount: 1
  },
  {
    id: 'circ_03',
    title: 'Bus Route #14 Timetable Micro-Adjustment',
    content: 'Please note morning pick-up times for Stops #2 and #3 will be advanced by 4 minutes starting next Monday due to road expansion works.',
    category: 'Transport',
    date: '2026-07-24',
    author: 'Transport Manager',
    targetRoles: ['parent', 'student'],
    attachmentsCount: 0
  },
  {
    id: 'circ_04',
    title: 'Weekly Mindfulness & Wellness Workshop',
    content: 'Join our certified adolescent mental health counselor Ms. Harper every Thursday at 3:30 PM in the Library Media Center.',
    category: 'Wellness',
    date: '2026-07-20',
    author: 'Counseling Cell',
    targetRoles: ['student', 'parent', 'teacher'],
    attachmentsCount: 1
  }
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_01',
    title: 'Bus Approaching Stop',
    message: 'Bus-14 is 5 minutes away from Maple Street Circle (Vance Stop).',
    timestamp: '10 mins ago',
    read: false,
    type: 'transport'
  },
  {
    id: 'notif_02',
    title: 'New Physics Assignment Graded',
    message: 'Alex Vance scored 96/100 on Quantum Wave Functions Lab.',
    timestamp: '2 hours ago',
    read: false,
    type: 'academic'
  },
  {
    id: 'notif_03',
    title: 'Weather Warning Notification',
    message: 'Heavy rain alert issued. Early bus departure scheduled for 02:30 PM.',
    timestamp: '3 hours ago',
    read: true,
    type: 'alert'
  },
  {
    id: 'notif_04',
    title: 'Gate Pass Approved',
    message: 'Digital Gate Pass #GP-EDUPULSE-2026 for July 30 approved by Admin.',
    timestamp: '1 day ago',
    read: true,
    type: 'wellness'
  }
];

export const MOCK_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_01',
    senderId: 'usr_tch_01',
    senderName: 'Dr. Marcus Thorne',
    senderAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    role: 'teacher',
    text: 'Hello Mrs. Vance, I wanted to compliment Alex on his outstanding physics lab submission this week. His analytical approach to wave functions was top-notch!',
    timestamp: 'Yesterday 04:15 PM'
  },
  {
    id: 'msg_02',
    senderId: 'usr_prt_01',
    senderName: 'Sarah Vance',
    senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    role: 'parent',
    text: 'Thank you so much Dr. Thorne! He spent quite a bit of time working on it. Is there any reading material you recommend for the upcoming mid-terms?',
    timestamp: 'Yesterday 05:00 PM'
  },
  {
    id: 'msg_03',
    senderId: 'usr_tch_01',
    senderName: 'Dr. Marcus Thorne',
    senderAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    role: 'teacher',
    text: 'Yes! Chapter 6 in the Advanced STEM e-book covers wave mechanics and thermodynamics. I have also shared study prompts with the AI assistant.',
    timestamp: 'Today 09:30 AM'
  }
];
