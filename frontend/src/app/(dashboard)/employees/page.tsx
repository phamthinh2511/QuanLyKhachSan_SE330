"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { employeesApi } from "@/lib/api/employees";
import { Employee } from "@/types/employee";
import EmployeeStatCards from "@/components/employees/EmployeeStatCards";
import EmployeeTable from "@/components/employees/EmployeeTable";
import EmployeeModal from "@/components/employees/EmployeeModal";
import EmployeeViewModal from "@/components/employees/EmployeeViewModal";
import { getUser } from "@/lib/auth";
import CustomSelect from "@/components/ui/CustomSelect";

const PAGE_SIZE = 10;

export default function EmployeesPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const [filterPosition, setFilterPosition] = useState("Tất cả");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [viewing, setViewing] = useState<Employee | null>(null);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await employeesApi.getAll();
      if (res.result) setEmployees(res.result);
    } catch (err: any) {
      setError(err.message || "Lỗi tải danh sách nhân viên");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = getUser();
    if (user?.role === "NHAN_VIEN") {
      router.replace("/dashboard");
      return;
    }
    fetchEmployees();
  }, [router]);

  const filtered = employees.filter((e) => {
    const matchSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.phone.includes(search);
    const matchPos = filterPosition === "Tất cả" || e.position === filterPosition;
    return matchSearch && matchPos;
  });

  const visibleEmployees = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleSearch = (val: string) => { setSearch(val); setVisibleCount(PAGE_SIZE); };
  const handleFilter = (val: string) => { setFilterPosition(val); setVisibleCount(PAGE_SIZE); };

  const handleSave = async (data: Employee) => {
    try {
      if (editing) {
        await employeesApi.update(editing.id, data);
        showToast("Cập nhật thông tin nhân viên thành công!");
      } else {
        await employeesApi.create(data);
        showToast("Thêm mới nhân viên thành công!");
      }
      await fetchEmployees();
      setModalOpen(false);
      setEditing(null);
    } catch (err: any) {
      showToast(err.message || "Không thể lưu thông tin nhân viên", "error");
    }
  };

  const handleEdit = (emp: Employee) => { setEditing(emp); setModalOpen(true); };

  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc muốn xóa nhân viên này?")) {
      try {
        await employeesApi.delete(id);
        await fetchEmployees();
        showToast("Xóa nhân viên thành công!");
      } catch (err: any) {
        showToast(err.message || "Không thể xóa nhân viên", "error");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-600 bg-red-50 rounded-xl border border-red-100">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="p-6 rounded-lg bg-white shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">Quản lý nhân viên</h1>
          <p className="text-gray-500 text-sm">Welcome back, Admin</p>
        </div>
      </div>

      {/* Stat Cards */}
      <EmployeeStatCards employees={employees} />

      {/* Search + Filter */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          
          <input
            type="text"
            placeholder="Tìm theo tên, email, số điện thoại..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => { setEditing(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition"
        >
          <Plus className="w-4 h-4" />
          Thêm nhân viên
        </button>
        <CustomSelect
          value={filterPosition}
          onChange={(e) => handleFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>Tất cả</option>
          <option>Lễ Tân</option>
          <option>Quản Lý</option>
          <option>Vệ Sinh</option>
          <option>Bếp</option>
          <option>Bảo Dưỡng</option>
          <option>Bảo Vệ</option>
          <option>Khác</option>
        </CustomSelect>
      </div>

      {/* Table */}
      <EmployeeTable
        employees={visibleEmployees}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={(emp) => setViewing(emp)}
      />

      {hasMore && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-gray-400">
            Đang hiển thị {visibleEmployees.length} / {filtered.length} nhân viên
          </p>
          <button
            onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
            className="px-6 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 text-sm font-medium rounded-xl transition"
          >
            Xem thêm 10 nhân viên
          </button>
        </div>
      )}

      {modalOpen && (
        <EmployeeModal
          employee={editing}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditing(null); }}
        />
      )}

      {viewing && (
        <EmployeeViewModal
          employee={viewing}
          onClose={() => setViewing(null)}
        />
      )}
    </div>
  );
}