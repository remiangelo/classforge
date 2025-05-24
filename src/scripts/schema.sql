-- Schema for ClassForge School Management System

-- Profiles table to extend the auth.users with role information
create table if not exists public.profiles (
  id uuid references auth.users(id) primary key,
  role text not null check (role in ('admin', 'teacher', 'student', 'parent')),
  first_name text not null,
  last_name text not null,
  email text not null,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Classes table
create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  grade_level integer,
  academic_year text,
  teacher_id uuid references public.profiles(id),
  max_students integer not null default 30,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enhanced students table (replacing the basic Student interface we had)
create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) not null,
  student_id text unique not null, -- School-specific student ID
  first_name text not null,
  last_name text not null,
  email text,
  date_of_birth date,
  gender text check (gender in ('male', 'female', 'other', 'prefer_not_to_say')),
  address text,
  phone text,
  emergency_contact_name text,
  emergency_contact_phone text,
  emergency_contact_relationship text,
  grade_level integer,
  enrollment_date date default current_date,
  status text check (status in ('active', 'inactive', 'graduated', 'transferred')) default 'active',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Student class enrollments (junction table for many-to-many relationship)
create table if not exists public.student_enrollments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.students(id) not null,
  class_id uuid references public.classes(id) not null,
  enrollment_date date default current_date,
  status text check (status in ('enrolled', 'completed', 'dropped', 'pending')) default 'enrolled',
  final_grade numeric(5,2),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  -- Ensure each student can only be enrolled once in each class
  unique(student_id, class_id)
);

-- Teachers table
create table if not exists public.teachers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) not null,
  employee_id text unique not null, -- School-specific employee ID
  first_name text not null,
  last_name text not null,
  email text not null,
  date_of_birth date,
  gender text check (gender in ('male', 'female', 'other', 'prefer_not_to_say')),
  address text,
  phone text,
  emergency_contact_name text,
  emergency_contact_phone text,
  emergency_contact_relationship text,
  hire_date date default current_date,
  department text,
  position text,
  qualifications text[],
  status text check (status in ('active', 'inactive', 'on_leave', 'terminated')) default 'active',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Parents table
create table if not exists public.parents (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) not null,
  first_name text not null,
  last_name text not null,
  email text not null,
  address text,
  phone text,
  occupation text,
  relationship text check (relationship in ('father', 'mother', 'guardian', 'other')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Parent-student relationships
create table if not exists public.parent_student_relationships (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.parents(id) not null,
  student_id uuid references public.students(id) not null,
  relationship text check (relationship in ('father', 'mother', 'guardian', 'other')),
  is_emergency_contact boolean default false,
  is_authorized_pickup boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  -- Each parent-student relationship should be unique
  unique(parent_id, student_id)
);

-- Create a function to automatically update the updated_at timestamp
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply the trigger to all relevant tables
create trigger update_profiles_updated_at
before update on public.profiles
for each row execute function public.update_updated_at();

create trigger update_classes_updated_at
before update on public.classes
for each row execute function public.update_updated_at();

create trigger update_students_updated_at
before update on public.students
for each row execute function public.update_updated_at();

create trigger update_student_enrollments_updated_at
before update on public.student_enrollments
for each row execute function public.update_updated_at();

create trigger update_teachers_updated_at
before update on public.teachers
for each row execute function public.update_updated_at();

create trigger update_parents_updated_at
before update on public.parents
for each row execute function public.update_updated_at();

create trigger update_parent_student_relationships_updated_at
before update on public.parent_student_relationships
for each row execute function public.update_updated_at();

-- Create a custom access token hook function for role-based access control
create or replace function public.handle_new_user()
returns trigger as $$
declare
  default_role text := 'student'; -- Default role for new users
begin
  insert into public.profiles (id, role, first_name, last_name, email)
  values (new.id, default_role, '', '', new.email);
  return new;
end;
$$ language plpgsql;

-- Trigger the function every time a user is created
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Create a hook for adding role to JWT tokens
create or replace function auth.jwt_custom_claims(jwt jsonb)
returns jsonb as $$
declare
  role_value text;
begin
  -- Get role from profiles table
  select role into role_value from public.profiles
  where id = (jwt ->> 'sub')::uuid;

  -- If role exists, add it to the JWT
  if role_value is not null then
    return jsonb_set(jwt, '{role}', to_jsonb(role_value));
  else
    return jwt;
  end if;
end;
$$ language plpgsql;

-- Row Level Security policies

-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.classes enable row level security;
alter table public.students enable row level security;
alter table public.student_enrollments enable row level security;
alter table public.teachers enable row level security;
alter table public.parents enable row level security;
alter table public.parent_student_relationships enable row level security;

-- Profiles policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Admin users can view all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Admin users can update all profiles"
  on public.profiles for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Students policies
create policy "Students can view their own record"
  on public.students for select
  using (profile_id = auth.uid());

create policy "Teachers can view all students"
  on public.students for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'teacher'
    )
  );

create policy "Admin users can view all students"
  on public.students for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Parents can view their children's records"
  on public.students for select
  using (
    exists (
      select 1 from public.parent_student_relationships psr
      join public.parents p on p.id = psr.parent_id
      where psr.student_id = public.students.id
      and p.profile_id = auth.uid()
    )
  );

-- Classes policies
create policy "All authenticated users can view classes"
  on public.classes for select
  to authenticated
  using (true);

create policy "Teachers can update classes they teach"
  on public.classes for update
  using (teacher_id = auth.uid());

create policy "Admin users can update all classes"
  on public.classes for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- Student enrollments policies
create policy "Students can view their own enrollments"
  on public.student_enrollments for select
  using (
    exists (
      select 1 from public.students
      where id = public.student_enrollments.student_id
      and profile_id = auth.uid()
    )
  );

create policy "Teachers can view enrollments for classes they teach"
  on public.student_enrollments for select
  using (
    exists (
      select 1 from public.classes
      where id = public.student_enrollments.class_id
      and teacher_id = auth.uid()
    )
  );

create policy "Admin users can view all enrollments"
  on public.student_enrollments for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Parents can view their children's enrollments"
  on public.student_enrollments for select
  using (
    exists (
      select 1 from public.parent_student_relationships psr
      join public.parents p on p.id = psr.parent_id
      where psr.student_id = public.student_enrollments.student_id
      and p.profile_id = auth.uid()
    )
  );
