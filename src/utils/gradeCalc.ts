import { Student } from '../types';

export function calculateAverage(student: Student): number {
  return Number(((student.math + student.science + student.english) / 3).toFixed(1));
}

export function calculateGrade(average: number): string {
  if (average >= 90) return 'A+';
  if (average >= 80) return 'A';
  if (average >= 70) return 'B';
  if (average >= 60) return 'C';
  if (average >= 50) return 'D';
  if (average >= 40) return 'E';
  return 'F';
}

export function isPassed(student: Student): boolean {
  // Pass if each subject is >= 35 and overall average is >= 40
  return student.math >= 35 && student.science >= 35 && student.english >= 35 && calculateAverage(student) >= 40;
}

export function getGradeBadgeColor(grade: string): string {
  switch (grade) {
    case 'A+': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50';
    case 'A': return 'bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400 border-teal-200 dark:border-teal-800/50';
    case 'B': return 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800/50';
    case 'C': return 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/50';
    case 'D': return 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800/50';
    case 'E': return 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400 border-orange-200 dark:border-orange-800/50';
    default: return 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-800/50';
  }
}
