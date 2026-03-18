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
import { Plus, Search } from 'lucide-react';
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
import { Calendar as CalendarIcon } from 'lucide-react';

interface ServiceUsage {
  id: string;
  bookingId: string;
  customerName: string;
  roomNumber: string;
  serviceName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  usageDate: string;
  status: string;
}

const initialUsages: ServiceUsage[] = [
  {
    id: 'SU-001',
    bookingId: 'BK-1001',
    customerName: 'John Smith',
    roomNumber: '305',
    serviceName: 'Breakfast Buffet',
    quantity: 2,
    unitPrice: 25,
    totalPrice: 50,
    usageDate: '2026-03-05',
    status: 'Paid',
  },
  {
    id: 'SU-002',
    bookingId: 'BK-1001',
    customerName: 'John Smith',
    roomNumber: '305',
    serviceName: 'Laundry Service',
    quantity: 1,
    unitPrice: 20,
    totalPrice: 20,
    usageDate: '2026-03-05',
    status: 'Pending',
  },
  {
    id: 'SU-003',
    bookingId: 'BK-1002',
    customerName: 'Sarah Johnson',
    roomNumber: '412',
    serviceName: 'Spa Treatment',
    quantity: 1,
    unitPrice: 80,
    totalPrice: 80,
    usageDate: '2026-03-05',
    status: 'Paid',
  },
  {
    id: 'SU-004',
    bookingId: 'BK-1004',
    customerName: 'Emily Davis',
    roomNumber: '501',
    serviceName: 'Airport Pickup',
    quantity: 1,
    unitPrice: 50,
    totalPrice: 50,
    usageDate: '2026-03-05',
    status: 'Paid',
  },
  {
    id: 'SU-005',
    bookingId: 'BK-1004',
    customerName: 'Emily Davis',
    roomNumber: '501',
    serviceName: 'Room Service',
    quantity: 3,
    unitPrice: 15,
    totalPrice: 45,
    usageDate: '2026-03-05',
    status: 'Pending',
  },
];

export function ServiceUsage() {
  const [usages] = useState<ServiceUsage[]>(initialUsages);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [usageDate, setUsageDate] = useState<Date>();

  const filteredUsages = usages.filter((usage) => {
    const matchesSearch =
      usage.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usage.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usage.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const totalRevenue = usages.reduce((sum, usage) => sum + usage.totalPrice, 0);
  const pendingAmount = usages
    .filter((u) => u.status === 'Pending')
    .reduce((sum, usage) => sum + usage.totalPrice, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Service Usage</h2>
          <p className="text-gray-500">Track services used by guests</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Record Usage
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Record Service Usage</DialogTitle>
              <DialogDescription>Enter service usage information</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="booking">Booking</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select booking" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BK-1001">BK-1001 - John Smith (Room 305)</SelectItem>
                    <SelectItem value="BK-1002">BK-1002 - Sarah Johnson (Room 412)</SelectItem>
                    <SelectItem value="BK-1003">BK-1003 - Michael Brown (Room 208)</SelectItem>
                    <SelectItem value="BK-1004">BK-1004 - Emily Davis (Room 501)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="service">Service</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Breakfast Buffet - $25</SelectItem>
                    <SelectItem value="roomservice">Room Service - $15</SelectItem>
                    <SelectItem value="laundry">Laundry Service - $20</SelectItem>
                    <SelectItem value="spa">Spa Treatment - $80</SelectItem>
                    <SelectItem value="airport">Airport Pickup - $50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" type="number" placeholder="1" min="1" defaultValue="1" />
              </div>
              <div className="space-y-2">
                <Label>Usage Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {usageDate ? format(usageDate, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={usageDate} onSelect={setUsageDate} />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2 col-span-2">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span>Unit Price:</span>
                    <span className="font-medium">$25.00</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span>Quantity:</span>
                    <span className="font-medium">1</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold mt-3 pt-3 border-t">
                    <span>Total:</span>
                    <span className="text-blue-600">$25.00</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">Record Usage</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">Total Usages</p>
              <p className="text-3xl font-semibold mt-2">{usages.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-3xl font-semibold mt-2 text-green-600">${totalRevenue}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">Pending Payment</p>
              <p className="text-3xl font-semibold mt-2 text-orange-600">${pendingAmount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">Today's Usages</p>
              <p className="text-3xl font-semibold mt-2">
                {usages.filter((u) => u.usageDate === '2026-03-05').length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by booking, customer, or service..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Table */}
      <Card>
        <CardHeader>
          <CardTitle>Service Usage Records ({filteredUsages.length})</CardTitle>
          <CardDescription>All recorded service usages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Booking
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Room</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Service
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Qty</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Unit Price
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Total</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsages.map((usage) => (
                  <tr key={usage.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium">{usage.id}</td>
                    <td className="py-3 px-4 text-sm">{usage.bookingId}</td>
                    <td className="py-3 px-4 text-sm">{usage.customerName}</td>
                    <td className="py-3 px-4 text-sm">{usage.roomNumber}</td>
                    <td className="py-3 px-4 text-sm">{usage.serviceName}</td>
                    <td className="py-3 px-4 text-sm">{usage.quantity}</td>
                    <td className="py-3 px-4 text-sm">${usage.unitPrice}</td>
                    <td className="py-3 px-4 text-sm font-semibold">${usage.totalPrice}</td>
                    <td className="py-3 px-4 text-sm">{usage.usageDate}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs ${
                          usage.status === 'Paid'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        {usage.status}
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
