"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getAllBookings,
  submitBookingForm,
  getAllCustomers,
  getAllRooms,
  deleteBooking,
  updateBooking,
  checkInBooking,
  checkOutBooking,
  BookingRequestPayload,
  CustomerResponse,
  RoomResponse
} from "@/lib/api/bookings";
import { Plus } from "lucide-react";
import { Booking, BookingStatus } from "@/types/booking";
import BookingStatCards from "@/components/bookings/BookingStatCards";
import { useToast } from "@/context/ToastContext";
import BookingTodayTable from "@/components/bookings/BookingTodayTable";
import BookingAllTable from "@/components/bookings/BookingAllTable";
import BookingModal from "@/components/bookings/BookingModal";
import CustomSelect from "@/components/ui/CustomSelect";
import CheckoutModal from "@/components/invoices/CheckoutModal";
import PageSkeleton from "@/components/ui/PageSkeleton";
import PageError from "@/components/ui/PageError";

// Module-level caches
let bookingsCache: Booking[] | null = null;
let bookingsCustomersCache: CustomerResponse[] | null = null;
let bookingsRoomsCache: RoomResponse[] | null = null;

const today = new Date().toISOString().split("T")[0];
const PAGE_SIZE_ALL = 50;

export const mapBookingStatus = (status: string): BookingStatus => {
  if (!status) return "Đặt trước";
  const s = status.trim();
  if (s === "Chưa nhận" || s === "Đã đặt trước" || s === "Đã đặt" || s === "Đặt trước") {
      return "Đặt trước";
  }
  if (
    s === "Checked-in" ||
    s === "Đã nhận phòng" ||
    s === "Đã nhận phòng tại quầy" ||
    s === "Đã nhận phòng đặt trước" ||
    s === "Đang sử dụng"
  ) {
    return "Đang sử dụng";
  }
  if (s === "Checked-out" || s === "Đã trả phòng") {
    return "Đã trả phòng";
  }
  if (s === "Đã hủy" || s === "CANCELLED") {
    return "Đã hủy";
  }
  return s as BookingStatus;
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>(() => bookingsCache || []);
  const { showToast } = useToast();
  const [customers, setCustomers] = useState<CustomerResponse[]>(() => bookingsCustomersCache || []);
  const [rooms, setRooms] = useState<RoomResponse[]>(() => bookingsRoomsCache || []);
  const [loading, setLoading] = useState(() => !bookingsCache);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Tất cả");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE_ALL);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Booking | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("add") === "true") {
        setEditing(null);
        setModalOpen(true);
        const newUrl = window.location.pathname;
        window.history.replaceState({}, "", newUrl);
      }
    }
  }, []);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    booking: Booking;
  } | null>(null);
  const [checkoutBooking, setCheckoutBooking] = useState<Booking | null>(null);
  const [checkoutPaymentMethod, setCheckoutPaymentMethod] = useState<string>("Tiền mặt");

  const handleCheckIn = async (bookingId: number) => {
    try {
      setLoading(true);
      await checkInBooking(bookingId);
      showToast("Nhận phòng (Check-in) thành công! Đã tạo phiếu thuê phòng.");
      await fetchData();
    } catch (error: any) {
      showToast(error.message || "Nhận phòng thất bại!", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (booking: Booking) => {
    const isConfirmed = window.confirm(`Bạn có chắc chắn muốn hủy đơn đặt phòng ${booking.bookingCode} của khách ${booking.customerName} không?`);
    if (isConfirmed) {
      await handleDelete(booking.id);
    }
  };

  const handleRowContextMenu = (e: React.MouseEvent, booking: Booking) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      booking,
    });
  };

  useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  const fetchData = useCallback(async (force = false) => {
    try {
      if (!bookingsCache || force) {
        setLoading(true);
      }
      setError(null);

      const [response, customerRes, roomRes] = await Promise.all([
        getAllBookings(),
        getAllCustomers().catch(() => []),
        getAllRooms().catch(() => [])
      ]);

      let parsedCustomers = customerRes;
      let parsedRooms = [];
      if (Array.isArray(roomRes)) {
        parsedRooms = roomRes;
      } else if (roomRes && typeof roomRes === 'object' && Array.isArray((roomRes as any).result)) {
        parsedRooms = (roomRes as any).result;
      }

      let rawList: any[] = [];

      if (Array.isArray(response)) {
        rawList = response;
      } else if (response && typeof response === "object") {
        if (Array.isArray((response as any).result)) {
          rawList = (response as any).result;
        } else if ((response as any).data && Array.isArray((response as any).data.result)) {
          rawList = (response as any).data.result;
        }
      }

      const mappedData = rawList.map((b: any) => ({
        id: b.id,
        bookingCode: String(b.id),
        customerName: b.customerName || "Khách vãng lai",
        roomNumber: b.roomNumber || "Chưa gán",
        checkIn: b.checkIn ? String(b.checkIn) : today,
        checkOut: b.checkOut ? String(b.checkOut) : today,
        bookingDate: today,
        status: mapBookingStatus(b.status),
        amount: b.thanhTien || b.tongTien || b.tongGia || b.amount || 0,
        guests: b.guests || b.soKhach || 1
      }));

      bookingsCache = mappedData;
      bookingsCustomersCache = parsedCustomers;
      bookingsRoomsCache = parsedRooms;

      setCustomers(parsedCustomers);
      setRooms(parsedRooms);
      setBookings(mappedData);
    } catch (err: any) {
      console.error("Lỗi đồng bộ danh sách đặt phòng:", err);
      setError(err.message || "Lỗi đồng bộ danh sách đặt phòng");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const computedBookingsForCards = () => {
    const todayObj = new Date();
    const currentMonth = todayObj.getMonth();
    const currentYear = todayObj.getFullYear();

    const dangOActive = bookings.filter((b) => b.status === "Đang sử dụng").length;

    const sapToiActive = bookings.filter(b => {
      if (b.status !== "Đặt trước" || !b.checkIn) return false;
      const checkInDate = new Date(b.checkIn);
      return checkInDate.getMonth() === currentMonth && checkInDate.getFullYear() === currentYear;
    }).length;

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

const searchedBookings = bookings.filter((b) => {
    return (
      b.bookingCode.toLowerCase().includes(search.toLowerCase()) ||
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.roomNumber.toLowerCase().includes(search.toLowerCase())
    );
  });

  const filteredBookings = searchedBookings.filter((b) => {
    if (filter === "Tất cả") return true;
    return b.status === filter;
  });

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (filter === "Đặt trước") {
      return new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime();
    }

    if (filter === "Đã hủy") {
      return b.id - a.id;
    }

    return b.id - a.id;
  });
  const visibleAll = sortedBookings.slice(0, visibleCount);

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      const res = await deleteBooking(id);

      if (res.code === 200) {
        showToast(res.message || "Đã xóa phiếu đặt phòng thành công!");
      } else {
        showToast(res.message || "Xóa phiếu đặt phòng thành công!");
      }

      await fetchData();
    } catch (error: any) {
      console.error("Lỗi khi thực hiện xóa phiếu phòng:", error);
      const backendMessage =
             error.response?.data?.message ||
             error.errorMessage ||
             error.message ||
             "Xử lý yêu cầu xóa thất bại. Vui lòng kiểm tra lại ràng buộc dữ liệu!";
           showToast(backendMessage, "error");
    } finally {
      setLoading(false);
    }
  };


  const handleSave = async (formData: any) => {
    try {
      setLoading(true);

      let rawStatus = formData.status || "Đặt trước";
      let dbStatus = "Chưa nhận";

      if (rawStatus === "Đang sử dụng") {
        dbStatus = "Đang sử dụng";
      } else if (rawStatus === "Đã trả phòng") {
        dbStatus = "Đã trả phòng";
      } else if (rawStatus === "Đã hủy") {
        dbStatus = "Đã hủy";
      }

      const matchedRoom = rooms.find((r) => r.id === parseInt(formData.roomId));
      const donGiaPhong = dbStatus === "Đã hủy" ? 0.0 : (matchedRoom?.maLoaiPhong?.donGia || parseFloat(formData.roomPrice) || parseFloat(formData.amount) || 300000.0);

      const bookingPayload: BookingRequestPayload = {
        role: "NHAN_VIEN",
        loaiHinh: formData.bookingType || (dbStatus === "Đang sử dụng" ? "THUE_TRUC_TIEP" : "DAT_TRUOC"),
        maKhachHangId: parseInt(formData.customerId),
        maPhongId: parseInt(formData.roomId),
        maNhanVienId: 1,
        ngayNhan: formData.ngayNhan,
        ngayTra: formData.ngayTra,
        donGia: donGiaPhong,
        trangThai: dbStatus,
        soKhach: parseInt(formData.guests) || 1
      };

      let res;
      if (editing) {
        res = await updateBooking(editing.id, bookingPayload);
        showToast(res.message || "Cập nhật trạng thái đơn thành công!");
      } else {
        res = await submitBookingForm(bookingPayload);
        showToast(res.message || "Tạo mới yêu cầu phòng thành công!");
      }

      await fetchData();
      setModalOpen(false);
      setEditing(null);
    } catch (error: any) {
      console.error("Lỗi lưu dữ liệu:", error);
      const msg = error.message || "Lỗi kết nối Server API. Vui lòng kiểm tra Console log!";
      showToast("Thao tác thất bại: " + msg, "error");
      throw error;
    } finally {
      setLoading(false);
    }
  };

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
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Đặt phòng mới
        </button>
      </div>



      {error && bookings.length === 0 ? (
        <PageError message={error} onRetry={() => fetchData(true)} />
      ) : loading && bookings.length === 0 ? (
        <PageSkeleton type="table" />
      ) : (
        <>


          <div className="space-y-4">
            <div className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-3 shadow-sm">
              <input
                type="text"
                placeholder="Tìm theo mã đơn, tên khách, số phòng..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50 text-slate-800"
              />
              <CustomSelect
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="Tất cả">Tất cả trạng thái (Filter tổng)</option>
                <option value="Đặt trước">Đặt trước</option>
                <option value="Đã hủy">Đã hủy</option>
              </CustomSelect>
            </div>

            <BookingAllTable
              bookings={visibleAll}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onRowContextMenu={handleRowContextMenu}
            />
          </div>
        </>
      )}

      {modalOpen && (
        <BookingModal
          booking={editing}
          bookings={bookings}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditing(null); }}
        />
      )}

      {contextMenu && (
        <div
          className="fixed bg-white border border-gray-200 rounded-2xl shadow-xl py-2 z-50 min-w-[190px] overflow-hidden"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-4 py-1.5 border-b border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Đơn: #{contextMenu.booking.bookingCode}
          </div>
          {contextMenu.booking.status === "Đặt trước" ? (
            <div className="p-1 space-y-0.5">
              <button
                onClick={() => { handleCheckIn(contextMenu.booking.id); setContextMenu(null); }}
                className="w-full text-left px-3 py-2 text-xs font-semibold text-green-700 hover:bg-green-50 rounded-lg transition flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Check-in (Nhận phòng)
              </button>
              <button
                onClick={() => { handleCancelBooking(contextMenu.booking); setContextMenu(null); }}
                className="w-full text-left px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-red-500" />
                Hủy đặt trước
              </button>
            </div>
          ) : contextMenu.booking.status === "Đang sử dụng" ? (
            <div className="p-1">
              <button
                onClick={() => { setCheckoutBooking(contextMenu.booking); setCheckoutPaymentMethod("Tiền mặt"); setContextMenu(null); }}
                className="w-full text-left px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50 rounded-lg transition flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Check-out & Tạo hóa đơn
              </button>
            </div>
          ) : (
            <div className="px-4 py-3 text-xs text-gray-400 text-center italic">Không khả dụng nhanh</div>
          )}
        </div>
      )}

      {checkoutBooking && (
        <CheckoutModal
          maPhieuThue={checkoutBooking.id}
          maPhong={parseInt(checkoutBooking.roomNumber) || 0}
          maNhanVien={1}
          khachHang={checkoutBooking.customerName}
          onSuccess={async (result) => {
            showToast(`Checkout thành công! Mã hóa đơn: #${result.maHoaDon}`);
            setCheckoutBooking(null);
            await fetchData();
          }}
          onClose={() => setCheckoutBooking(null)}
        />
      )}
    </div>
  );
}