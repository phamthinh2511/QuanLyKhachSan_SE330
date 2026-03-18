"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import {
  Bed,
  Users,
  Calendar,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const stats = [
  {
    title: 'Total Rooms',
    value: '150',
    change: '+0%',
    isPositive: true,
    icon: Bed,
    color: 'bg-blue-500',
  },
  {
    title: 'Available Rooms',
    value: '45',
    change: '-12%',
    isPositive: false,
    icon: CheckCircle2,
    color: 'bg-green-500',
  },
  {
    title: 'Occupied Rooms',
    value: '105',
    change: '+12%',
    isPositive: true,
    icon: XCircle,
    color: 'bg-orange-500',
  },
  {
    title: "Today's Check-ins",
    value: '23',
    change: '+5%',
    isPositive: true,
    icon: Calendar,
    color: 'bg-purple-500',
  },
  {
    title: "Today's Check-outs",
    value: '18',
    change: '+3%',
    isPositive: true,
    icon: Calendar,
    color: 'bg-pink-500',
  },
  {
    title: 'Total Revenue Today',
    value: '$15,420',
    change: '+18%',
    isPositive: true,
    icon: DollarSign,
    color: 'bg-emerald-500',
  },
];

const revenueData = [
  { month: 'Jan', revenue: 45000, bookings: 120 },
  { month: 'Feb', revenue: 52000, bookings: 135 },
  { month: 'Mar', revenue: 48000, bookings: 128 },
  { month: 'Apr', revenue: 61000, bookings: 156 },
  { month: 'May', revenue: 55000, bookings: 142 },
  { month: 'Jun', revenue: 67000, bookings: 168 },
];

const roomStatusData = [
  { name: 'Available', value: 45, color: '#10b981' },
  { name: 'Occupied', value: 105, color: '#f59e0b' },
  { name: 'Maintenance', value: 8, color: '#ef4444' },
  { name: 'Reserved', value: 12, color: '#3b82f6' },
];

const recentBookings = [
  {
    id: 'BK-1001',
    customer: 'John Smith',
    room: '305',
    checkIn: '2026-03-05',
    checkOut: '2026-03-08',
    status: 'Confirmed',
  },
  {
    id: 'BK-1002',
    customer: 'Sarah Johnson',
    room: '412',
    checkIn: '2026-03-05',
    checkOut: '2026-03-07',
    status: 'Confirmed',
  },
  {
    id: 'BK-1003',
    customer: 'Michael Brown',
    room: '208',
    checkIn: '2026-03-06',
    checkOut: '2026-03-10',
    status: 'Pending',
  },
  {
    id: 'BK-1004',
    customer: 'Emily Davis',
    room: '501',
    checkIn: '2026-03-05',
    checkOut: '2026-03-09',
    status: 'Confirmed',
  },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex gap-3">
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          New Booking
        </Button>
        <Button variant="outline">
          <Bed className="w-4 h-4 mr-2" />
          Check Room Status
        </Button>
        <Button variant="outline">
          <Users className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">{stat.title}</p>
                    <p className="text-3xl font-semibold">{stat.value}</p>
                    <div className="flex items-center gap-1">
                      {stat.isPositive ? (
                        <ArrowUpRight className="w-4 h-4 text-green-600" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-red-600" />
                      )}
                      <span
                        className={`text-sm ${
                          stat.isPositive ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500">vs last month</span>
                    </div>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue & Bookings Overview</CardTitle>
            <CardDescription>Monthly revenue and booking trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Revenue ($)"
                />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Bookings"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Room Status Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Room Status Distribution</CardTitle>
            <CardDescription>Current room availability status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={roomStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {roomStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>Latest booking reservations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Booking ID
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Room</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Check-in
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Check-out
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm">{booking.id}</td>
                    <td className="py-3 px-4 text-sm">{booking.customer}</td>
                    <td className="py-3 px-4 text-sm">{booking.room}</td>
                    <td className="py-3 px-4 text-sm">{booking.checkIn}</td>
                    <td className="py-3 px-4 text-sm">{booking.checkOut}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs ${
                          booking.status === 'Confirmed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
