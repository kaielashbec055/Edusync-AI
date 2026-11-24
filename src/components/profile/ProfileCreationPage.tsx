import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  User,
  GraduationCap,
  Shield,
  School,
  Sparkles,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle2,
  Users,
  BookOpen,
  Award,
  Hash,
  Briefcase
} from 'lucide-react';

export const ProfileCreationPage: React.FC = () => {
  const { role, user, completeProfileSetup, skipToDashboard } = useApp();

  // Student specific states
  const [studentName, setStudentName] = useState(user.name || 'Aarav Sharma');
  const [studentRollNo, setStudentRollNo] = useState(user.rollNo || 'STD-2026-0842');
  const [studentStandard, setStudentStandard] = useState(user.standard || '8th Standard');
  const [studentSection, setStudentSection] = useState(user.section || 'A');
  const [studentDob, setStudentDob] = useState(user.dob || '2012-05-14');
  const [studentGender, setStudentGender] = useState(user.gender || 'Male');
  const [studentBloodGroup, setStudentBloodGroup] = useState(user.bloodGroup || 'O+');
  const [guardianName, setGuardianName] = useState(user.guardianName || 'Priya Sharma');
  const [guardianPhone, setGuardianPhone] = useState(user.guardianPhone || '+91 98765 43210');
  const [studentAddress, setStudentAddress] = useState(user.address || 'Flat 402, Green Glen Heights, Bangalore');
  const [studentSchool, setStudentSchool] = useState(user.institution || 'St. Jude International Academy');

  // Parent specific states
  const [parentName, setParentName] = useState(user.name || 'Priya Sharma');
  const [parentPhone, setParentPhone] = useState(user.phone || '+91 98765 43210');
  const [parentOccupation, setParentOccupation] = useState(user.occupation || 'Lead Solutions Architect');
  const [parentAddress, setParentAddress] = useState(user.address || 'Flat 402, Green Glen Heights, Bangalore');
  const [childCount, setChildCount] = useState<number>(user.children?.length || 2);
  const [child1Name, setChild1Name] = useState(user.children?.[0]?.name || 'Aarav Sharma');
  const [child1Standard, setChild1Standard] = useState(user.children?.[0]?.standard || '8th Standard');
  const [child1Section, setChild1Section] = useState(user.children?.[0]?.section || 'A');
  const [child1RollNo, setChild1RollNo] = useState(user.children?.[0]?.rollNo || 'STD-2026-0842');

  const [child2Name, setChild2Name] = useState(user.children?.[1]?.name || 'Maya Sharma');
  const [child2Standard, setChild2Standard] = useState(user.children?.[1]?.standard || '5th Standard');
  const [child2Section, setChild2Section] = useState(user.children?.[1]?.section || 'B');
  const [child2RollNo, setChild2RollNo] = useState(user.children?.[1]?.rollNo || 'STD-2026-0518');

  const [child3Name, setChild3Name] = useState(user.children?.[2]?.name || 'Vivaan Sharma');
  const [child3Standard, setChild3Standard] = useState(user.children?.[2]?.standard || '2nd Standard');
  const [child3Section, setChild3Section] = useState(user.children?.[2]?.section || 'A');
  const [child3RollNo, setChild3RollNo] = useState(user.children?.[2]?.rollNo || 'STD-2026-0209');

  // Teacher specific states
  const [teacherName, setTeacherName] = useState(user.name || 'Mrs. Ananya Sharma');
  const [employeeId, setEmployeeId] = useState(user.employeeId || 'TCH-2021-994');
  const [teacherSubject, setTeacherSubject] = useState(user.gradeOrSubject || 'Mathematics & Science');
  const [assignedStandards, setAssignedStandards] = useState('8th Standard, 9th Standard');
  const [qualification, setQualification] = useState(user.qualifications || 'M.Sc. Mathematics, B.Ed');
  const [experience, setExperience] = useState(user.experience || '8 Years');
  const [teacherPhone, setTeacherPhone] = useState(user.phone || '+91 98112 33445');

  // Admin specific states
  const [adminName, setAdminName] = useState(user.name || 'Dr. Eleanor Vance');
  const [adminId, setAdminId] = useState(user.adminId || 'ADM-2018-1001');
  const [designation, setDesignation] = useState(user.designation || 'Principal & Director of Academic Affairs');
  const [department, setDepartment] = useState(user.department || 'Central Administration & Campus Safety');
  const [adminPhone, setAdminPhone] = useState(user.phone || '+91 98000 11223');

  const standardsList = [
    '1st Standard',
    '2nd Standard',
    '3rd Standard',
    '4th Standard',
    '5th Standard',
    '6th Standard',
    '7th Standard',
    '8th Standard',
    '9th Standard',
    '10th Standard',
    '11th Standard',
    '12th Standard'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (role === 'student') {
      completeProfileSetup({
        name: studentName,
        standard: studentStandard,
        section: studentSection,
        rollNo: studentRollNo,
        dob: studentDob,
        gender: studentGender,
        bloodGroup: studentBloodGroup,
        guardianName,
        guardianPhone,
        address: studentAddress,
        institution: studentSchool,
        title: `Student • ${studentStandard}`,
        gradeOrSubject: `${studentStandard} - Section ${studentSection}`
      });
    } else if (role === 'parent') {
      const childrenData = [];
      childrenData.push({
        id: 'c_01',
        name: child1Name,
        standard: child1Standard,
        section: child1Section,
        rollNo: child1RollNo,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      });
      if (childCount >= 2) {
        childrenData.push({
          id: 'c_02',
          name: child2Name,
          standard: child2Standard,
          section: child2Section,
          rollNo: child2RollNo,
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80'
        });
      }
      if (childCount >= 3) {
        childrenData.push({
          id: 'c_03',
          name: child3Name,
          standard: child3Standard,
          section: child3Section,
          rollNo: child3RollNo,
          avatar: 'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=150&auto=format&fit=crop&q=80'
        });
      }

      completeProfileSetup({
        name: parentName,
        phone: parentPhone,
        occupation: parentOccupation,
        address: parentAddress,
        children: childrenData,
        title: `Parent (${childCount} Children Enrolled)`,
        gradeOrSubject: `Parent of ${childrenData.map(c => `${c.name} (${c.standard})`).join(', ')}`
      });
    } else if (role === 'teacher') {
      completeProfileSetup({
        name: teacherName,
        employeeId,
        gradeOrSubject: teacherSubject,
        assignedClasses: assignedStandards.split(',').map(s => s.trim()),
        qualifications: qualification,
        experience,
        phone: teacherPhone,
        title: `Senior Educator • ${teacherSubject}`
      });
    } else if (role === 'admin') {
      completeProfileSetup({
        name: adminName,
        adminId,
        designation,
        department,
        phone: adminPhone,
        title: designation,
        gradeOrSubject: department
      });
    }
  };

  const getRoleIcon = () => {
    switch (role) {
      case 'student': return <GraduationCap className="w-6 h-6 text-[#7C3AED]" />;
      case 'parent': return <User className="w-6 h-6 text-emerald-600" />;
      case 'teacher': return <Shield className="w-6 h-6 text-indigo-600" />;
      case 'admin': return <School className="w-6 h-6 text-amber-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7FF] py-10 px-4 sm:px-6 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-3xl w-full bg-white border border-purple-100 rounded-3xl shadow-xl overflow-hidden"
      >
        {/* Top Header Banner */}
        <div className="purple-gradient-hero p-6 sm:p-8 text-white relative">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-md">
              {getRoleIcon()}
            </div>
            <div>
              <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-black uppercase tracking-wider border border-white/30">
                Official Profile Setup • {role.toUpperCase()} PERSON
              </span>
              <h1 className="text-2xl sm:text-3xl font-black mt-1">Complete Your Profile Details</h1>
              <p className="text-xs sm:text-sm text-purple-100 mt-0.5">
                Please fill your official profile information before entering the dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* Existing User Skip Banner */}
        <div className="bg-purple-100/90 border-b border-purple-200 px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-purple-900 font-bold">
            <Sparkles className="w-4 h-4 text-[#7C3AED]" />
            <span>Already an existing user or already created your profile?</span>
          </div>
          <button
            type="button"
            onClick={skipToDashboard}
            className="px-4 py-1.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-extrabold cursor-pointer transition-colors shadow-xs flex items-center gap-1.5"
          >
            <span>Click here to enter {role} dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Profile Creation Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* STUDENT FORM */}
          {role === 'student' && (
            <div className="space-y-5">
              <h3 className="text-sm font-black text-[#1E1B4B] uppercase tracking-wider flex items-center gap-2 border-b border-purple-100 pb-2">
                <BookOpen className="w-4 h-4 text-[#7C3AED]" /> Student Academic & Personal Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-purple-900 font-bold mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-purple-100 bg-purple-50/50 text-[#1E1B4B] font-semibold focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>

                <div>
                  <label className="block text-purple-900 font-bold mb-1">Admission / Roll Number *</label>
                  <input
                    type="text"
                    value={studentRollNo}
                    onChange={(e) => setStudentRollNo(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-purple-100 bg-purple-50/50 text-[#1E1B4B] font-semibold focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>

                <div>
                  <label className="block text-purple-900 font-bold mb-1">Standard / Class *</label>
                  <select
                    value={studentStandard}
                    onChange={(e) => setStudentStandard(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-purple-100 bg-purple-50/50 text-[#1E1B4B] font-semibold focus:outline-none focus:border-[#7C3AED]"
                  >
                    {standardsList.map((std) => (
                      <option key={std} value={std}>{std}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-purple-900 font-bold mb-1">Section *</label>
                  <select
                    value={studentSection}
                    onChange={(e) => setStudentSection(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-purple-100 bg-purple-50/50 text-[#1E1B4B] font-semibold focus:outline-none focus:border-[#7C3AED]"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                    <option value="D">Section D</option>
                  </select>
                </div>

                <div>
                  <label className="block text-purple-900 font-bold mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={studentDob}
                    onChange={(e) => setStudentDob(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-purple-100 bg-purple-50/50 text-[#1E1B4B] font-semibold focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>

                <div>
                  <label className="block text-purple-900 font-bold mb-1">Gender & Blood Group</label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={studentGender}
                      onChange={(e) => setStudentGender(e.target.value)}
                      className="w-full px-2 py-2.5 rounded-xl border border-purple-100 bg-purple-50/50 text-[#1E1B4B] font-semibold focus:outline-none focus:border-[#7C3AED]"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Blood (e.g. O+)"
                      value={studentBloodGroup}
                      onChange={(e) => setStudentBloodGroup(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-purple-100 bg-purple-50/50 text-[#1E1B4B] font-semibold focus:outline-none focus:border-[#7C3AED]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-purple-900 font-bold mb-1">Parent / Guardian Name *</label>
                  <input
                    type="text"
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-purple-100 bg-purple-50/50 text-[#1E1B4B] font-semibold focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>

                <div>
                  <label className="block text-purple-900 font-bold mb-1">Guardian Emergency Phone *</label>
                  <input
                    type="text"
                    value={guardianPhone}
                    onChange={(e) => setGuardianPhone(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-purple-100 bg-purple-50/50 text-[#1E1B4B] font-semibold focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-purple-900 font-bold mb-1">School / Institution Name</label>
                  <input
                    type="text"
                    value={studentSchool}
                    onChange={(e) => setStudentSchool(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-purple-100 bg-purple-50/50 text-[#1E1B4B] font-semibold focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-purple-900 font-bold mb-1">Residential Address</label>
                  <input
                    type="text"
                    value={studentAddress}
                    onChange={(e) => setStudentAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-purple-100 bg-purple-50/50 text-[#1E1B4B] font-semibold focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* PARENT FORM */}
          {role === 'parent' && (
            <div className="space-y-6">
              <h3 className="text-sm font-black text-[#1E1B4B] uppercase tracking-wider flex items-center gap-2 border-b border-purple-100 pb-2">
                <Users className="w-4 h-4 text-emerald-600" /> Parent Guardian & Children Enrollment Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-purple-900 font-bold mb-1">Parent Full Name *</label>
                  <input
                    type="text"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-purple-100 bg-purple-50/50 text-[#1E1B4B] font-semibold focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>

                <div>
                  <label className="block text-purple-900 font-bold mb-1">Contact Phone Number *</label>
                  <input
                    type="text"
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-purple-100 bg-purple-50/50 text-[#1E1B4B] font-semibold focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>

                <div>
                  <label className="block text-purple-900 font-bold mb-1">Profession / Occupation</label>
                  <input
                    type="text"
                    value={parentOccupation}
                    onChange={(e) => setParentOccupation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-purple-100 bg-purple-50/50 text-[#1E1B4B] font-semibold focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>

                <div>
                  <label className="block text-purple-900 font-bold mb-1">Residential Address</label>
                  <input
                    type="text"
                    value={parentAddress}
                    onChange={(e) => setParentAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-purple-100 bg-purple-50/50 text-[#1E1B4B] font-semibold focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>
              </div>

              {/* Children Selection Section */}
              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-black text-[#1E1B4B]">Enrolled Children (For Standard-Based Fees & Portals)</h4>
                    <p className="text-[11px] text-purple-700">Select how many children are studying in this institution:</p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-purple-200">
                    {[1, 2, 3].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setChildCount(num)}
                        className={`px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
                          childCount === num
                            ? 'bg-[#7C3AED] text-white shadow-xs'
                            : 'text-purple-900 hover:bg-purple-100'
                        }`}
                      >
                        {num} {num === 1 ? 'Child' : 'Children'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Child 1 */}
                <div className="p-3.5 rounded-xl bg-white border border-purple-100 space-y-2.5">
                  <span className="text-[10px] font-black uppercase text-purple-700 tracking-wider">
                    Child #1 Details
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                    <div className="sm:col-span-2">
                      <label className="block text-purple-900 font-bold mb-1">Child Name</label>
                      <input
                        type="text"
                        value={child1Name}
                        onChange={(e) => setChild1Name(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-xl border border-purple-100 bg-purple-50/30 text-[#1E1B4B] font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-purple-900 font-bold mb-1">Standard / Class</label>
                      <select
                        value={child1Standard}
                        onChange={(e) => setChild1Standard(e.target.value)}
                        className="w-full px-2.5 py-2 rounded-xl border border-purple-100 bg-purple-50/30 text-[#1E1B4B] font-semibold"
                      >
                        {standardsList.map((std) => (
                          <option key={std} value={std}>{std}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-purple-900 font-bold mb-1">Section</label>
                      <select
                        value={child1Section}
                        onChange={(e) => setChild1Section(e.target.value)}
                        className="w-full px-2.5 py-2 rounded-xl border border-purple-100 bg-purple-50/30 text-[#1E1B4B] font-semibold"
                      >
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Child 2 */}
                {childCount >= 2 && (
                  <div className="p-3.5 rounded-xl bg-white border border-purple-100 space-y-2.5">
                    <span className="text-[10px] font-black uppercase text-purple-700 tracking-wider">
                      Child #2 Details
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                      <div className="sm:col-span-2">
                        <label className="block text-purple-900 font-bold mb-1">Child Name</label>
                        <input
                          type="text"
                          value={child2Name}
                          onChange={(e) => setChild2Name(e.target.value)}
                          required
                          className="w-full px-3 py-2 rounded-xl border border-purple-100 bg-purple-50/30 text-[#1E1B4B] font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-purple-900 font-bold mb-1">Standard / Class</label>
                        <select
                          value={child2Standard}
                          onChange={(e) => setChild2Standard(e.target.value)}
                          className="w-full px-2.5 py-2 rounded-xl border border-purple-100 bg-purple-50/30 text-[#1E1B4B] font-semibold"
                        >
                          {standardsList.map((std) => (
                            <option key={std} value={std}>{std}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-purple-900 font-bold mb-1">Section</label>
                        <select
                          value={child2Section}
                          onChange={(e) => setChild2Section(e.target.value)}
                          className="w-full px-2.5 py-2 rounded-xl border border-purple-100 bg-purple-50/30 text-[#1E1B4B] font-semibold"
                        >
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Child 3 */}
                {childCount >= 3 && (
                  <div className="p-3.5 rounded-xl bg-white border border-purple-100 space-y-2.5">
                    <span className="text-[10px] font-black uppercase text-purple-700 tracking-wider">
                      Child #3 Details
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                      <div className="sm:col-span-2">
                        <label className="block text-purple-900 font-bold mb-1">Child Name</label>
                        <input
                          type="text"
                          value={child3Name}
                          onChange={(e) => setChild3Name(e.target.value)}
                          required
                          className="w-full px-3 py-2 rounded-xl border border-purple-100 bg-purple-50/30 text-[#1E1B4B] font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-purple-900 font-bold mb-1">Standard / Class</label>
                        <select
                          value={child3Standard}
                          onChange={(e) => setChild3Standard(e.target.value)}
                          className="w-full px-2.5 py-2 rounded-xl border border-purple-100 bg-purple-50/30 text-[#1E1B4B] font-semibold"
                        >
                          {standardsList.map((std) => (
                            <option key={std} value={std}>{std}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-purple-900 font-bold mb-1">Section</label>
                        <select
                          value={child3Section}
                          onChange={(e) => setChild3Section(e.target.value)}
                          className="w-full px-2.5 py-2 rounded-xl border border-purple-100 bg-purple-50/30 text-[#1E1B4B] font-semibold"
                        >
                          <option value="A">A</option>
                          <option value="B">B</option>
                          <option value="C">C</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TEACHER FORM */}
          {role === 'teacher' && (
            <div className="space-y-5">
              <h3 className="text-sm font-black text-[#1E1B4B] uppercase tracking-wider flex items-center gap-2 border-b border-purple-100 pb-2">
                <Briefcase className="w-4 h-4 text-indigo-600" /> Educator Academic Credentials & Profile
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-purple-900 font-bold mb-1">Teacher Full Name *</label>
                  <input
                    type="text"
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-purple-100 bg-purple-50/50 text-[#1E1B4B] font-semibold focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>

                <div>
                  <label className="block text-purple-900 font-bold mb-1">Faculty / Employee ID *</label>
                  <input
                    type="text"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-purple-100 bg-purple-50/50 text-[#1E1B4B] font-semibold focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>

                <div>
                  <label className="block text-purple-900 font-bold mb-1">Primary Subject Handled *</label>
                  <input
                    type="text"
                    value={teacherSubject}
                    onChange={(e) => setTeacherSubject(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-purple-100 bg-purple-50/50 text-[#1E1B4B] font-semibold focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>

                <div>
                  <label className="block text-purple-900 font-bold mb-1">Assigned Standards / Classes</label>
                  <input
                    type="text"
                    value={assignedStandards}
                    onChange={(e) => setAssignedStandards(e.target.value)}
                    placeholder="e.g. 8th Standard, 9th Standard"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-purple-100 bg-purple-50/50 text-[#1E1B4B] font-semibold focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>

                <div>
                  <label className="block text-purple-900 font-bold mb-1">Educational Qualifications</label>
                  <input
                    type="text"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-purple-100 bg-purple-50/50 text-[#1E1B4B] font-semibold focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>

                <div>
                  <label className="block text-purple-900 font-bold mb-1">Total Teaching Experience</label>
                  <input
                    type="text"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-purple-100 bg-purple-50/50 text-[#1E1B4B] font-semibold focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-purple-900 font-bold mb-1">Educator Phone Number</label>
                  <input
                    type="text"
                    value={teacherPhone}
                    onChange={(e) => setTeacherPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-purple-100 bg-purple-50/50 text-[#1E1B4B] font-semibold focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ADMIN FORM */}
          {role === 'admin' && (
            <div className="space-y-5">
              <h3 className="text-sm font-black text-[#1E1B4B] uppercase tracking-wider flex items-center gap-2 border-b border-purple-100 pb-2">
                <School className="w-4 h-4 text-amber-600" /> Administrative Officer Profile
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-purple-900 font-bold mb-1">Administrator Full Name *</label>
                  <input
                    type="text"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-purple-100 bg-purple-50/50 text-[#1E1B4B] font-semibold focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>

                <div>
                  <label className="block text-purple-900 font-bold mb-1">Admin / Staff ID *</label>
                  <input
                    type="text"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-purple-100 bg-purple-50/50 text-[#1E1B4B] font-semibold focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>

                <div>
                  <label className="block text-purple-900 font-bold mb-1">Official Designation *</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-purple-100 bg-purple-50/50 text-[#1E1B4B] font-semibold focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>

                <div>
                  <label className="block text-purple-900 font-bold mb-1">Department / Branch</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-purple-100 bg-purple-50/50 text-[#1E1B4B] font-semibold focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-purple-900 font-bold mb-1">Administrative Contact Phone</label>
                  <input
                    type="text"
                    value={adminPhone}
                    onChange={(e) => setAdminPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-purple-100 bg-purple-50/50 text-[#1E1B4B] font-semibold focus:outline-none focus:border-[#7C3AED]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Button */}
          <div className="pt-4 border-t border-purple-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-purple-700 font-medium">
              ✓ All information is encrypted and bound to your {role.toUpperCase()} account.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white font-black text-xs shadow-lg glow-purple flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Save Profile & Enter {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
