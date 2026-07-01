export interface Student {
  id: string;
  rollNumber: string;
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  attendance: number; // percentage, e.g., 85
  math: number; // 0-100
  science: number; // 0-100
  english: number; // 0-100
  remarks?: string;
}

export type Subject = 'math' | 'science' | 'english';

export interface StudentStats {
  totalStudents: number;
  passCount: number;
  failCount: number;
  passPercentage: number;
  classAverage: number;
  mathAverage: number;
  scienceAverage: number;
  englishAverage: number;
  topper: Student | null;
}
