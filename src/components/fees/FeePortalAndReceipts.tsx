import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import {
  CreditCard,
  Receipt,
  Download,
  Printer,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Building,
  User,
  GraduationCap,
  Clock,
  DollarSign,
  ChevronRight,
  X
} from 'lucide-react';

interface FeeBreakdown {
  tuitionFee: number;
  schoolFee: number;
  labFee: number;
  libraryFee: number;
  examFee: number;
  transportFee: number;
  total: number;
}

export const FeePortalAndReceipts: React.FC = () => {
  const { user, selectedChild, setSelectedChild, childrenList, addNotification } = useApp();
  const [selectedReceiptTerm, setSelectedReceiptTerm] = useState<'Term 2 (Current)' | 'Term 1 (Completed)'>('Term 2 (Current)');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paidTerms, setPaidTerms] = useState<Record<string, boolean>>({
    [`${childrenList[0]?.id || 'c_01'}-Term 1 (Completed)`]: true,
    [`${childrenList[1]?.id || 'c_02'}-Term 1 (Completed)`]: true,
    [`${childrenList[1]?.id || 'c_02'}-Term 2 (Current)`]: true
  });

  // Dynamic fee calculation based on Standard
  const calculateFeesForStandard = (standardStr: string): FeeBreakdown => {
    // Extract standard number
    const match = standardStr.match(/\d+/);
    const stdNumber = match ? parseInt(match[0], 10) : 8;

    let tuitionFee = 350;
    let schoolFee = 120;
    let labFee = 50;
    let libraryFee = 30;
    let examFee = 40;
    const transportFee = 150;

    if (stdNumber <= 4) {
      // Primary school (1st - 4th Std)
      tuitionFee = 320;
      schoolFee = 100;
      labFee = 40;
      libraryFee = 25;
      examFee = 35;
    } else if (stdNumber >= 5 && stdNumber <= 7) {
      // Middle school (5th - 7th Std)
      tuitionFee = 420;
      schoolFee = 140;
      labFee = 70;
      libraryFee = 35;
      examFee = 45;
    } else if (stdNumber >= 8 && stdNumber <= 9) {
      // Secondary school (8th - 9th Std)
      tuitionFee = 550;
      schoolFee = 180;
      labFee = 110;
      libraryFee = 45;
      examFee = 65;
    } else {
      // High School / Senior Secondary (10th - 12th Std)
      tuitionFee = 680;
      schoolFee = 220;
      labFee = 140;
      libraryFee = 60;
      examFee = 90;
    }

    const total = tuitionFee + schoolFee + labFee + libraryFee + examFee + transportFee;
    return { tuitionFee, schoolFee, labFee, libraryFee, examFee, transportFee, total };
  };

  const activeStandard = selectedChild.grade || '8th Standard';
  const feeDetails = calculateFeesForStandard(activeStandard);

  const termKey = `${selectedChild.id}-${selectedReceiptTerm}`;
  const isCurrentTermPaid = Boolean(paidTerms[termKey]);

  const handleProcessPayment = () => {
    setPaymentSuccess(true);
    setTimeout(() => {
      setPaidTerms(prev => ({ ...prev, [termKey]: true }));
      setPaymentSuccess(false);
      setShowPaymentModal(false);
      addNotification({
        title: 'Fee Payment Successful',
        message: `${selectedReceiptTerm} fee of $${feeDetails.total} paid for ${selectedChild.name} (${activeStandard}).`,
        type: 'academic'
      });
      setShowReceiptModal(true);
    }, 1200);
  };

  const receiptNumber = `RCP-2026-${activeStandard.replace(/[^0-9]/g, '') || '8'}-${selectedChild.id.slice(-3).toUpperCase() || '084'}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Top Banner & Child Selector */}
      <div className="p-6 md:p-8 rounded-3xl purple-gradient-hero text-white shadow-xl glow-purple flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="px-3.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-md text-xs font-black flex items-center gap-1.5 w-fit border border-white/20">
            <CreditCard className="w-3.5 h-3.5 text-amber-300" /> Parent Fee Management & Official Receipts
          </span>
          <h1 className="text-2xl sm:text-3xl font-black">Fee Portal & Payment Receipts</h1>
          <p className="text-purple-100 text-xs sm:text-sm font-medium max-w-xl">
            Standard-based fee schedules and verified institutional receipts for your children.
          </p>
        </div>

        {/* Child Selector Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-white/95 p-2 rounded-2xl border border-white/40 backdrop-blur-md shadow-md text-xs">
          <span className="text-purple-900 font-extrabold px-2">Select Student:</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {childrenList.map((child) => (
              <button
                key={child.id}
                onClick={() => setSelectedChild(child)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-extrabold transition-all cursor-pointer ${
                  selectedChild.id === child.id
                    ? 'bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white shadow-sm'
                    : 'bg-purple-50 text-purple-900 hover:bg-purple-100'
                }`}
              >
                <img src={child.avatar} alt={child.name} className="w-5 h-5 rounded-full object-cover ring-1 ring-white" />
                <span>{child.name} ({child.grade})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Standard-Based Fee Card Header */}
      <div className="p-6 rounded-3xl clay-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-purple-100 text-[#7C3AED] text-xs font-black border border-purple-200">
              {activeStandard}
            </span>
            <span className="text-xs font-bold text-slate-500">Section {selectedChild.section || 'A'}</span>
          </div>
          <h2 className="text-xl font-black text-[#1E1B4B] mt-1.5">
            Fee Breakdown for {selectedChild.name}
          </h2>
          <p className="text-xs text-purple-800 font-medium">
            Fees are calculated strictly according to <strong className="text-[#7C3AED]">{activeStandard}</strong> curriculum, lab requirements, and transport.
          </p>
        </div>

        {/* Status Badge & Pay Button */}
        <div className="flex items-center gap-3">
          {isCurrentTermPaid ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>PAID IN FULL</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>DUE: ${feeDetails.total}</span>
            </div>
          )}

          {!isCurrentTermPaid ? (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowPaymentModal(true)}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white font-black text-xs shadow-md glow-purple flex items-center gap-2 cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>Pay Fees Now</span>
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setShowReceiptModal(true)}
              className="px-5 py-2.5 rounded-2xl bg-[#7C3AED] text-white font-black text-xs shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Receipt className="w-4 h-4" />
              <span>View & Print Receipt</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Itemized Fee Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tuition Fee Card */}
        <div className="p-5 rounded-3xl clay-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-700">Curricular Instruction</span>
            <span className="text-xs font-black text-[#7C3AED] bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-100">
              {activeStandard}
            </span>
          </div>
          <p className="text-sm font-black text-[#1E1B4B]">Tuition Fees</p>
          <div className="flex items-baseline justify-between pt-1 border-t border-purple-100">
            <span className="text-xs text-purple-800 font-medium">Standard Academic Fee</span>
            <span className="text-xl font-black text-[#1E1B4B]">${feeDetails.tuitionFee}</span>
          </div>
        </div>

        {/* School & Term Fee Card */}
        <div className="p-5 rounded-3xl clay-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-700">Campus & Infrastructure</span>
            <span className="text-xs font-black text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
              Term Maintenance
            </span>
          </div>
          <p className="text-sm font-black text-[#1E1B4B]">School / Term Fees</p>
          <div className="flex items-baseline justify-between pt-1 border-t border-purple-100">
            <span className="text-xs text-purple-800 font-medium">Facilities & Utilities</span>
            <span className="text-xl font-black text-[#1E1B4B]">${feeDetails.schoolFee}</span>
          </div>
        </div>

        {/* Science & Computer Lab Fee Card */}
        <div className="p-5 rounded-3xl clay-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-700">Practical STEM</span>
            <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
              Equip & Consumables
            </span>
          </div>
          <p className="text-sm font-black text-[#1E1B4B]">Lab & Technology Fees</p>
          <div className="flex items-baseline justify-between pt-1 border-t border-purple-100">
            <span className="text-xs text-purple-800 font-medium">Physics, Chemistry, Computer</span>
            <span className="text-xl font-black text-[#1E1B4B]">${feeDetails.labFee}</span>
          </div>
        </div>

        {/* Library & Digital Learning */}
        <div className="p-5 rounded-3xl clay-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-700">Knowledge Resources</span>
            <span className="text-xs font-black text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
              Library
            </span>
          </div>
          <p className="text-sm font-black text-[#1E1B4B]">Library & Digital Books</p>
          <div className="flex items-baseline justify-between pt-1 border-t border-purple-100">
            <span className="text-xs text-purple-800 font-medium">Subscriptions & Journals</span>
            <span className="text-xl font-black text-[#1E1B4B]">${feeDetails.libraryFee}</span>
          </div>
        </div>

        {/* Examination & Assessment Fee */}
        <div className="p-5 rounded-3xl clay-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-700">Evaluations</span>
            <span className="text-xs font-black text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-100">
              Exams
            </span>
          </div>
          <p className="text-sm font-black text-[#1E1B4B]">Examination Fees</p>
          <div className="flex items-baseline justify-between pt-1 border-t border-purple-100">
            <span className="text-xs text-purple-800 font-medium">Periodic Tests & Term Assessments</span>
            <span className="text-xl font-black text-[#1E1B4B]">${feeDetails.examFee}</span>
          </div>
        </div>

        {/* Transport Telemetry Fee */}
        <div className="p-5 rounded-3xl clay-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-700">Safety & Fleet</span>
            <span className="text-xs font-black text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100">
              GPS Active
            </span>
          </div>
          <p className="text-sm font-black text-[#1E1B4B]">Bus & Transport Fees</p>
          <div className="flex items-baseline justify-between pt-1 border-t border-purple-100">
            <span className="text-xs text-purple-800 font-medium">Daily Route 14 Fleet Telemetry</span>
            <span className="text-xl font-black text-[#1E1B4B]">${feeDetails.transportFee}</span>
          </div>
        </div>
      </div>

      {/* Total Calculation & Receipts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Total Summary Card */}
        <div className="p-6 rounded-3xl clay-card space-y-4">
          <h3 className="font-black text-base text-[#1E1B4B]">Fee Summary Calculation</h3>
          
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between text-purple-900 font-bold">
              <span>Tuition Fees ({activeStandard}):</span>
              <span>${feeDetails.tuitionFee}</span>
            </div>
            <div className="flex justify-between text-purple-900 font-bold">
              <span>School / Term Fee:</span>
              <span>${feeDetails.schoolFee}</span>
            </div>
            <div className="flex justify-between text-purple-900 font-bold">
              <span>Lab & STEM Equipment:</span>
              <span>${feeDetails.labFee}</span>
            </div>
            <div className="flex justify-between text-purple-900 font-bold">
              <span>Library & Learning Materials:</span>
              <span>${feeDetails.libraryFee}</span>
            </div>
            <div className="flex justify-between text-purple-900 font-bold">
              <span>Term Examination Fee:</span>
              <span>${feeDetails.examFee}</span>
            </div>
            <div className="flex justify-between text-purple-900 font-bold">
              <span>Bus & Safety Telemetry:</span>
              <span>${feeDetails.transportFee}</span>
            </div>

            <div className="pt-3 border-t-2 border-purple-200 flex justify-between items-baseline text-sm font-black text-[#1E1B4B]">
              <span>Total Term Fee:</span>
              <span className="text-xl text-[#7C3AED]">${feeDetails.total}</span>
            </div>
          </div>

          <div className="pt-2">
            {!isCurrentTermPaid ? (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#9333EA] text-white font-black text-xs shadow-md glow-purple flex items-center justify-center gap-2 cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pay ${feeDetails.total} via Gateway</span>
              </button>
            ) : (
              <button
                onClick={() => setShowReceiptModal(true)}
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Receipt className="w-4 h-4" />
                <span>View Official Fee Receipt</span>
              </button>
            )}
          </div>
        </div>

        {/* Past Transactions & Receipts Table */}
        <div className="lg:col-span-2 p-6 rounded-3xl clay-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-base text-[#1E1B4B] flex items-center gap-2">
              <Receipt className="w-5 h-5 text-[#7C3AED]" />
              <span>Official Fee Receipts History</span>
            </h3>
            <span className="text-[11px] font-bold text-purple-700">Student: {selectedChild.name}</span>
          </div>

          <div className="space-y-3 pt-2">
            {[
              {
                term: 'Term 2 (Current)',
                date: '2026-05-15',
                amount: feeDetails.total,
                status: isCurrentTermPaid ? 'Paid' : 'Pending',
                receiptId: receiptNumber
              },
              {
                term: 'Term 1 (Completed)',
                date: '2026-01-10',
                amount: feeDetails.total,
                status: 'Paid',
                receiptId: `RCP-2026-${activeStandard.replace(/[^0-9]/g, '') || '8'}-T1-0112`
              }
            ].map((rec, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-[#1E1B4B]">{rec.term}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      rec.status === 'Paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {rec.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[11px] text-purple-800 font-medium mt-0.5">
                    Standard: <strong className="text-purple-950">{activeStandard}</strong> • Receipt: {rec.receiptId} • Date: {rec.date}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm font-black text-[#1E1B4B]">${rec.amount}</span>
                  {rec.status === 'Paid' ? (
                    <button
                      onClick={() => {
                        setSelectedReceiptTerm(rec.term as any);
                        setShowReceiptModal(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-purple-100 text-[#7C3AED] border border-purple-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>Receipt</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowPaymentModal(true)}
                      className="px-3 py-1.5 rounded-xl bg-[#7C3AED] text-white text-xs font-bold hover:bg-[#6D28D9] transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <span>Pay Now</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PAYMENT GATEWAY MODAL */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 bg-[#1E1B4B]/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-purple-100 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 relative"
            >
              <button
                onClick={() => setShowPaymentModal(false)}
                className="absolute top-4 right-4 p-2 text-purple-400 hover:text-purple-700 rounded-2xl hover:bg-purple-50 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-1">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-100 text-[#7C3AED] flex items-center justify-center mb-2">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-black text-[#1E1B4B]">Secure Fee Payment</h3>
                <p className="text-xs text-purple-800">
                  Paying for <strong>{selectedChild.name}</strong> • Standard: <strong>{activeStandard}</strong>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100 space-y-2 text-xs">
                <div className="flex justify-between text-purple-900 font-bold">
                  <span>Tuition & Standard Academic Fee:</span>
                  <span>${feeDetails.tuitionFee}</span>
                </div>
                <div className="flex justify-between text-purple-900 font-bold">
                  <span>School & Infrastructure Fee:</span>
                  <span>${feeDetails.schoolFee}</span>
                </div>
                <div className="flex justify-between text-purple-900 font-bold">
                  <span>STEM Labs, Library & Exams:</span>
                  <span>${feeDetails.labFee + feeDetails.libraryFee + feeDetails.examFee}</span>
                </div>
                <div className="flex justify-between text-purple-900 font-bold">
                  <span>Bus Transport:</span>
                  <span>${feeDetails.transportFee}</span>
                </div>
                <div className="pt-2 border-t border-purple-200 flex justify-between font-black text-sm text-[#1E1B4B]">
                  <span>Total Payable Amount:</span>
                  <span className="text-[#7C3AED] text-base">${feeDetails.total}</span>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-purple-900 font-bold mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    defaultValue={user.name}
                    className="w-full px-3 py-2 rounded-xl border border-purple-100 bg-purple-50/50 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-purple-900 font-bold mb-1">Card Number</label>
                  <input
                    type="text"
                    defaultValue="•••• •••• •••• 4242"
                    className="w-full px-3 py-2 rounded-xl border border-purple-100 bg-purple-50/50 font-medium font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-purple-900 font-bold mb-1">Expiry</label>
                    <input
                      type="text"
                      defaultValue="08/28"
                      className="w-full px-3 py-2 rounded-xl border border-purple-100 bg-purple-50/50 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-purple-900 font-bold mb-1">CVC</label>
                    <input
                      type="text"
                      defaultValue="882"
                      className="w-full px-3 py-2 rounded-xl border border-purple-100 bg-purple-50/50 font-medium"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleProcessPayment}
                disabled={paymentSuccess}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#9333EA] hover:from-[#6D28D9] text-white font-black text-xs shadow-md glow-purple transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {paymentSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300 animate-spin" />
                    <span>Verifying Transaction...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-amber-300" />
                    <span>Authorize Payment of ${feeDetails.total}</span>
                  </>
                )}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* OFFICIAL FEE RECEIPT MODAL */}
      <AnimatePresence>
        {showReceiptModal && (
          <div className="fixed inset-0 bg-[#1E1B4B]/50 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-purple-200 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowReceiptModal(false)}
                className="absolute top-4 right-4 p-2 text-purple-400 hover:text-purple-700 rounded-2xl hover:bg-purple-50 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Printable Receipt Container */}
              <div id="official-fee-receipt" className="border-2 border-purple-200 rounded-2xl p-6 sm:p-8 space-y-6 bg-[#FCFAFF]">
                {/* School Header */}
                <div className="flex items-start justify-between border-b-2 border-purple-200 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#7C3AED] text-white flex items-center justify-center font-black text-lg shadow-md">
                      SJ
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-[#1E1B4B]">ST. JUDE INTERNATIONAL ACADEMY</h2>
                      <p className="text-[11px] text-purple-800 font-medium">Affiliated to CBSE/ICSE • Campus Sector 4, Metro City</p>
                      <p className="text-[10px] text-purple-600 font-mono">Official Fee Receipt & Student Ledger</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-200 inline-block">
                      VERIFIED PAID
                    </span>
                    <p className="text-[10px] text-purple-700 font-mono font-bold mt-1">Receipt: {receiptNumber}</p>
                    <p className="text-[10px] text-slate-500 font-medium">Date: 2026-05-20</p>
                  </div>
                </div>

                {/* Student & Parent Metadata */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-purple-50/60 p-3.5 rounded-xl border border-purple-100">
                  <div>
                    <span className="text-[10px] font-bold text-purple-700 block uppercase">Student Name</span>
                    <span className="font-black text-[#1E1B4B]">{selectedChild.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-purple-700 block uppercase">Standard / Class</span>
                    <span className="font-black text-[#7C3AED]">{activeStandard}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-purple-700 block uppercase">Section & Roll</span>
                    <span className="font-black text-[#1E1B4B]">Sec {selectedChild.section || 'A'} • {selectedChild.id.toUpperCase()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-purple-700 block uppercase">Parent / Guardian</span>
                    <span className="font-black text-[#1E1B4B]">{user.name}</span>
                  </div>
                </div>

                {/* Itemized Table */}
                <div className="border border-purple-200 rounded-xl overflow-hidden text-xs">
                  <div className="grid grid-cols-12 bg-purple-100/80 p-2.5 font-black text-purple-900 text-[11px]">
                    <span className="col-span-1">#</span>
                    <span className="col-span-7">Fee Component</span>
                    <span className="col-span-2 text-center">Category</span>
                    <span className="col-span-2 text-right">Amount ($)</span>
                  </div>

                  <div className="divide-y divide-purple-100 bg-white">
                    <div className="grid grid-cols-12 p-2.5 font-medium text-slate-800">
                      <span className="col-span-1 text-slate-400 font-bold">1</span>
                      <span className="col-span-7 font-bold">Tuition Fees ({activeStandard} Schedule)</span>
                      <span className="col-span-2 text-center text-purple-700 font-semibold text-[10px]">Academic</span>
                      <span className="col-span-2 text-right font-black">${feeDetails.tuitionFee}.00</span>
                    </div>

                    <div className="grid grid-cols-12 p-2.5 font-medium text-slate-800">
                      <span className="col-span-1 text-slate-400 font-bold">2</span>
                      <span className="col-span-7 font-bold">School & Term Maintenance</span>
                      <span className="col-span-2 text-center text-purple-700 font-semibold text-[10px]">Institutional</span>
                      <span className="col-span-2 text-right font-black">${feeDetails.schoolFee}.00</span>
                    </div>

                    <div className="grid grid-cols-12 p-2.5 font-medium text-slate-800">
                      <span className="col-span-1 text-slate-400 font-bold">3</span>
                      <span className="col-span-7 font-bold">Physics, Chemistry & STEM Lab Consumables</span>
                      <span className="col-span-2 text-center text-purple-700 font-semibold text-[10px]">Laboratory</span>
                      <span className="col-span-2 text-right font-black">${feeDetails.labFee}.00</span>
                    </div>

                    <div className="grid grid-cols-12 p-2.5 font-medium text-slate-800">
                      <span className="col-span-1 text-slate-400 font-bold">4</span>
                      <span className="col-span-7 font-bold">Library & Digital Learning Subscriptions</span>
                      <span className="col-span-2 text-center text-purple-700 font-semibold text-[10px]">Library</span>
                      <span className="col-span-2 text-right font-black">${feeDetails.libraryFee}.00</span>
                    </div>

                    <div className="grid grid-cols-12 p-2.5 font-medium text-slate-800">
                      <span className="col-span-1 text-slate-400 font-bold">5</span>
                      <span className="col-span-7 font-bold">Assessment & Board Exam Administration</span>
                      <span className="col-span-2 text-center text-purple-700 font-semibold text-[10px]">Examination</span>
                      <span className="col-span-2 text-right font-black">${feeDetails.examFee}.00</span>
                    </div>

                    <div className="grid grid-cols-12 p-2.5 font-medium text-slate-800">
                      <span className="col-span-1 text-slate-400 font-bold">6</span>
                      <span className="col-span-7 font-bold">School Bus Route Telemetry & Transport</span>
                      <span className="col-span-2 text-center text-purple-700 font-semibold text-[10px]">Transport</span>
                      <span className="col-span-2 text-right font-black">${feeDetails.transportFee}.00</span>
                    </div>
                  </div>

                  <div className="p-3 bg-purple-50/80 border-t-2 border-purple-200 flex items-center justify-between text-xs font-black">
                    <span className="text-purple-900">Total Amount Paid:</span>
                    <span className="text-base text-[#7C3AED]">${feeDetails.total}.00</span>
                  </div>
                </div>

                {/* Footer Stamp & Signature */}
                <div className="flex items-center justify-between pt-2">
                  <div className="text-[10px] text-purple-700 space-y-0.5">
                    <p className="font-bold">Payment Method: Online Card / Gateway Verified</p>
                    <p className="font-mono">Transaction Hash: TXN_88F9A4C70129B</p>
                    <p className="text-emerald-700 font-bold">Status: Nil Balance Remaining ($0.00)</p>
                  </div>

                  <div className="text-center">
                    <div className="w-24 h-10 border-b border-purple-300 mx-auto flex items-end justify-center pb-1">
                      <span className="font-serif italic font-bold text-xs text-purple-900">S. Roy</span>
                    </div>
                    <span className="text-[9px] font-black uppercase text-purple-700">Accounts & Bursar Officer</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => window.print()}
                  className="px-5 py-2.5 rounded-2xl bg-purple-50 hover:bg-purple-100 text-[#1E1B4B] font-bold text-xs transition-all flex items-center gap-2 cursor-pointer border border-purple-200"
                >
                  <Printer className="w-4 h-4 text-[#7C3AED]" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={() => setShowReceiptModal(false)}
                  className="px-5 py-2.5 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-black text-xs transition-all cursor-pointer shadow-md"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
