import { apiClient } from "./client";
import { Employee, EmployeeStatus, EmployeePosition } from "@/types/employee";

export interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

export interface EmployeeResponseDto {
  id: string; // e.g. "EMP-001"
  hoTen: string;
  ngaySinh: string;
  email: string;
  soDienThoai: string;
  chucVu: string;
  phongBan: string;
  ngayVaoLam: string;
  trangThai: string;
  tenDangNhap?: string;
  loaiTaiKhoan?: string;
}

export interface EmployeeRequestDto {
  hoTen: string;
  ngaySinh?: string;
  email: string;
  soDienThoai: string;
  chucVu: string;
  phongBan: string;
  ngayVaoLam?: string;
  trangThai: string;
  tenDangNhap?: string;
  matKhau?: string;
  loaiTaiKhoan?: string;
}

const mapToEmployee = (dto: EmployeeResponseDto): Employee => {
  const numericId = parseInt(dto.id.replace("EMP-", ""), 10);
  return {
    id: numericId,
    employeeCode: dto.id,
    name: dto.hoTen,
    birthday: dto.ngaySinh || "",
    email: dto.email || "",
    phone: dto.soDienThoai,
    position: (dto.chucVu as EmployeePosition) || "Khác",
    department: dto.phongBan || "Chung",
    joinDate: dto.ngayVaoLam || "",
    status: (dto.trangThai as EmployeeStatus) || "Đang làm việc",
    username: dto.tenDangNhap,
    role: dto.loaiTaiKhoan,
  };
};

const mapToRequestDto = (emp: Partial<Employee>): EmployeeRequestDto => {
  return {
    hoTen: emp.name || "",
    ngaySinh: emp.birthday || "2000-01-01", // Default if empty to prevent error
    email: emp.email || "",
    soDienThoai: emp.phone || "",
    chucVu: emp.position || "Khác",
    phongBan: emp.department || "Chung",
    ngayVaoLam: emp.joinDate || undefined,
    trangThai: emp.status || "Đang làm việc",
    tenDangNhap: emp.username,
    matKhau: emp.password,
    loaiTaiKhoan: emp.role,
  };
};

export const employeesApi = {
  getAll: async (): Promise<ApiResponse<Employee[]>> => {
    const res = await apiClient<ApiResponse<EmployeeResponseDto[]>>("/api/employees");
    return {
      ...res,
      result: (res.result || []).map(mapToEmployee),
    };
  },

  create: async (data: Partial<Employee>): Promise<ApiResponse<Employee>> => {
    const res = await apiClient<ApiResponse<EmployeeResponseDto>>("/api/employees", {
      method: "POST",
      body: JSON.stringify(mapToRequestDto(data)),
    });
    return {
      ...res,
      result: mapToEmployee(res.result),
    };
  },

  update: async (id: number, data: Partial<Employee>): Promise<ApiResponse<Employee>> => {
    const res = await apiClient<ApiResponse<EmployeeResponseDto>>(`/api/employees/${id}`, {
      method: "PUT",
      body: JSON.stringify(mapToRequestDto(data)),
    });
    return {
      ...res,
      result: mapToEmployee(res.result),
    };
  },

  delete: async (id: number): Promise<ApiResponse<void>> => {
    return apiClient<ApiResponse<void>>(`/api/employees/${id}`, {
      method: "DELETE",
    });
  },

  getTrashBin: async (): Promise<ApiResponse<Employee[]>> => {
    const res = await apiClient<ApiResponse<EmployeeResponseDto[]>>("/api/employees/trash");
    return {
      ...res,
      result: (res.result || []).map(mapToEmployee),
    };
  },

  restore: async (id: number): Promise<ApiResponse<Employee>> => {
    const res = await apiClient<ApiResponse<EmployeeResponseDto>>(`/api/employees/${id}/restore`, {
      method: "PUT",
    });
    return {
      ...res,
      result: mapToEmployee(res.result),
    };
  },

  hardDelete: async (id: number): Promise<ApiResponse<void>> => {
    return apiClient<ApiResponse<void>>(`/api/employees/${id}/hard`, {
      method: "DELETE",
    });
  },
};
