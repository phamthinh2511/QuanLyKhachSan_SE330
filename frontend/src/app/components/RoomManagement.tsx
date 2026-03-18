"use client";
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Search, Plus, Edit, Bed, Grid3x3, List } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface Room {
  id: string;
  number: string;
  type: string;
  price: number;
  status: 'Available' | 'Occupied' | 'Maintenance' | 'Reserved';
  description: string;
  capacity: number;
  floor: number;
}

const initialRooms: Room[] = [
  {
    id: 'RM-001',
    number: '101',
    type: 'Standard',
    price: 120,
    status: 'Available',
    description: 'Comfortable standard room with city view',
    capacity: 2,
    floor: 1,
  },
  {
    id: 'RM-002',
    number: '102',
    type: 'Standard',
    price: 120,
    status: 'Occupied',
    description: 'Comfortable standard room with city view',
    capacity: 2,
    floor: 1,
  },
  {
    id: 'RM-003',
    number: '201',
    type: 'Deluxe',
    price: 180,
    status: 'Available',
    description: 'Spacious deluxe room with balcony',
    capacity: 3,
    floor: 2,
  },
  {
    id: 'RM-004',
    number: '202',
    type: 'Deluxe',
    price: 180,
    status: 'Reserved',
    description: 'Spacious deluxe room with balcony',
    capacity: 3,
    floor: 2,
  },
  {
    id: 'RM-005',
    number: '301',
    type: 'Suite',
    price: 350,
    status: 'Available',
    description: 'Luxury suite with separate living area',
    capacity: 4,
    floor: 3,
  },
  {
    id: 'RM-006',
    number: '302',
    type: 'Suite',
    price: 350,
    status: 'Occupied',
    description: 'Luxury suite with separate living area',
    capacity: 4,
    floor: 3,
  },
  {
    id: 'RM-007',
    number: '305',
    type: 'Suite',
    price: 350,
    status: 'Maintenance',
    description: 'Luxury suite with separate living area',
    capacity: 4,
    floor: 3,
  },
  {
    id: 'RM-008',
    number: '401',
    type: 'Presidential',
    price: 650,
    status: 'Available',
    description: 'Presidential suite with panoramic views',
    capacity: 6,
    floor: 4,
  },
];

const statusColors = {
  Available: 'bg-green-100 text-green-800',
  Occupied: 'bg-orange-100 text-orange-800',
  Maintenance: 'bg-red-100 text-red-800',
  Reserved: 'bg-blue-100 text-blue-800',
};

export function RoomManagement() {
  const [rooms] = useState<Room[]>(initialRooms);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.number.includes(searchTerm) || room.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || room.type === filterType;
    const matchesStatus = filterStatus === 'all' || room.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Room Management</h2>
          <p className="text-gray-500">Manage hotel rooms and their availability</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Room
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Room</DialogTitle>
              <DialogDescription>Enter room information below</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="roomNumber">Room Number</Label>
                <Input id="roomNumber" placeholder="e.g., 101" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roomType">Room Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Deluxe">Deluxe</SelectItem>
                    <SelectItem value="Suite">Suite</SelectItem>
                    <SelectItem value="Presidential">Presidential</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price per Night ($)</Label>
                <Input id="price" type="number" placeholder="120" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input id="capacity" type="number" placeholder="2" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="floor">Floor</Label>
                <Input id="floor" type="number" placeholder="1" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Occupied">Occupied</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                    <SelectItem value="Reserved">Reserved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Enter room description" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">Save Room</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4 items-end">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by room number or type..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Room Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Standard">Standard</SelectItem>
                <SelectItem value="Deluxe">Deluxe</SelectItem>
                <SelectItem value="Suite">Suite</SelectItem>
                <SelectItem value="Presidential">Presidential</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Occupied">Occupied</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Reserved">Reserved</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-1 border rounded-lg p-1">
              <Button
                size="sm"
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                onClick={() => setViewMode('table')}
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                onClick={() => setViewMode('grid')}
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Room Display */}
      {viewMode === 'table' ? (
        <Card>
          <CardHeader>
            <CardTitle>Room List ({filteredRooms.length})</CardTitle>
            <CardDescription>View and manage all rooms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Room #
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Type</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Floor</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Capacity
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Price/Night
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRooms.map((room) => (
                    <tr key={room.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium">{room.number}</td>
                      <td className="py-3 px-4 text-sm">{room.type}</td>
                      <td className="py-3 px-4 text-sm">{room.floor}</td>
                      <td className="py-3 px-4 text-sm">{room.capacity} guests</td>
                      <td className="py-3 px-4 text-sm font-medium">${room.price}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs ${
                            statusColors[room.status]
                          }`}
                        >
                          {room.status}
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
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredRooms.map((room) => (
            <Card key={room.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Room {room.number}</CardTitle>
                    <CardDescription>{room.type}</CardDescription>
                  </div>
                  <Bed className="w-5 h-5 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">{room.description}</p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Capacity:</span>
                  <span className="font-medium">{room.capacity} guests</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Floor:</span>
                  <span className="font-medium">{room.floor}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Price:</span>
                  <span className="font-semibold text-blue-600">${room.price}/night</span>
                </div>
                <div className="pt-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs ${
                      statusColors[room.status]
                    }`}
                  >
                    {room.status}
                  </span>
                </div>
                <Button variant="outline" className="w-full mt-2">
                  <Edit className="w-4 h-4 mr-2" />
                  Manage Room
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
