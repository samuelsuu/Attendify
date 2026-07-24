import { todayISODate } from "@/lib/date";
import { supabase } from "@/lib/supabase";
import type { AttendanceRecord, AttendanceWithProfile, Role } from "@/types/database";

export async function getHistory(userId: string): Promise<AttendanceRecord[]> {
  const { data, error } = await supabase
    .from("attendance")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getAllAttendance(): Promise<AttendanceWithProfile[]> {
  const { data, error } = await supabase
    .from("attendance")
    .select("*, profile:profiles!attendance_user_id_fkey(id, full_name, role, avatar_url)")
    .order("recorded_at", { ascending: false });
  if (error) throw error;
  return data as unknown as AttendanceWithProfile[];
}

export async function getRecordedByMe(recordedBy: string): Promise<AttendanceWithProfile[]> {
  const { data, error } = await supabase
    .from("attendance")
    .select("*, profile:profiles!attendance_user_id_fkey(id, full_name, role, avatar_url)")
    .eq("recorded_by", recordedBy)
    .order("recorded_at", { ascending: false });
  if (error) throw error;
  return data as unknown as AttendanceWithProfile[];
}

/** Admin and lecturer scans are separate attendance records, so "already
 * recorded today" is scoped to the specific role doing the recording. */
export async function hasRecordedToday(
  userId: string,
  recordedByRole: Extract<Role, "admin" | "lecturer">
): Promise<boolean> {
  const { data, error } = await supabase
    .from("attendance")
    .select("id")
    .eq("user_id", userId)
    .eq("date", todayISODate())
    .eq("recorded_by_role", recordedByRole)
    .maybeSingle();
  if (error) throw error;
  return !!data;
}

export type RecordAttendanceResult =
  | { status: "recorded"; record: AttendanceRecord }
  | { status: "already_recorded" };

export async function recordAttendance(
  userId: string,
  recordedBy: string,
  recordedByRole: Extract<Role, "admin" | "lecturer">
): Promise<RecordAttendanceResult> {
  const alreadyRecorded = await hasRecordedToday(userId, recordedByRole);
  if (alreadyRecorded) {
    return { status: "already_recorded" };
  }

  const { data, error } = await supabase
    .from("attendance")
    .insert({
      user_id: userId,
      date: todayISODate(),
      recorded_by: recordedBy,
      recorded_by_role: recordedByRole,
    })
    .select("*")
    .single();

  if (error) {
    // Unique constraint (user_id, date, recorded_by_role) — a race with another scan.
    if (error.code === "23505") {
      return { status: "already_recorded" };
    }
    throw error;
  }

  return { status: "recorded", record: data };
}

export async function getTodayCount(): Promise<number> {
  const { count, error } = await supabase
    .from("attendance")
    .select("id", { count: "exact", head: true })
    .eq("date", todayISODate());
  if (error) throw error;
  return count ?? 0;
}
