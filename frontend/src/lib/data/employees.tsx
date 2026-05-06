import { Employee } from "@/types/employee";

export const mockEmployees: Employee[] = [
  { id: 1, employeeCode: "EMP-001", name: "Nguyễn Văn An", birthday: "2000-01-01", email: "an.nguyen@hotel.com",   phone: "+84 234-567-8911", position: "Lễ Tân", department: "Front Desk",   joinDate: "2024-01-15", status: "Đang làm việc"   },
  { id: 2, employeeCode: "EMP-002", name: "Trần Thị Bình", birthday: "2000-01-01", email: "binh.tran@hotel.com",   phone: "+84 234-567-8912", position: "Quản Lý",      department: "Management",  joinDate: "2023-06-10", status: "Đang làm việc"   },
  { id: 3, employeeCode: "EMP-003", name: "Lê Văn Cường", birthday: "2000-01-01", email: "cuong.le@hotel.com",    phone: "+84 234-567-8913", position: "Vệ Sinh", department: "Housekeeping",joinDate: "2024-03-20", status: "Đang làm việc"   },
  { id: 4, employeeCode: "EMP-004", name: "Phạm Thị Dung", birthday: "2000-01-01", email: "dung.pham@hotel.com",   phone: "+84 234-567-8914", position: "Bếp",         department: "Kitchen",     joinDate: "2023-11-05", status: "Đang làm việc"   },
  { id: 5, employeeCode: "EMP-005", name: "Hoàng Văn Em", birthday: "2000-01-01", email: "em.hoang@hotel.com",    phone: "+84 234-567-8915", position: "Lễ Tân", department: "Front Desk",  joinDate: "2024-02-14", status: "Đang nghỉ phép"   },
  { id: 6, employeeCode: "EMP-006", name: "Vũ Thị Phương", birthday: "2000-01-01", email: "phuong.vu@hotel.com",   phone: "+84 234-567-8916", position: "Bảo Dưỡng",  department: "Maintenance", joinDate: "2023-12-01", status: "Đã nghỉ việc"   }];