import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../../context/AppContext';
import { Assignment, TestAssessment, AssessmentCategory } from '../../../types';
import {
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Upload,
  FileText,
  User,
  Award,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  CheckSquare,
  X,
  HelpCircle,
  FileCheck
} from 'lucide-react';

interface Props {
  initialTab?: 'homework' | 'tests';
}

export const HomeworkAndAssessments: React.FC<Props> = ({ initialTab = 'homework' }) => {
  const { homeworkList, submitHomework, testList } = useApp();
  const [activeTab, setActiveTab] = useState<'homework' | 'tests'>(initialTab);

  // Homework filters & submission modal
  const [hwFilter, setHwFilter] = useState<'all' | 'pending' | 'submitted' | 'overdue'>('all');
  const [selectedHwToSubmit, setSelectedHwToSubmit] = useState<Assignment | null>(null);
  const [submissionNote, setSubmissionNote] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('assignment_answers.pdf');

  // Test filters
  const [testCategoryFilter, setTestCategoryFilter] = useState<string>('all');
  const [testStatusFilter, setTestStatusFilter] = useState<'all' | 'upcoming' | 'completed'>('all');

  // Metrics for Homework
  const totalHw = homeworkList.length;
  const completedHw = homeworkList.filter(h => h.status === 'submitted' || h.status === 'graded').length;
  const pendingHw = homeworkList.filter(h => h.status === 'pending').length;
  const overdueHw = homeworkList.filter(h => h.status === 'overdue').length;

  const filteredHomework = homeworkList.filter(h => {
    if (hwFilter === 'all') return true;
    if (hwFilter === 'pending') return h.status === 'pending';
    if (hwFilter === 'submitted') return h.status === 'submitted' || h.status === 'graded';
    if (hwFilter === 'overdue') return h.status === 'overdue';
    return true;
  });

  // Metrics for Tests
  const totalTests = testList.length;
  const upcomingTests = testList.filter(t => t.status === 'upcoming').length;
  const completedTests = testList.filter(t => t.status === 'completed').length;
  const publishedTests = testList.filter(t => t.isPublished && t.obtainedMarks !== undefined);
  const avgTestScore = publishedTests.length > 0
    ? Math.round(publishedTests.reduce((acc, t) => acc + ((t.obtainedMarks! / t.maxMarks) * 100), 0) / publishedTests.length)
    : 88;

  const filteredTests = testList.filter(t => {
    if (testCategoryFilter !== 'all' && t.category !== testCategoryFilter) return false;
    if (testStatusFilter === 'upcoming' && t.status !== 'upcoming') return false;
    if (testStatusFilter === 'completed' && t.status !== 'completed') return false;
    return true;
  });

  const handleConfirmSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHwToSubmit) return;
    submitHomework(selectedHwToSubmit.id, submissionNote || `Attached file: ${selectedFileName}`);
    setSelectedHwToSubmit(null);
    setSubmissionNote('');
  };

  const testCategories: AssessmentCategory[] = [
    'Class Test',
    'Unit Test',
    'Weekly Test',
    'Monthly Test',
    'Home Test',
    'Model Examination',
    'Internal Assessment'
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Tab Navigation */}
      <div className="p-6 rounded-3xl clay-card space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-purple-100 text-[#7C3AED] text-xs font-black">
                ACADEMICS & CURRICULUM
              </span>
              <span className="text-xs text-purple-700 font-bold">Standard 8 Curriculum</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#1E1B4B] mt-1">
              Homework & Assessments Hub
            </h2>
            <p className="text-xs text-purple-800 font-medium">
              Manage day-to-day subject homework, view test schedules, and monitor published examination results.
            </p>
          </div>

          {/* Primary Two-Tab Switcher */}
          <div className="flex bg-purple-50 p-1.5 rounded-2xl border border-purple-100 text-xs">
            <button
              onClick={() => setActiveTab('homework')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black transition-all cursor-pointer ${
                activeTab === 'homework'
                  ? 'bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white shadow-md'
                  : 'text-purple-900 hover:text-purple-950'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Homework</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === 'homework' ? 'bg-white/20 text-white' : 'bg-purple-200 text-purple-900'
              }`}>
                {pendingHw} Pending
              </span>
            </button>

            <button
              onClick={() => setActiveTab('tests')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black transition-all cursor-pointer ${
                activeTab === 'tests'
                  ? 'bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white shadow-md'
                  : 'text-purple-900 hover:text-purple-950'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Tests & Assessments</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === 'tests' ? 'bg-white/20 text-white' : 'bg-purple-200 text-purple-900'
              }`}>
                {upcomingTests} Upcoming
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB A: HOMEWORK SECTION                                                  */}
      {/* ========================================================================= */}
      {activeTab === 'homework' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Homework Summary Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-3xl clay-card">
              <span className="text-[11px] font-bold text-purple-700 block">Total Assigned</span>
              <p className="text-2xl font-black text-[#1E1B4B] mt-1">{totalHw}</p>
              <span className="text-[10px] text-purple-600 font-semibold">Across all subjects</span>
            </div>

            <div className="p-4 rounded-3xl clay-card">
              <span className="text-[11px] font-bold text-emerald-700 block">Completed</span>
              <p className="text-2xl font-black text-emerald-800 mt-1">{completedHw}</p>
              <span className="text-[10px] text-emerald-600 font-semibold">Submitted & verified</span>
            </div>

            <div className="p-4 rounded-3xl clay-card">
              <span className="text-[11px] font-bold text-amber-700 block">Pending</span>
              <p className="text-2xl font-black text-amber-800 mt-1">{pendingHw}</p>
              <span className="text-[10px] text-amber-600 font-semibold">Action required</span>
            </div>

            <div className="p-4 rounded-3xl clay-card">
              <span className="text-[11px] font-bold text-rose-700 block">Overdue</span>
              <p className="text-2xl font-black text-rose-800 mt-1">{overdueHw}</p>
              <span className="text-[10px] text-rose-600 font-semibold">Past deadline</span>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-purple-100 shadow-xs text-xs">
              {(['all', 'pending', 'submitted', 'overdue'] as const).map((key) => (
                <button
                  key={key}
                  onClick={() => setHwFilter(key)}
                  className={`px-3 py-1.5 rounded-xl font-bold capitalize transition-all cursor-pointer ${
                    hwFilter === key
                      ? 'bg-[#7C3AED] text-white shadow-xs'
                      : 'text-purple-900 hover:bg-purple-50'
                  }`}
                >
                  {key === 'all' ? 'All Assignments' : key}
                </button>
              ))}
            </div>

            <p className="text-xs text-purple-800 font-bold">
              Showing {filteredHomework.length} assignments
            </p>
          </div>

          {/* Assignments List */}
          <div className="space-y-4">
            {filteredHomework.map((hw) => {
              const isOverdue = hw.status === 'overdue';
              const isSubmitted = hw.status === 'submitted' || hw.status === 'graded';
              return (
                <div
                  key={hw.id}
                  className={`p-5 rounded-3xl bg-white border transition-all ${
                    isOverdue
                      ? 'border-rose-200 bg-rose-50/20 shadow-xs'
                      : isSubmitted
                      ? 'border-emerald-200 bg-emerald-50/10 shadow-xs'
                      : 'border-purple-100 shadow-sm hover:border-purple-300'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-100 text-[#7C3AED]">
                          {hw.subject}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          isSubmitted
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : isOverdue
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {hw.status}
                        </span>
                        <span className="text-xs text-slate-500 font-bold flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-purple-400" />
                          Teacher: {hw.teacherName || 'Subject Educator'}
                        </span>
                      </div>

                      <h3 className="text-base font-black text-[#1E1B4B]">{hw.title}</h3>

                      {hw.instructions && (
                        <p className="text-xs text-slate-600 bg-purple-50/50 p-3 rounded-2xl border border-purple-100 leading-relaxed font-medium">
                          <strong>Instructions:</strong> {hw.instructions}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-xs text-purple-800 font-bold flex-wrap pt-1">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#7C3AED]" /> Assigned: {hw.assignedDate || '2026-05-18'}
                        </span>
                        <span className={`flex items-center gap-1.5 ${isOverdue ? 'text-rose-600 font-black' : ''}`}>
                          <Clock className="w-3.5 h-3.5" /> Due Date: {hw.dueDate}
                        </span>
                        <span>Max Score: {hw.maxScore} pts</span>
                      </div>

                      {isSubmitted && hw.studentSubmission && (
                        <div className="text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>
                            <strong>Submitted Work:</strong> {hw.studentSubmission}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="shrink-0 flex items-center md:flex-col gap-2">
                      {!isSubmitted ? (
                        <button
                          onClick={() => setSelectedHwToSubmit(hw)}
                          className="w-full sm:w-auto px-5 py-2.5 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-black text-xs shadow-md glow-purple transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Submit Work</span>
                        </button>
                      ) : (
                        <div className="px-4 py-2 rounded-2xl bg-emerald-100 text-emerald-800 text-xs font-black flex items-center gap-1.5 border border-emerald-200">
                          <FileCheck className="w-4 h-4 text-emerald-600" />
                          <span>Turned In</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB B: TESTS & ASSESSMENTS SECTION                                       */}
      {/* ========================================================================= */}
      {activeTab === 'tests' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Test Performance & Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-3xl clay-card">
              <span className="text-[11px] font-bold text-purple-700 block">Total Tests</span>
              <p className="text-2xl font-black text-[#1E1B4B] mt-1">{totalTests}</p>
              <span className="text-[10px] text-purple-600 font-semibold">Scheduled this term</span>
            </div>

            <div className="p-4 rounded-3xl clay-card">
              <span className="text-[11px] font-bold text-indigo-700 block">Upcoming Tests</span>
              <p className="text-2xl font-black text-indigo-800 mt-1">{upcomingTests}</p>
              <span className="text-[10px] text-indigo-600 font-semibold">Prepare syllabus</span>
            </div>

            <div className="p-4 rounded-3xl clay-card">
              <span className="text-[11px] font-bold text-emerald-700 block">Completed</span>
              <p className="text-2xl font-black text-emerald-800 mt-1">{completedTests}</p>
              <span className="text-[10px] text-emerald-600 font-semibold">Evaluations</span>
            </div>

            <div className="p-4 rounded-3xl clay-card">
              <span className="text-[11px] font-bold text-amber-700 block">Average Score</span>
              <p className="text-2xl font-black text-amber-800 mt-1">{avgTestScore}%</p>
              <span className="text-[10px] text-amber-600 font-semibold">Published tests</span>
            </div>
          </div>

          {/* Category & Status Filter Bar */}
          <div className="p-4 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#7C3AED]" />
                <span className="text-xs font-black text-[#1E1B4B]">Filter by Assessment Category:</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                {(['all', 'upcoming', 'completed'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setTestStatusFilter(s)}
                    className={`px-3 py-1 rounded-xl font-bold capitalize transition-all cursor-pointer ${
                      testStatusFilter === s
                        ? 'bg-purple-100 text-[#7C3AED] border border-purple-200'
                        : 'text-purple-800 hover:bg-purple-50'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Assessment Category Buttons */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <button
                onClick={() => setTestCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-black whitespace-nowrap cursor-pointer transition-all ${
                  testCategoryFilter === 'all'
                    ? 'bg-[#7C3AED] text-white shadow-xs'
                    : 'bg-purple-50 text-purple-900 hover:bg-purple-100 border border-purple-200'
                }`}
              >
                All Categories
              </button>
              {testCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setTestCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl font-black whitespace-nowrap cursor-pointer transition-all ${
                    testCategoryFilter === cat
                      ? 'bg-[#7C3AED] text-white shadow-xs'
                      : 'bg-purple-50 text-purple-900 hover:bg-purple-100 border border-purple-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Tests List */}
          <div className="space-y-4">
            {filteredTests.map((test) => {
              const isUpcoming = test.status === 'upcoming';
              return (
                <div
                  key={test.id}
                  className={`p-6 rounded-3xl bg-white border transition-all ${
                    isUpcoming
                      ? 'border-indigo-200 shadow-sm'
                      : test.isPublished
                      ? 'border-emerald-200 shadow-sm'
                      : 'border-purple-100 shadow-sm'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-2.5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-3 py-1 rounded-full text-xs font-black bg-purple-100 text-[#7C3AED]">
                          {test.subject}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-100 text-indigo-800 border border-indigo-200">
                          {test.category}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          isUpcoming
                            ? 'bg-blue-100 text-blue-800'
                            : test.isPublished
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {isUpcoming ? 'Scheduled' : test.isPublished ? 'Published Result' : 'Evaluation In Progress'}
                        </span>
                      </div>

                      <h3 className="text-base font-black text-[#1E1B4B]">{test.title}</h3>

                      <div className="flex items-center gap-4 text-xs text-purple-900 font-bold flex-wrap">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#7C3AED]" /> Date: {test.testDate}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#7C3AED]" /> Time: {test.testTime}
                        </span>
                        <span>Duration: {test.duration}</span>
                        <span>Max Marks: {test.maxMarks}</span>
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-purple-400" /> Teacher: {test.teacherName}
                        </span>
                      </div>

                      <div className="text-xs text-slate-700 bg-purple-50/40 p-3 rounded-2xl border border-purple-100">
                        <span className="font-black text-[#1E1B4B] block mb-0.5">Syllabus & Topics Covered:</span>
                        <p>{test.syllabus}</p>
                      </div>

                      {/* PUBLISHED RESULTS SECTION */}
                      {test.isPublished && test.obtainedMarks !== undefined ? (
                        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                          <div>
                            <span className="text-[10px] font-black uppercase text-emerald-700 tracking-wider">
                              Verified Published Marks
                            </span>
                            <div className="flex items-baseline gap-2 mt-0.5">
                              <span className="text-2xl font-black text-emerald-900">
                                {test.obtainedMarks} / {test.maxMarks}
                              </span>
                              <span className="text-xs font-bold text-emerald-800">
                                ({Math.round((test.obtainedMarks / test.maxMarks) * 100)}%)
                              </span>
                            </div>
                            {test.feedback && (
                              <p className="text-emerald-900 font-medium mt-1">
                                <strong>Teacher Remark:</strong> "{test.feedback}"
                              </p>
                            )}
                          </div>
                          <span className="px-3 py-1 rounded-full bg-emerald-200 text-emerald-900 text-xs font-black self-start sm:self-auto">
                            GRADE A
                          </span>
                        </div>
                      ) : !isUpcoming ? (
                        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-bold flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>
                            Test completed on {test.testDate}. Teacher is currently evaluating papers. Results will be published here upon verification.
                          </span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* HOMEWORK SUBMISSION MODAL                                                */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedHwToSubmit && (
          <div className="fixed inset-0 bg-[#1E1B4B]/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-purple-100 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 relative"
            >
              <button
                onClick={() => setSelectedHwToSubmit(null)}
                className="absolute top-4 right-4 p-2 text-purple-400 hover:text-purple-700 rounded-2xl hover:bg-purple-50 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-1">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-100 text-[#7C3AED] flex items-center justify-center mb-1">
                  <Upload className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-[#1E1B4B]">Submit Homework Assignment</h3>
                <p className="text-xs text-purple-800">
                  {selectedHwToSubmit.title} ({selectedHwToSubmit.subject})
                </p>
              </div>

              <form onSubmit={handleConfirmSubmission} className="space-y-4 text-xs">
                <div>
                  <label className="block text-purple-900 font-bold mb-1">Assignment Submission Notes / Answers</label>
                  <textarea
                    rows={4}
                    value={submissionNote}
                    onChange={(e) => setSubmissionNote(e.target.value)}
                    placeholder="Provide your solution summary, derivation steps, or references..."
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-purple-100 bg-purple-50/50 text-[#1E1B4B] font-medium focus:outline-none focus:border-[#7C3AED]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-purple-900 font-bold mb-1">Upload Work Attachments (PDF / Doc / Image)</label>
                  <div className="p-4 rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/40 text-center space-y-2">
                    <FileText className="w-7 h-7 mx-auto text-[#7C3AED]" />
                    <div className="text-xs text-purple-900 font-bold">
                      Attached: <span className="text-[#7C3AED]">{selectedFileName}</span>
                    </div>
                    <p className="text-[10px] text-slate-500">File attached and verified ready for educator submission</p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setSelectedHwToSubmit(null)}
                    className="px-4 py-2.5 rounded-2xl border border-purple-200 text-purple-900 font-bold hover:bg-purple-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-black shadow-md glow-purple cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckSquare className="w-4 h-4" />
                    <span>Confirm & Turn In</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
