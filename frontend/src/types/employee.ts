export type EmployeeStatus   = "Active" | "Inactive";
export type EmployeePosition = "Receptionist" | "Manager" | "Housekeeping" | "Chef" | "Maintenance" | "Security" | "Other";

export interface Employee {
  id: number;
  employeeCode: string;
  name: string;
  email: string;
  phone: string;
  position: EmployeePosition;
  department: string;
  joinDate: string; // YYYY-MM-DD
  status: EmployeeStatus;
}