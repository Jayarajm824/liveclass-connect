export interface Student {
  id: string;
  name: string;
  joinedAt: string;
}

export interface Class {
  id: string;
  teacher: string;
  subject: string;
  date: string;
  time: string;
  active: boolean;
  students: Student[];
}

export interface User {
  id: string;
  name: string;
  role: 'teacher' | 'student';
}