import { AttendanceScanner } from "@/components/attendance-scanner";

export default function LecturerScanScreen() {
  return <AttendanceScanner allowedRoles={["student"]} />;
}
