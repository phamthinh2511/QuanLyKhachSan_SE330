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
import { Search, Plus, Eye, Printer, CreditCard, Banknote, Building2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Separator } from './ui/separator';

interface Invoice {
  id: string;
  bookingId: string;
  customerName: string;
  roomNumber: string;
  roomCost: number;
  serviceCost: number;
  totalAmount: number;
  paymentMethod: string;
  paymentDate: string;
  status: 'Paid' | 'Pending' | 'Partial';
}

const initialInvoices: Invoice[] = [
  {
    id: 'INV-2026-001',
    bookingId: 'BK-1001',
    customerName: 'John Smith',
    roomNumber: '305',
    roomCost: 1050,
    serviceCost: 70,
    totalAmount: 1120,
    paymentMethod: 'Credit Card',
    paymentDate: '2026-03-05',
    status: 'Paid',
  },
  {
    id: 'INV-2026-002',
    bookingId: 'BK-1002',
    customerName: 'Sarah Johnson',
    roomNumber: '412',
    roomCost: 240,
    serviceCost: 80,
    totalAmount: 320,
    paymentMethod: 'Cash',
    paymentDate: '2026-03-05',
    status: 'Paid',
  },
  {
    id: 'INV-2026-003',
    bookingId: 'BK-1003',
    customerName: 'Michael Brown',
    roomNumber: '208',
    roomCost: 720,
    serviceCost: 0,
    totalAmount: 720,
    paymentMethod: '',
    paymentDate: '',
    status: 'Pending',
  },
  {
    id: 'INV-2026-004',
    bookingId: 'BK-1004',
    customerName: 'Emily Davis',
    roomNumber: '501',
    roomCost: 1400,
    serviceCost: 95,
    totalAmount: 1495,
    paymentMethod: 'Bank Transfer',
    paymentDate: '2026-03-05',
    status: 'Partial',
  },
];

export function InvoicePayment() {
  const [invoices] = useState<Invoice[]>(initialInvoices);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.bookingId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = invoices.filter((i) => i.status === 'Paid').reduce((sum, i) => sum + i.totalAmount, 0);
  const pendingAmount = invoices.filter((i) => i.status === 'Pending').reduce((sum, i) => sum + i.totalAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Invoice & Payment</h2>
          <p className="text-gray-500">Manage billing and payments</p>
        </div>
        <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Generate Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Generate Invoice</DialogTitle>
              <DialogDescription>Create invoice for a booking</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="booking">Select Booking</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select booking" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BK-1001">BK-1001 - John Smith (Room 305)</SelectItem>
                    <SelectItem value="BK-1002">BK-1002 - Sarah Johnson (Room 412)</SelectItem>
                    <SelectItem value="BK-1003">BK-1003 - Michael Brown (Room 208)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium">Invoice Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Room Charges (3 nights × $350):</span>
                    <span className="font-medium">$1,050.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Service Charges:</span>
                    <span className="font-medium">$70.00</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total Amount:</span>
                    <span className="text-blue-600 text-lg">$1,120.00</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="credit">Credit Card</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsGenerateDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">Generate & Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">Total Invoices</p>
              <p className="text-3xl font-semibold mt-2">{invoices.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">Paid Amount</p>
              <p className="text-3xl font-semibold mt-2 text-green-600">
                ${totalRevenue.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">Pending Amount</p>
              <p className="text-3xl font-semibold mt-2 text-orange-600">
                ${pendingAmount.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">This Month</p>
              <p className="text-3xl font-semibold mt-2">{invoices.length}</p>
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
                placeholder="Search by invoice ID, customer, or booking..."
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
                <SelectItem value="all">All Invoices</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Partial">Partial</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Invoice Table */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice List ({filteredInvoices.length})</CardTitle>
          <CardDescription>View and manage all invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Invoice ID
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Booking
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Room</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Room Cost
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Services
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Total</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Payment
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
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium">{invoice.id}</td>
                    <td className="py-3 px-4 text-sm">{invoice.bookingId}</td>
                    <td className="py-3 px-4 text-sm">{invoice.customerName}</td>
                    <td className="py-3 px-4 text-sm">{invoice.roomNumber}</td>
                    <td className="py-3 px-4 text-sm">${invoice.roomCost}</td>
                    <td className="py-3 px-4 text-sm">${invoice.serviceCost}</td>
                    <td className="py-3 px-4 text-sm font-semibold">${invoice.totalAmount}</td>
                    <td className="py-3 px-4 text-sm">
                      {invoice.paymentMethod ? (
                        <div className="flex items-center gap-1">
                          {invoice.paymentMethod === 'Cash' && (
                            <Banknote className="w-4 h-4 text-green-600" />
                          )}
                          {invoice.paymentMethod === 'Credit Card' && (
                            <CreditCard className="w-4 h-4 text-blue-600" />
                          )}
                          {invoice.paymentMethod === 'Bank Transfer' && (
                            <Building2 className="w-4 h-4 text-purple-600" />
                          )}
                          <span className="text-xs">{invoice.paymentMethod}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs ${
                          invoice.status === 'Paid'
                            ? 'bg-green-100 text-green-800'
                            : invoice.status === 'Pending'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedInvoice(invoice)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Printer className="w-4 h-4" />
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

      {/* View Invoice Dialog */}
      <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
            <DialogDescription>{selectedInvoice?.id}</DialogDescription>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="font-medium">{selectedInvoice.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Booking ID</p>
                  <p className="font-medium">{selectedInvoice.bookingId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Room Number</p>
                  <p className="font-medium">{selectedInvoice.roomNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Date</p>
                  <p className="font-medium">{selectedInvoice.paymentDate || 'Not paid'}</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Room Charges:</span>
                  <span className="font-medium">${selectedInvoice.roomCost}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Charges:</span>
                  <span className="font-medium">${selectedInvoice.serviceCost}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Amount:</span>
                  <span className="text-blue-600">${selectedInvoice.totalAmount}</span>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline">
                  <Printer className="w-4 h-4 mr-2" />
                  Print Invoice
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
