import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  LayoutGrid,
  List,
  Trash2,
  Edit,
  Filter,
  ArrowUpDown,
  User,
  CheckCircle2,
  XCircle,
  MessageSquare,
  BookOpen,
  Award,
  Calendar
} from 'lucide-react';
import { Student } from '../types';
import { calculateAverage, calculateGrade, isPassed, getGradeBadgeColor } from '../utils/gradeCalc';

interface StudentListProps {
  students: Student[];
  onDelete: (id: string) => void;
  onEdit: (student: Student) => void;
}

type SortField = 'rollNumber' | 'name' | 'average' | 'attendance';
type SortOrder = 'asc' | 'desc';

export default function StudentList({ students, onDelete, onEdit }: StudentListProps) {
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pass' | 'fail'>('all');
  const [genderFilter, setGenderFilter] = useState<'all' | 'Male' | 'Female' | 'Other'>('all');
  
  // Sorting states
  const [sortField, setSortField] = useState<SortField>('rollNumber');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // View state (Table vs Grid)
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Triggering sort cycles
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setGenderFilter('all');
    setSortField('rollNumber');
    setSortOrder('asc');
  };

  // Filter students
  const filteredStudents = students.filter((student) => {
    const avg = calculateAverage(student);
    const passed = isPassed(student);
    
    // Search filter
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNumber.includes(searchQuery);

    // Status filter
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'pass' && passed) ||
      (statusFilter === 'fail' && !passed);

    // Gender filter
    const matchesGender = genderFilter === 'all' || student.gender === genderFilter;

    return matchesSearch && matchesStatus && matchesGender;
  });

  // Sort students
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    let valA: string | number = '';
    let valB: string | number = '';

    if (sortField === 'rollNumber') {
      valA = parseInt(a.rollNumber) || 0;
      valB = parseInt(b.rollNumber) || 0;
    } else if (sortField === 'name') {
      valA = a.name.toLowerCase();
      valB = b.name.toLowerCase();
    } else if (sortField === 'average') {
      valA = calculateAverage(a);
      valB = calculateAverage(b);
    } else if (sortField === 'attendance') {
      valA = a.attendance;
      valB = b.attendance;
    }

    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div className="bg-white/45 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl p-6 shadow-xl transition-theme">
      {/* Search and Filters Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search student by name or roll number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200/40 dark:border-white/5 bg-white/30 dark:bg-slate-950/30 text-slate-800 dark:text-slate-200 text-sm focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition"
          />
        </div>

        {/* Filter Selection Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter Dropdown */}
          <div className="flex items-center gap-1.5 bg-white/30 dark:bg-slate-950/30 border border-slate-200/40 dark:border-white/5 rounded-2xl px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-transparent border-none outline-hidden cursor-pointer font-semibold pr-1 text-slate-700 dark:text-slate-300"
            >
              <option value="all" className="bg-white dark:bg-[#0f172a]">All Statuses</option>
              <option value="pass" className="bg-white dark:bg-[#0f172a] text-emerald-600 dark:text-emerald-400">Passed Only</option>
              <option value="fail" className="bg-white dark:bg-[#0f172a] text-rose-600 dark:text-rose-400">Failed Only</option>
            </select>
          </div>

          {/* Gender Filter Dropdown */}
          <div className="flex items-center gap-1.5 bg-white/30 dark:bg-slate-950/30 border border-slate-200/40 dark:border-white/5 rounded-2xl px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value as any)}
              className="bg-transparent border-none outline-hidden cursor-pointer font-semibold pr-1 text-slate-700 dark:text-slate-300"
            >
              <option value="all" className="bg-white dark:bg-[#0f172a]">All Genders</option>
              <option value="Male" className="bg-white dark:bg-[#0f172a]">Male</option>
              <option value="Female" className="bg-white dark:bg-[#0f172a]">Female</option>
              <option value="Other" className="bg-white dark:bg-[#0f172a]">Other</option>
            </select>
          </div>

          {/* Toggle View Mode Buttons */}
          <div className="flex items-center gap-1 bg-white/20 dark:bg-white/5 border border-white/10 dark:border-white/5 rounded-xl p-1">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'table'
                  ? 'bg-indigo-500/15 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Table view"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition ${
                viewMode === 'grid'
                  ? 'bg-indigo-500/15 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="Card grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Sorting indicators if sorting is active */}
      <div className="flex items-center gap-2 mb-4 text-xs text-slate-500 dark:text-slate-400">
        <span className="font-semibold">Active Sort:</span>
        <button
          onClick={() => handleSort(sortField)}
          className="px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1 hover:bg-indigo-500/20 transition cursor-pointer backdrop-blur-md"
        >
          {sortField === 'rollNumber' && 'Roll Number'}
          {sortField === 'name' && 'Student Name'}
          {sortField === 'average' && 'Average Score'}
          {sortField === 'attendance' && 'Attendance'}
          <span className="text-[10px]">{sortOrder === 'asc' ? '▲' : '▼'}</span>
        </button>
      </div>

      {/* Main Student Record Listing */}
      {sortedStudents.length === 0 ? (
        <div className="py-12 text-center">
          <div className="inline-flex p-3 rounded-2xl bg-slate-500/10 dark:bg-white/5 border border-white/10 text-slate-400 dark:text-slate-500 mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-700 dark:text-slate-300">No student records found</h4>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs mx-auto">
            Try adjusting your search filters or clear inputs to see the active records.
          </p>
          <button
            onClick={resetFilters}
            className="mt-4 px-4 py-2 text-xs font-bold rounded-xl bg-indigo-500/10 border border-indigo-500/25 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 transition cursor-pointer"
          >
            Clear Search & Filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* ==================== TABLE VIEW MODE ==================== */
        <div className="overflow-x-auto rounded-2xl border border-white/10 dark:border-white/5">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/20 dark:bg-white/5 border-b border-white/10 dark:border-white/5 text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider font-extrabold">
                <th
                  onClick={() => handleSort('rollNumber')}
                  className="px-4 py-4 cursor-pointer hover:text-slate-900 dark:hover:text-white transition"
                >
                  <span className="flex items-center gap-1.5">
                    Roll No <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th
                  onClick={() => handleSort('name')}
                  className="px-6 py-4 cursor-pointer hover:text-slate-900 dark:hover:text-white transition"
                >
                  <span className="flex items-center gap-1.5">
                    Name <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th className="px-4 py-4">Gender</th>
                <th
                  onClick={() => handleSort('attendance')}
                  className="px-4 py-4 cursor-pointer hover:text-slate-900 dark:hover:text-white transition"
                >
                  <span className="flex items-center gap-1.5">
                    Attendance <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th className="px-4 py-4 text-center">Math</th>
                <th className="px-4 py-4 text-center">Science</th>
                <th className="px-4 py-4 text-center">English</th>
                <th
                  onClick={() => handleSort('average')}
                  className="px-6 py-4 cursor-pointer hover:text-slate-900 dark:hover:text-white transition text-center"
                >
                  <span className="flex items-center justify-center gap-1.5">
                    Average <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th className="px-4 py-4 text-center">Grade</th>
                <th className="px-4 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 dark:divide-white/5">
              <AnimatePresence initial={false}>
                {sortedStudents.map((student) => {
                  const avg = calculateAverage(student);
                  const grade = calculateGrade(avg);
                  const passed = isPassed(student);
                  const isTopScore = avg >= 90;

                  return (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="hover:bg-white/20 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300 text-sm transition-theme group"
                    >
                      {/* Roll Number */}
                      <td className="px-4 py-4.5 font-bold text-slate-900 dark:text-white">
                        #{student.rollNumber}
                      </td>

                      {/* Name */}
                      <td className="px-6 py-4.5">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-900 dark:text-slate-100">
                            {student.name}
                          </span>
                          {isTopScore && (
                            <span className="p-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400" title="Excellent Score">
                              <Award className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Gender */}
                      <td className="px-4 py-4.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {student.gender}
                      </td>

                      {/* Attendance */}
                      <td className="px-4 py-4.5">
                        <div className="flex items-center gap-2">
                          <div className="w-12 bg-slate-200/50 dark:bg-white/5 h-1.5 rounded-full overflow-hidden shrink-0">
                            <div
                              className={`h-full rounded-full ${
                                student.attendance >= 90
                                  ? 'bg-emerald-500'
                                  : student.attendance >= 75
                                  ? 'bg-indigo-500'
                                  : 'bg-rose-500'
                              }`}
                              style={{ width: `${student.attendance}%` }}
                            />
                          </div>
                          <span className={`text-xs font-bold ${
                            student.attendance < 75 ? 'text-rose-500' : 'text-slate-500 dark:text-slate-400'
                          }`}>
                            {student.attendance}%
                          </span>
                        </div>
                      </td>

                      {/* Math Marks */}
                      <td className="px-4 py-4.5 text-center font-mono text-xs font-semibold">
                        {student.math}
                      </td>

                      {/* Science Marks */}
                      <td className="px-4 py-4.5 text-center font-mono text-xs font-semibold">
                        {student.science}
                      </td>

                      {/* English Marks */}
                      <td className="px-4 py-4.5 text-center font-mono text-xs font-semibold">
                        {student.english}
                      </td>

                      {/* Overall Average */}
                      <td className="px-6 py-4.5 text-center font-extrabold text-slate-900 dark:text-white">
                        {avg}%
                      </td>

                      {/* Grade */}
                      <td className="px-4 py-4.5 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${getGradeBadgeColor(grade)}`}>
                          {grade}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4.5 text-center">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border ${
                            passed
                              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20'
                          }`}
                        >
                          {passed ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <XCircle className="w-3 h-3 text-rose-500" />
                          )}
                          <span>{passed ? 'Pass' : 'Fail'}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4.5 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                          <button
                            onClick={() => onEdit(student)}
                            className="p-1.5 rounded-lg bg-white/35 dark:bg-white/5 border border-white/10 dark:border-white/5 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-500/10 transition cursor-pointer"
                            title="Edit Record"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDelete(student.id)}
                            className="p-1.5 rounded-lg bg-white/35 dark:bg-white/5 border border-white/10 dark:border-white/5 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      ) : (
        /* ==================== GRID / CARD VIEW MODE ==================== */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence initial={false}>
            {sortedStudents.map((student) => {
              const avg = calculateAverage(student);
              const grade = calculateGrade(avg);
              const passed = isPassed(student);
              const isTopScore = avg >= 90;

              return (
                <motion.div
                  key={student.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white/40 dark:bg-[#0f172a]/40 backdrop-blur-md border border-slate-200/30 dark:border-white/5 rounded-2xl p-5 shadow-xl relative flex flex-col justify-between group transition-theme hover:border-indigo-500/40"
                >
                  {/* Card top banner/badges */}
                  <div className="flex items-start justify-between gap-2 mb-4">
                    <div>
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-bold font-mono">
                        ROLL #{student.rollNumber}
                      </span>
                      <h3 className="text-base font-display font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 mt-0.5">
                        {student.name}
                        {isTopScore && (
                          <span className="text-amber-500" title="Distinction">
                            <Award className="w-4 h-4 shrink-0" />
                          </span>
                        )}
                      </h3>
                      <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span>{student.gender}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {student.attendance}% Attendance
                        </span>
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${getGradeBadgeColor(grade)}`}>
                        {grade}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          passed
                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20'
                        }`}
                      >
                        {passed ? (
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                        ) : (
                          <XCircle className="w-2.5 h-2.5 text-rose-500" />
                        )}
                        <span>{passed ? 'Pass' : 'Fail'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Marks breakdown blocks */}
                  <div className="bg-slate-500/5 dark:bg-white/5 border border-slate-200/20 dark:border-white/5 rounded-xl p-3 grid grid-cols-3 gap-2 mb-4">
                    <div className="text-center">
                      <span className="block text-[10px] font-semibold text-slate-400 dark:text-slate-500">Math</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{student.math}</span>
                    </div>
                    <div className="text-center border-x border-slate-200/20 dark:border-white/5">
                      <span className="block text-[10px] font-semibold text-slate-400 dark:text-slate-500">Science</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{student.science}</span>
                    </div>
                    <div className="text-center">
                      <span className="block text-[10px] font-semibold text-slate-400 dark:text-slate-500">English</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{student.english}</span>
                    </div>
                  </div>

                  {/* Remarks preview if present */}
                  {student.remarks && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 bg-slate-500/5 dark:bg-slate-900/10 rounded-xl p-2.5 mb-4 border border-slate-200/10 dark:border-white/5 flex gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <p className="line-clamp-2 italic text-[11px]">"{student.remarks}"</p>
                    </div>
                  )}

                  {/* Average Score Progress & Action Row */}
                  <div className="mt-auto pt-3 border-t border-slate-200/20 dark:border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold tracking-wider">Average</span>
                      <span className="block text-base font-extrabold text-slate-900 dark:text-white">{avg}%</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1">
                      <button
                        onClick={() => onEdit(student)}
                        className="p-1.5 rounded-lg bg-white/35 dark:bg-white/5 border border-white/10 dark:border-white/5 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-500/10 transition cursor-pointer"
                        title="Edit Record"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(student.id)}
                        className="p-1.5 rounded-lg bg-white/35 dark:bg-white/5 border border-white/10 dark:border-white/5 text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
