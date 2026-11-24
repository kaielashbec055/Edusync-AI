import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { MOCK_STUDENT_SUBJECTS } from '../../mockData/mockData';
import { SubjectGrade, AssessmentCategory, Assignment, TestAssessment } from '../../types';
import { getStudentSubjectsApi } from '../../services/api';
import {
  GraduationCap,
  TrendingUp,
  Clock,
  Award,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Calendar,
  ChevronRight,
  Smile,
  Flame,
  Bus,
  MapPin,
  CheckSquare,
  Trophy,
  ArrowRight,
  Bot,
  X,
  Upload,
  AlertCircle,
  FileText,
  FileCheck,
  Check,
  Filter
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user, setActiveTab, addMoodEntry, homeworkList, submitHomework, testList } = useApp();
  const [selectedMood, setSelectedMood] = useState<number | null>(4); // Happy by default
  const [subjects, setSubjects] = useState<SubjectGrade[]>(MOCK_STUDENT_SUBJECTS);
  const [showPendingHwModal, setShowPendingHwModal] = useState(false);
  
  // Homework & Test Columns State
  const [hwTabFilter, setHwTabFilter] = useState<'all' | 'pending' | 'submitted'>('pending');
  const [testCatFilter, setTestCatFilter] = useState<string>('all');
  const [selectedHwToSubmit, setSelectedHwToSubmit] = useState<Assignment | null>(null);
  const [submissionNote, setSubmissionNote] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('assignment_solution.pdf');
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);

  const pendingAssignments = homeworkList.filter(h => h.status === 'pending');
  const pendingCount = pendingAssignments.length;
  const completedAssignments = homeworkList.filter(h => h.status === 'submitted' || h.status === 'graded');
  const completedCount = completedAssignments.length;

  const publishedTests = testList.filter(t => t.isPublished && t.obtainedMarks !== undefined);
  const avgTestScore = publishedTests.length > 0
    ? Math.round(publishedTests.reduce((acc, t) => acc + ((t.obtainedMarks! / t.maxMarks) * 100), 0) / publishedTests.length)
    : 88;

  useEffect(() => {
    async function loadStudentData() {
      try {
        const subList = await getStudentSubjectsApi();
        if (subList && subList.length > 0) setSubjects(subList);
      } catch (e) {
        console.log('[StudentDashboard] Using local state fallback');
      }
    }
    loadStudentData();
  }, []);

  const handleMoodSubmit = (score: 1 | 2 | 3 | 4 | 5) => {
    setSelectedMood(score);
    addMoodEntry({
      date: new Date().toISOString().split('T')[0],
      score,
      tags: ['Daily Check-in']
    });
  };

  const handleConfirmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHwToSubmit) return;
    submitHomework(selectedHwToSubmit.id, submissionNote || `Attached file: ${selectedFileName}`);
    setIsSubmitSuccess(true);
    setTimeout(() => {
      setIsSubmitSuccess(false);
      setSelectedHwToSubmit(null);
      setSubmissionNote('');
    }, 1200);
  };

  // Filtered Homework for Dashboard Column
  const displayHomework = homeworkList.filter(h => {
    if (hwTabFilter === 'pending') return h.status === 'pending';
    if (hwTabFilter === 'submitted') return h.status === 'submitted' || h.status === 'graded';
    return true;
  });

  // Filtered Tests for Dashboard Column
  const displayTests = testList.filter(t => {
    if (testCatFilter !== 'all' && t.category !== testCatFilter) return false;
    return true;
  });

  const testCategories: AssessmentCategory[] = [
    'Class Test',
    'Unit Test',
    'Weekly Test',
    'Monthly Test',
    'Home Test',
    'Model Examination',
    'Internal Assessment'
  ];

  const todaySchedule = [
    { title: 'Math', time: '09:00 AM - 10:00 AM', room: 'Room 201', icon: '📐', bg: 'bg-purple-50 text-purple-700 border-purple-200' },
    { title: 'Science', time: '10:15 AM - 11:15 AM', room: 'Room 305', icon: '🧪', bg: 'bg-blue-50 text-blue-700 border-blue-200' },
    { title: 'English', time: '11:30 AM - 12:30 PM', room: 'Room 102', icon: '📚', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { title: 'Art & Craft', time: '01:30 PM - 02:30 PM', room: 'Room 204', icon: '🎨', bg: 'bg-pink-50 text-pink-700 border-pink-200' },
    { title: 'History', time: '03:00 PM - 04:00 PM', room: 'Room 101', icon: '🏛️', bg: 'bg-amber-50 text-amber-700 border-amber-200' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Top Welcome & XP Level Progress Hero Banner */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl purple-gradient-hero p-6 md:p-8 text-white shadow-xl glow-purple"
      >
        <div className="absolute -top-10 -right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-md text-xs font-black flex items-center gap-1.5 border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin-slow" /> Class 5-A • Aarav Sharma
              </span>
              <span className="px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-200 backdrop-blur-md text-xs font-black border border-amber-300/30 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400 animate-bounce" /> 7 Day Streak!
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
              Good Morning, Aarav! 👋
            </h1>

            {/* XP Level Progress Bar */}
            <div className="max-w-xl space-y-1.5">
              <div className="flex items-center justify-between text-xs font-black text-purple-100">
                <span>Level 5 Little Learner</span>
                <span>450 / 900 XP</span>
              </div>
              <div className="w-full h-3 bg-black/20 backdrop-blur-md rounded-full overflow-hidden p-0.5 border border-white/30">
                <div className="h-full bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-300 rounded-full transition-all duration-1000 shadow-sm" style={{ width: '50%' }}></div>
              </div>
            </div>
          </div>

          {/* Quick Mood Selector Card */}
          <div className="p-4 rounded-3xl bg-white/95 backdrop-blur-xl text-[#1E1B4B] shadow-xl border border-white/60 w-full lg:w-72">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-black flex items-center gap-1.5 text-purple-900">
                <Smile className="w-4 h-4 text-[#7C3AED]" />
                <span>How are you feeling?</span>
              </p>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-100 text-[#7C3AED]">7 Days Streak</span>
            </div>
            <div className="flex items-center justify-between gap-1 pt-1">
              {[
                { score: 1, emoji: '😞', label: 'Sad' },
                { score: 3, emoji: '😐', label: 'Okay' },
                { score: 4, emoji: '😊', label: 'Happy' }
              ].map((m) => (
                <button
                  key={m.score}
                  onClick={() => handleMoodSubmit(m.score as any)}
                  className={`flex-1 py-2 rounded-2xl text-xl flex flex-col items-center transition-all cursor-pointer ${
                    selectedMood === m.score ? 'bg-purple-100 ring-2 ring-[#7C3AED] scale-105' : 'bg-purple-50/50 hover:bg-purple-100/70'
                  }`}
                >
                  <span>{m.emoji}</span>
                  <span className="text-[9px] font-extrabold text-purple-900 mt-0.5">{m.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Overview Stats Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div 
          onClick={() => setShowPendingHwModal(true)}
          className="p-5 rounded-3xl clay-card flex items-center justify-between cursor-pointer hover:border-purple-300 hover:shadow-md transition-all group"
          title="Click to view all pending homework in a floating modal"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#7C3AED] border border-purple-200 flex items-center justify-center text-xl font-extrabold group-hover:scale-105 transition-transform">
              📚
            </div>
            <div>
              <span className="text-xs font-extrabold text-purple-700 uppercase tracking-wider block">Homework</span>
              <span className="text-xl font-black text-[#1E1B4B]">{pendingCount} Pending</span>
            </div>
          </div>
          <span className="text-[10px] font-black text-[#7C3AED] bg-purple-100 group-hover:bg-[#7C3AED] group-hover:text-white px-2.5 py-1 rounded-xl transition-colors">
            View Tasks →
          </span>
        </div>

        <div className="p-5 rounded-3xl clay-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center text-xl font-extrabold">
            ✅
          </div>
          <div>
            <span className="text-xs font-extrabold text-emerald-700 uppercase tracking-wider block">Attendance</span>
            <span className="text-xl font-black text-[#1E1B4B]">95% Present</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl clay-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 border border-amber-200 flex items-center justify-center text-xl font-extrabold">
            🎯
          </div>
          <div>
            <span className="text-xs font-extrabold text-amber-700 uppercase tracking-wider block">Daily Goal</span>
            <span className="text-xl font-black text-[#1E1B4B]">2 / 5 Tasks Done</span>
          </div>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 2 DEDICATED COLUMNS: 1. HOMEWORK COLUMN & 2. TESTS & ASSESSMENTS COLUMN */}
      {/* ========================================================================= */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* COLUMN 1: HOMEWORK BLOCK */}
        <div className="p-6 rounded-3xl clay-card flex flex-col justify-between space-y-4 border border-purple-100">
          <div className="space-y-4">
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 border-b border-purple-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#7C3AED] to-[#9333EA] text-white flex items-center justify-center shadow-md">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#1E1B4B] flex items-center gap-2">
                    <span>Homework Assignments</span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-100 text-[#7C3AED]">
                      {pendingCount} Pending
                    </span>
                  </h3>
                  <p className="text-[11px] text-purple-700 font-medium">Subject tasks assigned by class teachers</p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('homework_tests')}
                className="text-xs font-extrabold text-[#7C3AED] hover:text-purple-900 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>Full Hub</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-purple-50 p-1 rounded-xl text-xs">
              <button
                onClick={() => setHwTabFilter('pending')}
                className={`flex-1 py-1.5 rounded-lg font-black text-[11px] transition-all cursor-pointer ${
                  hwTabFilter === 'pending'
                    ? 'bg-[#7C3AED] text-white shadow-xs'
                    : 'text-purple-800 hover:text-purple-950'
                }`}
              >
                Pending ({pendingCount})
              </button>
              <button
                onClick={() => setHwTabFilter('submitted')}
                className={`flex-1 py-1.5 rounded-lg font-black text-[11px] transition-all cursor-pointer ${
                  hwTabFilter === 'submitted'
                    ? 'bg-[#7C3AED] text-white shadow-xs'
                    : 'text-purple-800 hover:text-purple-950'
                }`}
              >
                Submitted ({completedCount})
              </button>
              <button
                onClick={() => setHwTabFilter('all')}
                className={`flex-1 py-1.5 rounded-lg font-black text-[11px] transition-all cursor-pointer ${
                  hwTabFilter === 'all'
                    ? 'bg-[#7C3AED] text-white shadow-xs'
                    : 'text-purple-800 hover:text-purple-950'
                }`}
              >
                All ({homeworkList.length})
              </button>
            </div>

            {/* Homework Assignment Cards List */}
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {displayHomework.length === 0 ? (
                <div className="p-6 text-center rounded-2xl bg-purple-50/50 border border-purple-100">
                  <p className="text-xs font-bold text-purple-800">No homework in this view!</p>
                </div>
              ) : (
                displayHomework.map((hw) => {
                  const isSubmitted = hw.status === 'submitted' || hw.status === 'graded';
                  return (
                    <motion.div
                      key={hw.id}
                      whileHover={{ scale: 1.01 }}
                      className="p-4 rounded-2xl bg-white border border-purple-100 hover:border-purple-300 shadow-xs transition-all space-y-2.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black bg-purple-100 text-[#7C3AED]">
                            {hw.subject}
                          </span>
                          <span className="text-[11px] text-slate-500 font-bold">
                            By {hw.teacherName || 'Subject Teacher'}
                          </span>
                        </div>

                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 ${
                          isSubmitted ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                          hw.status === 'overdue' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                          'bg-amber-100 text-amber-900 border border-amber-200'
                        }`}>
                          <Clock className="w-3 h-3" />
                          Due: {hw.dueDate}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-black text-sm text-[#1E1B4B]">{hw.title}</h4>
                        <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">{hw.instructions}</p>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-purple-50 text-xs">
                        <span className="text-[10px] text-purple-700 font-medium">
                          Assigned: {hw.assignedDate}
                        </span>

                        {isSubmitted ? (
                          <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-black flex items-center gap-1">
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            Submitted ✓
                          </span>
                        ) : (
                          <button
                            onClick={() => setSelectedHwToSubmit(hw)}
                            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#9333EA] hover:from-[#6D28D9] text-white font-black text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <Upload className="w-3 h-3" />
                            <span>Submit Work</span>
                          </button>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>

          {/* Homework Column Footer */}
          <div className="pt-2 border-t border-purple-100 flex items-center justify-between text-xs">
            <span className="text-[11px] font-black text-purple-800">
              Total: {homeworkList.length} • Pending: {pendingCount} • Done: {completedCount}
            </span>
            <button
              onClick={() => setShowPendingHwModal(true)}
              className="text-xs font-black text-[#7C3AED] hover:underline cursor-pointer"
            >
              Open Floating Window
            </button>
          </div>
        </div>

        {/* COLUMN 2: TESTS & ASSESSMENTS BLOCK */}
        <div className="p-6 rounded-3xl clay-card flex flex-col justify-between space-y-4 border border-purple-100">
          <div className="space-y-4">
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 border-b border-purple-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#1E1B4B] flex items-center gap-2">
                    <span>Tests & Assessments</span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      Avg Score: {avgTestScore}%
                    </span>
                  </h3>
                  <p className="text-[11px] text-purple-700 font-medium">Class, Unit, Home & Term Examinations</p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('homework_tests')}
                className="text-xs font-extrabold text-[#7C3AED] hover:text-purple-900 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <span>All Tests</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Assessment Categories Filter Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                onClick={() => setTestCatFilter('all')}
                className={`px-3 py-1 rounded-xl font-black text-[11px] whitespace-nowrap transition-all cursor-pointer ${
                  testCatFilter === 'all'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
                }`}
              >
                All Categories
              </button>
              {testCategories.slice(0, 4).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setTestCatFilter(cat)}
                  className={`px-3 py-1 rounded-xl font-black text-[11px] whitespace-nowrap transition-all cursor-pointer ${
                    testCatFilter === cat
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Test Cards List */}
            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {displayTests.length === 0 ? (
                <div className="p-6 text-center rounded-2xl bg-purple-50/50 border border-purple-100">
                  <p className="text-xs font-bold text-purple-800">No tests scheduled for this category!</p>
                </div>
              ) : (
                displayTests.map((t) => {
                  const isPublished = t.isPublished && t.obtainedMarks !== undefined;
                  return (
                    <motion.div
                      key={t.id}
                      whileHover={{ scale: 1.01 }}
                      className="p-4 rounded-2xl bg-white border border-purple-100 hover:border-purple-300 shadow-xs transition-all space-y-2.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-black ${
                            t.category === 'Home Test' ? 'bg-amber-100 text-amber-900 border border-amber-200' :
                            t.category === 'Unit Test' ? 'bg-blue-100 text-blue-900 border border-blue-200' :
                            t.category === 'Model Examination' ? 'bg-purple-100 text-[#7C3AED] border border-purple-200' :
                            'bg-slate-100 text-slate-800 border border-slate-200'
                          }`}>
                            {t.category}
                          </span>
                          <span className="text-[11px] font-bold text-purple-900">{t.subject}</span>
                        </div>

                        <span className="text-[10px] text-slate-500 font-bold flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-purple-600" />
                          {t.testDate} • {t.testTime}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-black text-sm text-[#1E1B4B]">{t.title}</h4>
                        <p className="text-xs text-purple-900 font-medium mt-0.5 line-clamp-1">
                          <strong className="text-purple-950 font-bold">Syllabus:</strong> {t.syllabus}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-purple-50 text-xs">
                        <span className="text-[10px] text-slate-500 font-bold">
                          Max Marks: {t.maxMarks}
                        </span>

                        {/* Secure Results Gate: Hidden until published by teacher */}
                        {isPublished ? (
                          <span className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300 text-[11px] font-black flex items-center gap-1">
                            <Award className="w-3.5 h-3.5 text-emerald-600" />
                            Score: {t.obtainedMarks} / {t.maxMarks} ({Math.round((t.obtainedMarks! / t.maxMarks) * 100)}%)
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-extrabold flex items-center gap-1">
                            <Clock className="w-3 h-3 text-amber-600" />
                            Evaluation in Progress
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>

          {/* Test Column Footer */}
          <div className="pt-2 border-t border-purple-100 flex items-center justify-between text-xs">
            <span className="text-[10px] text-slate-500 font-medium">
              * Results published only upon official educator verification
            </span>
            <button
              onClick={() => setActiveTab('homework_tests')}
              className="text-xs font-black text-blue-600 hover:underline cursor-pointer"
            >
              View Full Schedule →
            </button>
          </div>
        </div>

      </motion.div>

      {/* Main Grid: Today's Schedule & Side Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule List */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-3xl clay-card space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-lg text-[#1E1B4B] flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#7C3AED]" />
                  <span>Today's Schedule</span>
                </h3>
                <p className="text-xs text-purple-700 font-medium">28 May, Tuesday • Class 5-A</p>
              </div>
              <button
                onClick={() => setActiveTab('academics')}
                className="text-xs font-extrabold text-[#7C3AED] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {todaySchedule.map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.01 }}
                  className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 flex items-center justify-between gap-4 transition-all"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center text-lg font-bold ${item.bg}`}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-[#1E1B4B]">{item.title}</h4>
                      <p className="text-xs text-purple-800 font-bold">{item.time}</p>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-white text-purple-800 border border-purple-200 text-xs font-extrabold">
                    {item.room}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Gamified Quests & AI Doubt Assistant Launcher */}
          <div className="p-6 rounded-3xl clay-card space-y-4 bg-gradient-to-r from-purple-50 via-indigo-50 to-pink-50 border border-purple-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500 animate-bounce" />
                <h3 className="font-black text-base text-[#1E1B4B]">Current Quest & AI Buddy</h3>
              </div>
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-purple-200 text-[#7C3AED]">
                +100 XP Reward
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-purple-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
              <div>
                <h4 className="font-black text-xs text-[#1E1B4B]">Complete 3 Math Homework Quizzes</h4>
                <p className="text-xs text-purple-800 font-medium">Progress: 2/3 completed</p>
              </div>

              <button
                onClick={() => setActiveTab('games')}
                className="px-4 py-2 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white text-xs font-extrabold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Play Quest Game</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Live Bus Tracking */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Live Bus Tracking Telemetry Widget */}
          <div className="p-6 rounded-3xl clay-card space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-sm text-[#1E1B4B] flex items-center gap-2">
                <Bus className="w-4 h-4 text-emerald-600 animate-bounce" />
                <span>Bus Telemetry Tracker</span>
              </h3>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                BUS ON THE WAY
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-emerald-900">School Bus KA 09 AB 1234</span>
                <MapPin className="w-4 h-4 text-emerald-600 animate-pulse" />
              </div>

              <div className="grid grid-cols-3 gap-2 text-center pt-1 border-t border-emerald-200/80">
                <div>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase block">ETA</span>
                  <span className="text-sm font-black text-emerald-950">10 min</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase block">Distance</span>
                  <span className="text-sm font-black text-emerald-950">2.5 km</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-700 uppercase block">Speed</span>
                  <span className="text-sm font-black text-emerald-950">28 km/h</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('safety')}
              className="w-full py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>View Live Map Tracking</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Help Box */}
          <div className="p-6 rounded-3xl clay-card space-y-3 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200">
            <h4 className="font-black text-sm text-[#1E1B4B] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#7C3AED]" />
              <span>Need Homework Guidance?</span>
            </h4>
            <p className="text-xs text-purple-900 font-medium">
              Ask your AI Study Buddy in the bottom-right corner for instant hints, formulas, and concept explanations!
            </p>
          </div>
        </motion.div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: SUBMIT HOMEWORK MODAL (WITH FILE ATTACHMENT & NOTES)           */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedHwToSubmit && (
          <div className="fixed inset-0 bg-[#1E1B4B]/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl border border-purple-200 p-6 max-w-lg w-full shadow-2xl space-y-5"
            >
              <div className="flex items-center justify-between border-b border-purple-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#7C3AED] flex items-center justify-center">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-[#1E1B4B]">Submit Homework Assignment</h3>
                    <p className="text-xs text-purple-700">{selectedHwToSubmit.subject} • Due: {selectedHwToSubmit.dueDate}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedHwToSubmit(null)}
                  className="p-1.5 rounded-xl hover:bg-purple-100 text-purple-400 hover:text-purple-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {isSubmitSuccess ? (
                <div className="p-8 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-xl font-black">
                    ✓
                  </div>
                  <h4 className="font-black text-emerald-900 text-base">Assignment Submitted Successfully!</h4>
                  <p className="text-xs text-emerald-700">Reflected immediately in Student and Parent Portals.</p>
                </div>
              ) : (
                <form onSubmit={handleConfirmSubmit} className="space-y-4">
                  <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-1">
                    <span className="text-[10px] font-black uppercase text-purple-700 tracking-wider">Assignment Details</span>
                    <h4 className="font-black text-xs text-[#1E1B4B]">{selectedHwToSubmit.title}</h4>
                    <p className="text-[11px] text-slate-600">{selectedHwToSubmit.instructions}</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-purple-900">Upload Completed File / Attachment</label>
                    <div className="p-4 rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/30 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileCheck className="w-6 h-6 text-[#7C3AED]" />
                        <div>
                          <p className="text-xs font-extrabold text-[#1E1B4B]">{selectedFileName}</p>
                          <p className="text-[10px] text-purple-700">PDF, PNG, JPG supported (Max 15MB)</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedFileName(`homework_solution_${Date.now().toString().slice(-4)}.pdf`)}
                        className="px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-[#7C3AED] text-xs font-black cursor-pointer"
                      >
                        Change File
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-purple-900">Submission Remarks or Student Notes</label>
                    <textarea
                      rows={2}
                      value={submissionNote}
                      onChange={(e) => setSubmissionNote(e.target.value)}
                      placeholder="e.g. Completed all worksheet equations and attached scanned diagrams..."
                      className="w-full px-4 py-2.5 rounded-2xl border border-purple-200 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] text-xs font-medium"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedHwToSubmit(null)}
                      className="px-4 py-2 rounded-xl text-xs font-black text-purple-900 bg-purple-50 hover:bg-purple-100 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-[#7C3AED] to-[#9333EA] hover:from-[#6D28D9] shadow-md glow-purple cursor-pointer flex items-center gap-2"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Confirm & Submit</span>
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* MODAL 2: FLOATING SMALL WINDOW FOR PENDING HOMEWORK                     */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showPendingHwModal && (
          <div className="fixed inset-0 bg-[#1E1B4B]/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-purple-200 rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl space-y-4 relative"
            >
              <div className="flex items-center justify-between border-b border-purple-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-sm text-[#1E1B4B]">Pending Homework To Complete</h3>
                    <p className="text-[11px] text-purple-700 font-medium">{pendingCount} assignments awaiting submission</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowPendingHwModal(false)}
                  className="p-1.5 rounded-xl hover:bg-purple-100 text-purple-400 hover:text-purple-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Pending Homework Items List */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1 text-xs">
                {pendingAssignments.length === 0 ? (
                  <div className="p-4 text-center text-emerald-800 font-bold bg-emerald-50 rounded-2xl">
                    🎉 Awesome! All homework assignments are completed!
                  </div>
                ) : (
                  pendingAssignments.map((hw) => (
                    <div
                      key={hw.id}
                      className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-2 hover:border-purple-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-purple-100 text-[#7C3AED]">
                          {hw.subject}
                        </span>
                        <span className="text-[10px] text-rose-600 font-black flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Due: {hw.dueDate}
                        </span>
                      </div>

                      <h4 className="font-black text-xs text-[#1E1B4B]">{hw.title}</h4>
                      <p className="text-[11px] text-slate-600 line-clamp-2">{hw.instructions}</p>

                      <div className="flex items-center justify-between pt-1 border-t border-purple-100 text-[10px] text-purple-800">
                        <span>Teacher: {hw.teacherName || 'Subject Teacher'}</span>
                        <button
                          onClick={() => {
                            submitHomework(hw.id, 'Completed & submitted via floating pending window');
                          }}
                          className="px-3 py-1 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-black cursor-pointer shadow-xs transition-colors"
                        >
                          Quick Submit ✓
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-2 border-t border-purple-100 flex items-center justify-between text-xs">
                <span className="text-[10px] text-purple-700 font-bold">Standard 8 • Aarav Sharma</span>
                <button
                  onClick={() => setShowPendingHwModal(false)}
                  className="px-4 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 font-black cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
