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
import { Search, Plus, Edit, Eye, Trash2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Avatar, AvatarFallback } from './ui/avatar';

interface Employee {
  id: string;
  name: string;
  phone: string;
  email: string;
  position: string;
  salary: number;
  joinDate: string;
  status: string;
}

const initialEmployees: Employee[] = [
  {
    id: 'EMP-001',
    name: 'Alice Cooper',
    phone: '+1 234-567-8911',
    email: 'alice.cooper@hotel.com',
    position: 'Receptionist',
    salary: 35000,
    joinDate: '2024-01-15',
    status: 'Active',
  },
  {
    id: 'EMP-002',
    name: 'Bob Martinez',
    phone: '+1 234-567-8912',
    email: 'bob.martinez@hotel.com',
    position: 'Manager',
    salary: 65000,
    joinDate: '2023-06-10',
    status: 'Active',
  },
  {
    id: 'EMP-003',
    name: 'Carol White',
    phone: '+1 234-567-8913',
    email: 'carol.white@hotel.com',
    position: 'Housekeeping',
    salary: 30000,
    joinDate: '2024-03-20',
    status: 'Active',
  },
  {
    id: 'EMP-004',
    name: 'David Lee',
    phone: '+1 234-567-8914',
    email: 'david.lee@hotel.com',
    position: 'Chef',
    salary: 45000,
    joinDate: '2023-11-05',
    status: 'Active',
  },
  {
    id: 'EMP-005',
    name: 'Emma Wilson',
    phone: '+1 234-567-8915',
    email: 'emma.wilson@hotel.com',
    position: 'Receptionist',
    salary: 35000,
    joinDate: '2024-02-14',
    status: 'Active',
  },
  {
    id: 'EMP-006',
    name: 'Frank Thomas',
    phone: '+1 234-567-8916',
    email: 'frank.thomas@hotel.com',
    position: 'Maintenance',
    salary: 32000,
    joinDate: '2024-01-08',
    status: 'Active',
  },
];

const positionColors: Record<string, string> = {
  Manager: 'bg-purple-100 text-purple-800',
  Receptionist: 'bg-blue-100 text-blue-800',
  Housekeeping: 'bg-green-100 text-green-800',
  Chef: 'bg-orange-100 text-orange-800',
  Maintenance: 'bg-gray-100 text-gray-800',
};

export function EmployeeManagement() {
  const [employees] = useState<Employee[]>(initialEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPosition, setFilterPosition] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch =
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.phone.includes(searchTerm);
    const matchesPosition = filterPosition === 'all' || employee.position === filterPosition;
    return matchesSearch && matchesPosition;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Employee Management</h2>
          <p className="text-gray-500">Manage hotel staff and employees</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>Enter employee information below</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="Enter full name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" placeholder="+1 234-567-8900" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="employee@hotel.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Receptionist">Receptionist</SelectItem>
                    <SelectItem value="Housekeeping">Housekeeping</SelectItem>
                    <SelectItem value="Chef">Chef</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary">Annual Salary ($)</Label>
                <Input id="salary" type="number" placeholder="35000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="joinDate">Join Date</Label>
                <Input id="joinDate" type="date" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">Save Employee</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">Total Employees</p>
              <p className="text-3xl font-semibold mt-2">{employees.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">Active Staff</p>
              <p className="text-3xl font-semibold mt-2 text-green-600">
                {employees.filter((e) => e.status === 'Active').length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">Departments</p>
              <p className="text-3xl font-semibold mt-2">
                {new Set(employees.map((e) => e.position)).size}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">Avg. Salary</p>
              <p className="text-3xl font-semibold mt-2">
                ${Math.round(employees.reduce((sum, e) => sum + e.salary, 0) / employees.length).toLocaleString()}
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
                placeholder="Search by name, email, or phone..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={filterPosition} onValueChange={setFilterPosition}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Positions</SelectItem>
                <SelectItem value="Manager">Manager</SelectItem>
                <SelectItem value="Receptionist">Receptionist</SelectItem>
                <SelectItem value="Housekeeping">Housekeeping</SelectItem>
                <SelectItem value="Chef">Chef</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Employee Table */}
      <Card>
        <CardHeader>
          <CardTitle>Employee List ({filteredEmployees.length})</CardTitle>
          <CardDescription>View and manage all employees</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Employee
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Contact
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Position
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Salary</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Join Date
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
                {filteredEmployees.map((employee) => {
                  const initials = employee.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('');
                  return (
                    <tr key={employee.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-blue-600 text-white">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{employee.name}</p>
                            <p className="text-xs text-gray-500">{employee.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">
                          <p>{employee.email}</p>
                          <p className="text-gray-500">{employee.phone}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs ${
                            positionColors[employee.position]
                          }`}
                        >
                          {employee.position}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm font-medium">
                        ${employee.salary.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-sm">{employee.joinDate}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-green-100 text-green-800">
                          {employee.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedEmployee(employee)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* View Employee Details Dialog */}
      <Dialog open={!!selectedEmployee} onOpenChange={() => setSelectedEmployee(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Employee Details</DialogTitle>
            <DialogDescription>Complete employee information</DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-blue-600 text-white text-xl">
                    {selectedEmployee.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{selectedEmployee.name}</h3>
                  <p className="text-sm text-gray-500">{selectedEmployee.id}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Position</p>
                  <p className="font-medium">{selectedEmployee.position}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium">{selectedEmployee.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{selectedEmployee.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{selectedEmployee.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Annual Salary</p>
                  <p className="font-medium">${selectedEmployee.salary.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Join Date</p>
                  <p className="font-medium">{selectedEmployee.joinDate}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
