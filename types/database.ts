export type Role = "admin" | "student" | "lecturer";

export type Profile = {
  id: string;
  full_name: string;
  email: string;
  role: Role;
  created_at: string;
};

export type AttendanceRecord = {
  id: string;
  user_id: string;
  date: string;
  recorded_at: string;
  recorded_by: string | null;
};

export type AttendanceWithProfile = AttendanceRecord & {
  profile: Pick<Profile, "id" | "full_name" | "role"> | null;
};
