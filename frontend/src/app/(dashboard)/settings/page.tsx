"use client";

import { useState, useEffect } from "react";
import { 
  Trash2, RotateCcw, Settings, AlertTriangle, Users, 
  UserCog, BedDouble, Wrench, Layers, ShieldCheck, 
  Search, RefreshCw, X 
} from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { getCustomersTrash, restoreCustomer, hardDeleteCustomer } from "@/lib/api/customers";
import { employeesApi } from "@/lib/api/employees";
import { getRoomsTrash, restoreRoom, hardDeleteRoom } from "@/lib/api/rooms";
import { getServicesTrash, restoreService, hardDeleteService } from "@/lib/api/services";
import { getRoomTypesTrash, restoreRoomType, hardDeleteRoomType } from "@/lib/api/room-types";
import { getAccountsTrash, restoreAccount, hardDeleteAccount } from "@/lib/api/accounts";
import { getUser } from "@/lib/auth";

import { Customer } from "@/types/customer";
import { Employee } from "@/types/employee";
import { Room } from "@/types/room";
import { Service } from "@/types/service";
import { RoomTypeModel } from "@/types/room-type";
import { Account } from "@/types/account";

type TrashCategory = "customers" | "employees" | "rooms" | "services" | "room-types" | "accounts";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "trash">("profile");
  const [activeCategory, setActiveCategory] = useState<TrashCategory>("customers");
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  // Force active tab to profile if role is NHAN_VIEN and they somehow land on trash
  useEffect(() => {
    if (user?.role === "NHAN_VIEN" && activeTab === "trash") {
      setActiveTab("profile");
    }
  }, [user, activeTab]);
  
  // Data lists
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomTypeModel[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<{ id: any; category: TrashCategory; name: string } | null>(null);

  // Hard delete customer 2-step verification states
  const [deleteStep, setDeleteStep] = useState<"confirm" | "verify">("confirm");
  const [deleteInputText, setDeleteInputText] = useState("");
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!confirmDelete) {
      setDeleteStep("confirm");
      setDeleteInputText("");
      setDeleteError(null);
    }
  }, [confirmDelete]);

  const { showToast } = useToast();

  const fetchTrashData = async (cat: TrashCategory) => {
    setLoading(true);
    try {
      if (cat === "customers") {
        const data = await getCustomersTrash();
        setCustomers(data);
      } else if (cat === "employees") {
        const res = await employeesApi.getTrashBin();
        setEmployees(res.result || []);
      } else if (cat === "rooms") {
        const data = await getRoomsTrash();
        setRooms(data);
      } else if (cat === "services") {
        const data = await getServicesTrash();
        setServices(data);
      } else if (cat === "room-types") {
        const data = await getRoomTypesTrash();
        setRoomTypes(data);
      } else if (cat === "accounts") {
        const data = await getAccountsTrash();
        setAccounts(data);
      }
    } catch (err: any) {
      console.error(err);
      showToast(err.message || "Không thể tải danh sách thùng rác", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "trash") {
      fetchTrashData(activeCategory);
      setSearch("");
    }
  }, [activeTab, activeCategory]);

  const handleRestore = async (id: any, category: TrashCategory, name: string) => {
    try {
      if (category === "customers") {
        await restoreCustomer(id);
      } else if (category === "employees") {
        await employeesApi.restore(id);
      } else if (category === "rooms") {
        await restoreRoom(id);
      } else if (category === "services") {
        await restoreService(id);
      } else if (category === "room-types") {
        await restoreRoomType(id);
      } else if (category === "accounts") {
        await restoreAccount(id);
      }
      showToast(`Khôi phục thành công đối tượng: ${name}`);
      fetchTrashData(category);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || `Khôi phục thất bại đối tượng ${name}`, "error");
    }
  };

  const handleHardDelete = async () => {
    if (!confirmDelete) return;
    const { id, category, name } = confirmDelete;

    // Additional validation for customers
    if (category === "customers") {
      if (deleteStep !== "verify") {
        setDeleteStep("verify");
        return;
      }
      if (deleteInputText.trim() !== name) {
        setDeleteError("Tên khách hàng không khớp. Vui lòng nhập lại.");
        return;
      }
    }

    setDeleting(true);
    try {
      if (category === "customers") {
        await hardDeleteCustomer(id);
      } else if (category === "employees") {
        await employeesApi.hardDelete(id);
      } else if (category === "rooms") {
        await hardDeleteRoom(id);
      } else if (category === "services") {
        await hardDeleteService(id);
      } else if (category === "room-types") {
        await hardDeleteRoomType(id);
      } else if (category === "accounts") {
        await hardDeleteAccount(id);
      }
      showToast(`Đã xóa vĩnh viễn đối tượng: ${name}`);
      setConfirmDelete(null);
      fetchTrashData(category);
    } catch (err: any) {
      console.error(err);
      showToast(err.message || `Xóa vĩnh viễn thất bại: ${name}`, "error");
    } finally {
      setDeleting(false);
    }
  };

  const getFilteredData = () => {
    const query = search.toLowerCase().trim();
    if (activeCategory === "customers") {
      return customers.filter(c => c.name.toLowerCase().includes(query) || c.phone.includes(query) || c.email.toLowerCase().includes(query));
    }
    if (activeCategory === "employees") {
      return employees.filter(e => e.name.toLowerCase().includes(query) || e.phone.includes(query) || e.email.toLowerCase().includes(query));
    }
    if (activeCategory === "rooms") {
      return rooms.filter(r => String(r.id).includes(query) || r.type.toLowerCase().includes(query));
    }
    if (activeCategory === "services") {
      return services.filter(s => s.name.toLowerCase().includes(query) || (s.description && s.description.toLowerCase().includes(query)));
    }
    if (activeCategory === "room-types") {
      return roomTypes.filter(rt => rt.tenLoaiPhong.toLowerCase().includes(query) || (rt.moTa && rt.moTa.toLowerCase().includes(query)));
    }
    if (activeCategory === "accounts") {
      return accounts.filter(a => a.username.toLowerCase().includes(query) || a.role.toLowerCase().includes(query));
    }
    return [];
  };

  const filteredData = getFilteredData();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="p-6 rounded-lg bg-white shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Cài đặt</h1>
          <p className="text-gray-500 text-sm mt-0.5">Quản lý hồ sơ và tùy chọn cấu hình hệ thống</p>
        </div>
      </div>

      <div className="flex gap-6 items-start">
        {/* Settings Sub-Sidebar */}
        <div className="w-64 bg-white border border-gray-100 rounded-2xl p-4 space-y-1 shadow-sm flex-shrink-0">
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
              activeTab === "profile" 
                ? "bg-blue-50 text-blue-600" 
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Hồ sơ & Tài khoản
          </button>
          {user?.role !== "NHAN_VIEN" && (
            <button
              onClick={() => setActiveTab("trash")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                activeTab === "trash" 
                  ? "bg-blue-50 text-blue-600" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              }`}
            >
              <Trash2 className="w-4 h-4" />
              Thùng rác hệ thống
            </button>
          )}
        </div>

        {/* Settings Main Content Area */}
        <div className="flex-1 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          {activeTab === "profile" ? (
            <div className="p-6 space-y-6">
              <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3">
                Hồ sơ {user?.role === "ADMIN" ? "Quản trị viên" : "Nhân viên"}
              </h2>
              <div className="grid grid-cols-2 gap-6 max-w-2xl">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Tên đăng nhập</label>
                  <input type="text" readOnly value={user?.name || "..."} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Vai trò hệ thống</label>
                  <input type="text" readOnly value={user?.role || "..."} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Họ tên nhân viên</label>
                  <input type="text" readOnly value={user?.role === "ADMIN" ? "Quản Trị Viên" : "Nhân Viên Khách Sạn"} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed font-medium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Bộ phận</label>
                  <input type="text" readOnly value={user?.role === "ADMIN" ? "Ban Quản Trị" : "Bộ Phận Lễ Tân/Nghiệp Vụ"} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed font-medium" />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col">
              {/* Category tabs header */}
              <div className="border-b border-gray-100 bg-slate-50/50 p-4">
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      { id: "customers", label: "Khách hàng", icon: Users },
                      { id: "employees", label: "Nhân viên", icon: UserCog },
                      { id: "rooms", label: "Phòng", icon: BedDouble },
                      { id: "services", label: "Dịch vụ", icon: Wrench },
                      { id: "room-types", label: "Loại phòng", icon: Layers },
                      { id: "accounts", label: "Tài khoản", icon: ShieldCheck },
                    ] as { id: TrashCategory; label: string; icon: any }[]
                  ).map((cat) => {
                    const CatIcon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                          activeCategory === cat.id
                            ? "bg-blue-600 text-white shadow-sm"
                            : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                        }`}
                      >
                        <CatIcon className="w-3.5 h-3.5" />
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Toolbar */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Tìm kiếm trong thùng rác..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  onClick={() => fetchTrashData(activeCategory)}
                  className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-500 hover:text-gray-800 transition"
                  title="Tải lại danh sách"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                </button>
              </div>

              {/* Table list */}
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="p-12 text-center text-gray-500 flex flex-col items-center justify-center gap-3">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xs font-medium">Đang tải danh sách đã xóa...</p>
                  </div>
                ) : filteredData.length === 0 ? (
                  <div className="p-12 text-center text-gray-400">
                    <Trash2 className="w-10 h-10 mx-auto text-gray-200 mb-3" />
                    <p className="text-sm font-medium">Thùng rác trống</p>
                    <p className="text-xs text-gray-400 mt-1">Không có bản ghi nào bị xóa mềm ở danh mục này</p>
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wide">
                        {activeCategory === "customers" && (
                          <>
                            <th className="px-6 py-3 text-left font-semibold">Mã KH</th>
                            <th className="px-6 py-3 text-left font-semibold">Họ tên</th>
                            <th className="px-6 py-3 text-left font-semibold">Số điện thoại</th>
                            <th className="px-6 py-3 text-left font-semibold">Email</th>
                            <th className="px-6 py-3 text-left font-semibold">Trạng thái</th>
                          </>
                        )}
                        {activeCategory === "employees" && (
                          <>
                            <th className="px-6 py-3 text-left font-semibold">Mã NV</th>
                            <th className="px-6 py-3 text-left font-semibold">Họ tên</th>
                            <th className="px-6 py-3 text-left font-semibold">Số điện thoại</th>
                            <th className="px-6 py-3 text-left font-semibold">Email</th>
                            <th className="px-6 py-3 text-left font-semibold">Chức vụ</th>
                          </>
                        )}
                        {activeCategory === "rooms" && (
                          <>
                            <th className="px-6 py-3 text-left font-semibold">Mã phòng</th>
                            <th className="px-6 py-3 text-left font-semibold">Tầng</th>
                            <th className="px-6 py-3 text-left font-semibold">Sức chứa</th>
                            <th className="px-6 py-3 text-left font-semibold">Loại phòng</th>
                            <th className="px-6 py-3 text-left font-semibold">Giá phòng</th>
                          </>
                        )}
                        {activeCategory === "services" && (
                          <>
                            <th className="px-6 py-3 text-left font-semibold">Mã DV</th>
                            <th className="px-6 py-3 text-left font-semibold">Tên dịch vụ</th>
                            <th className="px-6 py-3 text-left font-semibold">Đơn giá</th>
                            <th className="px-6 py-3 text-left font-semibold">Mô tả</th>
                          </>
                        )}
                        {activeCategory === "room-types" && (
                          <>
                            <th className="px-6 py-3 text-left font-semibold">ID</th>
                            <th className="px-6 py-3 text-left font-semibold">Tên loại phòng</th>
                            <th className="px-6 py-3 text-left font-semibold">Đơn giá</th>
                            <th className="px-6 py-3 text-left font-semibold">Sức chứa tối đa</th>
                          </>
                        )}
                        {activeCategory === "accounts" && (
                          <>
                            <th className="px-6 py-3 text-left font-semibold">ID</th>
                            <th className="px-6 py-3 text-left font-semibold">Tên đăng nhập</th>
                            <th className="px-6 py-3 text-left font-semibold">Quyền hạn</th>
                            <th className="px-6 py-3 text-left font-semibold">Ngày tạo</th>
                          </>
                        )}
                        <th className="px-6 py-3 text-right font-semibold">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {activeCategory === "customers" && (filteredData as Customer[]).map((c) => (
                        <tr key={c.id} className="hover:bg-gray-50/50 transition">
                          <td className="px-6 py-4 font-semibold text-gray-700">{c.id}</td>
                          <td className="px-6 py-4 font-medium text-gray-800">{c.name}</td>
                          <td className="px-6 py-4 text-gray-500">{c.phone}</td>
                          <td className="px-6 py-4 text-gray-500">{c.email}</td>
                          <td className="px-6 py-4 text-gray-500">{c.status}</td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button onClick={() => handleRestore(c.id, "customers", c.name)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Khôi phục"><RotateCcw className="w-4 h-4" /></button>
                              <button onClick={() => setConfirmDelete({ id: c.id, category: "customers", name: c.name })} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition" title="Xóa vĩnh viễn"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {activeCategory === "employees" && (filteredData as Employee[]).map((e) => (
                        <tr key={e.id} className="hover:bg-gray-50/50 transition">
                          <td className="px-6 py-4 font-semibold text-gray-700">{e.employeeCode || e.id}</td>
                          <td className="px-6 py-4 font-medium text-gray-800">{e.name}</td>
                          <td className="px-6 py-4 text-gray-500">{e.phone}</td>
                          <td className="px-6 py-4 text-gray-500">{e.email}</td>
                          <td className="px-6 py-4 text-gray-500">{e.position}</td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button onClick={() => handleRestore(e.id, "employees", e.name)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Khôi phục"><RotateCcw className="w-4 h-4" /></button>
                              <button onClick={() => setConfirmDelete({ id: e.id, category: "employees", name: e.name })} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition" title="Xóa vĩnh viễn"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {activeCategory === "rooms" && (filteredData as Room[]).map((r) => (
                        <tr key={r.id} className="hover:bg-gray-50/50 transition">
                          <td className="px-6 py-4 font-semibold text-gray-700">Phòng {r.id}</td>
                          <td className="px-6 py-4 text-gray-500">{r.floor}</td>
                          <td className="px-6 py-4 text-gray-500">{r.capacity} khách</td>
                          <td className="px-6 py-4 text-gray-500">{r.type}</td>
                          <td className="px-6 py-4 text-gray-500">{r.pricePerNight.toLocaleString("vi-VN")} VND</td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button onClick={() => handleRestore(r.id, "rooms", `Phòng ${r.id}`)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Khôi phục"><RotateCcw className="w-4 h-4" /></button>
                              <button onClick={() => setConfirmDelete({ id: r.id, category: "rooms", name: `Phòng ${r.id}` })} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition" title="Xóa vĩnh viễn"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {activeCategory === "services" && (filteredData as Service[]).map((s) => (
                        <tr key={s.id} className="hover:bg-gray-50/50 transition">
                          <td className="px-6 py-4 font-semibold text-gray-700">{s.serviceCode}</td>
                          <td className="px-6 py-4 font-medium text-gray-800">{s.name}</td>
                          <td className="px-6 py-4 text-gray-500">{s.price.toLocaleString("vi-VN")} VND</td>
                          <td className="px-6 py-4 text-gray-500 truncate max-w-[200px]">{s.description}</td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button onClick={() => handleRestore(s.id, "services", s.name)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Khôi phục"><RotateCcw className="w-4 h-4" /></button>
                              <button onClick={() => setConfirmDelete({ id: s.id, category: "services", name: s.name })} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition" title="Xóa vĩnh viễn"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {activeCategory === "room-types" && (filteredData as RoomTypeModel[]).map((rt) => (
                        <tr key={rt.id} className="hover:bg-gray-50/50 transition">
                          <td className="px-6 py-4 font-semibold text-gray-700">{rt.id}</td>
                          <td className="px-6 py-4 font-medium text-gray-800">{rt.tenLoaiPhong}</td>
                          <td className="px-6 py-4 text-gray-500">{rt.donGia.toLocaleString("vi-VN")} VND</td>
                          <td className="px-6 py-4 text-gray-500">{rt.sucChuaToiDa} khách</td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button onClick={() => handleRestore(rt.id!, "room-types", rt.tenLoaiPhong)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Khôi phục"><RotateCcw className="w-4 h-4" /></button>
                              <button onClick={() => setConfirmDelete({ id: rt.id!, category: "room-types", name: rt.tenLoaiPhong })} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition" title="Xóa vĩnh viễn"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {activeCategory === "accounts" && (filteredData as Account[]).map((a) => (
                        <tr key={a.id} className="hover:bg-gray-50/50 transition">
                          <td className="px-6 py-4 font-semibold text-gray-700">{a.id}</td>
                          <td className="px-6 py-4 font-medium text-gray-800">{a.username}</td>
                          <td className="px-6 py-4 text-gray-500">{a.role}</td>
                          <td className="px-6 py-4 text-gray-500">{new Date(a.createdAt).toLocaleDateString("vi-VN")}</td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button onClick={() => handleRestore(a.id, "accounts", a.username)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Khôi phục"><RotateCcw className="w-4 h-4" /></button>
                              <button onClick={() => setConfirmDelete({ id: a.id, category: "accounts", name: a.username })} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition" title="Xóa vĩnh viễn"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all scale-100">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-800 text-base">
                    {confirmDelete.category === "customers" && deleteStep === "verify" 
                      ? "Xác thực danh tính" 
                      : "Xác nhận xóa vĩnh viễn"}
                  </h2>
                  {confirmDelete.category === "customers" && (
                    <p className="text-gray-400 text-xs mt-0.5">Mã KH: {confirmDelete.id}</p>
                  )}
                </div>
              </div>
              <button 
                onClick={() => setConfirmDelete(null)} 
                className="p-1.5 hover:bg-gray-100 rounded-lg transition" 
                disabled={deleting}
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Content for Customer 2-Step: Step 1 (Confirm) */}
            {confirmDelete.category === "customers" && deleteStep === "confirm" && (
              <div className="p-6 space-y-4">
                <p className="text-sm text-gray-600 leading-relaxed">
                  Hành động này đối với khách hàng <strong className="text-gray-800 font-semibold">{confirmDelete.name}</strong> không thể hoàn tác. 
                  Khách hàng này và toàn bộ dữ liệu lịch sử liên quan sẽ bị xóa vĩnh viễn khỏi hệ thống.
                </p>
                <p className="text-xs text-red-500 bg-red-50 p-3 rounded-lg border border-red-100">
                  Cảnh báo: Hành động này có tính chất nghiêm trọng và không thể khôi phục lại dữ liệu sau khi thực hiện.
                </p>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(null)}
                    className="px-4 py-2 border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-medium transition shadow-sm"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteStep("verify")}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition shadow-sm"
                  >
                    Tiếp tục
                  </button>
                </div>
              </div>
            )}

            {/* Content for Customer 2-Step: Step 2 (Verify) */}
            {confirmDelete.category === "customers" && deleteStep === "verify" && (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleHardDelete();
                }} 
                className="p-6 space-y-4"
              >
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Để xác nhận xóa vĩnh viễn, vui lòng nhập chính xác tên khách hàng dưới đây để tiếp tục:
                  </p>
                  <div className="p-2.5 bg-gray-50 rounded-lg text-center border border-gray-200 select-none">
                    <span className="font-mono text-sm font-bold text-gray-800 tracking-wide">{confirmDelete.name}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="customer-name-hard-confirm" className="block text-xs font-semibold text-gray-500">
                    Nhập lại tên khách hàng
                  </label>
                  <input
                    id="customer-name-hard-confirm"
                    type="text"
                    autoFocus
                    placeholder="Nhập đúng tên khách hàng..."
                    value={deleteInputText}
                    onChange={(e) => {
                      setDeleteInputText(e.target.value);
                      if (deleteError) setDeleteError(null);
                    }}
                    disabled={deleting}
                    className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
                  />
                  {deleteError && <p className="text-xs text-red-500 mt-1">{deleteError}</p>}
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setDeleteStep("confirm")}
                    disabled={deleting}
                    className="px-4 py-2 border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-medium transition shadow-sm"
                  >
                    Quay lại
                  </button>
                  <button
                    type="submit"
                    disabled={deleteInputText.trim() !== confirmDelete.name || deleting}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition shadow-sm flex items-center gap-2"
                  >
                    {deleting && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                    Xóa vĩnh viễn
                  </button>
                </div>
              </form>
            )}

            {/* Content for Standard 1-Step Hard Delete (Other categories) */}
            {confirmDelete.category !== "customers" && (
              <div className="p-6 space-y-4">
                <p className="text-sm text-gray-600 leading-relaxed font-normal">
                  Hành động này đối với <strong>{confirmDelete.name}</strong> không thể hoàn tác. Bạn có chắc chắn muốn xóa vĩnh viễn đối tượng này khỏi hệ thống?
                </p>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(null)}
                    disabled={deleting}
                    className="px-4 py-2 border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-medium transition shadow-sm"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={handleHardDelete}
                    disabled={deleting}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition shadow-sm flex items-center gap-2"
                  >
                    {deleting && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                    Xóa vĩnh viễn
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}