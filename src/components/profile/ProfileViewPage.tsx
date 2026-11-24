import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import {
  User,
  GraduationCap,
  Shield,
  School,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle2,
  Edit3,
  Award,
  BookOpen,
  ArrowRight,
  Sparkles,
  CreditCard,
  QrCode
} from 'lucide-react';

export const ProfileViewPage: React.FC = () => {
  const { user, role, setIsProfileSetupActive, setActiveTab } = useApp();

  const getRoleBadge = () => {
    switch (role) {
      case 'student':
        return { label: 'Student Profile', color: 'from-[#7C3AED] to-[#9333EA]', icon: <GraduationCap className="w-5 h-5" /> };
      case 'parent':
        return { label: 'Parent / Guardian Profile', color: 'from-emerald-500 to-teal-600', icon: <User className="w-5 h-5" /> };
      case 'teacher':
        return { label: 'Educator Profile', color: 'from-indigo-600 to-purple-600', icon: <Shield className="w-5 h-5" /> };
      case 'admin':
        return { label: 'Administrator Profile', color: 'from-amber-500 to-orange-600', icon: <School className="w-5 h-5" /> };
    }
  };

  const badgeInfo = getRoleBadge();

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Top Profile Hero Card */}
      <div className="p-6 sm:p-8 rounded-3xl purple-gradient-hero text-white shadow-xl glow-purple flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-4 ring-white/30 shadow-lg"
            />
            <div className="absolute -bottom-1 -right-1 p-1.5 rounded-xl bg-white text-[#7C3AED] shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
          </div>

          <div className="space-y-1">
            <span className="px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-md text-[11px] font-black uppercase tracking-wider border border-white/20 inline-flex items-center gap-1.5">
              {badgeInfo.icon}
              {badgeInfo.label}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black">{user.name}</h1>
            <p className="text-purple-100 text-xs sm:text-sm font-medium">
              {user.title || user.gradeOrSubject}
            </p>
          </div>
        </div>

        {/* Edit Button */}
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsProfileSetupActive(true)}
            className="px-5 py-2.5 rounded-2xl bg-white text-[#1E1B4B] hover:bg-purple-50 font-black text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
          >
            <Edit3 className="w-4 h-4 text-[#7C3AED]" />
            <span>Edit Profile</span>
          </motion.button>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Personal & Institutional Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Identity Information Card */}
          <div className="p-6 rounded-3xl clay-card space-y-4">
            <h3 className="font-black text-base text-[#1E1B4B] flex items-center gap-2">
              <User className="w-5 h-5 text-[#7C3AED]" />
              <span>Identity & Contact Details</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
              <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-1">
                <span className="text-[10px] font-black uppercase text-purple-700 tracking-wider">Full Legal Name</span>
                <p className="font-black text-sm text-[#1E1B4B]">{user.name}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-1">
                <span className="text-[10px] font-black uppercase text-purple-700 tracking-wider">Official Email</span>
                <p className="font-black text-xs text-[#1E1B4B] flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-purple-500" />
                  {user.email}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-1">
                <span className="text-[10px] font-black uppercase text-purple-700 tracking-wider">Contact Number</span>
                <p className="font-black text-xs text-[#1E1B4B] flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-purple-500" />
                  {user.phone || '+91 98765 43210'}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-1">
                <span className="text-[10px] font-black uppercase text-purple-700 tracking-wider">
                  {role === 'student' ? 'Blood Group & Gender' : role === 'parent' ? 'Occupation' : 'Designation'}
                </span>
                <p className="font-black text-xs text-[#1E1B4B]">
                  {role === 'student' ? `${user.bloodGroup || 'O+'} • ${user.gender || 'Male'}` :
                   role === 'parent' ? (user.occupation || 'Lead Solutions Architect') :
                   (user.designation || user.gradeOrSubject)}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-1 sm:col-span-2">
                <span className="text-[10px] font-black uppercase text-purple-700 tracking-wider">Residential Address</span>
                <p className="font-bold text-xs text-[#1E1B4B] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                  {user.address || 'Flat 402, Green Glen Heights, Sector 4, Bangalore'}
                </p>
              </div>
            </div>
          </div>

          {/* Role-Specific Institutional Card */}
          {role === 'student' && (
            <div className="p-6 rounded-3xl clay-card space-y-4">
              <h3 className="font-black text-base text-[#1E1B4B] flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#7C3AED]" />
                <span>Student Academic Enrollment</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-100 text-center">
                  <span className="text-[10px] font-black uppercase text-purple-700">Enrolled Standard</span>
                  <p className="text-lg font-black text-[#1E1B4B] mt-1">{user.standard || '8th Standard'}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-100 text-center">
                  <span className="text-[10px] font-black uppercase text-purple-700">Section</span>
                  <p className="text-lg font-black text-[#1E1B4B] mt-1">Section {user.section || 'A'}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-100 text-center">
                  <span className="text-[10px] font-black uppercase text-purple-700">Roll / Admission ID</span>
                  <p className="text-sm font-black text-[#1E1B4B] mt-2">{user.rollNo || 'STD-2026-0842'}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 text-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-purple-700 uppercase">Guardian Contact</span>
                  <p className="font-black text-[#1E1B4B]">{user.guardianName || 'Priya Sharma'} ({user.guardianPhone || '+91 98765 43210'})</p>
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full">
                  VERIFIED GUARDIAN
                </span>
              </div>
            </div>
          )}

          {role === 'parent' && (
            <div className="p-6 rounded-3xl clay-card space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-base text-[#1E1B4B] flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-600" />
                  <span>Enrolled Children Details</span>
                </h3>
                <button
                  onClick={() => setActiveTab('fees')}
                  className="text-xs font-black text-[#7C3AED] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Open Fee Portal →</span>
                </button>
              </div>

              <div className="space-y-3 pt-1">
                {(user.children || [
                  { id: 'c_01', name: 'Aarav Sharma', standard: '8th Standard', section: 'A', rollNo: 'STD-2026-0842' },
                  { id: 'c_02', name: 'Maya Sharma', standard: '5th Standard', section: 'B', rollNo: 'STD-2026-0518' }
                ]).map((child, idx) => (
                  <div
                    key={child.id || idx}
                    className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#7C3AED]/10 text-[#7C3AED] font-black flex items-center justify-center text-sm">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-[#1E1B4B]">{child.name}</h4>
                        <p className="text-xs text-purple-700 font-bold">
                          {child.standard} • Section {child.section} • Roll No: {child.rollNo || `STD-2026-00${idx + 1}`}
                        </p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-purple-100 text-[#7C3AED] font-black text-[10px] rounded-full border border-purple-200">
                      Standard {child.standard.split(' ')[0]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {role === 'teacher' && (
            <div className="p-6 rounded-3xl clay-card space-y-4">
              <h3 className="font-black text-base text-[#1E1B4B] flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-600" />
                <span>Academic Faculty Record</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-100">
                  <span className="text-[10px] font-black uppercase text-purple-700">Faculty ID</span>
                  <p className="font-black text-sm text-[#1E1B4B] mt-1">{user.employeeId || 'TCH-2021-994'}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-100">
                  <span className="text-[10px] font-black uppercase text-purple-700">Qualifications</span>
                  <p className="font-black text-xs text-[#1E1B4B] mt-1">{user.qualifications || 'M.Sc. Mathematics, B.Ed'}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-100 sm:col-span-2">
                  <span className="text-[10px] font-black uppercase text-purple-700">Assigned Standards & Classes</span>
                  <p className="font-black text-xs text-[#1E1B4B] mt-1">
                    {user.assignedClasses?.join(', ') || '8th Standard (A & B), 9th Standard (A)'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {role === 'admin' && (
            <div className="p-6 rounded-3xl clay-card space-y-4">
              <h3 className="font-black text-base text-[#1E1B4B] flex items-center gap-2">
                <School className="w-5 h-5 text-amber-600" />
                <span>Institutional Administration</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-100">
                  <span className="text-[10px] font-black uppercase text-purple-700">Administrator ID</span>
                  <p className="font-black text-sm text-[#1E1B4B] mt-1">{user.adminId || 'ADM-2018-1001'}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-100">
                  <span className="text-[10px] font-black uppercase text-purple-700">Designation</span>
                  <p className="font-black text-xs text-[#1E1B4B] mt-1">{user.designation || 'Principal & Director'}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-100 sm:col-span-2">
                  <span className="text-[10px] font-black uppercase text-purple-700">Department</span>
                  <p className="font-black text-xs text-[#1E1B4B] mt-1">{user.department || 'Central Academic & Financial Administration'}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Digital ID Badge & Quick Links */}
        <div className="space-y-6">
          {/* Digital ID Card */}
          <div className="p-6 rounded-3xl clay-card space-y-4 border-2 border-purple-200/80 bg-gradient-to-br from-white via-purple-50/30 to-indigo-50/20 shadow-md">
            <div className="flex items-center justify-between border-b border-purple-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#7C3AED]" />
                <span className="text-xs font-black text-[#1E1B4B] tracking-tight">Digital Smart ID Card</span>
              </div>
              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                ACTIVE
              </span>
            </div>

            <div className="text-center space-y-2 py-2">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 mx-auto rounded-2xl object-cover ring-2 ring-[#7C3AED]/30 shadow-md"
              />
              <h4 className="font-black text-base text-[#1E1B4B]">{user.name}</h4>
              <p className="text-xs text-[#7C3AED] font-black uppercase tracking-wider">{role} PERSON</p>
              <p className="text-[11px] text-purple-800 font-bold">{user.institution || 'St. Jude International Academy'}</p>
            </div>

            <div className="p-3 rounded-2xl bg-white border border-purple-100 flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black text-purple-700 uppercase">Security Token</p>
                <p className="text-xs font-mono font-bold text-[#1E1B4B]">EDY-{user.id.toUpperCase()}</p>
              </div>
              <QrCode className="w-8 h-8 text-[#7C3AED]" />
            </div>
          </div>

          {/* Quick Links Card */}
          <div className="p-5 rounded-3xl clay-card space-y-3">
            <h4 className="font-black text-xs text-[#1E1B4B] uppercase tracking-wider">Account Navigation</h4>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="w-full py-2.5 px-4 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#1E1B4B] text-xs font-bold transition-all flex items-center justify-between cursor-pointer"
            >
              <span>Go to {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard</span>
              <ArrowRight className="w-4 h-4 text-[#7C3AED]" />
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className="w-full py-2.5 px-4 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#1E1B4B] text-xs font-bold transition-all flex items-center justify-between cursor-pointer"
            >
              <span>Manage Settings & Security</span>
              <ArrowRight className="w-4 h-4 text-[#7C3AED]" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
