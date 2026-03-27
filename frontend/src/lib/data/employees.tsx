import { Employee } from "@/types/employee";

export const mockEmployees: Employee[] = [
  { id: 1, employeeCode: "EMP-001", name: "Nguyễn Văn An",   email: "an.nguyen@hotel.com",   phone: "+84 234-567-8911", position: "Receptionist", department: "Front Desk",   joinDate: "2024-01-15", status: "Active"   },
  { id: 2, employeeCode: "EMP-002", name: "Trần Thị Bình",   email: "binh.tran@hotel.com",   phone: "+84 234-567-8912", position: "Manager",      department: "Management",  joinDate: "2023-06-10", status: "Active"   },
  { id: 3, employeeCode: "EMP-003", name: "Lê Văn Cường",    email: "cuong.le@hotel.com",    phone: "+84 234-567-8913", position: "Housekeeping", department: "Housekeeping",joinDate: "2024-03-20", status: "Active"   },
  { id: 4, employeeCode: "EMP-004", name: "Phạm Thị Dung",   email: "dung.pham@hotel.com",   phone: "+84 234-567-8914", position: "Chef",         department: "Kitchen",     joinDate: "2023-11-05", status: "Active"   },
  { id: 5, employeeCode: "EMP-005", name: "Hoàng Văn Em",    email: "em.hoang@hotel.com",    phone: "+84 234-567-8915", position: "Receptionist", department: "Front Desk",  joinDate: "2024-02-14", status: "Active"   },
  { id: 6, employeeCode: "EMP-006", name: "Vũ Thị Phương",   email: "phuong.vu@hotel.com",   phone: "+84 234-567-8916", position: "Maintenance",  department: "Maintenance", joinDate: "2024-01-08", status: "Inactive" },
];