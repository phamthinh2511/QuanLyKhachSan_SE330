"use client";
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Search, Plus, Edit, Calendar as CalendarIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { format } from 'date-fns';

interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalAmount: number;
  status: 'Booked' | 'Checked-in' | 'Checked-out' | 'Cancelled';
}

const initialBookings: Booking[] = [
  {
    id: 'BK-1001',
    customerId: 'CUS-001',
    customerName: 'John Smith',
    roomNumber: '305',
    checkIn: '2026-03-05',
    checkOut: '2026-03-08',
    guests: 2,
    totalAmount: 1050,
    status: 'Checked-in',
  },
  {
    id: 'BK-1002',
    customerId: 'CUS-002',
    customerName: 'Sarah Johnson',
    roomNumber: '412',
    checkIn: '2026-03-05',
    checkOut: '2026-03-07',
    guests: 1,
    totalAmount: 240,
    status: 'Checked-in',
  },
  {
    id: 'BK-1003',
    customerId: 'CUS-003',
    customerName: 'Michael Brown',
    roomNumber: '208',
    checkIn: '2026-03-06',
    checkOut: '2026-03-10',
    guests: 3,
    totalAmount: 720,
    status: 'Booked',
  },
  {
    id: 'BK-1004',
    customerId: 'CUS-004',
    customerName: 'Emily Davis',
    roomNumber: '501',
    checkIn: '2026-03-05',
    checkOut: '2026-03-09',
    guests: 2,
    totalAmount: 1400,
    status: 'Checked-in',
  },
  {
    id: 'BK-1005',
    customerId: 'CUS-005',
    customerName: 'David Wilson',
    roomNumber: '102',
    checkIn: '2026-03-01',
    checkOut: '2026-03-04',
    guests: 2,
    totalAmount: 360,
    status: 'Checked-out',
  },
];

const statusColors = {
  Booked: 'bg-blue-100 text-blue-800',
  'Checked-in': 'bg-green-100 text-green-800',
  'Checked-out': 'bg-gray-100 text-gray-800',
  Cancelled: 'bg-red-100 text-red-800',
};

export function BookingManagement() {
  const [bookings] = useState<Booking[]>(initialBookings);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.roomNumber.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Booking Management</h2>
          <p className="text-gray-500">Manage room reservations and bookings</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New Booking
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Booking</DialogTitle>
              <DialogDescription>Enter booking information below</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="customer">Customer</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CUS-001">John Smith</SelectItem>
                    <SelectItem value="CUS-002">Sarah Johnson</SelectItem>
                    <SelectItem value="CUS-003">Michael Brown</SelectItem>
                    <SelectItem value="CUS-004">Emily Davis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="room">Room</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select room" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="101">Room 101 - Standard ($120)</SelectItem>
                    <SelectItem value="201">Room 201 - Deluxe ($180)</SelectItem>
                    <SelectItem value="301">Room 301 - Suite ($350)</SelectItem>
                    <SelectItem value="401">Room 401 - Presidential ($650)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Check-in Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkInDate ? format(checkInDate, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={checkInDate} onSelect={setCheckInDate} />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Check-out Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkOutDate ? format(checkOutDate, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={checkOutDate} onSelect={setCheckOutDate} />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="guests">Number of Guests</Label>
                <Input id="guests" type="number" placeholder="2" min="1" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Total Amount ($)</Label>
                <Input id="amount" type="number" placeholder="360" disabled />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">Create Booking</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by booking ID, customer name, or room..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Bookings</SelectItem>
                <SelectItem value="Booked">Booked</SelectItem>
                <SelectItem value="Checked-in">Checked-in</SelectItem>
                <SelectItem value="Checked-out">Checked-out</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Booking Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">Total Bookings</p>
              <p className="text-3xl font-semibold mt-2">{bookings.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">Checked-in</p>
              <p className="text-3xl font-semibold mt-2 text-green-600">
                {bookings.filter((b) => b.status === 'Checked-in').length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">Upcoming</p>
              <p className="text-3xl font-semibold mt-2 text-blue-600">
                {bookings.filter((b) => b.status === 'Booked').length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-3xl font-semibold mt-2 text-emerald-600">
                ${bookings.reduce((sum, b) => sum + b.totalAmount, 0).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Booking Table */}
      <Card>
        <CardHeader>
          <CardTitle>Booking List ({filteredBookings.length})</CardTitle>
          <CardDescription>View and manage all bookings</CardDescription>
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
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Guests</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium">{booking.id}</td>
                    <td className="py-3 px-4 text-sm">{booking.customerName}</td>
                    <td className="py-3 px-4 text-sm">{booking.roomNumber}</td>
                    <td className="py-3 px-4 text-sm">{booking.checkIn}</td>
                    <td className="py-3 px-4 text-sm">{booking.checkOut}</td>
                    <td className="py-3 px-4 text-sm">{booking.guests}</td>
                    <td className="py-3 px-4 text-sm font-medium">${booking.totalAmount}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs ${
                          statusColors[booking.status]
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </div>
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
