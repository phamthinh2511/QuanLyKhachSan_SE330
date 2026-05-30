import { Booking } from "@/types/booking";

interface Props {
  bookings: Booking[];
  // Nhận thêm props overrideStats để lấy trực tiếp con số chính xác đã tính từ page.tsx
  overrideStats?: {
    dangO: number;
    sapToi: number;
    doanhThu: number;
  };
}

export default function BookingStatCards({ bookings, overrideStats }: Props) {
  // LOGIC DỰ PHÒNG: Nếu có dữ liệu overrideStats từ page.tsx thì dùng luôn,
  // nếu không (hoặc chưa kịp load) thì tự tính toán dựa trên trạng thái tiếng Việt chuẩn.
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const thisMonthBookings = bookings.filter((b) => {
    if (!b.checkIn) return false;
    const checkIn = new Date(b.checkIn);
    return checkIn.getMonth() === currentMonth && checkIn.getFullYear() === currentYear;
  });

  // 1. Lượt đặt trong tháng (tính cả đơn hủy và đơn thường để biết tổng số giao dịch phát sinh)
  const total = thisMonthBookings.length;

  // 2. Khách đang ở (Ưu tiên lấy từ page.tsx truyền xuống)
  const checkedIn = overrideStats
    ? overrideStats.dangO
    : bookings.filter((b) => {
            const status = b.status ? b.status.trim() : "";
            return (
              status === "Đã nhận phòng tại quầy" ||
              status === "Đã nhận phòng đặt trước" ||
              status === "Đã nhận phòng" ||
              status === "Đang sử dụng"
            );
          }).length;

  // 3. Sắp tới trong tháng (Ưu tiên lấy từ page.tsx truyền xuống)
  const upcoming = overrideStats
    ? overrideStats.sapToi
    : thisMonthBookings.filter((b) => b.status === "Chưa nhận").length;

  // 4. Tổng doanh thu tháng (Ưu tiên lấy từ page.tsx truyền xuống)
  const totalRevenue = overrideStats
    ? overrideStats.doanhThu
    : thisMonthBookings
        .filter((b) => b.status !== "Đã hủy")
        .reduce((sum, b) => sum + (b.amount || 0), 0);

  const cards = [
    { label: "Lượt đặt trong tháng",   value: String(total),                    color: "text-gray-800" },
    { label: "Đang ở",                 value: String(checkedIn),                color: "text-green-600" },
    { label: "Sắp tới trong tháng",     value: String(upcoming),                 color: "text-blue-600"  },
    { label: "Tổng doanh thu tháng",    value: `${totalRevenue.toLocaleString("vi-VN")} đ`, color: "text-emerald-600" },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm text-center transition hover:shadow-md">
          <p className="text-gray-400 text-sm mb-2 font-medium">{c.label}</p>
          <p className={`text-3xl font-bold tracking-tight ${c.color}`}>{c.value}</p>
        </div>
      ))}
    </div>
  );
}