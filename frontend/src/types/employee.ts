export type EmployeeStatus   = "Đang làm việc" | "Đã nghỉ việc" | "Đang nghỉ phép";
export type EmployeePosition = "Lễ Tân" | "Quản Lý" | "Vệ Sinh" | "Bếp" | "Bảo Dưỡng" | "Bảo Vệ" | "Khác";

export interface Employee {
  id: number;
  employeeCode: string;
  name: string;
  birthday: string; // YYYY-MM-DD
  email: string;
  phone: string;
  position: EmployeePosition;
  department: string;
  joinDate: string; // YYYY-MM-DD
  status: EmployeeStatus;
  username?: string;
  password?: string;
  role?: string;
}