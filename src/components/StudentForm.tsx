import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserPlus, Save, X, Sparkles, HelpCircle, FileText, CheckCircle } from 'lucide-react';
import { Student } from '../types';
import { calculateAverage, calculateGrade } from '../utils/gradeCalc';

interface StudentFormProps {
  onSubmit: (studentData: Omit<Student, 'id'> & { id?: string }) => void;
  existingStudents: Student[];
  editingStudent: Student | null;
  onCancelEdit: () => void;
}

export default function StudentForm({
  onSubmit,
  existingStudents,
  editingStudent,
  onCancelEdit,
}: StudentFormProps) {
  // Form fields
  const [rollNumber, setRollNumber] = useState('');
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [attendance, setAttendance] = useState('90');
  const [math, setMath] = useState('');
  const [science, setScience] = useState('');
  const [english, setEnglish] = useState('');
  const [remarks, setRemarks] = useState('');

  // Form error states
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Load editing student data if any
  useEffect(() => {
    if (editingStudent) {
      setRollNumber(editingStudent.rollNumber);
      setName(editingStudent.name);
      setGender(editingStudent.gender);
      setAttendance(editingStudent.attendance.toString());
      setMath(editingStudent.math.toString());
      setScience(editingStudent.science.toString());
      setEnglish(editingStudent.english.toString());
      setRemarks(editingStudent.remarks || '');
      setErrors({});
    } else {
      resetForm();
    }
  }, [editingStudent]);

  const resetForm = () => {
    setRollNumber('');
    setName('');
    setGender('Male');
    setAttendance('90');
    setMath('');
    setScience('');
    setEnglish('');
    setRemarks('');
    setErrors({});
  };

  // Live preview metrics
  const mathNum = parseInt(math) || 0;
  const scienceNum = parseInt(science) || 0;
  const englishNum = parseInt(english) || 0;
  
  const liveAvg = math && science && english 
    ? Number(((mathNum + scienceNum + englishNum) / 3).toFixed(1))
    : 0;
  const liveGrade = math && science && english ? calculateGrade(liveAvg) : '—';

  // Basic Validation Logic
  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Roll Number validation
    if (!rollNumber.trim()) {
      newErrors.rollNumber = 'Roll number is required.';
    } else if (!/^\d+$/.test(rollNumber.trim())) {
      newErrors.rollNumber = 'Roll number must contain digits only.';
    } else {
      // Check for uniqueness (excluding current student being edited)
      const rollConflict = existingStudents.some(
        (s) => s.rollNumber.trim() === rollNumber.trim() && s.id !== editingStudent?.id
      );
      if (rollConflict) {
        newErrors.rollNumber = 'Roll number already exists in records.';
      }
    }

    // Name validation
    if (!name.trim()) {
      newErrors.name = 'Student name is required.';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    } else if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
      newErrors.name = 'Name must contain only letters and spaces.';
    }

    // Attendance validation
    const attNum = parseInt(attendance);
    if (!attendance) {
      newErrors.attendance = 'Attendance is required.';
    } else if (isNaN(attNum) || attNum < 0 || attNum > 100) {
      newErrors.attendance = 'Attendance must be between 0% and 100%.';
    }

    // Marks validation (Math)
    const mathVal = parseInt(math);
    if (math === '') {
      newErrors.math = 'Math marks are required.';
    } else if (isNaN(mathVal) || mathVal < 0 || mathVal > 100) {
      newErrors.math = 'Must be between 0 and 100.';
    }

    // Marks validation (Science)
    const sciVal = parseInt(science);
    if (science === '') {
      newErrors.science = 'Science marks are required.';
    } else if (isNaN(sciVal) || sciVal < 0 || sciVal > 100) {
      newErrors.science = 'Must be between 0 and 100.';
    }

    // Marks validation (English)
    const engVal = parseInt(english);
    if (english === '') {
      newErrors.english = 'English marks are required.';
    } else if (isNaN(engVal) || engVal < 0 || engVal > 100) {
      newErrors.english = 'Must be between 0 and 100.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        ...(editingStudent && { id: editingStudent.id }),
        rollNumber: rollNumber.trim(),
        name: name.trim(),
        gender,
        attendance: parseInt(attendance),
        math: parseInt(math),
        science: parseInt(science),
        english: parseInt(english),
        remarks: remarks.trim() || undefined,
      });

      // Show temporary success feedback
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);

      if (!editingStudent) {
        resetForm();
      }
    }
  };

  return (
    <div className="bg-white/45 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden transition-theme">
      {/* Background decoration */}
      <div className="absolute right-0 top-0 -translate-y-8 translate-x-8 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10 dark:border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 backdrop-blur-md">
            {editingStudent ? <Save className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="text-lg font-display font-bold text-slate-900 dark:text-slate-100">
              {editingStudent ? 'Edit Student Record' : 'Register New Student'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {editingStudent ? 'Update details for ' + editingStudent.name : 'Fill in the details with subject scores.'}
            </p>
          </div>
        </div>
        {editingStudent && (
          <button
            onClick={onCancelEdit}
            type="button"
            className="p-1.5 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 rounded-lg text-slate-400 hover:text-slate-600 transition"
            title="Cancel edit"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-4">
        {/* Core details row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Roll Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
              Roll Number *
            </label>
            <input
              type="text"
              placeholder="e.g. 1010"
              value={rollNumber}
              onChange={(e) => {
                setRollNumber(e.target.value);
                if (errors.rollNumber) setErrors({ ...errors, rollNumber: '' });
              }}
              className={`w-full px-4 py-2.5 rounded-xl border bg-white/30 dark:bg-slate-950/30 text-slate-800 dark:text-slate-200 text-sm transition focus:outline-hidden focus:ring-2 ${
                errors.rollNumber
                  ? 'border-rose-300 focus:ring-rose-500/10'
                  : 'border-slate-200/40 dark:border-white/5 focus:border-indigo-500 focus:ring-indigo-500/10'
              }`}
            />
            {errors.rollNumber && (
              <p className="text-rose-500 dark:text-rose-400 text-xs mt-1 font-medium">{errors.rollNumber}</p>
            )}
          </div>

          {/* Student Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
              Student Name *
            </label>
            <input
              type="text"
              placeholder="e.g. David Vance"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({ ...errors, name: '' });
              }}
              className={`w-full px-4 py-2.5 rounded-xl border bg-white/30 dark:bg-slate-950/30 text-slate-800 dark:text-slate-200 text-sm transition focus:outline-hidden focus:ring-2 ${
                errors.name
                  ? 'border-rose-300 focus:ring-rose-500/10'
                  : 'border-slate-200/40 dark:border-white/5 focus:border-indigo-500 focus:ring-indigo-500/10'
              }`}
            />
            {errors.name && (
              <p className="text-rose-500 dark:text-rose-400 text-xs mt-1 font-medium">{errors.name}</p>
            )}
          </div>
        </div>

        {/* Secondary details row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Gender selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
              Gender
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Male', 'Female', 'Other'] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={`py-2 text-xs font-semibold rounded-xl border transition ${
                    gender === g
                      ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-600 dark:text-indigo-400'
                      : 'bg-white/20 dark:bg-white/5 border-white/10 dark:border-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/30'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Attendance Percentage */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
              Attendance (%) *
            </label>
            <input
              type="number"
              min="0"
              max="100"
              placeholder="e.g. 92"
              value={attendance}
              onChange={(e) => {
                setAttendance(e.target.value);
                if (errors.attendance) setErrors({ ...errors, attendance: '' });
              }}
              className={`w-full px-4 py-2 rounded-xl border bg-white/30 dark:bg-slate-950/30 text-slate-800 dark:text-slate-200 text-sm transition focus:outline-hidden focus:ring-2 ${
                errors.attendance
                  ? 'border-rose-300 focus:ring-rose-500/10'
                  : 'border-slate-200/40 dark:border-white/5 focus:border-indigo-500 focus:ring-indigo-500/10'
              }`}
            />
            {errors.attendance && (
              <p className="text-rose-500 dark:text-rose-400 text-xs mt-1 font-medium">{errors.attendance}</p>
            )}
          </div>
        </div>

        {/* Marks section heading */}
        <div className="pt-2">
          <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-3">
            <span>Subject Scores (0 - 100)</span>
            <span className="h-px bg-white/10 grow" />
          </h3>

          <div className="grid grid-cols-3 gap-3">
            {/* Mathematics */}
            <div className="group">
              <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1 group-focus-within:text-blue-500 transition-colors">
                Mathematics
              </label>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="Math"
                value={math}
                onChange={(e) => {
                  setMath(e.target.value);
                  if (errors.math) setErrors({ ...errors, math: '' });
                }}
                className={`w-full px-3 py-2 rounded-xl border bg-white/30 dark:bg-slate-950/30 text-slate-800 dark:text-slate-200 text-sm text-center transition focus:outline-hidden focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 ${
                  errors.math ? 'border-rose-300' : 'border-slate-200/40 dark:border-white/5'
                }`}
              />
              {errors.math && (
                <p className="text-rose-500 dark:text-rose-400 text-[10px] mt-1 font-medium text-center">{errors.math}</p>
              )}
            </div>

            {/* Science */}
            <div className="group">
              <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1 group-focus-within:text-emerald-500 transition-colors">
                Science
              </label>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="Sci"
                value={science}
                onChange={(e) => {
                  setScience(e.target.value);
                  if (errors.science) setErrors({ ...errors, science: '' });
                }}
                className={`w-full px-3 py-2 rounded-xl border bg-white/30 dark:bg-slate-950/30 text-slate-800 dark:text-slate-200 text-sm text-center transition focus:outline-hidden focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 ${
                  errors.science ? 'border-rose-300' : 'border-slate-200/40 dark:border-white/5'
                }`}
              />
              {errors.science && (
                <p className="text-rose-500 dark:text-rose-400 text-[10px] mt-1 font-medium text-center">{errors.science}</p>
              )}
            </div>

            {/* English */}
            <div className="group">
              <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 mb-1 group-focus-within:text-amber-500 transition-colors">
                English
              </label>
              <input
                type="number"
                min="0"
                max="100"
                placeholder="Eng"
                value={english}
                onChange={(e) => {
                  setEnglish(e.target.value);
                  if (errors.english) setErrors({ ...errors, english: '' });
                }}
                className={`w-full px-3 py-2 rounded-xl border bg-white/30 dark:bg-slate-950/30 text-slate-800 dark:text-slate-200 text-sm text-center transition focus:outline-hidden focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500 ${
                  errors.english ? 'border-rose-300' : 'border-slate-200/40 dark:border-white/5'
                }`}
              />
              {errors.english && (
                <p className="text-rose-500 dark:text-rose-400 text-[10px] mt-1 font-medium text-center">{errors.english}</p>
              )}
            </div>
          </div>
        </div>

        {/* Live Score Preview Panel */}
        {math && science && english && !errors.math && !errors.science && !errors.english && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-3 bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-between backdrop-blur-md"
          >
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Live Calculations:
            </span>
            <div className="flex gap-4 text-xs font-bold">
              <span className="text-slate-600 dark:text-slate-300">
                Avg: <span className="text-indigo-600 dark:text-indigo-400">{liveAvg}%</span>
              </span>
              <span className="text-slate-600 dark:text-slate-300">
                Grade: <span className="text-indigo-600 dark:text-indigo-400">{liveGrade}</span>
              </span>
            </div>
          </motion.div>
        )}

        {/* Remarks Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
            Evaluation Remarks (Optional)
          </label>
          <textarea
            placeholder="Write general observations, character traits, or improvement paths..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows={2}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200/40 dark:border-white/5 bg-white/30 dark:bg-slate-950/30 text-slate-800 dark:text-slate-200 text-sm focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/10 transition resize-none"
          />
        </div>

        {/* Buttons / Submission actions */}
        <div className="flex gap-3 pt-2">
          {editingStudent && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="flex-1 py-3 text-sm font-bold rounded-2xl border border-white/20 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:bg-white/10 transition duration-150"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="flex-3 bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white font-bold py-3 px-4 rounded-2xl text-sm transition-all duration-150 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 flex items-center justify-center gap-2 cursor-pointer"
          >
            {editingStudent ? (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Register Student</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Success notification panel inside card */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-4 left-4 right-4 bg-emerald-500 text-white px-4 py-2.5 rounded-2xl shadow-lg flex items-center gap-2 text-xs font-bold"
          >
            <CheckCircle className="w-4 h-4" />
            <span>
              {editingStudent
                ? 'Student record updated successfully!'
                : 'Student registered successfully!'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
