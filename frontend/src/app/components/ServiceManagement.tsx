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
import { Plus, Edit, Trash2, Coffee, Car, Sparkles, UtensilsCrossed } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  icon: any;
}

const initialServices: Service[] = [
  {
    id: 'SRV-001',
    name: 'Breakfast Buffet',
    category: 'Food & Beverage',
    price: 25,
    description: 'Continental breakfast buffet with variety of options',
    icon: UtensilsCrossed,
  },
  {
    id: 'SRV-002',
    name: 'Room Service',
    category: 'Food & Beverage',
    price: 15,
    description: '24/7 in-room dining service',
    icon: Coffee,
  },
  {
    id: 'SRV-003',
    name: 'Laundry Service',
    category: 'Housekeeping',
    price: 20,
    description: 'Same-day laundry and dry cleaning',
    icon: Sparkles,
  },
  {
    id: 'SRV-004',
    name: 'Spa Treatment',
    category: 'Wellness',
    price: 80,
    description: 'Relaxing spa and massage treatments',
    icon: Sparkles,
  },
  {
    id: 'SRV-005',
    name: 'Airport Pickup',
    category: 'Transportation',
    price: 50,
    description: 'Private car service to/from airport',
    icon: Car,
  },
  {
    id: 'SRV-006',
    name: 'Airport Drop-off',
    category: 'Transportation',
    price: 50,
    description: 'Private car service to airport',
    icon: Car,
  },
];

const categoryColors: Record<string, string> = {
  'Food & Beverage': 'bg-orange-100 text-orange-800',
  Housekeeping: 'bg-blue-100 text-blue-800',
  Wellness: 'bg-purple-100 text-purple-800',
  Transportation: 'bg-green-100 text-green-800',
};

export function ServiceManagement() {
  const [services] = useState<Service[]>(initialServices);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Service Management</h2>
          <p className="text-gray-500">Manage hotel services and pricing</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Service</DialogTitle>
              <DialogDescription>Enter service information below</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="serviceName">Service Name</Label>
                <Input id="serviceName" placeholder="e.g., Breakfast Buffet" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" placeholder="e.g., Food & Beverage" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input id="price" type="number" placeholder="25" />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Enter service description" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">Save Service</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Service Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">Total Services</p>
              <p className="text-3xl font-semibold mt-2">{services.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">Categories</p>
              <p className="text-3xl font-semibold mt-2">
                {new Set(services.map((s) => s.category)).size}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">Avg. Price</p>
              <p className="text-3xl font-semibold mt-2">
                ${Math.round(services.reduce((sum, s) => sum + s.price, 0) / services.length)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">Popular</p>
              <p className="text-lg font-semibold mt-2">Breakfast</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => {
          const Icon = service.icon;
          return (
            <Card key={service.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <CardDescription className="mt-1">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                            categoryColors[service.category]
                          }`}
                        >
                          {service.category}
                        </span>
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{service.description}</p>
                <div className="flex justify-between items-center pt-3 border-t">
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="text-2xl font-semibold text-blue-600">${service.price}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Service Table */}
      <Card>
        <CardHeader>
          <CardTitle>Service List</CardTitle>
          <CardDescription>All available hotel services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Service Name
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Category
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Price</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Description
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-medium">{service.id}</td>
                    <td className="py-3 px-4 text-sm">{service.name}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs ${
                          categoryColors[service.category]
                        }`}
                      >
                        {service.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold">${service.price}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{service.description}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600">
                          <Trash2 className="w-4 h-4" />
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
