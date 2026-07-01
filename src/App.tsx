import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sun,
  Moon,
  GraduationCap,
  Sparkles,
  Info,
  RotateCcw,
  BookOpen,
  CheckCircle2
} from 'lucide-react';
import { Student } from './types';
import { PRESET_STUDENTS } from './data/presets';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';

export default function App() {
  // Theme state (persisted)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('sms-theme');
    return saved === 'dark' ? 'dark' : 'light';
  });

  // Students state (persisted)
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('sms-students');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse students from localStorage, loading presets instead.');
      }
    }
    return PRESET_STUDENTS;
  });

  // Active student being edited
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Sync theme to localStorage and body styles
  useEffect(() => {
    localStorage.setItem('sms-theme', theme);
  }, [theme]);

  // Sync students to localStorage
  useEffect(() => {
    localStorage.setItem('sms-students', JSON.stringify(students));
  }, [students]);

  // Form submit handler (Add / Edit)
  const handleAddOrUpdateStudent = (studentData: Omit<Student, 'id'> & { id?: string }) => {
    if (studentData.id) {
      // Edit mode: Update existing record
      setStudents((prev) =>
        prev.map((s) => (s.id === studentData.id ? (studentData as Student) : s))
      );
      setEditingStudent(null);
    } else {
      // Add mode: Register new record with generated ID
      const newStudent: Student = {
        ...studentData,
        id: `student-${Date.now()}`
      };
      setStudents((prev) => [newStudent, ...prev]);
    }
  };

  // Delete student record
  const handleDeleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    // Clear editing state if deleting the active edit student
    if (editingStudent?.id === id) {
      setEditingStudent(null);
    }
  };

  // Setup initial edit state
  const handleStartEdit = (student: Student) => {
    setEditingStudent(student);
    // Smoothly scroll to form on mobile devices
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  // Cancel active edit
  const handleCancelEdit = () => {
    setEditingStudent(null);
  };

  // Force-reset list to default preset data
  const handleResetToPresets = () => {
    if (window.confirm('Are you sure you want to reset all records to the default mock students? This will overwrite your current additions.')) {
      setStudents(PRESET_STUDENTS);
      setEditingStudent(null);
    }
  };

  // Format active date representation
  const activeDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className={`${theme === 'dark' ? 'dark bg-[#0f172a] text-slate-100' : 'bg-[#f8fafc] text-slate-900'} min-h-screen font-sans transition-colors duration-500 transition-theme relative overflow-hidden`}>
      {/* Background Mesh Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] bg-blue-600/10 dark:bg-blue-600/25 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 dark:bg-purple-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-indigo-500/5 dark:bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Primary Header/Bar */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/45 dark:bg-[#0f172a]/45 border-b border-white/10 dark:border-white/5 transition-theme">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500/30 dark:bg-indigo-500/40 blur-lg rounded-xl" />
              <div className="relative w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/30">
                S
              </div>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-display font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
                EduFlow <span className="text-indigo-600 dark:text-indigo-400 font-medium text-sm">Student Manager</span>
              </h1>
              <span className="block text-[10px] font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                Academic Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Live date indicator */}
            <span className="hidden md:inline-block text-xs font-semibold text-slate-500 dark:text-slate-400">
              {activeDate}
            </span>

            {/* Reset to presets */}
            <button
              onClick={handleResetToPresets}
              className="p-2 rounded-xl text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-all cursor-pointer"
              title="Reset to default students"
            >
              <RotateCcw className="w-4.5 h-4.5" />
            </button>

            {/* Theme switch button */}
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2.5 rounded-xl border border-white/20 dark:border-white/10 bg-white/15 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-2xs hover:shadow-xs transition-all cursor-pointer backdrop-blur-md"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Welcome Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center gap-1 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5" />
                Frosted Glass Edition
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-950 dark:text-white tracking-tight">
              Student Records
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              Administer scholar records, review grades, generate academic analytics, and manage enrollments.
            </p>
          </div>
        </div>

        {/* Feature Overview Announcement (Creative Tip) */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/20 rounded-3xl p-4 sm:p-5 flex gap-4 text-slate-600 dark:text-slate-400 backdrop-blur-md"
        >
          <div className="p-2 rounded-2xl bg-indigo-500/15 dark:bg-indigo-500/25 text-indigo-600 dark:text-indigo-400 shrink-0 h-10 w-10 flex items-center justify-center">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Interactive Dashboard Guidelines
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Register a student below with scores for Math, Science, and English. The system calculates grades instantly and highlights class averages. Change list view modes to view compact tables or custom visual cards with student details.
            </p>
          </div>
        </motion.div>

        {/* SECTION 1: Bento Analytics Dashboard */}
        <AnalyticsDashboard students={students} />

        {/* SECTION 2: Form and Records Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left panel: Input Form (Spans 4 columns) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <StudentForm
              onSubmit={handleAddOrUpdateStudent}
              existingStudents={students}
              editingStudent={editingStudent}
              onCancelEdit={handleCancelEdit}
            />
          </div>

          {/* Right panel: Active Records List & Analytics (Spans 8 columns) */}
          <div className="lg:col-span-8">
            <StudentList
              students={students}
              onDelete={handleDeleteStudent}
              onEdit={handleStartEdit}
            />
          </div>
        </div>
      </main>

      {/* Footer decoration */}
      <footer className="py-12 mt-20 border-t border-white/10 text-center text-xs text-slate-500 dark:text-slate-400 transition-theme relative z-10">
        <p className="font-semibold tracking-widest uppercase text-[10px]">
          &copy; 2026 EduFlow Systems &bull; Frosted Creative Design &bull; Data-Driven Academics
        </p>
        <p className="mt-1.5 text-[10px] text-slate-400">
          Powered by React 19 & Tailwind CSS v4
        </p>
      </footer>
    </div>
  );
}
