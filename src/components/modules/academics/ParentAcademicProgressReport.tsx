import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../../context/AppContext';
import {
  BookOpen,
  Award,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  User,
  Calendar,
  TrendingUp,
  TrendingDown,
  Download,
  Printer,
  Bell,
  Star,
  Sparkles,
  BarChart2,
  ShieldCheck,
  CheckSquare,
  X
} from 'lucide-react';

export const ParentAcademicProgressReport: React.FC = () => {
  const { selectedChild, homeworkList, testList, teacherFeedbackList, notifications } = useApp();
  const [showMonthlyPdfModal, setShowMonthlyPdfModal] = useState(false);
  const [activeReportTab, setActiveReportTab] = useState<'homework' | 'tests' | 'analysis' | 'feedback' | 'notifications'>('homework');

  // Homework Metrics
  const totalHomework = homeworkList.length;
  const completedHomework = homeworkList.filter(h => h.status === 'submitted' || h.status === 'graded').length;
  const pendingHomework = homeworkList.filter(h => h.status === 'pending').length;
  const overdueHomework = homeworkList.filter(h => h.status === 'overdue').length;
  const homeworkCompletionRate = totalHomework > 0 ? Math.round((completedHomework / totalHomework) * 100) : 0;

  // Group homework by subject
  const subjectHomeworkMap: Record<string, { total: number; done: number; pending: number }> = {};
  homeworkList.forEach(hw => {
    if (!subjectHomeworkMap[hw.subject]) {
      subjectHomeworkMap[hw.subject] = { total: 0, done: 0, pending: 0 };
    }
    subjectHomeworkMap[hw.subject].total += 1;
    if (hw.status === 'submitted' || hw.status === 'graded') {
      subjectHomeworkMap[hw.subject].done += 1;
    } else {
      subjectHomeworkMap[hw.subject].pending += 1;
    }
  });

  // Tests Metrics
  const totalTests = testList.length;
  const completedTests = testList.filter(t => t.status === 'completed').length;
  const upcomingTests = testList.filter(t => t.status === 'upcoming').length;
  const publishedTests = testList.filter(t => t.isPublished && t.obtainedMarks !== undefined);
  const averageTestScore = publishedTests.length > 0
    ? Math.round(publishedTests.reduce((acc, t) => acc + ((t.obtainedMarks! / t.maxMarks) * 100), 0) / publishedTests.length)
    : 88;

  // Month-wise Performance Data
  const monthlyTrends = [
    { month: 'Jan', score: 82, hwRate: 90 },
    { month: 'Feb', score: 85, hwRate: 92 },
    { month: 'Mar', score: 87, hwRate: 95 },
    { month: 'Apr', score: 91, hwRate: 94 },
    { month: 'May (Current)', score: 93, hwRate: homeworkCompletionRate }
  ];

  // Filter academic notifications
  const academicNotifications = notifications.filter(
    n => n.type === 'academic' || n.title.includes('Homework') || n.title.includes('Test') || n.title.includes('Profile')
  );

  return (
    <div className="p-6 md:p-8 rounded-3xl clay-card space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-purple-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-purple-100 text-[#7C3AED] text-xs font-black flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#7C3AED]" /> OFFICIAL ACADEMIC PROGRESS REPORT
            </span>
            <span className="text-xs text-purple-700 font-bold">{selectedChild.name} • {selectedChild.grade}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#1E1B4B]">
            Central Academic Telemetry & Performance Dossier
          </h2>
          <p className="text-xs text-purple-800 font-medium max-w-2xl">
            Live synchronization of student homework submissions, standardized examination evaluations, and teacher remarks.
          </p>
        </div>

        {/* Action Button: Download/View Monthly PDF Report */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setShowMonthlyPdfModal(true)}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#9333EA] hover:from-[#6D28D9] text-white font-black text-xs shadow-md glow-purple transition-all flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Monthly Report (PDF)</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100">
          <span className="text-[11px] font-bold text-purple-700 block">Homework Completion</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-[#1E1B4B]">{homeworkCompletionRate}%</span>
            <span className="text-xs text-emerald-600 font-bold">✓ {completedHomework}/{totalHomework}</span>
          </div>
          <div className="w-full bg-purple-200 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-[#7C3AED] h-full rounded-full" style={{ width: `${homeworkCompletionRate}%` }} />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100">
          <span className="text-[11px] font-bold text-indigo-700 block">Average Test Score</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-indigo-950">{averageTestScore}%</span>
            <span className="text-xs text-emerald-600 font-bold">+5.4% YoY</span>
          </div>
          <p className="text-[10px] text-indigo-700 mt-2 font-medium">Across all completed exams</p>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
          <span className="text-[11px] font-bold text-amber-800 block">Pending Assignments</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-amber-900">{pendingHomework} Tasks</span>
            <span className="text-xs text-amber-700 font-bold">{overdueHomework} overdue</span>
          </div>
          <p className="text-[10px] text-amber-700 mt-2 font-medium">Immediate student focus needed</p>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
          <span className="text-[11px] font-bold text-emerald-800 block">Tests Scheduled</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-emerald-900">{totalTests} Conducted</span>
            <span className="text-xs text-emerald-700 font-bold">{upcomingTests} upcoming</span>
          </div>
          <p className="text-[10px] text-emerald-700 mt-2 font-medium">Curriculum syllabus on track</p>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-b border-purple-100">
        {[
          { key: 'homework', label: 'Homework Progress', icon: <BookOpen className="w-3.5 h-3.5" /> },
          { key: 'tests', label: 'Test Performance', icon: <Award className="w-3.5 h-3.5" /> },
          { key: 'analysis', label: 'Performance Analytics', icon: <BarChart2 className="w-3.5 h-3.5" /> },
          { key: 'feedback', label: 'Teacher Feedback', icon: <User className="w-3.5 h-3.5" /> },
          { key: 'notifications', label: 'Academic Alerts', icon: <Bell className="w-3.5 h-3.5" /> }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveReportTab(tab.key as any)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl font-black transition-all cursor-pointer whitespace-nowrap ${
              activeReportTab === tab.key
                ? 'bg-[#7C3AED] text-white shadow-sm'
                : 'text-purple-900 hover:bg-purple-50'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* SECTION A: HOMEWORK PROGRESS REPORT                                      */}
      {/* ========================================================================= */}
      {activeReportTab === 'homework' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-[#1E1B4B]">Subject-wise Homework Completion Status</h3>
              <p className="text-xs text-purple-700 font-medium">Detailed tracking of student submission timeliness and pending assignments.</p>
            </div>
            <span className="text-xs font-black text-[#7C3AED] bg-purple-50 px-3 py-1 rounded-xl border border-purple-200 self-start sm:self-auto">
              Completion Rate: {homeworkCompletionRate}%
            </span>
          </div>

          {/* Subject-Wise Homework Breakdown Bars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(subjectHomeworkMap).map(([subject, stats]) => {
              const pct = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;
              return (
                <div key={subject} className="p-4 rounded-2xl bg-white border border-purple-100 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-black text-[#1E1B4B]">{subject}</span>
                    <span className="font-extrabold text-purple-900">{stats.done} of {stats.total} Completed ({pct}%)</span>
                  </div>
                  <div className="w-full bg-purple-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        pct === 100 ? 'bg-emerald-500' : pct >= 50 ? 'bg-[#7C3AED]' : 'bg-amber-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{stats.pending > 0 ? `⚠️ ${stats.pending} pending task` : '✓ All tasks submitted'}</span>
                    <span className="text-purple-700 font-bold">Standard 8</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Full Detailed Homework Table */}
          <div className="border border-purple-100 rounded-2xl overflow-hidden shadow-xs bg-white text-xs">
            <div className="grid grid-cols-12 bg-purple-50 p-3 font-black text-purple-900 border-b border-purple-100">
              <span className="col-span-4">Assignment Title</span>
              <span className="col-span-2">Subject</span>
              <span className="col-span-2">Teacher</span>
              <span className="col-span-2">Due Date</span>
              <span className="col-span-2 text-right">Status</span>
            </div>

            <div className="divide-y divide-purple-100">
              {homeworkList.map((hw) => {
                const isDone = hw.status === 'submitted' || hw.status === 'graded';
                const isOverdue = hw.status === 'overdue';
                return (
                  <div key={hw.id} className="grid grid-cols-12 p-3 items-center">
                    <span className="col-span-4 font-bold text-[#1E1B4B]">{hw.title}</span>
                    <span className="col-span-2 text-purple-700 font-semibold">{hw.subject}</span>
                    <span className="col-span-2 text-slate-600">{hw.teacherName || 'Subject Teacher'}</span>
                    <span className="col-span-2 text-slate-500 font-mono">{hw.dueDate}</span>
                    <div className="col-span-2 text-right">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        isDone ? 'bg-emerald-100 text-emerald-800' : isOverdue ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {hw.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION B: TEST PERFORMANCE REPORT                                       */}
      {/* ========================================================================= */}
      {activeReportTab === 'tests' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-[#1E1B4B]">Standardized Examination & Assessment Records</h3>
              <p className="text-xs text-purple-700 font-medium">Class tests, unit tests, monthly assessments, and home tests.</p>
            </div>
            <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200 self-start sm:self-auto">
              Average Score: {averageTestScore}%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {testList.map((test) => (
              <div
                key={test.id}
                className="p-5 rounded-2xl bg-white border border-purple-100 space-y-3 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-[#7C3AED] text-[10px] font-black">
                      {test.subject}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-black">
                      {test.category}
                    </span>
                  </div>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                    test.status === 'upcoming' ? 'bg-blue-100 text-blue-800' : test.isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {test.status === 'upcoming' ? 'Upcoming' : test.isPublished ? 'Published' : 'Evaluation Ongoing'}
                  </span>
                </div>

                <div>
                  <h4 className="font-black text-sm text-[#1E1B4B]">{test.title}</h4>
                  <p className="text-xs text-slate-500 font-medium">Date: {test.testDate} • Max: {test.maxMarks} marks</p>
                </div>

                {test.isPublished && test.obtainedMarks !== undefined ? (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-700 uppercase">Score Obtained</span>
                      <p className="font-black text-base text-emerald-950">
                        {test.obtainedMarks} / {test.maxMarks} ({Math.round((test.obtainedMarks / test.maxMarks) * 100)}%)
                      </p>
                    </div>
                    {test.feedback && (
                      <p className="text-[11px] text-emerald-900 italic max-w-xs text-right">
                        "{test.feedback}"
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="p-2.5 bg-purple-50/50 rounded-xl border border-purple-100 text-[11px] text-purple-800">
                    {test.status === 'upcoming'
                      ? `Scheduled for ${test.testDate} (${test.testTime}). Syllabus: ${test.syllabus}`
                      : 'Teacher has not yet published evaluated scores. Results will be notified.'}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION C: ACADEMIC PERFORMANCE ANALYSIS                                 */}
      {/* ========================================================================= */}
      {activeReportTab === 'analysis' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-[#1E1B4B]">Progress Trends & Longitudinal Growth</h3>
              <p className="text-xs text-purple-700 font-medium">Month-wise comparative growth charts and academic trajectories.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Monthly Trend Chart Simulation */}
            <div className="p-5 rounded-2xl bg-white border border-purple-100 space-y-4">
              <h4 className="text-xs font-black uppercase text-purple-900 tracking-wider flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Month-Wise Assessment Average Trend</span>
              </h4>

              <div className="space-y-3 pt-2">
                {monthlyTrends.map((t) => (
                  <div key={t.month} className="space-y-1 text-xs">
                    <div className="flex justify-between font-bold">
                      <span className="text-purple-950">{t.month}</span>
                      <span className="text-[#7C3AED] font-black">{t.score}%</span>
                    </div>
                    <div className="w-full bg-purple-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-[#7C3AED] to-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${t.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Strengths & Focus Areas */}
            <div className="p-5 rounded-2xl bg-white border border-purple-100 space-y-4">
              <h4 className="text-xs font-black uppercase text-purple-900 tracking-wider">
                Key Strengths & Growth Target Areas
              </h4>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                  <span className="font-black text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Subject Mastery: Mathematics & Coding
                  </span>
                  <p className="text-emerald-950 font-medium text-[11px]">
                    Consistent 94%+ scores in quadratic algebra and problem sets. Student demonstrates advanced conceptual maturity.
                  </p>
                </div>

                <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
                  <span className="font-black text-amber-900 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" /> Target Area: Physics Numerical Multi-Step Units
                  </span>
                  <p className="text-amber-950 font-medium text-[11px]">
                    Homework completion dipped on 2026-05-18 during gravitation labs. Recommended 1-on-1 review with Dr. Thorne.
                  </p>
                </div>

                <div className="p-3.5 bg-purple-50 rounded-xl border border-purple-100 space-y-1">
                  <span className="font-black text-[#1E1B4B]">Overall Trajectory: Superior Progress</span>
                  <p className="text-purple-900 text-[11px]">
                    {selectedChild.name} ranks in the top 5% of Standard 8 cohort with 97.5% attendance rate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION D: TEACHER FEEDBACK & REMARKS                                    */}
      {/* ========================================================================= */}
      {activeReportTab === 'feedback' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-[#1E1B4B]">Subject Teacher Feedback & Term Remarks</h3>
            <span className="text-xs font-bold text-purple-700">Official Faculty Observations</span>
          </div>

          <div className="space-y-3">
            {teacherFeedbackList.map((fb) => (
              <div
                key={fb.id}
                className="p-5 rounded-2xl bg-white border border-purple-100 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={fb.teacherAvatar}
                      alt={fb.teacherName}
                      className="w-10 h-10 rounded-xl object-cover ring-2 ring-purple-200"
                    />
                    <div>
                      <h4 className="font-black text-sm text-[#1E1B4B]">{fb.teacherName}</h4>
                      <p className="text-xs text-[#7C3AED] font-bold">{fb.subject} Faculty</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-mono block">{fb.date}</span>
                    <div className="flex items-center gap-0.5 text-amber-400 mt-0.5 justify-end">
                      {[...Array(fb.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-700 font-medium bg-purple-50/50 p-3.5 rounded-xl border border-purple-100 leading-relaxed italic">
                  "{fb.remark}"
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100">
                    <span className="font-black text-emerald-900 block text-[10px] uppercase">Strength Area:</span>
                    <span className="text-emerald-950 font-bold">{fb.strengthArea}</span>
                  </div>
                  <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-100">
                    <span className="font-black text-amber-900 block text-[10px] uppercase">Area for Improvement:</span>
                    <span className="text-amber-950 font-bold">{fb.areaOfImprovement}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION E: PARENT ACADEMIC NOTIFICATIONS                                  */}
      {/* ========================================================================= */}
      {activeReportTab === 'notifications' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-[#1E1B4B]">Academic Notifications & Activity Feed</h3>
            <span className="text-xs text-purple-700 font-bold">{academicNotifications.length} alerts logged</span>
          </div>

          <div className="space-y-2.5">
            {academicNotifications.map((notif) => (
              <div
                key={notif.id}
                className="p-4 rounded-2xl bg-white border border-purple-100 flex items-start gap-3 shadow-xs"
              >
                <div className="p-2 rounded-xl bg-purple-100 text-[#7C3AED] mt-0.5">
                  <Bell className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-xs text-[#1E1B4B]">{notif.title}</h4>
                    <span className="text-[10px] text-slate-400 font-medium">{notif.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">{notif.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION F: MONTHLY ACADEMIC REPORT MODAL (PDF FORMAT)                     */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {showMonthlyPdfModal && (
          <div className="fixed inset-0 bg-[#1E1B4B]/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-purple-200 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowMonthlyPdfModal(false)}
                className="absolute top-4 right-4 p-2 text-purple-400 hover:text-purple-700 rounded-2xl hover:bg-purple-50 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div id="monthly-academic-report-doc" className="border-2 border-purple-200 rounded-2xl p-6 sm:p-8 space-y-6 bg-[#FCFAFF]">
                {/* School Header */}
                <div className="flex items-center justify-between border-b-2 border-purple-200 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#7C3AED] text-white flex items-center justify-center font-black text-lg shadow-md">
                      SJ
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-[#1E1B4B]">ST. JUDE INTERNATIONAL ACADEMY</h2>
                      <p className="text-[11px] text-purple-800 font-bold">Comprehensive Monthly Academic Performance Dossier</p>
                      <p className="text-[10px] text-slate-500 font-mono">Academic Month: May 2026 • Term II</p>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-200">
                    ACADEMIC EXCELLENCE
                  </span>
                </div>

                {/* Metadata */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-purple-50 p-3.5 rounded-xl border border-purple-100 font-bold">
                  <div>
                    <span className="text-[10px] text-purple-700 uppercase block">Student Name</span>
                    <span>{selectedChild.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-purple-700 uppercase block">Standard</span>
                    <span className="text-[#7C3AED]">{selectedChild.grade} - Sec {selectedChild.section}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-purple-700 uppercase block">Cumulative GPA</span>
                    <span>3.88 / 4.0</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-purple-700 uppercase block">Attendance Rate</span>
                    <span className="text-emerald-700">97.5% Present</span>
                  </div>
                </div>

                {/* Homework Summary Box */}
                <div className="p-4 bg-white rounded-xl border border-purple-100 space-y-2 text-xs">
                  <h4 className="font-black text-[#1E1B4B]">Homework Completion Summary:</h4>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <span className="text-[10px] text-purple-700 block">Total Assigned</span>
                      <span className="text-base font-black">{totalHomework}</span>
                    </div>
                    <div className="p-2 bg-emerald-50 rounded-lg">
                      <span className="text-[10px] text-emerald-700 block">Completed</span>
                      <span className="text-base font-black text-emerald-800">{completedHomework}</span>
                    </div>
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <span className="text-[10px] text-purple-900 block">Completion Rate</span>
                      <span className="text-base font-black text-[#7C3AED]">{homeworkCompletionRate}%</span>
                    </div>
                  </div>
                </div>

                {/* Tests Table */}
                <div className="border border-purple-100 rounded-xl overflow-hidden text-xs">
                  <div className="grid grid-cols-12 bg-purple-100 p-2 font-black text-purple-900 text-[10px]">
                    <span className="col-span-5">Assessment Title</span>
                    <span className="col-span-3">Subject & Category</span>
                    <span className="col-span-2 text-center">Date</span>
                    <span className="col-span-2 text-right">Result</span>
                  </div>
                  <div className="divide-y divide-purple-50 bg-white">
                    {testList.map((t) => (
                      <div key={t.id} className="grid grid-cols-12 p-2 text-[11px] items-center">
                        <span className="col-span-5 font-bold text-[#1E1B4B]">{t.title}</span>
                        <span className="col-span-3 text-purple-700">{t.subject} ({t.category})</span>
                        <span className="col-span-2 text-center text-slate-500 font-mono">{t.testDate}</span>
                        <span className="col-span-2 text-right font-black text-emerald-800">
                          {t.isPublished && t.obtainedMarks !== undefined ? `${t.obtainedMarks}/${t.maxMarks}` : 'Pending'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Teacher Summary Remark */}
                <div className="p-3.5 bg-purple-50 rounded-xl border border-purple-100 text-xs space-y-1">
                  <span className="font-black text-[#1E1B4B] block">Academic Dean & Faculty Remarks:</span>
                  <p className="text-slate-700 italic">
                    "{selectedChild.name} demonstrates exemplary scientific and mathematical intuition. Recommended to continue regular assignment submission rhythm."
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 rounded-2xl bg-purple-50 hover:bg-purple-100 text-[#7C3AED] border border-purple-200 font-bold text-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print PDF</span>
                </button>
                <button
                  onClick={() => setShowMonthlyPdfModal(false)}
                  className="px-5 py-2.5 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-black text-xs cursor-pointer"
                >
                  Close Dossier
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
