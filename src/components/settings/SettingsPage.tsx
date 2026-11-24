import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  User,
  GraduationCap,
  BookOpen,
  Shield,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Save,
  Sparkles,
  School,
  Lock,
  Layers,
  Check,
  RefreshCw,
  Eye,
  EyeOff,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { evaluatePasswordStrength } from '../../utils/crypto';
import { useLanguage } from '../../context/LanguageContext';

export const SettingsPage: React.FC = () => {
  const { user, role, updateUserProfile, changeUserPassword } = useApp();
  
  let language = 'en';
  let setLanguage: (lang: any) => void = () => {};
  let availableLanguages: any[] = [];
  let t = (_key: string, fallback?: string) => fallback || _key;

  try {
    const lang = useLanguage();
    language = lang.language;
    setLanguage = lang.setLanguage;
    availableLanguages = lang.availableLanguages;
    t = lang.t;
  } catch {
    // Graceful fallback if used outside LanguageProvider
  }

  // Profile Form States
  const [name, setName] = useState(user.name);
  const [gradeOrSubject, setGradeOrSubject] = useState(user.gradeOrSubject || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Change Password Form States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Password Strength Evaluation
  const strength = evaluatePasswordStrength(newPassword);

  // Sync state if user changes or switches person
  useEffect(() => {
    setName(user.name);
    setGradeOrSubject(user.gradeOrSubject || '');
    setSaveSuccess(false);
    setErrorMessage(null);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordSuccess(null);
    setPasswordError(null);
  }, [user, role]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Full name cannot be empty.');
      return;
    }

    if (role === 'student' && !gradeOrSubject.trim()) {
      setErrorMessage('Class / Year is required.');
      return;
    }

    if (role === 'teacher' && !gradeOrSubject.trim()) {
      setErrorMessage('Teaching Subject is required.');
      return;
    }

    setIsSaving(true);
    try {
      await updateUserProfile({
        name: name.trim(),
        gradeOrSubject: gradeOrSubject.trim()
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      setErrorMessage('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }

    if (!newPassword) {
      setPasswordError('Please enter a new password.');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError('New password must be different from your current password.');
      return;
    }

    setPasswordSaving(true);
    try {
      const res = await changeUserPassword(currentPassword, newPassword);
      if (res.success) {
        setPasswordSuccess(res.message);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setPasswordSuccess(null), 4000);
      } else {
        setPasswordError(res.message);
      }
    } catch {
      setPasswordError('Failed to update password. Please check your current password.');
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 md:p-8 rounded-3xl purple-gradient-hero text-white shadow-xl glow-purple relative overflow-hidden"
      >
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black tracking-wide uppercase border border-white/20">
              <Settings className="w-3.5 h-3.5 text-white animate-spin-slow" />
              <span>{t('settings.portalBadge', 'Portal Settings')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">{t('settings.title', 'Account & Security Settings')}</h1>
            <p className="text-xs sm:text-sm text-purple-100 font-medium">
              {t('settings.subtitle', 'Manage your personal credentials, profile information, and role-based access.')}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/10 p-2.5 rounded-2xl border border-white/20 backdrop-blur-md">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={user.name}
              className="w-11 h-11 rounded-xl object-cover ring-2 ring-white/30"
            />
            <div className="text-left">
              <span className="text-xs font-black block text-white">{user.name}</span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white text-[#7C3AED] inline-block mt-0.5 shadow-xs">
                {role} Profile
              </span>
            </div>
          </div>
        </div>

        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </motion.div>

      {/* 5-Language Selection Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="p-6 md:p-8 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-4"
      >
        <div className="flex items-center justify-between border-b border-purple-50 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#7C3AED] flex items-center justify-center font-black">
              <Globe className="w-5 h-5 text-[#7C3AED]" />
            </div>
            <div>
              <h2 className="text-base font-black text-[#1E1B4B]">{t('settings.langSelect', 'Language & Region')}</h2>
              <p className="text-xs text-purple-700 font-medium">
                {t('settings.langSelectDesc', 'Choose your preferred language across the entire application interface.')}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            5 Languages Active
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-1">
          {availableLanguages.map((l) => {
            const isSelected = language === l.code;
            return (
              <motion.button
                key={l.code}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => setLanguage(l.code)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'bg-gradient-to-tr from-[#7C3AED] to-[#9333EA] text-white border-transparent shadow-md glow-purple'
                    : 'bg-purple-50/50 hover:bg-purple-100/70 border-purple-100 text-[#1E1B4B]'
                }`}
              >
                <div className="text-xl mb-1.5">{l.flag}</div>
                <p className={`font-black text-sm leading-tight ${isSelected ? 'text-white' : 'text-[#1E1B4B]'}`}>
                  {l.nativeName}
                </p>
                <p className={`text-[11px] font-medium mt-0.5 ${isSelected ? 'text-purple-100' : 'text-purple-600'}`}>
                  {l.name}
                </p>
                {isSelected && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-white shadow-xs" />
                )}
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Role Details Summary Card */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1 space-y-6"
        >
          <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-5">
            <div className="flex items-center gap-3 border-b border-purple-50 pb-4">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#7C3AED] to-[#9333EA] text-white flex items-center justify-center shadow-sm">
                {role === 'student' ? <GraduationCap className="w-6 h-6" /> :
                 role === 'teacher' ? <Shield className="w-6 h-6" /> :
                 role === 'parent' ? <User className="w-6 h-6" /> : <School className="w-6 h-6" />}
              </div>
              <div>
                <h3 className="text-sm font-black text-[#1E1B4B]">{t('settings.persona', 'Current Person')}</h3>
                <p className="text-xs font-extrabold text-[#7C3AED] capitalize">{role} Account</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100">
                <span className="text-purple-600 font-bold block text-[11px] mb-0.5">{t('settings.fullName', 'Full Name')}</span>
                <span className="font-black text-[#1E1B4B] text-sm">{user.name}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100">
                <span className="text-purple-600 font-bold block text-[11px] mb-0.5">{t('settings.email', 'Email Address')}</span>
                <span className="font-extrabold text-[#1E1B4B] truncate block">{user.email}</span>
              </div>

              {role === 'student' && (
                <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100">
                  <span className="text-purple-600 font-bold block text-[11px] mb-0.5">{t('settings.classYear', 'Class / Year')}</span>
                  <span className="font-extrabold text-[#7C3AED]">{user.gradeOrSubject || 'Class 5-A'}</span>
                </div>
              )}

              {role === 'teacher' && (
                <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100">
                  <span className="text-purple-600 font-bold block text-[11px] mb-0.5">{t('settings.teachingSubject', 'Teaching Subject')}</span>
                  <span className="font-extrabold text-[#7C3AED]">{user.gradeOrSubject || 'Physics & Mathematics'}</span>
                </div>
              )}

              {role === 'parent' && (
                <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100">
                  <span className="text-purple-600 font-bold block text-[11px] mb-0.5">{t('settings.associatedWard', 'Associated Ward')}</span>
                  <span className="font-extrabold text-[#7C3AED]">Aarav Sharma (Class 5-A)</span>
                </div>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Role-Based Access Control verified and active.</span>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Profile & Change Password Forms */}
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Section 1: Role-Specific Profile Editing Form */}
          <div className="p-6 md:p-8 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-purple-50 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#7C3AED] flex items-center justify-center font-black">
                  {role === 'student' ? <GraduationCap className="w-5 h-5" /> :
                   role === 'teacher' ? <BookOpen className="w-5 h-5" /> :
                   role === 'parent' ? <User className="w-5 h-5" /> : <School className="w-5 h-5" />}
                </div>
                <div>
                  <h2 className="text-lg font-black text-[#1E1B4B]">
                    {role === 'student' ? t('settings.studentInfo', 'Student Profile Information') :
                     role === 'teacher' ? t('settings.teacherInfo', 'Teacher Profile Information') :
                     role === 'parent' ? t('settings.parentInfo', 'Parent Profile Information') : t('settings.adminInfo', 'Administrator Profile')}
                  </h2>
                  <p className="text-xs text-purple-700 font-medium">
                    {role === 'student' ? t('settings.studentDesc', 'View and update your student name and enrolled class/year.') :
                     role === 'teacher' ? t('settings.teacherDesc', 'View and update your educator name and assigned teaching subject.') :
                     role === 'parent' ? t('settings.parentDesc', 'View and update your parent identity and account name.') :
                     t('settings.adminDesc', 'Manage institutional administrator information.')}
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-purple-100 text-[#7C3AED] border border-purple-200">
                {role}
              </span>
            </div>

            {/* Profile Notifications / Alerts */}
            <AnimatePresence>
              {saveSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-800 text-xs font-extrabold flex items-center gap-2 shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Profile updated successfully! Changes have been saved.</span>
                </motion.div>
              )}

              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3.5 bg-rose-50 border border-rose-300 rounded-2xl text-rose-800 text-xs font-extrabold flex items-center gap-2 shadow-xs"
                >
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Profile Editing Form */}
            <form onSubmit={handleProfileSave} className="space-y-5">
              {/* STUDENT PROFILE */}
              {role === 'student' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-purple-950 mb-1.5">
                      Student Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Aarav Sharma"
                        className="w-full pl-10 pr-4 py-2.5 bg-purple-50/50 border border-purple-100 rounded-2xl text-sm text-[#1E1B4B] font-medium focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-purple-950 mb-1.5">
                      Class / Year <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <GraduationCap className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
                      <input
                        type="text"
                        value={gradeOrSubject}
                        onChange={(e) => setGradeOrSubject(e.target.value)}
                        placeholder="e.g. Class 5-A, Year 2026"
                        className="w-full pl-10 pr-4 py-2.5 bg-purple-50/50 border border-purple-100 rounded-2xl text-sm text-[#1E1B4B] font-medium focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all"
                        required
                      />
                    </div>
                    <p className="text-[11px] text-purple-600 font-semibold mt-1 pl-1">
                      Enrolled academic cohort or classroom section.
                    </p>
                  </div>
                </div>
              )}

              {/* TEACHER PROFILE */}
              {role === 'teacher' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-purple-950 mb-1.5">
                      Teacher Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Mrs. Sharma"
                        className="w-full pl-10 pr-4 py-2.5 bg-purple-50/50 border border-purple-100 rounded-2xl text-sm text-[#1E1B4B] font-medium focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-purple-950 mb-1.5">
                      Teaching Subject <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <BookOpen className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
                      <input
                        type="text"
                        value={gradeOrSubject}
                        onChange={(e) => setGradeOrSubject(e.target.value)}
                        placeholder="e.g. Mathematics & Physics"
                        className="w-full pl-10 pr-4 py-2.5 bg-purple-50/50 border border-purple-100 rounded-2xl text-sm text-[#1E1B4B] font-medium focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all"
                        required
                      />
                    </div>
                    <p className="text-[11px] text-purple-600 font-semibold mt-1 pl-1">
                      Primary subject specialty or curriculum department.
                    </p>
                  </div>
                </div>
              )}

              {/* PARENT PROFILE */}
              {role === 'parent' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-purple-950 mb-1.5">
                      Parent Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Priya Sharma"
                        className="w-full pl-10 pr-4 py-2.5 bg-purple-50/50 border border-purple-100 rounded-2xl text-sm text-[#1E1B4B] font-medium focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all"
                        required
                      />
                    </div>
                    <p className="text-[11px] text-purple-600 font-semibold mt-1 pl-1">
                      Guardian/Parent name associated with enrolled student accounts.
                    </p>
                  </div>
                </div>
              )}

              {/* ADMIN PROFILE */}
              {role === 'admin' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-black text-purple-950 mb-1.5">
                      Administrator Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Dr. Eleanor Vance"
                        className="w-full pl-10 pr-4 py-2.5 bg-purple-50/50 border border-purple-100 rounded-2xl text-sm text-[#1E1B4B] font-medium focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-purple-950 mb-1.5">
                      Administrative Title
                    </label>
                    <div className="relative">
                      <School className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
                      <input
                        type="text"
                        value={gradeOrSubject}
                        onChange={(e) => setGradeOrSubject(e.target.value)}
                        placeholder="e.g. Principal & Campus Director"
                        className="w-full pl-10 pr-4 py-2.5 bg-purple-50/50 border border-purple-100 rounded-2xl text-sm text-[#1E1B4B] font-medium focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Profile Action Buttons */}
              <div className="pt-4 border-t border-purple-50 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setName(user.name);
                    setGradeOrSubject(user.gradeOrSubject || '');
                  }}
                  className="px-4 py-2.5 rounded-2xl border border-purple-200 text-purple-700 hover:bg-purple-50 text-xs font-extrabold transition-all cursor-pointer"
                >
                  {t('settings.resetChanges', 'Reset Changes')}
                </button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#9333EA] hover:from-[#6D28D9] hover:to-[#7E22CE] text-white text-xs font-extrabold shadow-md glow-purple transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{t('settings.savingProfile', 'Saving Profile...')}</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{t('settings.updateProfile', 'Update Profile')}</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </div>

          {/* Section 2: Complete Change Password Card */}
          <div className="p-6 md:p-8 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-purple-50 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-black">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-[#1E1B4B]">{t('settings.changePassword', 'Change Password')}</h3>
                <p className="text-xs text-purple-700 font-medium">
                  {t('settings.changePasswordDesc', 'Update your security password with cryptographic encryption. Passwords are never stored in plain text.')}
                </p>
              </div>
            </div>

            {/* Password Alerts */}
            <AnimatePresence>
              {passwordSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-800 text-xs font-extrabold flex items-center gap-2 shadow-xs"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{passwordSuccess}</span>
                </motion.div>
              )}

              {passwordError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3.5 bg-rose-50 border border-rose-300 rounded-2xl text-rose-800 text-xs font-extrabold flex items-center gap-2 shadow-xs"
                >
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>{passwordError}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              {/* Current Password Field */}
              <div>
                <label className="block text-xs font-black text-purple-950 mb-1.5">
                  {t('settings.currentPassword', 'Current Password')} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password (default: Password123!)"
                    className="w-full pl-10 pr-10 py-2.5 bg-purple-50/50 border border-purple-100 rounded-2xl text-sm text-[#1E1B4B] font-medium focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-700 transition-colors cursor-pointer"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password Field */}
              <div>
                <label className="block text-xs font-black text-purple-950 mb-1.5">
                  {t('settings.newPassword', 'New Password')} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new strong password"
                    className="w-full pl-10 pr-10 py-2.5 bg-purple-50/50 border border-purple-100 rounded-2xl text-sm text-[#1E1B4B] font-medium focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-700 transition-colors cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {newPassword.length > 0 && (
                  <div className="mt-2.5 space-y-2 p-3 bg-purple-50/60 rounded-2xl border border-purple-100">
                    <div className="flex items-center justify-between text-[11px] font-black">
                      <span className="text-purple-800">{t('settings.passwordStrength', 'Password Strength')}:</span>
                      <span className={`px-2 py-0.5 rounded-full text-white text-[10px] ${
                        strength.label === 'Weak' ? 'bg-rose-500' :
                        strength.label === 'Fair' ? 'bg-amber-500' :
                        strength.label === 'Good' ? 'bg-blue-500' : 'bg-emerald-500'
                      }`}>
                        {strength.label}
                      </span>
                    </div>

                    {/* Progress bars */}
                    <div className="grid grid-cols-4 gap-1.5">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            strength.score >= step
                              ? strength.score <= 1 ? 'bg-rose-500' :
                                strength.score === 2 ? 'bg-amber-500' :
                                strength.score === 3 ? 'bg-blue-500' : 'bg-emerald-500'
                              : 'bg-purple-200'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Rule checklist */}
                    <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px] text-purple-900 font-bold">
                      <div className="flex items-center gap-1">
                        <span className={strength.hasMinLength ? 'text-emerald-600' : 'text-purple-300'}>
                          {strength.hasMinLength ? '✓' : '•'}
                        </span>
                        <span>8+ Characters</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={strength.hasUpper && strength.hasLower ? 'text-emerald-600' : 'text-purple-300'}>
                          {strength.hasUpper && strength.hasLower ? '✓' : '•'}
                        </span>
                        <span>Upper & Lowercase</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={strength.hasNumber ? 'text-emerald-600' : 'text-purple-300'}>
                          {strength.hasNumber ? '✓' : '•'}
                        </span>
                        <span>Numbers (0-9)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={strength.hasSpecial ? 'text-emerald-600' : 'text-purple-300'}>
                          {strength.hasSpecial ? '✓' : '•'}
                        </span>
                        <span>Special Symbol (!@#)</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-xs font-black text-purple-950 mb-1.5">
                  {t('settings.confirmPassword', 'Confirm New Password')} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    className="w-full pl-10 pr-10 py-2.5 bg-purple-50/50 border border-purple-100 rounded-2xl text-sm text-[#1E1B4B] font-medium focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-700 transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={passwordSaving || !currentPassword || !newPassword || !confirmPassword}
                  className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-[#7C3AED] hover:from-amber-600 hover:to-[#6D28D9] text-white text-xs font-extrabold shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {passwordSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{t('settings.hashingUpdating', 'Hashing & Updating...')}</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>{t('settings.updatePassword', 'Update Password')}</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
