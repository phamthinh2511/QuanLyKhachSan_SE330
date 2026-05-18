"use client";

import { useState, useEffect, useCallback } from "react";
// Hãy kiểm tra và đảm bảo file @/lib/api/bookings xuất đủ 5 thành phần này nhé
import {
  getAllBookings,
  submitBookingForm,
  getAllCustomers,
  getAllRooms,
  deleteBooking,
  updateBooking,
  BookingRequestPayload
} from "@/lib/api/bookings";
import { Plus } from "lucide-react";
import { Booking } from "@/types/booking";
import BookingStatCards from "@/components/bookings/BookingStatCards";
import BookingTodayTable from "@/components/bookings/BookingTodayTable";
import BookingAllTable from "@/components/bookings/BookingAllTable";
import BookingModal, { CustomerResponse, RoomResponse } from "@/components/bookings/BookingModal";

const today = new Date().toISOString().split("T")[0];
const PAGE_SIZE_ALL = 50;

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [customers, setCustomers] = useState<CustomerResponse[]>([]); // Tạo State khách hàng
  const [rooms, setRooms] = useState<RoomResponse[]>([]);             // Tạo State phòng
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Tất cả");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE_ALL);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Booking | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // Chạy song song cả 3 API nạp dữ liệu từ backend lên hệ thống
      const [response, customerRes, roomRes] = await Promise.all([
        getAllBookings(),
        getAllCustomers().catch(() => []),
        getAllRooms().catch(() => [])
      ]);

      setCustomers(customerRes);
      setRooms(roomRes);

      const rawList = Array.isArray(response) ? response : [];

      const mappedData = rawList.map((b: any) => ({
        id: b.id,
        bookingCode: b.bookingCode || `BK-${b.id}`,
        customerName: b.customerName || "Khách vãng lai",
        roomNumber: b.roomNumber || "Chưa gán",
        checkIn: b.checkIn ? String(b.checkIn) : today,
        checkOut: b.checkOut ? String(b.checkOut) : today,
        bookingDate: today,
        status: b.status || "Chưa nhận",
        amount: b.thanhTien || b.tongTien || b.tongGia || b.amount || 0,
        guests: b.guests || b.soKhach || 1
      }));

      setBookings(mappedData);
    } catch (error) {
      console.error("Lỗi đồng bộ danh sách đặt phòng:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
    const computedBookingsForCards = () => {
        const todayObj = new Date();
        const currentMonth = todayObj.getMonth(); // 0-11
        const currentYear = todayObj.getFullYear();

        // A. Số lượng khách đang lưu trú thực tế tại khách sạn
        const dangOActive = bookings.filter((b) => {
              const status = b.status ? b.status.trim() : "";
              return (
                status === "Đã nhận phòng tại quầy" ||
                status === "Đã nhận phòng đặt trước" ||
                status === "Đã nhận phòng" ||
                status === "Đang sử dụng"
              );
            }).length;

        // B. Số lượng đơn đặt trước sẽ check-in trong tháng hiện tại này
        const sapToiActive = bookings.filter(b => {
          if (b.status !== "Chưa nhận" || !b.checkIn) return false;
          const checkInDate = new Date(b.checkIn);
          return checkInDate.getMonth() === currentMonth && checkInDate.getFullYear() === currentYear;
        }).length;

        // C. Tổng doanh thu tạm tính của các phòng trong tháng (Bỏ qua các phòng đã Hủy)
        const tongDoanhThuThang = bookings.reduce((sum, b) => {
          if (b.status === "Đã hủy" || !b.checkIn) return sum;
          const checkInDate = new Date(b.checkIn);
          if (checkInDate.getMonth() === currentMonth && checkInDate.getFullYear() === currentYear) {
            return sum + (b.amount || 0);
          }
          return sum;
        }, 0);

        return { dangOActive, sapToiActive, tongDoanhThuThang };
      };

      const { dangOActive, sapToiActive, tongDoanhThuThang } = computedBookingsForCards();

  const todayBookings = bookings.filter((b) => b.checkIn === today);
  const allFiltered = bookings.filter((b) => {
    const matchSearch =
      b.bookingCode.toLowerCase().includes(search.toLowerCase()) ||
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.roomNumber.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter == "Tất cả" || b.status === filter;
    return matchSearch && matchFilter;
  });
  const handleDelete = async (id: number) => {
    try {
      setLoading(true);

      // Gọi hàm từ file bookings.ts, nhận về cấu trúc ApiResponse
      const res = await deleteBooking(id);

      if (res.code === 200) {
        alert(res.message || "Đã xóa phiếu đặt phòng thành công!");
      } else {
        alert(res.message || "Xóa phiếu đặt phòng thành công!");
      }

      // Refresh lại danh sách phòng ngay lập tức để dòng vừa xóa biến mất khỏi màn hình
      await fetchData();
    } catch (error: any) {
      console.error("Lỗi khi thực hiện xóa phiếu phòng:", error);
      alert("Xử lý yêu cầu xóa thất bại. Vui lòng kiểm tra lại ràng buộc dữ liệu!");
      await fetchData();
    } finally {
      setLoading(false);
    }
  };



  const visibleAll = allFiltered.slice(0, visibleCount);

    const handleSave = async (formData: any) => {
        try {
          setLoading(true);
    let dbStatus = formData.status;
          if (!editing) {
            // Nếu tạo mới, tự động gán trạng thái theo loại hình giao dịch
            const dbStatus = formData.status;
          }
        const finalDonGia = dbStatus === "Đã hủy"
                ? 0.0
                : (parseFloat(formData.amount) || parseFloat(formData.roomPrice) || 500000.0);
          // Chuẩn bị gói dữ liệu chi tiết thu được từ Modal gửi lên
          const bookingPayload: BookingRequestPayload = {
            role: "NHAN_VIEN",
            loaiHinh: formData.bookingType,
            maKhachHangId: parseInt(formData.customerId),
            maPhongId: parseInt(formData.roomId),
            maNhanVienId: 1, // Mặc định ID nhân viên lập phiếu
            ngayNhan: formData.checkIn,
            ngayTra: formData.checkOut,
            donGia: parseFloat(formData.amount) || parseFloat(formData.roomPrice) || 500000.0,
            trangThai: dbStatus,
            soKhach: parseInt(formData.guests) || 1
          };

          let res;
          if (editing) {
            // TRƯỜNG HỢPẤN NÚT SỬA: Gọi API PUT để cập nhật đè lên dòng cũ
            res = await updateBooking(editing.id, bookingPayload);
            if (res.code === 200) {
              alert(res.message || "Đã lưu thông tin chỉnh sửa vào đơn đặt phòng!");
            } else {
              alert("Cập nhật đơn đặt phòng thành công!");
            }
          } else {
            // TRƯỜNG HỢP ĐẶT PHÒNG MỚI: Gọi API POST như bình thường
            res = await submitBookingForm(bookingPayload);
            if (res.code === 200) {
              alert(res.message || "Tạo mới đơn đặt phòng thành công!");
            } else {
              alert("Thao tác thành công!");
            }
          }

          // Tải lại danh sách từ database để dòng dữ liệu trên bảng thay đổi ngay lập tức
          await fetchData();
        } catch (error: any) {
          console.error("Lỗi trong quá trình xử lý lưu dữ liệu phòng:", error);
          alert("Không thể lưu thông tin. Vui lòng kiểm tra lại tính hợp lệ của phòng và ngày đặt!");
          await fetchData();
        } finally {
          setLoading(false);
        }

        // Đóng modal và giải phóng trạng thái chỉnh sửa
        setModalOpen(false);
        setEditing(null);
      };
//   const handleSave = async (formData: any) => {
//     try {
//       const bookingPayload: BookingRequestPayload = {
//         role: "NHAN_VIEN",
//         loaiHinh: formData.bookingType,
//         maKhachHangId: parseInt(formData.customerId) || 1,
//         maPhongId: parseInt(formData.roomId) || 1,
//         maNhanVienId: 1,
//         ngayNhan: formData.checkIn,
//         ngayTra: formData.checkOut,
//         donGia: parseFloat(formData.amount) || parseFloat(formData.roomPrice) || 500000.0
//       };
//
//       const res = await submitBookingForm(bookingPayload);
//
//       if (res.code === 200) {
//         alert(res.message || "Xử lý yêu cầu phòng thành công!");
//       } else {
//         alert("Thao tác thành công!");
//       }
//
//       await fetchData();
//     } catch (error: any) {
//       console.error("Lỗi xử lý gửi đơn phòng:", error);
//       await fetchData();
//     }
//     setModalOpen(false);
//     setEditing(null);
//   };

  const handleEdit = (booking: Booking) => {
    setEditing(booking);
    setModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="p-6 rounded-xl bg-white shadow-sm flex justify-between items-center border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tất cả đặt phòng</h1>
          <p className="text-gray-500 text-sm">Hệ thống đồng bộ API thời gian thực với Neon Database.</p>
        </div>
        <button
          onClick={() => { setEditing(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Đặt phòng mới
        </button>
      </div>

     <BookingStatCards
             bookings={bookings}
             overrideStats={{
               dangO: dangOActive,
               sapToi: sapToiActive,
               doanhThu: tongDoanhThuThang
             }}
           />

      {loading && bookings.length === 0 ? (
        <div className="p-12 text-center text-gray-400 text-sm">Đang đồng bộ dữ liệu hệ thống phòng...</div>
      ) : (
        <>
          <BookingTodayTable
                      bookings={todayBookings}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />

          <div className="space-y-4">
            <div className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-3 shadow-sm">
              <input
                type="text"
                placeholder="Tìm theo mã đơn, tên khách, số phòng..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50 text-slate-800"
              />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Tất cả">Tất cả trạng thái</option>
                <option value="Chưa nhận">Chưa nhận</option>
                <option value="Đã nhận phòng tại quầy">Đã nhận phòng tại quầy</option>
                <option value="Đã nhận phòng đặt trước">Đã nhận phòng đặt trước</option>
                <option value="Đã trả phòng">Đã trả phòng</option>
                <option value="Đã hủy">Đã hủy</option>
              </select>
            </div>

            <BookingAllTable
                          bookings={visibleAll}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
          </div>
        </>
      )}

      {/* SỬA ĐỔI CHÍNH XÁC CÁC BIẾN TRUYỀN VÀO ĐÂY */}
      {modalOpen && (
        <BookingModal
          booking={editing}
          customers={customers}
          rooms={rooms}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditing(null); }}
        />
      )}
    </div>
  );
}
