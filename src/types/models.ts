// User role types
export type UserRole = 'admin' | 'teacher' | 'student' | 'parent';

// Profile for all users
export interface Profile {
  id: string; // UUID reference to auth.users
  role: UserRole;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

// Student model
export interface Student {
  id: string;
  profile_id: string;
  student_id: string; // School-specific student ID
  first_name: string;
  last_name: string;
  email: string | null;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  address?: string;
  phone?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  grade_level: number | null;
  enrollment_date: string | null;
  status: 'active' | 'inactive' | 'graduated' | 'transferred';
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Teacher model
export interface Teacher {
  id: string;
  profile_id: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  address?: string;
  phone?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  hire_date: string;
  department?: string;
  position?: string;
  qualifications?: string[];
  status: 'active' | 'inactive' | 'on_leave' | 'terminated';
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Class model
export interface Class {
  id: string;
  name: string;
  description?: string;
  grade_level?: number;
  academic_year?: string;
  teacher_id: string;
  max_students: number;
  created_at: string;
  updated_at: string;
}

// Student enrollment model
export interface StudentEnrollment {
  id: string;
  student_id: string;
  class_id: string;
  enrollment_date: string;
  status: 'enrolled' | 'completed' | 'dropped' | 'pending';
  final_grade?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Parent model
export interface Parent {
  id: string;
  profile_id: string;
  first_name: string;
  last_name: string;
  email: string;
  address?: string;
  phone?: string;
  occupation?: string;
  relationship: 'father' | 'mother' | 'guardian' | 'other';
  created_at: string;
  updated_at: string;
}

// Parent-student relationship model
export interface ParentStudentRelationship {
  id: string;
  parent_id: string;
  student_id: string;
  relationship: 'father' | 'mother' | 'guardian' | 'other';
  is_emergency_contact: boolean;
  is_authorized_pickup: boolean;
  created_at: string;
  updated_at: string;
}
