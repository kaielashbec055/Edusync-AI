import React, { useState, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { useLanguage } from '../../../context/LanguageContext';
import { UserRole } from '../../../types';
import {
  X,
  Lock,
  Mail,
  User,
  GraduationCap,
  ShieldCheck,
  School,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Phone,
  AtSign,
  Eye,
  EyeOff,
  AlertCircle,
  HelpCircle,
  Loader2
} from 'lucide-react';
import { evaluatePasswordStrength } from '../../../utils/crypto';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authMode,
    setAuthMode,
    authTargetRole,
    setAuthTargetRole,
    registerAccount,
    loginAccount
  } = useApp();

  const { t } = useLanguage();

  // Mode & Role State
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');

  // Sign In Form State
  const [loginIdentifier, setLoginIdentifier] = useState('alex_student');
  const [loginPassword, setLoginPassword] = useState('Password123!');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Sign Up Form State
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpUsername, setSignUpUsername] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showSignUpConfirmPassword, setShowSignUpConfirmPassword] = useState(false);

  // UI / Feedback State
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [showForgotTip, setShowForgotTip] = useState(false);

  useEffect(() => {
    if (authTargetRole) {
      setSelectedRole(authTargetRole);
      // Pre-fill demo identifier based on target role
      if (authTargetRole === 'student') setLoginIdentifier('alex_student');
      else if (authTargetRole === 'teacher') setLoginIdentifier('dr_thorne');
      else if (authTargetRole === 'parent') setLoginIdentifier('sarah_parent');
      else if (authTargetRole === 'admin') setLoginIdentifier('eleanor_admin');
    }
  }, [authTargetRole]);

  // Reset errors when switching tab
  useEffect(() => {
    setErrorMessage(null);
    setSuccessToast(null);
    setShowForgotTip(false);
  }, [authMode]);

  const isRegister = authMode === 'signup';
  const passwordStrength = evaluatePasswordStrength(signUpPassword);

  if (!isAuthModalOpen) return null;

  // Handle Sign In submission
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessToast(null);

    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      setErrorMessage(t('auth.fillAllFields', 'Please enter your username/email and password.'));
      return;
    }

    setLoading(true);

    try {
      const res = await loginAccount(loginIdentifier.trim(), loginPassword);
      if (!res.success) {
        setErrorMessage(res.message);
        setLoading(false);
        return;
      }

      setSuccessToast(`${t('auth.welcomeBack', 'Welcome Back')}! Redirecting to ${res.user?.role.toUpperCase()} Dashboard...`);
      setTimeout(() => {
        setLoading(false);
        setSuccessToast(null);
        setAuthTargetRole(null);
        setIsAuthModalOpen(false);
      }, 700);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  // Handle Sign Up registration submission
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessToast(null);

    // Required fields check
    if (
      !signUpName.trim() ||
      !signUpEmail.trim() ||
      !signUpPhone.trim() ||
      !signUpUsername.trim() ||
      !signUpPassword ||
      !signUpConfirmPassword
    ) {
      setErrorMessage(t('auth.fillAllFields', 'Please complete all required fields.'));
      return;
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signUpEmail.trim())) {
      setErrorMessage(t('auth.invalidEmail', 'Please enter a valid institutional email address.'));
      return;
    }

    // Phone format validation (at least 10 digits)
    const phoneDigits = signUpPhone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      setErrorMessage(t('auth.invalidPhone', 'Please enter a valid 10-digit mobile number.'));
      return;
    }

    // Username validation (alphanumeric, underscores, min 3 chars)
    if (!/^[a-zA-Z0-9_]{3,30}$/.test(signUpUsername.trim())) {
      setErrorMessage('Username must be 3-30 characters (letters, numbers, underscores).');
      return;
    }

    // Password strength check (min 6 chars)
    if (signUpPassword.length < 6) {
      setErrorMessage(t('auth.passwordTooWeak', 'Password must be at least 6 characters.'));
      return;
    }

    // Password & Confirm Password match check
    if (signUpPassword !== signUpConfirmPassword) {
      setErrorMessage(t('auth.passwordMismatch', 'Password and confirm password do not match.'));
      return;
    }

    setLoading(true);

    try {
      const res = await registerAccount({
        name: signUpName.trim(),
        email: signUpEmail.trim(),
        phone: signUpPhone.trim(),
        username: signUpUsername.trim(),
        password: signUpPassword,
        role: selectedRole
      });

      if (!res.success) {
        setErrorMessage(res.message);
        setLoading(false);
        return;
      }

      setSuccessToast(`Account created for ${signUpName}! Redirecting to ${selectedRole.toUpperCase()} Dashboard...`);

      // Auto login with new registered account
      setTimeout(async () => {
        await loginAccount(signUpUsername.trim(), signUpPassword);
        setLoading(false);
        setSuccessToast(null);
        setAuthTargetRole(null);
        setIsAuthModalOpen(false);
      }, 900);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#1E1B4B]/50 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-purple-100 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-4 relative my-8 animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-purple-400 hover:text-purple-700 rounded-2xl hover:bg-purple-50 cursor-pointer font-bold transition-colors"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Switcher: Sign In vs Sign Up */}
        <div className="flex bg-purple-50 p-1.5 rounded-2xl border border-purple-100 text-xs font-black">
          <button
            data-testid="tab-signin"
            type="button"
            onClick={() => setAuthMode('signin')}
            className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              !isRegister
                ? 'bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white shadow-md'
                : 'text-purple-700 hover:text-purple-950'
            }`}
          >
            <span>{t('auth.signInBtn', 'Sign In')}</span>
          </button>
          <button
            data-testid="tab-signup"
            type="button"
            onClick={() => setAuthMode('signup')}
            className={`flex-1 py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              isRegister
                ? 'bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white shadow-md'
                : 'text-purple-700 hover:text-purple-950'
            }`}
          >
            <span>{t('auth.signUpBtn', 'Sign Up')}</span>
          </button>
        </div>

        {/* Header Title & Branding */}
        <div className="text-center space-y-1 pt-1">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-[#7C3AED] via-[#9333EA] to-[#C084FC] p-0.5 shadow-md flex items-center justify-center glow-purple">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[#7C3AED]" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-[#1E1B4B]">
            {isRegister
              ? t('auth.createAccount', 'Create Institutional Account')
              : t('auth.welcomeBack', 'Welcome Back')}
          </h2>
          <p className="text-xs text-purple-800 font-semibold">
            {isRegister
              ? t('auth.signUpDesc', 'Register a new account with your role and details.')
              : t('auth.signInDesc', 'Sign in to access your role-based dashboard.')}
          </p>
        </div>

        {/* Success Alert Banner */}
        {successToast && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-800 text-xs font-black flex items-center justify-center gap-2 animate-bounce shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-300 rounded-2xl text-rose-800 text-xs font-black flex items-center justify-between gap-2 shadow-sm">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-600 hover:text-rose-900 font-black text-sm cursor-pointer ml-2"
            >
              ×
            </button>
          </div>
        )}

        {/* Forgot Password Tip Box */}
        {showForgotTip && (
          <div className="p-3 bg-amber-50 border border-amber-300 rounded-2xl text-amber-900 text-xs font-medium space-y-1 shadow-sm">
            <div className="flex items-center gap-1.5 font-bold text-amber-950">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>Need Help Signing In?</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Default demo credentials are pre-configured:
              <br />• <strong>Student:</strong> <code className="bg-amber-100 px-1 rounded">alex_student</code> / <code className="bg-amber-100 px-1 rounded">Password123!</code>
              <br />• <strong>Teacher:</strong> <code className="bg-amber-100 px-1 rounded">dr_thorne</code> / <code className="bg-amber-100 px-1 rounded">Password123!</code>
              <br />• <strong>Parent:</strong> <code className="bg-amber-100 px-1 rounded">sarah_parent</code> / <code className="bg-amber-100 px-1 rounded">Password123!</code>
            </p>
          </div>
        )}

        {/* Role Selector Tabs (Active in Sign Up or when choosing Persona) */}
        <div className="space-y-1">
          <label className="block text-[11px] font-black uppercase text-purple-900 tracking-wider">
            {t('auth.role', 'Select Role')}:
          </label>
          <div className="grid grid-cols-4 gap-1.5 bg-purple-50/80 p-1.5 rounded-2xl border border-purple-100">
            {[
              { role: 'student', label: t('auth.student', 'Student'), icon: <GraduationCap className="w-4 h-4" /> },
              { role: 'parent', label: t('auth.parent', 'Parent'), icon: <User className="w-4 h-4" /> },
              { role: 'teacher', label: t('auth.teacher', 'Teacher'), icon: <ShieldCheck className="w-4 h-4" /> },
              { role: 'admin', label: t('auth.admin', 'Admin'), icon: <School className="w-4 h-4" /> }
            ].map((r) => (
              <button
                key={r.role}
                type="button"
                onClick={() => {
                  setSelectedRole(r.role as UserRole);
                  if (!isRegister) {
                    if (r.role === 'student') setLoginIdentifier('alex_student');
                    else if (r.role === 'teacher') setLoginIdentifier('dr_thorne');
                    else if (r.role === 'parent') setLoginIdentifier('sarah_parent');
                    else if (r.role === 'admin') setLoginIdentifier('eleanor_admin');
                  }
                }}
                className={`py-2 px-1 rounded-xl text-xs font-black transition-all flex flex-col items-center gap-1 cursor-pointer ${
                  selectedRole === r.role
                    ? 'bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white shadow-sm'
                    : 'text-purple-700 hover:text-purple-950 hover:bg-purple-100/50'
                }`}
              >
                {r.icon}
                <span className="text-[10px]">{r.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* A. SIGN UP FORM */}
        {/* ========================================================================= */}
        {isRegister ? (
          <form onSubmit={handleSignUpSubmit} className="space-y-3 text-xs">
            {/* Full Name */}
            <div>
              <label className="block text-purple-950 mb-1 font-bold">
                {t('auth.fullName', 'Full Name')} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
                <input
                  type="text"
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full pl-10 pr-3 py-2.5 bg-purple-50/50 border border-purple-100 rounded-2xl text-[#1E1B4B] font-medium focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            {/* Email Address & Phone Number (2 Columns on tablet/desktop) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-purple-950 mb-1 font-bold">
                  {t('auth.email', 'Email Address')} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
                  <input
                    type="email"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="name@school.edu"
                    className="w-full pl-10 pr-3 py-2.5 bg-purple-50/50 border border-purple-100 rounded-2xl text-[#1E1B4B] font-medium focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-purple-950 mb-1 font-bold">
                  {t('auth.mobile', 'Mobile Number')} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
                  <input
                    type="tel"
                    value={signUpPhone}
                    onChange={(e) => setSignUpPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-3 py-2.5 bg-purple-50/50 border border-purple-100 rounded-2xl text-[#1E1B4B] font-medium focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-purple-950 mb-1 font-bold">
                {t('auth.username', 'Username')} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <AtSign className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
                <input
                  type="text"
                  value={signUpUsername}
                  onChange={(e) => setSignUpUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                  placeholder="e.g. aarav_student"
                  className="w-full pl-10 pr-3 py-2.5 bg-purple-50/50 border border-purple-100 rounded-2xl text-[#1E1B4B] font-medium focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all"
                  required
                />
              </div>
              <p className="text-[10px] text-purple-600 mt-0.5">Use lowercase letters, numbers, or underscores.</p>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-purple-950 mb-1 font-bold">
                  {t('auth.password', 'Password')} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
                  <input
                    type={showSignUpPassword ? 'text' : 'password'}
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full pl-10 pr-9 py-2.5 bg-purple-50/50 border border-purple-100 rounded-2xl text-[#1E1B4B] font-medium focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-700 cursor-pointer"
                  >
                    {showSignUpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-purple-950 mb-1 font-bold">
                  {t('auth.confirmPassword', 'Confirm Password')} <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
                  <input
                    type={showSignUpConfirmPassword ? 'text' : 'password'}
                    value={signUpConfirmPassword}
                    onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full pl-10 pr-9 py-2.5 bg-purple-50/50 border border-purple-100 rounded-2xl text-[#1E1B4B] font-medium focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignUpConfirmPassword(!showSignUpConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-700 cursor-pointer"
                  >
                    {showSignUpConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Live Password Strength Meter */}
            {signUpPassword && (
              <div className="space-y-1 pt-0.5">
                <div className="flex items-center justify-between text-[10px] font-black">
                  <span className="text-purple-900">Password Strength:</span>
                  <span
                    style={{
                      color:
                        passwordStrength.score <= 1
                          ? '#EF4444'
                          : passwordStrength.score === 2
                          ? '#F59E0B'
                          : passwordStrength.score === 3
                          ? '#3B82F6'
                          : '#10B981'
                    }}
                  >
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 h-1.5">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`h-full rounded-full transition-colors ${
                        step <= passwordStrength.score
                          ? passwordStrength.score <= 1
                            ? 'bg-rose-500'
                            : passwordStrength.score === 2
                            ? 'bg-amber-500'
                            : passwordStrength.score === 3
                            ? 'bg-blue-500'
                            : 'bg-emerald-500'
                          : 'bg-purple-100'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              data-testid="btn-submit-signup"
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#9333EA] hover:from-[#6D28D9] text-white font-black text-xs shadow-md glow-purple transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registering & Hashing Password...</span>
                </>
              ) : (
                <>
                  <span>Create {selectedRole.toUpperCase()} Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* ========================================================================= */
          /* B. SIGN IN FORM */
          /* ========================================================================= */
          <form onSubmit={handleSignInSubmit} className="space-y-3.5 text-xs">
            {/* Username or Email Address */}
            <div>
              <label className="block text-purple-950 mb-1 font-bold">
                Username or Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <AtSign className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
                <input
                  type="text"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="Enter username or email address"
                  className="w-full pl-10 pr-3 py-2.5 bg-purple-50/50 border border-purple-100 rounded-2xl text-[#1E1B4B] font-medium focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all"
                  required
                />
              </div>
            </div>

            {/* Security Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-purple-950 font-bold">
                  {t('auth.password', 'Security Password')} <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotTip(!showForgotTip)}
                  className="text-[11px] font-black text-[#7C3AED] hover:underline cursor-pointer"
                >
                  {t('auth.forgotPassword', 'Forgot Password?')}
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter your security password"
                  className="w-full pl-10 pr-9 py-2.5 bg-purple-50/50 border border-purple-100 rounded-2xl text-[#1E1B4B] font-medium focus:outline-none focus:border-[#7C3AED] focus:bg-white transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-700 cursor-pointer"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              data-testid="btn-submit-signin"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#9333EA] hover:from-[#6D28D9] text-white font-black text-xs shadow-md glow-purple transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In as {selectedRole.toUpperCase()}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Footer switcher between Sign In & Sign Up */}
        <div className="text-center pt-2 border-t border-purple-100 text-[11px] text-purple-800 font-semibold">
          <span>
            {isRegister
              ? t('auth.alreadyHaveAccount', 'Already have an account?')
              : t('auth.dontHaveAccount', "Don't have an account?")}{' '}
          </span>
          <button
            type="button"
            onClick={() => setAuthMode(isRegister ? 'signin' : 'signup')}
            className="text-[#7C3AED] font-black hover:underline cursor-pointer ml-1"
          >
            {isRegister ? t('auth.signInBtn', 'Sign In') : t('auth.signUpBtn', 'Sign Up Free')}
          </button>
        </div>
      </div>
    </div>
  );
};
