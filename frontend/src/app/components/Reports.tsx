"use client";
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
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
  AreaChart,
  Area,
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Download, TrendingUp, Users, Bed, DollarSign } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const monthlyRevenue = [
  { month: 'Jan', revenue: 45000, expenses: 25000, profit: 20000 },
  { month: 'Feb', revenue: 52000, expenses: 27000, profit: 25000 },
  { month: 'Mar', revenue: 48000, expenses: 26000, profit: 22000 },
  { month: 'Apr', revenue: 61000, expenses: 30000, profit: 31000 },
  { month: 'May', revenue: 55000, expenses: 28000, profit: 27000 },
  { month: 'Jun', revenue: 67000, expenses: 32000, profit: 35000 },
  { month: 'Jul', revenue: 78000, expenses: 35000, profit: 43000 },
  { month: 'Aug', revenue: 82000, expenses: 36000, profit: 46000 },
  { month: 'Sep', revenue: 71000, expenses: 33000, profit: 38000 },
  { month: 'Oct', revenue: 65000, expenses: 31000, profit: 34000 },
  { month: 'Nov', revenue: 58000, expenses: 29000, profit: 29000 },
  { month: 'Dec', revenue: 75000, expenses: 34000, profit: 41000 },
];

const occupancyData = [
  { month: 'Jan', rate: 65 },
  { month: 'Feb', rate: 72 },
  { month: 'Mar', rate: 68 },
  { month: 'Apr', rate: 78 },
  { month: 'May', rate: 74 },
  { month: 'Jun', rate: 82 },
  { month: 'Jul', rate: 88 },
  { month: 'Aug', rate: 92 },
  { month: 'Sep', rate: 85 },
  { month: 'Oct', rate: 79 },
  { month: 'Nov', rate: 71 },
  { month: 'Dec', rate: 80 },
];

const serviceUsageData = [
  { name: 'Breakfast', value: 450, color: '#3b82f6' },
  { name: 'Room Service', value: 320, color: '#10b981' },
  { name: 'Laundry', value: 180, color: '#f59e0b' },
  { name: 'Spa', value: 210, color: '#8b5cf6' },
  { name: 'Airport Transfer', value: 150, color: '#ef4444' },
];

const roomTypeRevenue = [
  { type: 'Standard', revenue: 145000 },
  { type: 'Deluxe', revenue: 230000 },
  { type: 'Suite', revenue: 385000 },
  { type: 'Presidential', revenue: 175000 },
];

export function Reports() {
  const [timeRange, setTimeRange] = useState('year');

  const totalRevenue = monthlyRevenue.reduce((sum, item) => sum + item.revenue, 0);
  const totalExpenses = monthlyRevenue.reduce((sum, item) => sum + item.expenses, 0);
  const totalProfit = monthlyRevenue.reduce((sum, item) => sum + item.profit, 0);
  const avgOccupancy = Math.round(
    occupancyData.reduce((sum, item) => sum + item.rate, 0) / occupancyData.length
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Reports & Statistics</h2>
          <p className="text-gray-500">Analytics and insights for hotel performance</p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-semibold mt-2">${totalRevenue.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">+12.5%</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Profit</p>
                <p className="text-2xl font-semibold mt-2">${totalProfit.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">+18.2%</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg Occupancy</p>
                <p className="text-2xl font-semibold mt-2">{avgOccupancy}%</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">+5.8%</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Bed className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Guests</p>
                <p className="text-2xl font-semibold mt-2">2,845</p>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">+9.3%</span>
                </div>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Tabs */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue Analysis</TabsTrigger>
          <TabsTrigger value="occupancy">Occupancy Rate</TabsTrigger>
          <TabsTrigger value="services">Service Usage</TabsTrigger>
          <TabsTrigger value="rooms">Room Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue & Profit</CardTitle>
                <CardDescription>Revenue and profit trends throughout the year</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
                    <Bar dataKey="profit" fill="#10b981" name="Profit" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Trend</CardTitle>
                <CardDescription>Monthly revenue growth pattern</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#3b82f6"
                      fill="#93c5fd"
                      name="Revenue"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Financial Summary</CardTitle>
              <CardDescription>Year-to-date financial overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-8">
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <p className="text-3xl font-semibold text-blue-600">
                    ${totalRevenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">Across all revenue streams</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Total Expenses</p>
                  <p className="text-3xl font-semibold text-red-600">
                    ${totalExpenses.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">Operating costs</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Net Profit</p>
                  <p className="text-3xl font-semibold text-green-600">
                    ${totalProfit.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Profit margin: {Math.round((totalProfit / totalRevenue) * 100)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="occupancy">
          <Card>
            <CardHeader>
              <CardTitle>Occupancy Rate Analysis</CardTitle>
              <CardDescription>Room occupancy trends throughout the year</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={occupancyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    name="Occupancy Rate (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Most Used Services</CardTitle>
                <CardDescription>Service popularity distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={serviceUsageData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {serviceUsageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Revenue Contribution</CardTitle>
                <CardDescription>Revenue breakdown by service type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {serviceUsageData.map((service) => {
                    const total = serviceUsageData.reduce((sum, s) => sum + s.value, 0);
                    const percentage = Math.round((service.value / total) * 100);
                    return (
                      <div key={service.name} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{service.name}</span>
                          <span className="font-medium">
                            {service.value} uses ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: service.color,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="rooms">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Room Type</CardTitle>
                <CardDescription>Performance comparison across room categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={roomTypeRevenue} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="type" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#3b82f6" name="Revenue ($)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Room Performance Summary</CardTitle>
                <CardDescription>Key metrics by room type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {roomTypeRevenue.map((room, index) => {
                    const totalRevenue = roomTypeRevenue.reduce((sum, r) => sum + r.revenue, 0);
                    const percentage = Math.round((room.revenue / totalRevenue) * 100);
                    return (
                      <div key={room.type} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{room.type}</p>
                            <p className="text-sm text-gray-500">{percentage}% of total revenue</p>
                          </div>
                          <p className="text-xl font-semibold text-blue-600">
                            ${room.revenue.toLocaleString()}
                          </p>
                        </div>
                        {index < roomTypeRevenue.length - 1 && (
                          <div className="border-b border-gray-200" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
