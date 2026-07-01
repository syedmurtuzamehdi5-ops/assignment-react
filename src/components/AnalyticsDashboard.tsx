import { useState } from 'react';
import { motion } from 'motion/react';
import { Users, Award, Percent, BookOpen, Sparkles, AlertCircle, Heart } from 'lucide-react';
import { Student, StudentStats } from '../types';
import { calculateAverage, isPassed } from '../utils/gradeCalc';

interface AnalyticsDashboardProps {
  students: Student[];
}

export default function AnalyticsDashboard({ students }: AnalyticsDashboardProps) {
  const [activeSubjectTab, setActiveSubjectTab] = useState<'all' | 'math' | 'science' | 'english'>('all');

  // Calculate statistics
  const totalStudents = students.length;
  const passCount = students.filter(isPassed).length;
  const failCount = totalStudents - passCount;
  const passPercentage = totalStudents > 0 ? Math.round((passCount / totalStudents) * 100) : 0;

  // Class averages
  const classAverage = totalStudents > 0
    ? Number((students.reduce((acc, s) => acc + calculateAverage(s), 0) / totalStudents).toFixed(1))
    : 0;

  const mathAverage = totalStudents > 0
    ? Number((students.reduce((acc, s) => acc + s.math, 0) / totalStudents).toFixed(1))
    : 0;

  const scienceAverage = totalStudents > 0
    ? Number((students.reduce((acc, s) => acc + s.science, 0) / totalStudents).toFixed(1))
    : 0;

  const englishAverage = totalStudents > 0
    ? Number((students.reduce((acc, s) => acc + s.english, 0) / totalStudents).toFixed(1))
    : 0;

  const averageAttendance = totalStudents > 0
    ? Math.round(students.reduce((acc, s) => acc + s.attendance, 0) / totalStudents)
    : 0;

  // Find topper
  let topper: Student | null = null;
  let maxAverage = -1;
  students.forEach((s) => {
    const avg = calculateAverage(s);
    if (avg > maxAverage) {
      maxAverage = avg;
      topper = s;
    }
  });

  // Render empty state if no students
  if (totalStudents === 0) {
    return (
      <div className="bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl p-8 text-center shadow-xl transition-theme">
        <div className="inline-flex p-4 rounded-2xl bg-slate-500/10 dark:bg-white/5 text-slate-400 dark:text-slate-500 mb-4">
          <Users className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-display font-semibold text-slate-800 dark:text-slate-100 mb-1">
          No Insights Available
        </h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto text-sm">
          Please add student records to compute averages, pass/fail analysis, and highlight class performers.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
      {/* CARD 1: OVERVIEW METRIC (TOTAL STUDENTS) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white/45 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl p-5 md:p-6 shadow-xl flex flex-col justify-between relative overflow-hidden transition-theme"
      >
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-24 h-24 bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Class Roll</span>
          <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 backdrop-blur-md">
            <Users className="w-5 h-5" />
          </div>
        </div>
        <div>
          <h2 className="text-3xl md:text-4xl font-display font-extrabold text-slate-900 dark:text-white mb-1">
            {totalStudents}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-1">
            <span>Active registered students</span>
          </p>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] text-slate-500">
          <span>Gender Ratio</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {students.filter(s => s.gender === 'Male').length} M • {students.filter(s => s.gender === 'Female').length} F
          </span>
        </div>
      </motion.div>

      {/* CARD 2: DYNAMIC PASS RATE (CIRCULAR GRAPH) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="bg-white/45 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl p-5 md:p-6 shadow-xl flex flex-col justify-between relative overflow-hidden transition-theme"
      >
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-24 h-24 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Pass Percentage</span>
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 backdrop-blur-md">
            <Percent className="w-5 h-5" />
          </div>
        </div>
        
        <div className="flex items-center gap-4 py-1">
          {/* Circular SVG Ring */}
          <div className="relative w-16 h-16 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-200/50 dark:text-white/5"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <motion.path
                initial={{ strokeDasharray: "0, 100" }}
                animate={{ strokeDasharray: `${passPercentage}, 100` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-emerald-500 dark:text-emerald-400"
                strokeWidth="3.5"
                strokeDasharray={`${passPercentage}, 100`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-300">{passPercentage}%</span>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-display font-extrabold text-slate-900 dark:text-white">
              {passCount} <span className="text-sm font-normal text-slate-400">passed</span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {failCount} failing ({totalStudents - passCount} needing support)
            </p>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] text-slate-500">
          <span>Passing Criteria</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">Avg ≥ 40 & Subjects ≥ 35</span>
        </div>
      </motion.div>

      {/* CARD 3: CLASS AVERAGES & PROGRESS */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white/45 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl p-5 md:p-6 shadow-xl flex flex-col justify-between relative overflow-hidden transition-theme col-span-1 md:col-span-2 lg:col-span-1"
      >
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-24 h-24 bg-violet-500/10 dark:bg-violet-500/15 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Class Performance</span>
          <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-600 dark:text-violet-400 backdrop-blur-md">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="space-y-2 py-1">
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-display font-extrabold text-slate-900 dark:text-white">
              {classAverage}
            </h2>
            <span className="text-xs text-slate-400">/ 100 overall</span>
          </div>
          
          {/* Subject mini-bars */}
          <div className="space-y-1.5">
            <div>
              <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
                <span>Math</span>
                <span className="font-medium">{mathAverage}%</span>
              </div>
              <div className="w-full bg-slate-200/50 dark:bg-white/5 h-1 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: `${mathAverage}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
                <span>Science</span>
                <span className="font-medium">{scienceAverage}%</span>
              </div>
              <div className="w-full bg-slate-200/50 dark:bg-white/5 h-1 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${scienceAverage}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400">
                <span>English</span>
                <span className="font-medium">{englishAverage}%</span>
              </div>
              <div className="w-full bg-slate-200/50 dark:bg-white/5 h-1 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${englishAverage}%` }} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-2 pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] text-slate-500">
          <span>Highest Average Subject</span>
          <span className="font-semibold text-violet-600 dark:text-violet-400">
            {mathAverage >= scienceAverage && mathAverage >= englishAverage ? 'Math' : (scienceAverage >= englishAverage ? 'Science' : 'English')}
          </span>
        </div>
      </motion.div>

      {/* CARD 4: TOP PERFORMING STUDENT */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="bg-white/45 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl p-5 md:p-6 shadow-xl flex flex-col justify-between relative overflow-hidden transition-theme col-span-1 md:col-span-2 lg:col-span-1"
      >
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-24 h-24 bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Top Performer</span>
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 backdrop-blur-md">
            <Award className="w-5 h-5" />
          </div>
        </div>

        {topper ? (
          <div className="flex flex-col justify-center py-1">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-medium flex items-center gap-1 shrink-0">
                <Sparkles className="w-3 h-3" />
                Topper
              </span>
              <span className="text-[11px] text-slate-400">Roll {(topper as Student).rollNumber}</span>
            </div>
            <h3 className="text-lg font-display font-bold text-slate-800 dark:text-slate-200 truncate leading-tight">
              {(topper as Student).name}
            </h3>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {calculateAverage(topper)}%
              </span>
              <span className="text-xs text-slate-400">average score</span>
            </div>
          </div>
        ) : (
          <div className="text-slate-400 text-sm py-4">No data</div>
        )}

        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] text-slate-500">
          <span>Attendance Ratio</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {averageAttendance}% overall
          </span>
        </div>
      </motion.div>
    </div>
  );
}
