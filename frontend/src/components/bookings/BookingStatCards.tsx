import { Booking } from "@/types/booking";

interface Props { bookings: Booking[] }

export default function BookingStatCards({ bookings }: Props) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const thisMonthBookings = bookings.filter((b) => {
    const checkIn = new Date(b.checkIn);
    return checkIn.getMonth() === currentMonth && checkIn.getFullYear() === currentYear;
  });

  const total = thisMonthBookings.length;
  const checkedIn = bookings.filter((b) => b.status === "Checked-in").length;
  const upcoming = thisMonthBookings.filter((b) => b.status === "Booked").length;
  const totalRevenue = thisMonthBookings
    .filter((b) => b.status !== "Cancelled")
    .reduce((sum, b) => sum + b.amount, 0);

  const cards = [
    { label: "Lượt đặt trong tháng",   value: String(total),        color: "text-gray-800" },
    { label: "Đang ở",         value: String(checkedIn),    color: "text-green-600" },
    { label: "Sắp tới trong tháng",        value: String(upcoming),     color: "text-blue-600"  },
    { label: "Tổng doanh thu tháng", value: `$${totalRevenue.toLocaleString()}`, color: "text-green-600" },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm text-center">
          <p className="text-gray-400 text-sm mb-2">{c.label}</p>
          <p className={`text-3xl font-bold ${c.color}`}>{c.value}</p>
        </div>
      ))}
    </div>
  );
}